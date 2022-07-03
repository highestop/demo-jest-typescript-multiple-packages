export default function toEqualAsJsonStr(received: any, expected: string) {
  if (JSON.stringify(received) === expected) {
    return {
      message: () =>
        `expected '${JSON.stringify(received)}' not to equal '${expected}'`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `expected '${JSON.stringify(received)}' to equal '${expected}'`,
      pass: false,
    };
  }
}
