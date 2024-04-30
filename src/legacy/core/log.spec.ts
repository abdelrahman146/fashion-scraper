import { log } from "./log";
import fs from "fs";
import path from "path";
import moment from "moment";

describe("logging test", () => {
  xtest("should log text appened in a file", () => {
    const str = "TEST LOG " + JSON.stringify({ hello: { world: "here" } });
    log(str);
    const file = moment().format("YYYYMMDD") + "-info.log";
    const filePath = path.join(process.cwd(), "logs", file);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const lastLine = lines[lines.length - 2];
    expect(lastLine.includes(str)).toBe(true);
  });
});
