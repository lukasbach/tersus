import { useLocalStorage } from "@mantine/hooks";

export const useColorBlobs = () => {
  return useLocalStorage({
    key: "colorblobs",
    defaultValue: true,
  });
};
