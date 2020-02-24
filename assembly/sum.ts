export function sum(from: i32, to: i32): f64 {
  let total: f64 = 0;
  for (let i: i32 = from; i < to; i += 1) {
    total += load<f64>(i << 3);
  }
  return total;
}
