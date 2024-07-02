import {
  Group,
  Input,
  InputWrapperProps,
  NumberInput,
  Select,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";

const ONE_HOUR = 60 * 60 * 1000;
const units: Record<string, number> = {
  seconds: 1000,
  hours: ONE_HOUR,
  days: ONE_HOUR * 24,
  weeks: ONE_HOUR * 24 * 7,
  months: ONE_HOUR * 24 * 30,
  years: ONE_HOUR * 24 * 365,
};

export const FrequencyInput: FC<
  InputWrapperProps & {
    onChangeFrequency: (frequency: number) => void;
    value: number;
  }
> = ({ onChangeFrequency, value, ...wrapperProps }) => {
  const [unit, setUnit] = useState("hours");
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const unit =
      Object.entries(units)
        .reverse()
        .find(([, unit]) => value / unit > 2)?.[0] ?? "hours";
    setNumber(value / units[unit]);
    setUnit(unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChangeFrequency(number * units[unit]);
  }, [number, onChangeFrequency, unit]);

  return (
    <Input.Wrapper {...wrapperProps}>
      <Group wrap="nowrap">
        <NumberInput
          style={{ flexGrow: 1 }}
          value={Math.round(number * 100) / 100}
          onValueChange={({ floatValue }) => {
            setNumber((old) => floatValue ?? old);
          }}
        />
        <Select
          data={Object.keys(units)}
          value={unit}
          onChange={(unit) => setUnit((old) => unit ?? old)}
          w="100px"
        />
      </Group>
    </Input.Wrapper>
  );
};
