import { randomBytes } from "crypto";

export const generateAPIKey = (length = 32) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    result += charset.charAt(bytes[i] % charset.length);
  }

  const prefix = process.env.DB_API_KEY_PREFIX || "sk_db_";
  result = `${prefix}${result}`;
  return result;
};
