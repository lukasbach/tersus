import { sampleWidget } from "./sample.tsx";
import { WidgetDefinition } from "../types.ts";
import { counterWidget } from "./counter.tsx";
import { recurringTodoWidget } from "./recurring-todo.tsx";

export const widgets = {
  sampleWidget,
  counterWidget,
  recurringTodoWidget,
} as Record<string, WidgetDefinition<any>>;
