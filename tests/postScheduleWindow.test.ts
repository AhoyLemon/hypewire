import { describe, expect, test } from "bun:test";

import { addDays, chicagoCalendarDate, currentWindowAnchorDate, drawScheduledSlots } from "../src/ts/lib/postScheduleWindow";

describe("drawScheduledSlots", () => {
  test("returns one slot a day", () => {
    expect(drawScheduledSlots({ year: 2026, month: 1, day: 15 }, () => 0)).toHaveLength(1);
  });

  test("converts the window's start (9am Chicago) to UTC in winter (CST, UTC-6)", () => {
    const [slot] = drawScheduledSlots({ year: 2026, month: 1, day: 15 }, () => 0);
    expect(slot.cron).toBe("0 15 * * *");
  });

  test("converts the window's start (9am Chicago) to UTC in summer (CDT, UTC-5)", () => {
    const [slot] = drawScheduledSlots({ year: 2026, month: 7, day: 15 }, () => 0);
    expect(slot.cron).toBe("0 14 * * *");
  });

  test("stays inside the 9am-9pm window at the top of the rng range", () => {
    // Just under 9pm CST on the 15th = just under 03:00 UTC on the 16th.
    const [slot] = drawScheduledSlots({ year: 2026, month: 1, day: 15 }, () => 0.9999);
    expect(slot.utc.toISOString()).toBe("2026-01-16T02:59:00.000Z");
  });
});

describe("chicagoCalendarDate", () => {
  test("returns the Chicago-local date for a UTC instant late in the Chicago evening", () => {
    // 2026-01-15 23:00 UTC = 2026-01-15 17:00 CST.
    expect(chicagoCalendarDate(new Date("2026-01-15T23:00:00Z"))).toEqual({ year: 2026, month: 1, day: 15 });
  });

  test("returns the prior Chicago-local date just after UTC midnight", () => {
    // 2026-01-16 03:00 UTC = 2026-01-15 21:00 CST.
    expect(chicagoCalendarDate(new Date("2026-01-16T03:00:00Z"))).toEqual({ year: 2026, month: 1, day: 15 });
  });
});

describe("addDays", () => {
  test("rolls over a month boundary", () => {
    expect(addDays({ year: 2026, month: 1, day: 31 }, 1)).toEqual({ year: 2026, month: 2, day: 1 });
  });

  test("rolls over a year boundary", () => {
    expect(addDays({ year: 2026, month: 12, day: 31 }, 1)).toEqual({ year: 2027, month: 1, day: 1 });
  });

  test("supports subtracting days via a negative count", () => {
    expect(addDays({ year: 2026, month: 3, day: 1 }, -1)).toEqual({ year: 2026, month: 2, day: 28 });
  });
});

describe("currentWindowAnchorDate", () => {
  test("anchors to today once the window has opened", () => {
    // 2026-01-15 18:00 CST = 2026-01-16 00:00 UTC.
    expect(currentWindowAnchorDate(new Date("2026-01-16T00:00:00Z"))).toEqual({ year: 2026, month: 1, day: 15 });
  });

  test("anchors to yesterday for a run delayed past midnight", () => {
    // 2026-01-16 01:00 CST = 2026-01-16 07:00 UTC.
    expect(currentWindowAnchorDate(new Date("2026-01-16T07:00:00Z"))).toEqual({ year: 2026, month: 1, day: 15 });
  });

  test("flips to the new day right at 9am Chicago", () => {
    // 2026-01-16 09:00 CST = 2026-01-16 15:00 UTC.
    expect(currentWindowAnchorDate(new Date("2026-01-16T15:00:00Z"))).toEqual({ year: 2026, month: 1, day: 16 });
  });
});
