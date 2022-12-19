#!/usr/bin/env node
import { readFile } from "fs/promises";
import { parseSettings } from "./helper.js";
import { Clockodo } from "./index.js";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

var argv;

/**
 * Initialize App
 */
const init = async () => {
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

  argv = yargs(hideBin(process.argv))
    .usage("Usage: $0 <command> [options]")
    .command("getUsers", "Get all clockodo users.", {}, async () =>
      console.log(await Clockodo.getUsers())
    )
    .command(
      "getAbsences [year]",
      "Get all absences for a year.",
      (argv) => {
        argv.positional("year", {
          describe: "Absence Year",
          type: "integer",
          default: new Date().getFullYear(),
        });
      },
      async (argv) => console.log(await Clockodo.getAbsences(argv.year))
    )
    .demandCommand()
    .example("$0 getUsers").argv;
};

try {
  await init();
} catch (e) {
  console.log(e);
}
