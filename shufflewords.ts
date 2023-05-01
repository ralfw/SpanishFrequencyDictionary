// deno run shufflewords.ts

const words = `
vida, calle, pagar, casa, puerta, como, cosa, amigo, quién, volar, tanto, hablar, tener, cual, cuenta, estar, viejo, la, Pablo, mujer, ver, y, Maria, cabeza, hombre, si, ejemplo, Lucia, correr, libro, trabajo, qué, blanco, año, hijo, grande, mi, nuevo, mí, animal, madre, nosotros, cuándo, poder, mano, árbol, ir, cierto, su, carta, pero, un, el, quien, saber, persona, gato, tú, negro, mundo, él, rojo, ciudad, vosotros, día, comer, mucho, problema, beber, esto, padre, ello, plan, venir, ellas, dónde, familiar, ojo, hija, amar, médico, ellos, niño, último, solo, encontrar, mesa, hacer, poco, ella, hora, alto, primero, ser, mejor, bajo, tu, idea, perro, pájaro, yo, dar, una, querer, decir, llevar, Alejandro, llegar, nuestro, bueno
`

function shuffleWords(inputString: string): string {
  // Split the input string into an array of words
  const words = inputString.split(/[\s,;\n]+/).filter(x => x.trim() != "");

  // Shuffle the words using the Fisher-Yates shuffle algorithm
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }

  // Join the shuffled words into a string
  const CHUNK_SIZE = 10;
  let chunked = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunked.push(words.slice(i, i + CHUNK_SIZE));
  }
  
  return chunked.map(x => x.join(", ")).join(", ");
}

console.log(shuffleWords(words));