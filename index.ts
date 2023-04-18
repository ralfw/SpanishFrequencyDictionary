import { walkSync } from "https://deno.land/std/fs/mod.ts";

import { askAsync } from "./modules/gpt.ts"


interface FreqDictEntry {
  ES:string
  EN:string
  Category:string
  Gender:string
  Plural:string
  Conjugation:string
  ESsample:string
  ENsample:string
}


function loadDict(filepath:string): FreqDictEntry {
  const text = Deno.readTextFileSync(filepath);
  const lines = text.split("\n");
  const columns = lines.map(x => x.split("\t"));
  const entries = columns.map(x => {
    return {
      ES: x[0],
      EN: x[1],
      Category: x.length > 2 ? x[2] : "",
      Gender: x.length > 3 ? x[3] : "",
      Plural: x.length > 4 ? x[4] : "",
      Conjugation: x.length > 5 ? x[5] : "",
      ESsample: x.length > 6 ? x[6] : "",
      ENsample: x.length > 7 ? x[7] : ""
    };
  })
  return entries;
}

function storeDict(filepath:string, entries:FreqDictEntry[]) {
  const lines = entries.map(x => `${x.ES}\t${x.EN}\t${x.Category}\t${x.Gender}\t${x.Plural}\t${x.Conjugation}\t${x.ESsample}\t${x.ENsample}`);
  const text = lines.join("\n");
  Deno.writeTextFileSync(filepath, text);
}


async function runPrompt(promptFilename:string, words:string, delimiter:string="\t"): Promise<string[][]> {
  const prompt = Deno.readTextFileSync(promptFilename).replace("{WORDS}", words);
  
  const completion = await askAsync(prompt, 0.1);
  console.log(completion)
  const result = completion.split("\n").map(x => x.split(delimiter));
  
  return result;
}


async function addCategories(entries:FreqDictEntry) {
  const words = entries.map(x => x.ES);
  console.log(`-- add categories for ${words.length} words`)
  
  const cols = await runPrompt("promptForCategories.txt", words);

  const dict = new Map<string,FreqDictEntry>(entries.map(x => [x.ES, x]));
  for(const c of cols)
    dict.get(c[0]).Category = c[1];
}

async function addGenders(entries:FreqDictEntry) {
  const words = entries.filter(x => x.Category == "Noun").map(x => x.ES);  
  console.log(`-- add gender for ${words.length} words`)
  if (words.length == 0) return;
  
  const cols = await runPrompt("promptForGenders.txt", words);

  const dict = new Map<string,FreqDictEntry>(entries.map(x => [x.ES, x]));
  for(const c of cols)
    dict.get(c[0]).Gender = c[1];
}

async function addPlurals(entries:FreqDictEntry) {
  const words = entries.filter(x => x.Category == "Noun").map(x => x.ES);
  console.log(`-- add plurals for ${words.length} words`)
  if (words.length == 0) return;
  
  const cols = await runPrompt("promptForPlurals.txt", words, ";");

  const dict = new Map<string,FreqDictEntry>(entries.map(x => [x.ES, x]));
  for(const c of cols)
    dict.get(c[0]).Plural = c[1];
}

async function addConjugations(entries:FreqDictEntry) {
  const words = entries.filter(x => x.Category == "Verb").map(x => x.ES);
  console.log(`-- add conjugations for ${words.length} words`)
  if (words.length == 0) return;
  
  const cols = await runPrompt("promptForConjugations.txt", words);

  const dict = new Map<string,FreqDictEntry>(entries.map(x => [x.ES, x]));
  for(const c of cols)
    dict.get(c[0]).Conjugation = c[1];
}

async function addExamples(entries:FreqDictEntry) {
  const words = entries.map(x => x.ES);
  console.log(`-- add examples for ${words.length} words`)
  
  const cols = await runPrompt("promptForExamples.txt", words);

  const dict = new Map<string,FreqDictEntry>(entries.map(x => [x.ES, x]));
  for(const c of cols) {
    dict.get(c[0]).ESsample = c[1];
    dict.get(c[0]).ENsample = c[2];
  }
}


async function complete(sourceFilepath:string, destFilepath:string) {
  const entries = loadDict(sourceFilepath);
  let completed = [];

  const chunks = [];
  const chunkSize = 20;
  for (let i = 0; i < entries.length; i += chunkSize) {
    console.log("=== chunk starting at " + i)
    
    const chunk = entries.slice(i, i + chunkSize);

    await addCategories(chunk);
    await addGenders(chunk);
    await addPlurals(chunk);
    await addConjugations(chunk);
    await addExamples(chunk);
    
    completed = completed.concat(chunk)
  }

  storeDict(destFilepath, completed);
  console.log(completed.length + " entries stored in " + destFilepath);
}


await complete("esfreqdict/1-100.csv", "completed/1-100.csv")
Deno.exit();


const path = "esfreqdict";
for (const file of walkSync(path)) {
  if (file.isFile) {
    const destinationFilepath = file.path.replace(path, "completed");
    console.log(`${file.path} -> ${destinationFilepath}`)
    await complete(file.path, destinationFilepath);

    break;
  }
}
