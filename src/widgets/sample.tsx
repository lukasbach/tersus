import { WidgetDefinition } from "../types.ts";

export const sampleWidget: WidgetDefinition<{}> = {
  type: "sample",
  name: "Sample Widget",
  sizing: { w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
  displayComponent: () => <div>Sample Widget</div>,
  configComponent: () => <div>Sample Widget Config</div>,
  iconComponent: () => <div>XXX</div>,
};
