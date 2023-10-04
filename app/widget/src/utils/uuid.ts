// this is polyfill for crypto.randomUUID
const generateUniqSerial = () => {
  return "xxxx-xxxx-xxx-xxxx".replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
};

export function generateUUID() {
  try {
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    } else {
      console.log("crypto.randomUUID not supported");
      return generateUniqSerial();
    }
  } catch (e) {
    console.log("crypto.randomUUID not supported");
    return generateUniqSerial();
  }
}
