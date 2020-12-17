import { Dev } from '../ref';
import { isValidatable } from '../../src';

describe('Validatable', () => {
  test('isValidatable works', () => {
    expect(isValidatable()).toBeFalsy();
    expect(isValidatable(undefined)).toBeFalsy();
    expect(isValidatable(null)).toBeFalsy();
    expect(isValidatable({})).toBeFalsy();
    expect(isValidatable({ name: 'Sander' })).toBeFalsy();
    expect(isValidatable([])).toBeFalsy();
    expect(isValidatable([{ name: 'Sander' }])).toBeFalsy();
    expect(isValidatable({ isValid: true })).toBeTruthy();
    expect(isValidatable(Dev.Sander)).toBeTruthy();
  });
});
