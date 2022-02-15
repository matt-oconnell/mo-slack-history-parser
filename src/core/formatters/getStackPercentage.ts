import { ConversationsHistoryResponse } from "@slack/web-api";
import { FormatterFunction } from "./index";

const getStackPercentage: FormatterFunction = (
  messages: ConversationsHistoryResponse["messages"] = []
): string => {
  let backendCount = 0;
  let frontendCount = 0;
  let totalCount = 0;

  messages.forEach((message) => {
    const messageText = message.text;
    if (messageText && /backend|frontend/.test(messageText)) {
      totalCount++;
      if (messageText.includes("backend")) {
        backendCount++;
      } else {
        frontendCount++;
      }
    }
  });

  const backendPercentage =
    Math.floor((backendCount / totalCount) * 10000) / 100;
  const frontendPercentage =
    Math.floor((frontendCount / totalCount) * 10000) / 100;

  return `There were ${backendPercentage}% backend bugs vs ${frontendPercentage}% frontend bugs`;
};

export default getStackPercentage;
