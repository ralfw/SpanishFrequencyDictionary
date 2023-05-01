// deno run shufflewords.ts

const lessonWords = [
  // Names
  `Pablo, Lucia, Pedro, Claudia, Daniel, Carmen, Maria`,
  // Evergreen verbs
  `comer, beber, hacer, poder, hacer, dar, pagar, amar,
  venir, ir, querer, tener, ser, estar, saber`,
  // Evergreen nouns
  `problema, hombre, mujer, niño, niña, casa, perro, gato, trabajo,
  vida, calle, amigo, rojo, alto, viejo, poco, mesa`,
  // Evergreen adjectives
  `grande, azul, blanco, pequeño, nuevo`,
  // Evergreen other
  `yo, él, ella, nosotros, ellos, mí, su, nos, vos, sus,
  mucho, dónde, quíen, cuando, como, qué`,
  // Lesson words
  // 2
  ``,
  // 3
  `ir
primero
cosa
ciudad
`,
  // 4
  `
nuestro
esto
mundo
negro
bajo
familiar
`,
  // 5
  `
decir
poco
tanto
persona
`,
  // 6
  `
año
día
hora`,
  // 7 
  `correr
árbol
perro
volar
gato
pájaro`,
  // 8
  `
`,
  // 9
  `llegar
mano
ojo
viejo
cabeza`,
  // 10
  `
mejor
cierto
ejemplo
cuenta
pagar`,
  // 11
  `llevar
encontrar
último
solo`,
];

function shuffleWords(lessonWords: string[]): string {
  // Split the input string into an array of words
  const words = lessonWords.join(",")
                           .split(/[\s,;\n]+/)
                           .filter(x => x.trim() != "");

  // Shuffle the words using the Fisher-Yates shuffle algorithm
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }

  console.log(`${words.length} words\n`);
  return words.join(", ");
  
  /*
  // Join the shuffled words into a string
  const CHUNK_SIZE = 10;
  let chunked = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunked.push(words.slice(i, i + CHUNK_SIZE));
  }
  */
  
  //return chunked.map(x => x.join(", ")).join(", ");
}

console.log(shuffleWords(lessonWords));