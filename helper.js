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
  if (
    !obj.devmail ||
    (typeof obj.devmail === "string" && obj.devmail.length < 1)
  ) {
    throw new Error(
      "No developer email found. Clockodo likes to know this. Check settings.json."
    );
  }
  globalThis.verbose = obj.verbose;
};

export const getISOFormat = (date) => {
  if (!(date instanceof Date)) throw new Error("Argument must be of type Date");
  return date.toISOString().split(".")[0] + "Z";
};

export const delay = (t, v) => {
  return new Promise((resolve) => setTimeout(resolve, t, v));
};
