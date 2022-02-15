import { Command } from "@oclif/core";
import chalk = require("chalk");
import configCreator from "../../core/config";

export default class Delete extends Command {
  static examples = [
    `
    $ slparse config delete"
    `,
  ];

  async run(): Promise<void> {
    const config = configCreator.create();

    config.delete("SLACK_BOT_TOKEN");
    config.delete("SLACK_SIGNING_SECRET");

    this.log(chalk.greenBright("Successfully deleted tokens."));

    this.exit();
  }
}
