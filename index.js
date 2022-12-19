import { parseCsv } from "./parsecsv.js";
import { readFile } from "fs/promises";
import { getUsers } from "./clockodo.js";

const parseArgs = () => {
  if (process.argv.length < 3) {
    throw new Error("Need a CSV file as a parameter.");
  }
  globalThis.csvFilename = process.argv[2];
};

const parseSettings = (obj) => {
  if (
    !obj.apikey ||
    (typeof obj.apikey === "string" && obj.apikey.length < 1)
  ) {
    throw new Error("No API key present. Check settings.json.");
  }
  if (
    !obj.server ||
    (typeof obj.server === "string" && obj.server.length < 1)
  ) {
    throw new Error("No API server found. Check settings.json.");
  }
  if (
    !obj.email ||
    (typeof obj.email === "string" && obj.email.length < 1)
  ) {
    throw new Error("No email found. Check settings.json.");
  }
};

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

await init();
parseCsv(globalThis.csvFilename);
console.log(await getUsers());
