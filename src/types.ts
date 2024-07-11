import { Layout, Layouts } from "react-grid-layout";
import { ComponentType } from "react";

type DefaultConfig = {
  title: string;
  referencingId?: string;
};

export type WidgetRenderProps<T, R> = {
  id: string;
  referenceResolved: boolean;
  config: T & DefaultConfig;
  onOpenEditModal: () => void;
  onChange: (payload: Partial<T & DefaultConfig>) => void;
  referencing?: {
    config: R & DefaultConfig;
    onChange: (payload: Partial<R & DefaultConfig>) => void;
  };
  layout: Layout;
  icon?: ComponentType;
  isDark: boolean;
};

type WidgetAction<T, R> = {
  text: string;
  icon?: string | ComponentType<WidgetRenderProps<T, R>>;
  action: (props: WidgetRenderProps<T, R>) => Promise<void> | void;
  skip?: (props: WidgetRenderProps<T, R>) => boolean;
};

export type WidgetDefinition<T, R> = {
  name: string;
  label: string;
  description: string[];
  referencing?: WidgetDefinition<R, any>;
  sizing: Partial<Layout>;
  default: T & Pick<DefaultConfig, "title">;
  ConfigComponent?: ComponentType<WidgetRenderProps<T, R>>;
  DisplayComponent: ComponentType<WidgetRenderProps<T, R>>;
  IconComponent: ComponentType<{}>;
  iconActions?:
    | WidgetAction<T, R>[]
    | ((props: WidgetRenderProps<T, R>) => WidgetAction<T, R>[]);
  menuActions?:
    | WidgetAction<T, R>[]
    | ((props: WidgetRenderProps<T, R>) => WidgetAction<T, R>[]);
  skipTitleComponent?: boolean;
};

export type PayloadOfWidgetDefinition<T> =
  T extends WidgetDefinition<infer U, any> ? U : never;

export type WidgetPayload<T = any> = {
  config: T & DefaultConfig;
  type: string;
};

export type DashboardConfig = {
  title: string;
  lastEdit: number;
  createdAt: number;
  editedAfterWeek: boolean;
  layouts: Layouts;
  widgets: Record<string, WidgetPayload>;
};
