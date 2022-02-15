import { ConversationsHistoryResponse } from "@slack/web-api";

export enum Formatters {
  GroupByStack = "groupByStack",
  GetStackPercentage = "getStackPercentage",
}

export type FormatterFunction = (
  messages: ConversationsHistoryResponse["messages"]
) => string;
