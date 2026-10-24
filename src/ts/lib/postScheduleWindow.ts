/** IANA zone treated as the posting audience's local time. */
const POSTING_TIME_ZONE = "America/Chicago";

/** Hours are local-Chicago hours-of-day. One bucket means one post a day, somewhere between 9am and 9pm Central. Add buckets to post more often. */
const BUCKETS: ReadonlyArray<{ startHour: number; endHour: number }> = [
  { startHour: 9, endHour: 21 },
];

/** One randomly-drawn posting slot, as a ready-to-use GitHub Actions cron string (UTC, "M H * * *"). */
export interface ScheduledSlot {
  /** UTC cron expression for this slot, e.g. "37 18 * * *". */
  cron: string;
  /** The slot's actual UTC instant on the target calendar date, for tests/debugging. */
  utc: Date;
}

/** The UTC offset (in minutes, negative for zones behind UTC) that `POSTING_TIME_ZONE` observes at the given instant, read with the standard Intl trick instead of a datetime library. */
function chicagoOffsetMinutesAt(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: POSTING_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  const wallClockAsUTC = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );

  return (wallClockAsUTC - instant.getTime()) / 60_000;
}

/** Converts a Chicago wall-clock date/time to its UTC instant, refining once because the offset depends on the instant being solved for. */
function chicagoWallClockToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const guessUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = chicagoOffsetMinutesAt(new Date(guessUtcMs));
  const refinedUtcMs = guessUtcMs - offset * 60_000;
  const refinedOffset = chicagoOffsetMinutesAt(new Date(refinedUtcMs));
  return new Date(guessUtcMs - refinedOffset * 60_000);
}

/** Draws one random UTC-cron slot per bucket for `chicagoDate`. rng is injectable for deterministic tests and is called once per bucket. */
export function drawScheduledSlots(
  chicagoDate: { year: number; month: number; day: number },
  rng: () => number = Math.random,
): ScheduledSlot[] {
  return BUCKETS.map(({ startHour, endHour }) => {
    const bucketMinutes = (endHour - startHour) * 60;
    const offsetMinutes = Math.floor(rng() * bucketMinutes);
    const utc = chicagoWallClockToUtc(
      chicagoDate.year,
      chicagoDate.month,
      chicagoDate.day,
      0,
      startHour * 60 + offsetMinutes,
    );

    return {
      utc,
      cron: `${utc.getUTCMinutes()} ${utc.getUTCHours()} * * *`,
    };
  });
}

/** The Chicago calendar date (Y-M-D) that `instant` falls on, per the posting time zone. */
export function chicagoCalendarDate(instant: Date): {
  year: number;
  month: number;
  day: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: POSTING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Adds (or subtracts, with a negative count) whole calendar days to a Y-M-D date. */
export function addDays(
  date: { year: number; month: number; day: number },
  days: number,
): { year: number; month: number; day: number } {
  const shifted = new Date(
    Date.UTC(date.year, date.month - 1, date.day) + days * 86_400_000,
  );
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

/** The calendar date the current posting window belongs to. Before the window opens (a run delayed past midnight, say), that's still yesterday. */
export function currentWindowAnchorDate(now: Date): {
  year: number;
  month: number;
  day: number;
} {
  const chicagoHour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: POSTING_TIME_ZONE,
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .find((p) => p.type === "hour")?.value,
  );

  const today = chicagoCalendarDate(now);
  return chicagoHour < BUCKETS[0].startHour ? addDays(today, -1) : today;
}
