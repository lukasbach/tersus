import { modals } from "@mantine/modals";
import { Button, Group, NumberInput, TextInput } from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";

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

export const promptNumber = ({
  labels,
  value,
  onSubmitModal,
  ...settings
}: Parameters<typeof modals.open>[0] & {
  value?: number;
  onSubmitModal: (value: number) => void;
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
          onSubmitModal(parseFloat(e.target.elements.value.value));
        }}
      >
        <NumberInput
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

export const promptDate = ({
  labels,
  value,
  onSubmitModal,
  ...settings
}: Parameters<typeof modals.open>[0] & {
  value?: DateValue;
  onSubmitModal: (value: Date) => void;
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
          onSubmitModal(new Date(e.target.elements.value.value));
        }}
      >
        <DateTimePicker
          label={labels?.input}
          placeholder={labels?.placeholder}
          defaultValue={value}
          name="value"
          autoFocus
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
