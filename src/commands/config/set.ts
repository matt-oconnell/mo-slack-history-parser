import { Command, Flags } from "@oclif/core";
import chalk = require("chalk");
import configCreator from "../../core/config";

export default class Set extends Command {
  static examples = [
    `
    $ slparse config set --SLACK_BOT_TOKEN="ABC123_MyBotToken" --SLACK_SIGNING_SECRET="ABC123_MySigningSecret"
    `,
  ];

  static flags = {
    SLACK_BOT_TOKEN: Flags.string({
      name: "SLACK_BOT_TOKEN",
      description: "Slack Bot Token",
      required: true,
    }),
    SLACK_SIGNING_SECRET: Flags.string({
      name: "SLACK_SIGNING_SECRET",
      description: "Slack Bot Token",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Set);
    const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } = flags;

    const config = configCreator.create();

    config.set("SLACK_BOT_TOKEN", SLACK_BOT_TOKEN);
    config.set("SLACK_SIGNING_SECRET", SLACK_SIGNING_SECRET);

    this.log(chalk.greenBright("Successfully set tokens."));

    this.exit();
  }
}
