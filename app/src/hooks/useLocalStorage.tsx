import { useState, useEffect } from 'react';

type Value = any;

const useLocalStorage = (key: string, initialValue: Value): [Value, (value: Value) => void] => {
  const [value, setValue] = useState<Value>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      return JSON.parse(storedValue);
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const updateValue = (newValue: Value) => {
    setValue(newValue);
  };

  return [value, updateValue];
};

export default useLocalStorage;
