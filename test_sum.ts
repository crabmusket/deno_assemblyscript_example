const memory = new WebAssembly.Memory({ initial: 1 });
const floats = new Float64Array(memory.buffer);
for (let i = 0; i < 10; i += 1) {
  floats[i] = 1;
}

const lib = await WebAssembly.instantiate(
  new Uint8Array(Deno.readFileSync("./assembly/sum.standalone.wasm")),
  { env: { memory } }
);

console.log("sum(0, 10) from standalone module:");
console.log(lib.instance.exports.sum(0, 10));
