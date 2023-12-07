import { expect, test, describe } from 'vitest';
import { stringify } from './json';

describe('json utils', () => {
  test('stringify uses JSON.stringify with expected args', () => {
    const expected = `{
  "name": "test"
}`;
    const output = stringify({ name: 'test' });
    expect(output).toEqual(expected);
  });
});
