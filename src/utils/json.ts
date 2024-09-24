export const safeJsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("Error parsing JSON", e, json);
    return null;
  }
}