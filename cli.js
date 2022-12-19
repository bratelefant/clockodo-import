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
      async (argv) =>
        console.log(await Clockodo.getAbsences({ year: argv.year }))
    )
    .command(
      "getEntries [timeSince] [timeUntil]",
      "Get all entries between the dates.",
      (argv) => {
        argv
          .positional("timeSince", {
            describe: "Entries since what date.",
            type: "string",
            default: new Date(new Date().setUTCHours(0, 0, 0, 0)),
          })
          .positional("timeUntil", {
            describe: "Entries until what date.",
            type: "string",
            default: new Date(new Date().setUTCHours(23, 59, 59, 999)),
          });
      },
      async (argv) =>
        console.log(
          await Clockodo.getEntries({
            timeSince: argv.timeSince,
            timeUntil: argv.timeUntil,
          })
        )
    )
    .demandCommand()
    .example("$0 getUsers").argv;
};

try {
  await init();
} catch (e) {
  console.log(e);
}
