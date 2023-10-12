export const getSessionSecret = () => {
  if (!process.env.DB_SESSION_SECRET) {
    return "a8F2h6T9j4Kl0Pz8W7eX3rB5y1VcQ6mN";
  }

  if (process.env.DB_SESSION_SECRET.length < 32) {
    console.warn("WARNING: Session secret should be 32 characters long.");
  }

  return process.env.DB_SESSION_SECRET;
};



export const isCookieSecure = () => {
  if (!process.env.DB_SESSION_SECURE) {
    return false;
  }

  return process.env.DB_SESSION_SECURE === "true";
}