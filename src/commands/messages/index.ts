import { Command, Flags } from "@oclif/core";
import getChannelMessages from "../../core/getChannelMessages";
import { Formatters } from "../../core/formatters/index";
import chalk = require("chalk");
import errors from "../../core/errors";

export default class GetMessages extends Command {
  static description =
    "Simple CLI to parse and format messages from a specific Slack channel";

  static examples = [
    `
    $ slparse messages -c="bugs" -f="percentages"
    $ slparse messages -c="bugs" -f="getStackPercentage" --daysAgo="3"
    $ slparse messages -c="bugs" -f="getStackPercentage" --startTime="1644631325" --endTime="1644804126"
    `,
  ];

  static flags = {
    channelName: Flags.string({
      char: "c",
      name: "channelName",
      description: "Slack channel name",
      required: true,
    }),
    formatter: Flags.string({
      char: "f",
      name: "formatter",
      description: "Output formatter",
      required: false,
      options: [Formatters.GroupByStack, Formatters.GetStackPercentage],
    }),
    daysAgo: Flags.string({
      name: "daysAgo",
      description:
        "Retrieve messages from specified number of days ago (positive integer)",
      required: false,
      exclusive: ["startTime"],
    }),
    startTime: Flags.string({
      name: "startTime",
      description:
        "Start of time range of messages to include in results (10 digit unix timestamp)",
      required: false,
      exclusive: ["daysAgo"],
    }),
    endTime: Flags.string({
      name: "endTime",
      description:
        "End of time range of messages to include in results. Default is the current time (10 digit unix timestamp)",
      required: false,
      exclusive: ["daysAgo"],
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(GetMessages);
    const { channelName, formatter, daysAgo, startTime, endTime } = flags;

    const formattedChannelMessages = await getChannelMessages({
      channelName,
      formatter: formatter as Formatters, // oclif will enforce this
      daysAgo,
      startTime,
      endTime,
    });

    this.log(chalk.greenBright(formattedChannelMessages));

    this.exit();
  }

  async catch(error: Error) {
    const prettyError = errors.handle(error);

    if (prettyError) {
      this.error(prettyError.message || "", prettyError);
    }

    this.error(error);
  }
}
