import { walkSync } from "https://deno.land/std/fs/mod.ts";

import { askAsync } from "./modules/gpt.ts";

interface FreqDictEntry {
  ES: string;
  EN: string;
  Category: string;
  Gender: string;
  Plural: string;
  Conjugation: string;
  ESsample: string;
  ENsample: string;
}

function loadDict(filepath: string): FreqDictEntry[] {
  const text = Deno.readTextFileSync(filepath);
  const lines = text.split("\n");
  const columns = lines.map((x) => x.split("\t"));
  const entries = columns.map((x) => {
    return {
      ES: x[0],
      EN: x[1],
      Category: x.length > 2 ? x[2] : "",
      Gender: x.length > 3 ? x[3] : "",
      Plural: x.length > 4 ? x[4] : "",
      Conjugation: x.length > 5 ? x[5] : "",
      ESsample: x.length > 6 ? x[6] : "",
      ENsample: x.length > 7 ? x[7] : "",
    };
  });
  return entries;
}

function storeDict(filepath: string, entries: FreqDictEntry[]) {
  const lines = entries.map((x) =>
    `${x.ES}\t${x.EN}\t${x.Category}\t${x.Gender}\t${x.Plural}\t${x.Conjugation}\t${x.ESsample}\t${x.ENsample}`
  );
  const text = lines.join("\n");
  Deno.writeTextFileSync(filepath, text);
}

async function runPrompt(
  promptFilename: string,
  word: string,
  delimiter: string = "$",
): Promise<string[]> {
  const prompt = Deno.readTextFileSync(promptFilename).replace("{WORD}", word);

  const completion = await askAsync(prompt, 0.25);
  console.log(completion);
  const result = completion.split("\n");
  return result;
}

async function addAll(entry: FreqDictEntry) {
  console.log(`-- add all for ${entry.ES}`);

  const cols = await runPrompt("promptForAll.txt", entry.ES);

  entry.Category = cleanup(cols[0]);
  entry.Gender = cleanup(cols[1]);
  entry.Plural = cleanup(cols[2]);
  entry.Conjugation = cleanup(cols[3]);
  entry.ESsample = cleanup(cols[4]);
  entry.ENsample = cleanup(cols[5]);
  console.log(entry);
}

function cleanup(x:string):string {
  return replaceNA(removeLabel(x));
}
function replaceNA(x:string):string {
  return x=="N/A" ? "" : x;
}
function removeLabel(x:string):string {
  const parts = x.split(":");
  if (parts.length==1) return parts[0];
  return parts[1].trim();
}

async function complete(sourceFilepath: string, destFilepath: string) {
  const entries = loadDict(sourceFilepath);

  for (const e of entries) {
    await addAll(e);
  }

  storeDict(destFilepath, entries);
  console.log(entries.length + " entries stored in " + destFilepath);
}

await complete("esfreqdict/sample.csv", "completed/sample.csv");
Deno.exit();

const path = "esfreqdict";
for (const file of walkSync(path)) {
  if (file.isFile) {
    const destinationFilepath = file.path.replace(path, "completed");
    console.log(`${file.path} -> ${destinationFilepath}`);
    await complete(file.path, destinationFilepath);

    break;
  }
}
