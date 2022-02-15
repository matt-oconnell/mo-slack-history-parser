import { SlackApiError } from "./errors";
import startApp from "./startApp";
import groupByStack from "./formatters/groupByStack";
import getStackPercentage from "./formatters/getStackPercentage";
import { Formatters } from "./formatters/index";
import { ConversationsHistoryArguments, WebClient } from "@slack/web-api";
import { ValidationError } from "common-errors";
import { Channel } from "@slack/web-api/dist/response/ConversationsListResponse";
import { Message } from "@slack/web-api/dist/response/ConversationsHistoryResponse";

const formatters = {
  [Formatters.GroupByStack]: groupByStack,
  [Formatters.GetStackPercentage]: getStackPercentage,
};

interface Options {
  channelName: string;
  formatter: Formatters;
  daysAgo?: string;
  startTime?: string;
  endTime?: string;
}

export default async (options: Options) => {
  const { client } = await startApp();

  const channels = await fetchAllChannels(client);

  let channelId = "";
  const channel = channels.find(
    (channel) => channel.name === options.channelName
  );
  if (channel?.id) {
    channelId = channel.id;
  }

  const historyOptions = parseAndFormatHistoryOptions(options, channelId);

  const messages = await fetchAllMessages(client, historyOptions);

  let formattededResult = "";
  if (options.formatter) {
    formattededResult = formatters[options.formatter](messages);
  } else {
    formattededResult = JSON.stringify(messages);
  }

  return formattededResult;
};

const fetchAllChannels = async (
  client: WebClient,
  channels: Channel[] = [],
  cursor: string = ""
): Promise<Channel[]> => {
  const conversationList = await client.conversations.list({ cursor });

  if (!conversationList.ok || !conversationList.channels) {
    throw new SlackApiError(conversationList.error);
  }

  channels = [...channels, ...conversationList.channels];

  const nextCursor = conversationList.response_metadata?.next_cursor;

  if (!nextCursor) {
    return channels;
  }

  return fetchAllChannels(client, channels, nextCursor);
};

const fetchAllMessages = async (
  client: WebClient,
  historyOptions: ConversationsHistoryArguments,
  messages: Message[] = [],
  cursor: string = ""
): Promise<Message[]> => {
  const conversationHistory = await client.conversations.history({
    ...historyOptions,
    cursor,
  });

  if (!conversationHistory.ok || !conversationHistory.messages) {
    throw new SlackApiError(conversationHistory.error);
  }

  messages = [...messages, ...conversationHistory.messages];

  const nextCursor = conversationHistory.response_metadata?.next_cursor;

  if (!nextCursor) {
    return messages;
  }

  return fetchAllMessages(client, historyOptions, messages, nextCursor);
};

const parseAndFormatHistoryOptions = (
  { startTime, endTime, daysAgo }: Options,
  channelId: string
): ConversationsHistoryArguments => {
  const historyOptions: ConversationsHistoryArguments = {
    channel: channelId,
  };

  if (startTime) {
    historyOptions.oldest = startTime;
  }

  if (endTime) {
    historyOptions.latest = endTime;
  }

  if (daysAgo) {
    const daysAgoInt = parseInt(daysAgo);
    if (!daysAgoInt || daysAgoInt < 1) {
      throw new ValidationError("daysAgo must be a positive integer");
    } else {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - daysAgoInt);
      historyOptions.oldest = (currentDate.getTime() / 1000).toString();
    }
  }

  return historyOptions;
};
