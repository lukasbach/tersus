import { useCallback, useRef } from "react";

export const isNotNullish = <T>(value: T | null | undefined): value is T =>
  value !== undefined && value !== null;

export const resolveRecursiveSubitem = (structure: any, key: string) => {
  const parts = key.split(".");
  let current = structure;
  for (const part of parts) {
    current = current?.[part];
  }
  return current;
};

export const useRefCopy = <T>(value: T) => {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
};

export const useStableHandler = <T extends (...args: any[]) => any>(
  handler: T,
) => {
  const handlerRef = useRefCopy<T>(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback<T>(((...args) => handlerRef.current(...args)) as T, [
    handlerRef,
  ]);
};

export const removeUndefinedValues = <T>(v: T): T => {
  if (v === null || v === undefined) {
    return null as any;
  }
  if (typeof v !== "object") {
    return v;
  }
  if (Array.isArray(v)) {
    return v.map(removeUndefinedValues) as T;
  }
  const result: any = {};
  for (const [key, value] of Object.entries(v as any)) {
    if (value !== undefined) {
      result[key] = removeUndefinedValues(value);
    }
  }
  return result;
};

export const randId = () => Math.random().toString(36).substr(2, 9);

export const randomInteger = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
