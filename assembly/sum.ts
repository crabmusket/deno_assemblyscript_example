export function sum(from: usize, to: usize): f64 {
  let total: f64 = 0;
  for (let i: usize = from; i < to; i += 1) {
    total += load<f64>(i << 3);
  }
  return total;
}
