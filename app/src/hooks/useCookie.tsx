import React from "react";
import cookie from "js-cookie";

export const useCookie = (cookieName: string) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = cookie.get(cookieName);
      return item || null;
    } catch (err) {
      return null;
    }
  });

  const setValue = (value: string | null) => {
    if (value) {
      cookie.set(cookieName, value, {
        expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      });
    } else {
      cookie.remove(cookieName);
    }
    setStoredValue(value);
  };

  return [storedValue, setValue] as const;
};
