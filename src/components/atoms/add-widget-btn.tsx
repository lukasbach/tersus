import { FC, useMemo } from "react";
import { Box, Flex, Paper, Stack, Text, UnstyledButton } from "@mantine/core";
import { widgets } from "../../widgets";

export const AddWidgetBtn: FC<{ widgetType: string; onClick: () => void }> = ({
  widgetType,
  onClick,
}) => {
  const widget = useMemo(() => widgets[widgetType], [widgetType]);
  return (
    <UnstyledButton onClick={onClick} w="100%">
      <Paper shadow="xs" withBorder p="md" mb="md" radius="lg">
        <Flex>
          <Box mr="xs">
            <widget.IconComponent />
          </Box>
          <Stack gap="xs">
            <Text fw="600">{widget.name}</Text>
            <Text c="dimmed">{widget.label}</Text>
          </Stack>
        </Flex>
      </Paper>
    </UnstyledButton>
  );
};
