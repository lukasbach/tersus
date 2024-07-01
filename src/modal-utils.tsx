import { modals } from "@mantine/modals";
import { Button, Group, TextInput } from "@mantine/core";

export const promptText = ({
  labels,
  value,
  onSubmitModal,
  ...settings
}: Parameters<typeof modals.open>[0] & {
  value?: string;
  onSubmitModal: (value: string) => void;
  labels?: {
    submit?: string;
    cancel?: string;
    input?: string;
    placeholder?: string;
  };
}) => {
  modals.open({
    ...settings,
    children: (
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          modals.closeAll();
          onSubmitModal(e.target.elements.value.value);
        }}
      >
        <TextInput
          label={labels?.input}
          placeholder={labels?.placeholder}
          defaultValue={value}
          name="value"
          data-autofocus
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={() => modals.closeAll()} variant="default">
            {labels?.cancel ?? "Cancel"}
          </Button>
          <Button type="submit">{labels?.submit ?? "Submit"}</Button>
        </Group>
      </form>
    ),
  });
};