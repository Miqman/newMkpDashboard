import JsonExcel from "../components/ExportExcel.vue";

import { boot } from "quasar/wrappers";

export default boot(({ app }) => {
  app.use(JsonExcel);
});
