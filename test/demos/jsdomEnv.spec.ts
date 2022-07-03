// make sure that test is running in jsdom testing environment
// (in jest config: testEnvironment: 'jsdom')
test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});
