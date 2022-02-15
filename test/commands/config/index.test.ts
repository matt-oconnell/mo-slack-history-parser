import { expect, test } from "@oclif/test";
import configCreator from "../../../src/core/config";

const mockConf = {
  get(key: string) {
    if (key === "SLACK_BOT_TOKEN") {
      return "bot_test";
    }
    if (key === "SLACK_SIGNING_SECRET") {
      return "signing_test";
    }
  },
};

describe("config", () => {
  test
    .stdout()
    .stub(configCreator, "create", () => mockConf)
    .command(["config"])
    .exit()
    .it("lists the existing tokens", (ctx) => {
      expect(ctx.stdout).to.contain("Successfully retrieved tokens:");
      expect(ctx.stdout).to.contain("SLACK_BOT_TOKEN", "bot_test");
      expect(ctx.stdout).to.contain("SLACK_SIGNING_SECRET", "signing_test");
    });
});
