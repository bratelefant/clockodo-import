import fetch from "node-fetch";
import { getISOFormat } from "./helper.js";

/**
 * Get the HTTP headers for requests.
 * @returns Header for API authentication using infos from settings.json
 */
const getHeaders = () => {
  return {
    "X-ClockodoApiUser": Clockodo.settings.email,
    "X-ClockodoApiKey": Clockodo.settings.apikey,
    "X-Clockodo-External-Application": "nodejs-clockodo",
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
