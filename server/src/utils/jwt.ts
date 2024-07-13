import jwt from "jsonwebtoken";

const key =
  process.env.DB_BOT_SECRET_KEY || process.env.DB_SECRET_KEY || "supersecret";

const jwtBotSign = (data: { botId: string; userId: string }) => {
  return jwt.sign(data, key, { expiresIn: "7d" });
};

const jwtBotVerify = (
  token: string
): { botId: string; userId: string } | null => {
  try {
    const data = jwt.verify(token, key) as { botId: string; userId: string };
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export { jwtBotSign, jwtBotVerify };
