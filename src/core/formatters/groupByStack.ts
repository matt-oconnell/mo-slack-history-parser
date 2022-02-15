import { ConversationsHistoryResponse } from "@slack/web-api";
import { FormatterFunction } from "./index";

const groupByStack: FormatterFunction = (
  messages: ConversationsHistoryResponse["messages"] = []
) => {
  const formattedResult: { backend: string[]; frontend: string[] } = {
    backend: [],
    frontend: [],
  };

  messages.forEach((message) => {
    const messageText = message.text;
    if (messageText && /backend|frontend/.test(messageText)) {
      const link = /<([^|]+)|/.exec(messageText)?.[1] || "";

      if (messageText.includes("backend")) {
        formattedResult.backend.push(link);
      } else {
        formattedResult.frontend.push(link);
      }
    }
  });

  return JSON.stringify(formattedResult);
};

export default groupByStack;
