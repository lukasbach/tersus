import { Layout, Layouts } from "react-grid-layout";
import { ComponentType } from "react";

export type WidgetRenderProps<T> = {
  config: T;
  onOpenEditModal: () => void;
  onChange: (payload: Partial<T>) => void;
};

type WidgetAction<T> = {
  text: string;
  icon?: ComponentType<any>;
  action: (props: WidgetRenderProps<T>) => Promise<void> | void;
  skip?: (props: WidgetRenderProps<T>) => boolean;
};

export type WidgetDefinition<T> = {
  name: string;
  sizing: Partial<Layout>;
  default: T;
  configComponent: ComponentType<WidgetRenderProps<T>>;
  displayComponent: ComponentType<WidgetRenderProps<T>>;
  iconComponent: ComponentType<WidgetRenderProps<T>>;
  iconActions?: WidgetAction<T>[];
  menuActions?: WidgetAction<T>[];
};

export type WidgetPayload<T = any> = {
  config: T;
  type: string;
};

export type DashboardConfig = {
  layouts: Layouts;
  widgets: Record<string, WidgetPayload>;
};
