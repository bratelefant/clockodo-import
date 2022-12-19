import fetch from "node-fetch";

/**
 * Get the HTTP headers for requests.
 * @returns Header for API authentication using infos from settings.json
 */
const getHeaders = () => {
  return {
    "X-ClockodoApiUser": globalThis.settings.email,
    "X-ClockodoApiKey": globalThis.settings.apikey,
  };
};

/**
 * Get all Clockodo users.
 * @returns Array containing all the users.
 */
export const getUsers = async () => {
  const response = await fetch(globalThis.settings.server + "users", {
    method: "get",
    headers: getHeaders(),
  });
  return await response.json();
};
