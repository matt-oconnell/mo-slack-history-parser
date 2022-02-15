import { Command } from "@oclif/core";
import Conf from "conf";
import chalk = require("chalk");

export default class Delete extends Command {
  static examples = [
    `
    $ slparse config delete"
    `,
  ];

  async run(): Promise<void> {
    const config = new Conf();

    config.delete("SLACK_BOT_TOKEN");
    config.delete("SLACK_SIGNING_SECRET");

    this.log(chalk.greenBright("Successfully deleted tokens."));

    this.exit();
  }
}
