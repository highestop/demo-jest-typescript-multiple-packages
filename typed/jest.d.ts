declare namespace jest {
  interface Matchers<R> {
    toEqualAsJsonStr(obj: any): R;
  }
}
