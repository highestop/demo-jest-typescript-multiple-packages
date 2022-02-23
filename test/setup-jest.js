expect.extend({
    toEqualAsJsonStr,
});
export function toEqualAsJsonStr(received, expected) {
    if (JSON.stringify(received) === expected) {
        return {
            message: () => `expected '${JSON.stringify(received)}' not to equal '${expected}'`,
            pass: true,
        };
    }
    else {
        return {
            message: () => `expected '${JSON.stringify(received)}' to equal '${expected}'`,
            pass: false,
        };
    }
}
