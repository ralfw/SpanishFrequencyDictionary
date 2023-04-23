// deno run shufflewords.ts

const words = `
Lucia, Pablo, Maria, Alejandro,
ir,mucho,querer,primero,cosa,alto,ciudad,calle, 
el,la,y,un, una,ser,tener,hombre,casa,mujer,hijo,problema,
padre,idea,amigo,madre,puerta,mesa,animal,médico,carta,plan,
hija,pero,ver,él,yo,grande,ella,bueno,niño,nosotros,blanco,
libro,ello,rojo,tú,ellos, ellas,vosotros
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
  
  return chunked.map(x => x.join(",")).join(",\n");
}

console.log(shuffleWords(words));