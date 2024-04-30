import moment from "moment";
import fs from "fs";
import path from "path";

export function log(...data: any[]) {
  const timestamp = moment().format("YYYY-MM-DD, h:mm:ss a");
  console.log(`🕑 [${timestamp}] `, ...data);
  return timestamp;
}

export function logr(...data: any[]) {
  const timestamp = log(...data);
  try {
    const str = JSON.stringify(data);
    writeInLogFile(`🕑 [${timestamp}] ${str}`);
  } catch {}
  return timestamp;
}

function writeInLogFile(str: string) {
  const file = moment().format("YYYYMMDD") + "-info.log";
  const filePath = path.join(process.cwd(), "logs", file);
  if (!fs.existsSync(path.join(process.cwd(), "logs"))) fs.mkdirSync(process.cwd(), "logs");
  fs.appendFileSync(filePath, str + "\n");
}
