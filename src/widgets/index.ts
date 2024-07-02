import { WidgetDefinition } from "../types.ts";
import { counterWidget } from "./counter.tsx";
import { recurringTodoWidget } from "./recurring-todo.tsx";
import { counterButtonsWidget } from "./counter-buttons.tsx";
import { counterGraphWidget } from "./counter-graph.tsx";
import { todoListWidget } from "./todoList.tsx";
import { notesWidget } from "./notes.tsx";
import { mapsRouteWidget } from "./mapsRoute.tsx";
import { mapsLocationWidget } from "./mapsLocation.tsx";
import { rotatingItemWidget } from "./rotating-item.tsx";
import { dateTickerWidget } from "./date-ticker.tsx";

export const widgets = {
  counterWidget,
  counterGraphWidget,
  counterButtonsWidget,
  recurringTodoWidget,
  todoListWidget,
  notesWidget,
  mapsRouteWidget,
  mapsLocationWidget,
  rotatingItemWidget,
  dateTickerWidget,
} as Record<string, WidgetDefinition<any, any>>;
