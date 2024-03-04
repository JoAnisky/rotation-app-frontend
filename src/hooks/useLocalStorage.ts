export const useLocalStorage = <T>(key: string) => {
  // Always verify that the browser supports or has enough space for value storage.
  const setItem = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value() : value; // This allows storing the result of a function call, if needed.
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Could not store the item in localStorage:", error);
    }
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      // If we have an item, return it; otherwise, return undefined.

      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.error("Could not retrieve the item from localStorage:", error);
      return undefined; // Explicitly return undefined in case of error
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Could not remove the item from localStorage:", error);
    }
  };

  return { setItem, getItem, removeItem };
};
