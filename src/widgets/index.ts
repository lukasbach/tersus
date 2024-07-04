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
import { recurringTodoListWidget } from "./recurring-todo-list.tsx";
import { iframeWidget } from "./iframe.tsx";
import { linkListWidget } from "./link-list.tsx";
import { habitTrackerWidget } from "./habit-tracker.tsx";
import { habitTrackerButtonsWidget } from "./habit-tracker-buttons.tsx";

export const widgets = {
  counterWidget,
  counterGraphWidget,
  counterButtonsWidget,
  recurringTodoWidget,
  recurringTodoListWidget,
  todoListWidget,
  notesWidget,
  mapsRouteWidget,
  mapsLocationWidget,
  rotatingItemWidget,
  dateTickerWidget,
  iframeWidget,
  linkListWidget,
  habitTrackerWidget,
  habitTrackerButtonsWidget,
} as Record<string, WidgetDefinition<any, any>>;
