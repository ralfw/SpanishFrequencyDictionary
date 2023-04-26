// deno run shufflewords.ts

const words = `
idea, la, mí, animal, ser, tu, poco, ciudad, alto, estar, Pablo, problema, mi, ver, familiar, pero, cosa, ella, esto, libro, año, médico, tener, poder, yo, hija, hora, plan, primero, mucho, tú, nosotros, como, persona, ir, Lucia, tanto, quién, vosotros, rojo, un, su, día, si, madre, querer, ellas, nuestro, niño, hijo, trabajo, amigo, ellos, ello, blanco, carta, Alejandro, Maria, una, negro, decir, padre, mujer, bueno, mundo, dar, el, hombre, amar, calle, casa, y, grande, mesa, puerta, él, bajo
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