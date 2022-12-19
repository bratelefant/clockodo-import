import { readFile } from "fs/promises";
import { getUsers } from "./clockodo.js";

export const commands = [
  {
    name: "getUsers",
    additionalArgs: 0,
  },
  { name: "help" },
];

export const helptext =
  "Usage: npm start [command] [filename]\n\nAvailable commands: " +
  commands.map((c) => c.name).join(",");

/**
 * Parse command line args and throw an error, if somethings not ok.
 */
export const parseArgs = () => {
  if (process.argv.length < 3) {
    throw new Error("Can't do anything without command line options.");
  }
  if (!commands.some((c) => c.name === process.argv[2])) {
    throw new Error("Command " + process.argv[2] + " is unknown.");
  }
  globalThis.command = process.argv[2];
};

/**
 * Check if the settings are ok.
 * @param {Object} obj settings object from settings.json
 */
export const parseSettings = (obj) => {
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
  if (!obj.email || (typeof obj.email === "string" && obj.email.length < 1)) {
    throw new Error("No email found. Check settings.json.");
  }
};
