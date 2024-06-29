import { Layout, Layouts } from "react-grid-layout";
import { ComponentType } from "react";

export type WidgetDefinition<T> = {
  type: string;
  name: string;
  sizing: Partial<Layout>;
  configComponent: ComponentType<{
    config: T;
    onChange: (payload: Partial<T>) => void;
  }>;
  displayComponent: ComponentType<{
    config: T;
    onEdit: () => void;
    onChange: (payload: Partial<T>) => void;
  }>;
  iconComponent: ComponentType<{ config: T }>;
};

export type WidgetPayload<T = any> = {
  config: T;
  widget: string;
};

export type DashboardConfig = {
  layouts: Layouts;
  widgets: Record<string, WidgetPayload>;
};
