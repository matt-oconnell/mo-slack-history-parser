import { PrettyPrintableError } from "@oclif/core/lib/interfaces";
import { AuthenticationRequiredError, ValidationError } from "common-errors";

export class SlackApiError extends Error {}

export default {
  handle(error: Error): PrettyPrintableError | undefined {
    if (error instanceof SlackApiError) {
      return {
        code: error.message,
        suggestions: [
          "See Slack API docs for info on this method's particular error",
          "e.g. https://api.slack.com/methods/conversations.list#errors",
        ],
      };
    }
    if (error instanceof AuthenticationRequiredError) {
      return {
        message: error.message,
        suggestions: [
          "Did you set your bot token and signing secret with: ",
          '$ slparse config set --SLACK_BOT_TOKEN="ABC123_MyBotToken" --SLACK_SIGNING_SECRET="ABC123_MySigningSecret"',
        ],
      };
    }
    if (error instanceof ValidationError) {
      return {
        message: error.message,
      };
    }
  },
};
