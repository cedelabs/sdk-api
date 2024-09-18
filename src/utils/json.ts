export const safeJsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}