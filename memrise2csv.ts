// Importieren der erforderlichen Module
// Source: https://app.memrise.com/course/203799/5000-most-frequent-spanish-words/
import { walkSync } from "https://deno.land/std/fs/mod.ts";

import { readFileStrSync, writeFileStrSync } from "https://deno.land/std@0.55.0/fs/mod.ts";

function transformFile(sourceFilepath: string, destFilepath: string) {
  const fileContent = readFileStrSync(sourceFilepath);
  const lines = fileContent.split("\n");
  let transformedContent = "";

  for (let i = 0; i < lines.length; i += 2) {
    if (lines[i] && lines[i + 1]) {
      const transformedLine = `${lines[i]}\t${lines[i + 1]}\n`;
      transformedContent += transformedLine;
    }
  }

  writeFileStrSync(destFilepath, transformedContent);
  console.log("converted " + destFilepath);
}

const sourcePath = "memrise";
const destPath = "esfreqdict";

for (const file of walkSync(sourcePath)) {
  if (file.isFile) {
    const destinationFilepath = file.path.replace(sourcePath, destPath).replace(".txt", ".csv");
    console.log(`${file.path} -> ${destinationFilepath}`)
    transformFile(file.path, destinationFilepath);
  }
}
