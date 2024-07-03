import { FC } from "react";
import { Box, useComputedColorScheme } from "@mantine/core";

const Blob: FC<{
  top: string;
  left: string;
  w: number;
  h?: number;
  color: string;
}> = ({ top, left, w, h, color }) => {
  return (
    <Box
      pos="absolute"
      top={top}
      left={left}
      w={`${w}px`}
      h={`${h ?? w}px`}
      style={{
        backgroundImage: `radial-gradient(closest-side, ${color}, transparent)`,
      }}
    />
  );
};

export const BgBlobs: FC<{}> = ({}) => {
  const scheme = useComputedColorScheme();
  return (
    <Box
      pos="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg={scheme === "dark" ? "#303030" : "#fff"}
    >
      <Blob left="0%" top="-30%" w={1000} color="#CC5DE888" />
      <Blob left="30%" top="00%" w={1200} h={600} color="#339AF088" />
      <Blob left="-20%" top="60%" w={1000} color="#339AF088" />
      <Blob left="70%" top="10%" w={1400} color="#CC5DE888" />
      {scheme === "dark" && (
        <Box
          pos="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          bg="#00000066"
        />
      )}
    </Box>
  );
};
