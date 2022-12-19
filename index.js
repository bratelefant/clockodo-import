import { readFile } from "fs/promises";
import { getUsers } from "./clockodo.js";
import { helptext, parseArgs, parseSettings } from "./helper.js";

/**
 * Initialize App
 */
const init = async () => {
  try {
    parseArgs();
  } catch (e) {
    console.warn("Command line params not ok:\n", e.message);
  }

  const jsonString = await readFile("./settings.json");
  const json = JSON.parse(jsonString);

  try {
    parseSettings(json);
  } catch (e) {
    console.warn("Settings are not ok: ", e.message);
  }
  globalThis.settings = json;
  globalThis.verbose = json.verbose;
  globalThis.verbose && console.log("Initialized settings and global object.");
};

try {
  await init();

  switch (globalThis.command) {
    case "getUsers":
      console.log(await getUsers());
      break;
    default:
      console.log(helptext);
  }
} catch (e) {
  console.log(e);
}
