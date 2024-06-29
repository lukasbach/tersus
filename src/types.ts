import { Layout, Layouts } from "react-grid-layout";
import { ComponentType } from "react";

type DefaultConfig = {
  title: string;
  referencingId?: string;
};

export type WidgetRenderProps<T, R> = {
  referenceResolved: boolean;
  config: T & DefaultConfig;
  onOpenEditModal: () => void;
  onChange: (payload: Partial<T & DefaultConfig>) => void;
  referencing?: {
    config: R & DefaultConfig;
    onChange: (payload: Partial<R & DefaultConfig>) => void;
  };
  layout: Layout;
};

type WidgetAction<T, R> = {
  text: string;
  icon?: ComponentType<any>;
  action: (props: WidgetRenderProps<T, R>) => Promise<void> | void;
  skip?: (props: WidgetRenderProps<T, R>) => boolean;
};

export type WidgetDefinition<T, R> = {
  name: string;
  referencing?: WidgetDefinition<R, any>;
  sizing: Partial<Layout>;
  default: T & Pick<DefaultConfig, "title">;
  configComponent?: ComponentType<WidgetRenderProps<T, R>>;
  displayComponent: ComponentType<WidgetRenderProps<T, R>>;
  iconComponent: ComponentType<WidgetRenderProps<T, R>>;
  iconActions?: WidgetAction<T, R>[];
  menuActions?: WidgetAction<T, R>[];
};

export type PayloadOfWidgetDefinition<T> =
  T extends WidgetDefinition<infer U, any> ? U : never;

export type WidgetPayload<T = any> = {
  config: T & DefaultConfig;
  type: string;
};

export type DashboardConfig = {
  layouts: Layouts;
  widgets: Record<string, WidgetPayload>;
};
