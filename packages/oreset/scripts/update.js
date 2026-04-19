import { updateVersion } from "./utils/update-version.js";

await Promise.all([
  updateVersion("./README.md"),
  updateVersion("./src/oreset.css"),
]);
