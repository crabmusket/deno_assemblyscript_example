// Copied from https://docs.assemblyscript.org/
export function fib(n: i32): i32 {
  var a = 0, b = 1
  for (let i = 0; i < n; i++) {
    let t = a + b; a = b; b = t
  }
  return b
}
