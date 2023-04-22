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
  const q = row[COL_TRANSLATION] + "\n\n" + row[COL_TRANSLATEDEXAMPLE];

  // ES / back
  let a = row[COL_WORD];
  switch(row[COL_CATEGORY]) {
    case "noun":
      a = (row[COL_GENDER] == "masculine" ? "el " : "la ") + a;
      a += ", pl. " + row[COL_PLURAL];
      break;
    case "verb":
      a += "\n\n" + row[COL_CONJUGATION];
      break;
  }
  a += "\n\n" + row[COL_EXAMPLE]
  
  flashcards.push({
    question: q,
    answer: a,
    categories: [row[COL_CATEGORY]]
  });
}

const jsonFilename = csvFilename.replace(".csv", ".json");
const json = JSON.stringify(flashcards);
Deno.writeTextFileSync(jsonFilename, json);