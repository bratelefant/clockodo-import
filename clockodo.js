import fetch from "node-fetch";

/**
 * Get the HTTP headers for requests.
 * @returns Header for API authentication using infos from settings.json
 */
const getHeaders = () => {
  return {
    "X-ClockodoApiUser": Clockodo.settings.email,
    "X-ClockodoApiKey": Clockodo.settings.apikey,
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
