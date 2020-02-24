import * as loader from "./assemblyscript_loader.js";

const memory = new WebAssembly.Memory({ initial: 1 });
const floats = new Float64Array(memory.buffer);
for (let i = 0; i < 10; i += 1) {
  floats[i] = 1;
}

const wasmModule = loader.instantiateSync(
  Deno.readFileSync("./assembly/sum.runtime.wasm"),
  // Pass the memory into the module in the "env" namespace, which is how
  // AssemblyScript expects it when using the --importMemory flag.
  { env: { memory } }
);

console.log("sum(0, 10) from module with runtime:");
console.log(wasmModule.sum(0, 10));
