import { App } from "@slack/bolt";
import { AuthenticationRequiredError } from "common-errors";
import Conf from "conf";

export default async () => {
  const config = new Conf();

  const token = config.get("SLACK_BOT_TOKEN");
  const signingSecret = config.get("SLACK_SIGNING_SECRET");

  if (!(typeof token === "string") || !(typeof signingSecret === "string")) {
    throw new AuthenticationRequiredError("No token or secret provided.");
  }

  try {
    const app = new App({
      token,
      signingSecret,
    });

    await app.start();

    return app;
  } catch (e) {
    throw new AuthenticationRequiredError(
      "Issue Authenticating with Slack API: " + (e as any).message
    );
  }
};
