import {sampleDashboards} from "./src/sample-dashboards";
import * as fs from "node:fs";

const template = await fs.promises.readFile("./README.tpl.md", "utf8");

const templatesText = Object.entries(sampleDashboards).map(([key, value]) =>
  `### ${value.title}\n\n${value.description.join("\n\n")}\n\n<div align="center"><img src="https://github.com/lukasbach/tersus/raw/main/public/dashboards/${key}-dark.png" alt="Template sample" /></div>`).join("\n\n");

const readme = template
  .replace("{{templates}}", templatesText);

await fs.promises.writeFile("README.md", readme);