export interface Context<T> {
  getValue(): T;
  setValue(value: T): void;
}
export function createContext<T>(defaultValue: T) {
  let value: T = defaultValue;

  function getValue() {
    return value;
  }

  function setValue(newValue: T) {
    value = newValue;
  }

  const context = {
    getValue,
    setValue,
  };

  return context;
}

export function useContext<T>(context: Context<T>): [T, (value: T) => void] {
  return [context.getValue(), context.setValue];
}
