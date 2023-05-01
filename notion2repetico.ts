// deno run --allow-all notion2repetico.ts notion/raw.csv

const csvFilename = Deno.args[0];

const lines = Deno.readTextFileSync(csvFilename).split("\n");
const table = lines.map(x => x.split("\t"));

const COL_RANK = 0;
const COL_SPANISH = 1;
const COL_TRANSLATION = 2;
const COL_CONJUGATION = 3;
const COL_CATEGORY = 4;
const COL_EXAMPLE = 5;
const COL_TRANSLATEDEXAMPLE = 6;
const COL_WORD = 7;
const COL_GENDER = 8;
const COL_PLURAL = 9

const flashcards = [];
for(const row of table) {
  // EN / front
  const q = `<p>${row[COL_TRANSLATION]}</p><p>${row[COL_TRANSLATEDEXAMPLE]}</p>`;

  // ES / back
  let a = "";
  switch(row[COL_CATEGORY]) {
    case "noun":
      const article = row[COL_GENDER] == "masculine" ? "el " : "la ";
      a = `<p>${article} ${row[COL_WORD]}, pl. ${row[COL_PLURAL]}</p>`
      break;
    case "verb":
      a = `<p>${row[COL_WORD]}</p><p>${row[COL_CONJUGATION]}</p>`
      break;
    default:
      a = `${row[COL_WORD]}`;
      break;
  }
  a = a + `<p>${row[COL_EXAMPLE]}</p>`;
  
  flashcards.push({
    question: q,
    answer: a,
    categories: [row[COL_CATEGORY], "SDbD"]
  });
}

const jsonFilename = csvFilename.replace(".csv", ".json");
const json = JSON.stringify(flashcards);
Deno.writeTextFileSync(jsonFilename, json);