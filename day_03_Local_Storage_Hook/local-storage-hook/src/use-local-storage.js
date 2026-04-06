import { useState, useEffect } from "react";
export default function useLocalStorage(keyName, initialValue) {
  // Add your solution here
  const [storedValue, setStoredValue] = useState(
    JSON.parse(window.localStorage.getItem(keyName)) || initialValue,
  );

  useEffect(() => {
    window.localStorage.setItem(keyName, JSON.stringify(storedValue));
  }, [storedValue]);

  return [storedValue, setStoredValue];
}
