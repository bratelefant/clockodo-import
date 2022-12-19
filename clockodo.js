import fetch from "node-fetch";

const getHeaders = () => {
  return {
    "X-ClockodoApiUser": globalThis.settings.email,
    "X-ClockodoApiKey": globalThis.settings.apikey,
  };
};

export const getUsers = async () => {
  const response = await fetch(globalThis.settings.server + "users", {
    method: "get",
    headers: getHeaders(),
  });
  return await response.json();
};
