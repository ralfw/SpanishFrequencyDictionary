// deno run shufflewords.ts

const lessonWords = [
//// ---- evergree
  // Names
  `Pablo, Lucia, Pedro, Claudia, Carmen, Maria`,

// ----- lessons

  `casi
morir
incluso
aceptar
comprender
estado
posibilidad
ley`,

  `formar
suponer
tocar
amor
muerte
jamás
debajo
pan`,

  `realizar
preguntar
aspecto
servicio
completamente`,

  `convertir
explicar
diferencia
efecto
objeto`,

  `clase
ayudar
cumplir
sistema
profundamente`,

  `reconocer
utilizar
guerra
cuestión
cantidad`,

  `abrir
estudiar
dirigir
ofrecer
acción`,

  `levantar
repetir
duda
viaje
respeto`,

  `usar
olvidar
pie
brazo
boca`,

  `suelo
construir
cielo
fuerte
ventana`,

  `época
escuchar
descubrir
sociedad
libertad`,
];

// deno run shufflewords.ts

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