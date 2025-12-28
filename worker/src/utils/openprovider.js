// worker/src/utils/openprovider.js
// OpenProvider API integration scaffolding for BUILD WITH AI

export async function openproviderRequest(env, endpoint, method = "POST", body = {}) {
  const url = `${env.OPENPROVIDER_API_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "Authorization":
      "Basic " + btoa(`${env.OPENPROVIDER_USERNAME}:${env.OPENPROVIDER_PASSWORD}`)
  };

  let response;
  let data = null;
  let error = "";
  let details = "";

  try {
    response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    });
  } catch (err) {
    error = "Network error";
    details = err.message || String(err);
    return { success: false, data: null, error, details };
  }

  if (!response || !response.ok) {
    error = `HTTP error: ${response ? response.status : "No response"}`;
    details = response ? await response.text() : "No response received";
    return { success: false, data: null, error, details };
  }

  try {
    data = await response.json();
  } catch (err) {
    error = "JSON parse error";
    details = err.message || String(err);
    return { success: false, data: null, error, details };
  }

  return { success: true, data, error: "", details: "" };
}
