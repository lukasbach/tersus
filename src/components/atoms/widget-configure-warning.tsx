import { FC, PropsWithChildren } from "react";
import { Button, Center, Stack, Text } from "@mantine/core";

export const WidgetConfigureWarning: FC<
  PropsWithChildren<{ onOpenEditModal: () => void }>
> = ({ onOpenEditModal, children }) => {
  return (
    <Center h="100%">
      <Stack>
        <Text>{children || "This widget needs to be configured first."}</Text>
        <Button onClick={onOpenEditModal}>Configure widget</Button>
      </Stack>
    </Center>
  );
};
