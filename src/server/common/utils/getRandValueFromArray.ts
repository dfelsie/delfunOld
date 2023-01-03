export default function getRandValueFromArray<A>(ary: A[]): A {
  const val = ary[Math.floor(Math.random() * ary.length)];
  if (val === undefined) {
    throw "randValueFromArrayError";
  }
  return val;
}
