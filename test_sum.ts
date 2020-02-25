import * as loader from "./assemblyscript_loader.js";

function runWithLoader() {
  const memory = new WebAssembly.Memory({ initial: 1 });
  // Treat the raw memory bytes as an array of Float64s so we can work with it
  // conveniently. Assign the first 10 elements to 1.
  const floats = new Float64Array(memory.buffer);
  for (let i = 0; i < 10; i += 1) {
    floats[i] = 1;
  }

  const wasmModule = loader.instantiateSync(
    Deno.readFileSync("./assembly/sum.runtime.wasm"),
    // We need to pass in the memory in the "env" namespace. You'll see different
    // conventions for this (e.g. the MDN docs usually use the "js" namespace for
    // memory imports) but this is AssemblyScript's convention.
    { env: { memory } }
  );

  console.log("sum(0, 10) from module with runtime:");
  console.log(wasmModule.sum(0, 10));
}

async function runWithStandalone() {
  const memory = new WebAssembly.Memory({ initial: 1 });
  const floats = new Float64Array(memory.buffer);
  for (let i = 0; i < 10; i += 1) {
    floats[i] = 1;
  }

  // Instead of importing the .wasm file directly, we'll instantiate it using the
  // same APIs that are available in the web browser (except Deno.readFileSync,
  // of course).
  const lib = await WebAssembly.instantiate(
    new Uint8Array(Deno.readFileSync("./assembly/sum.standalone.wasm")),
    { env: { memory } }
  );

  console.log("sum(0, 10) from standalone module:");
  console.log(lib.instance.exports.sum(0, 10));
}

runWithLoader();
runWithStandalone();
