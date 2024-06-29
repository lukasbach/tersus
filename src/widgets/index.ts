import { sampleWidget } from "./sample.tsx";
import { WidgetDefinition } from "../types.ts";

export const widgets = { sampleWidget } as Record<
  string,
  WidgetDefinition<any>
>;
