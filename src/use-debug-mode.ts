import { useLocalStorage } from "@mantine/hooks";

export const useDebugMode = () => {
  return useLocalStorage({
    key: "debug",
    defaultValue: false,
  });
};
