// The AssemblyScript loader provides convenience and support for AS's runtime.
// See https://docs.assemblyscript.org/basics/loader for more details.
import * as loader from "./assemblyscript_loader.js";
const wasmModule = loader.instantiateSync(Deno.readFileSync("./assembly/fib.runtime.wasm"));

console.log("fib(10) from module with runtime:");
console.log(wasmModule.fib(10));

// Deno can also import WASM modules directly. Because this module has no dependency
// on AS's runtime, we don't need to use the loader.
import { fib } from "./assembly/fib.standalone.wasm";

console.log("fib(10) from standalone module:");
console.log(fib(10));
