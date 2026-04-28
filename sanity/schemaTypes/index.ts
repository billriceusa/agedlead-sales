import { authorType } from "./author";
import { categoryType } from "./category";
import { glossaryTermType } from "./glossaryTerm";
import { guideType } from "./guide";
import { leadTypeSchema } from "./leadType";
import { leadProviderType } from "./leadProvider";
import { playbookType } from "./playbook";
import { postType } from "./post";
import { priceBenchmarkType } from "./priceBenchmark";
import { verticalType } from "./vertical";
import { cronHeartbeatType } from "./cronHeartbeat";
import { tableType, tableRowType } from "./objects/table";
import { codeBlockType } from "./objects/codeBlock";

export const schemaTypes = [
  authorType,
  categoryType,
  glossaryTermType,
  guideType,
  leadTypeSchema,
  leadProviderType,
  playbookType,
  postType,
  priceBenchmarkType,
  verticalType,
  cronHeartbeatType,
  tableType,
  tableRowType,
  codeBlockType,
];
