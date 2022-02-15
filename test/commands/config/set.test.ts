import { expect, test } from "@oclif/test";
import configCreator from "../../../src/core/config";

describe("config set", () => {
  // quick spy, oclif's test framework doesnt support these well. would
  // use something legit if i had more time
  let results = {
    SLACK_BOT_TOKEN: "",
    SLACK_SIGNING_SECRET: "",
  };

  const mockConf = {
    set(key: string, value: string) {
      if (key === "SLACK_BOT_TOKEN" || key === "SLACK_SIGNING_SECRET") {
        results[key] = value;
      }
    },
  };

  test
    .stdout()
    .stub(configCreator, "create", () => mockConf)
    .command([
      "config set",
      "--SLACK_BOT_TOKEN=bot_test",
      "--SLACK_SIGNING_SECRET=signing_test",
    ])
    .exit()
    .it("sets the provided tokens", (ctx) => {
      expect(ctx.stdout).to.contain("Successfully set tokens.");
      expect(results.SLACK_BOT_TOKEN).to.equal("bot_test");
      expect(results.SLACK_SIGNING_SECRET).to.equal("signing_test");
    });
});
