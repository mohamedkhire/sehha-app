let inMemoryStorage: { [key: string]: string } = {};

export const setItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      console.warn('Local storage is full, falling back to in-memory storage');
      inMemoryStorage[key] = value;
    } else {
      throw error;
    }
  }
};

export const getItem = (key: string): string | null => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : inMemoryStorage[key] || null;
  } catch (error) {
    console.warn('Error accessing localStorage, falling back to in-memory storage');
    return inMemoryStorage[key] || null;
  }
};

export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Error accessing localStorage, falling back to in-memory storage');
  }
  delete inMemoryStorage[key];
};

