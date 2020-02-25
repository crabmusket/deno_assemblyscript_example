export function sum(from: usize, to: usize): f64 {
  let total: f64 = 0;
  for (let i: usize = from; i < to; i += 1) {
    // << 3 is the same as multiplying by 8, the size in bytes of a 64-bit float
    // in memory.
    total += load<f64>(i << 3);
  }
  return total;
}
