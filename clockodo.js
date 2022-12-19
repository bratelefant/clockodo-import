import fetch from "node-fetch";
import { delay, getISOFormat } from "./helper.js";
import { readFile } from "fs/promises";

const batchDelay = 2000;
/**
 * Get the HTTP headers for requests.
 * @returns Header for API authentication using infos from settings.json
 */
const getHeaders = () => {
  return {
    "X-ClockodoApiUser": Clockodo.settings.email,
    "X-ClockodoApiKey": Clockodo.settings.apikey,
    "X-Clockodo-External-Application":
      "nodejs-clockodo;" + Clockodo.settings.email,
  };
};

export const Clockodo = {};

Clockodo.settings = {
  server: undefined,
  email: undefined,
  apikey: undefined,
  verbose: false,
};

/**
 * Setup Clockodo
 * @param {Object} settings
 * @param {String} settings.server Server URL with trailing slash
 * @param {String} settings.email Clockodo E-mail
 * @param {String} settings.apikey Clockodo API Key
 * @param {boolean} settings.verbose Log stuff
 */
Clockodo.configure = ({ server, email, apikey, verbose }) => {
  Clockodo.settings = { server, email, apikey, verbose };
};

/**
 * Get all Clockodo users.
 * @returns Array containing all the users.
 */
Clockodo.getUsers = async () => {
  const response = await fetch(Clockodo.settings.server + "users", {
    method: "get",
    headers: getHeaders(),
  });
  return await response.json();
};

/**
 *
 * @param {Object} param0 Param Object
 * @param {Number} param0.year Year of the absence entries
 * @returns Array of absences
 */
Clockodo.getAbsences = async ({ year }) => {
  if (!year) throw new Error("Year required");
  const response = await fetch(
    Clockodo.settings.server + "absences?year=" + year,
    {
      method: "get",
      headers: getHeaders(),
    }
  );
  return await response.json();
};

Clockodo.getEntries = async ({ timeSince, timeUntil }) => {
  if (
    !timeSince ||
    !timeUntil ||
    !(timeSince instanceof Date) ||
    !(timeUntil instanceof Date)
  )
    throw new Error("timeSince and timeUntil are required Date objects");

  const response = await fetch(
    Clockodo.settings.server +
      "v2/entries?time_since=" +
      getISOFormat(timeSince) +
      "&time_until=" +
      getISOFormat(timeUntil),
    {
      method: "get",
      headers: getHeaders(),
    }
  );
  return await response.json();
};

/**
 * Basic user import
 * @param {Object} params
 * @param {String} params.csvfile The file to read data from. Must be UTF-8 encoded. Format: name;email:role\n
 * @param {boolean} params.dryrun If true, the request will not be fired but infos on the parsed data will be sent to console
 */
Clockodo.importUsers = async ({ csvfile, dryrun = true }) => {
  dryrun &&
    console.info(
      "### This is a dry run. Nothing is sent to the Clockodo server. ###\n"
    );
  const result = await readFile(csvfile, { encoding: "utf-8" });
  const lines = (result + "").trim().split("\n");
  (globalThis.verbose || dryrun) &&
    console.log("Parsed " + lines.length + " lines of data");
  const data = [];
  lines.forEach((line) => {
    const linedata = line.split(";");
    if (!linedata.length === 3)
      throw new Error(
        "Couldn't parse CSV data. Seems like your file is not properly formated."
      );
    (dryrun || globalThis.verbose) &&
      console.log(
        "Got name " +
          linedata[0] +
          " with mail " +
          linedata[1] +
          " and role " +
          linedata[2]
      );
    data.push({ name: linedata[0], email: linedata[1], role: linedata[2] });
  });

  (dryrun || globalThis.verbose) &&
    console.log("Collected " + data.length + " sets of user data");

  (dryrun || globalThis.verbose) &&
    data.length > 1 &&
    console.log("First of them is " + JSON.stringify(data[0], null, 2));

  for (const body of data) {
    const request = {
      method: "post",
      body: JSON.stringify(body),
      headers: getHeaders(),
    };

    (dryrun || globalThis.verbose) &&
      console.log("About to fire this request:");
    (dryrun || globalThis.verbose) && console.log(request);

    if (dryrun) {
      console.log("\nThis is a dryrun. Don't send anything.");
    } else {
      globalThis.verbose && console.log("Fire request");
    }

    globalThis.verbose &&
      console.log("Waiting for " + batchDelay + " ms before next request.");
    await delay(batchDelay);
  }
};
