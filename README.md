# The Future Is Now

> Running WASM with Deno by compiling TypeScript using AssemblyScript

[Deno](https://deno.land) is a new runtime for JavaScript and TypeScript, with native support for loading [WebAssembly](https://webassembly.org/) (WASM) modules.
This is just one of many reasons to be looking forward to Deno's v1.0 release.

[AssemblyScript](https://assemblyscript.org/) is a compiler that understands a subset of TypeScript and produces WASM modules.
Being able to write a high-level language that isn't _all_ of TypeScript, but isn't C or Rust, seems like a really helpful way to get started experimenting with WASM in an existing JS or TS application.

For a new server project I'm starting, I wanted to see if I could use Deno instead of Node, and write some of the server's logic in AssemblyScript for high performance.
It turns out that it's not very hard to get these two great projects to work together.

## Dependencies

This project relies on having `node`, `npm` and `deno` installed.

I'm using `node` 12, `npm` 6.13, and `deno` 0.34.

You can install the latter by running:

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh -s v0.34.0
```

To install AssemblyScript, just run

```bash
npm ci
```

Then take a moment to appreciate that `node_modules` is only 30MB on-disk!

## Building WASM from source

`assembly/fib.ts` contains an example of TypeScript code written for AssemblyScript (taken from their documentation).
There are two ways we can compile it for use with Deno:

1. Using the AssemblyScript runtime.
2. Using no runtime. This is easier to get into Deno, but you'll miss out on everything [documented here](https://docs.assemblyscript.org/details/runtime).

This project is set up to create outputs using both approaches in `assembly/fib.runtime.wasm` and `assembly/fib.standalone.wasm` respectively.
To compile both modules, run

```bash
npm run asbuild
```

Take a look at `package.json` to see what this script does.
Then you'll see a bunch of files created in the `assembly` folder.

The TypeScript files that will be compiled to WASM are placed in their own folder so they can have a custom `tsconfig.json` which loads a bunch of compatibility stuff.
I'm not sure if this can be worked around, but it's an acceptable constraint for now!

## Deno and WASM

There are three ways to import WASM modules into Deno JS/TS code which are used in `test_fib.ts` and `test_sum.ts`:

**Direct imports**

Deno allows you to import a WASM module as an ES module:

```typescript
import { fib } from "./assembly/fib.standalone.wasm";
```

This is convenient, but won't work with more advanced features like AS's runtime, as far as I can tell.

**Browser WebAssembly API**

Deno implements many of the same APIs as in browsers.
WebAssembly is just one example.
See the `runWithStandalone` function in `test_sum.ts` for an example and [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API) for more details.

**AssemblyScript loader**

AS has [a loader script](https://github.com/AssemblyScript/assemblyscript/tree/master/lib/loader) which helps setting things up for you.

I had to inline a copy of the loader here (in `assemblyscript_loader.js`), because the existing source does not use ES modules.
Hopefully that will change in a future version.

## Running Deno

After building your WASM modules, run the example using:

```bash
deno --allow-read=. test_fib.ts
```

You should see:

```
fib(10) from module with runtime:
89
fib(10) from standalone module:
89
```

`allow-read` is required because the script loads the `fib.runtime.wasm` file from disk.
If you wrote a script that only used the ESM `import` method to include `fib.standalone.wasm` this permission would not be required, because imports do not require permissions.

## Passing memory into WASM

`test_sum.ts` shows a more complex example of passing a memory region (an array of 10 `Float64`s) into the WASM module.
The WASM code in `assembly/sum.ts` sums the values in memory given a start and end index.

Run the example using:

```bash
deno --allow-read=. test_sum.ts
```

You should see:

```
sum(0, 10) from module with runtime:
10
sum(0, 10) from standalone module:
10
```

An important concern is the interaction between the passed-in memory buffer and AssemblyScript's runtime code (when compiled with the runtime).
Note that in the NPM script `asbuild:sum.runtime`, we pass the `--memoryBase 80` option.
This reserves 80 bytes of space (enough for 10 `f64`s) _before_ the AS runtime places its static data in memory.

It's not necessary to pass this option in `asbuild:sum.standalone` because AS doesn't need to use any `data` segments for the runtime's data structures.
For more details, see https://docs.assemblyscript.org/details/memory
