import { convertNumberToString } from '../worker';

describe('week03', () => {
  Array.apply(null, { length: 5 }).forEach(() => {
    testUnit();
  });
});

function testUnit() {
  const num: number = Math.random() * 100000;
  const expectResult = num.toString(16).toUpperCase();

  test(`test converNumToString - ${num}`, () => {
    expect(convertNumberToString(num, 16)).toBe(expectResult);
  });
}
