/**
 * Vue application setup
 */

import { useWorkbench } from "./_useWorkbench.js";

// Vue is loaded from a CDN <script> in _javascripts.pug, not bundled.
declare const Vue: typeof import("vue");

const app = Vue.createApp({
  setup: useWorkbench,
});

app.mount("#app");

export default app;
