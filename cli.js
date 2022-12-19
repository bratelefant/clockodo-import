import { readFile } from "fs/promises";
import { helptext, parseArgs, parseSettings } from "./helper.js";
import { Clockodo } from "./index.js";

/**
 * Initialize App
 */
const init = async () => {
  try {
    parseArgs();
  } catch (e) {
    console.warn("Command line params not ok:\n", e.message);
  }

  var jsonString;

  try {
    jsonString = await readFile("./settings.json");
  } catch (e) {
    console.warn(
      "Couldn't read from settings.json. Did you already copy settings.json.example?"
    );
    throw e;
  }
  const json = JSON.parse(jsonString);

  try {
    parseSettings(json);
  } catch (e) {
    console.warn("Settings are not ok: ", e.message);
  }
  Clockodo.configure(json);
};

try {
  await init();

  switch (globalThis.command) {
    case "getUsers":
      console.log(await Clockodo.getUsers());
      break;
    case "getAbsences":
      console.log(await Clockodo.getAbsences(parseInt(process.argv[3])));
      break;
    default:
      console.log(helptext);
  }
} catch (e) {
  console.log(e);
}
