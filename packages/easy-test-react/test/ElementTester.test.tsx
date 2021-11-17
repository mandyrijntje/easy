import React from 'react';
import { mock } from '@thisisagile/easy-test';

const getByText = mock.return(<div />);
jest.mock('@testing-library/react', () => ({ ...jest.requireActual('@testing-library/react'), getByText }));
import { fireEvent } from '@testing-library/react';
import { ElementTester, Tester, renders } from '../src';

describe('ElementTester', () => {
  const a = <div />;
  const e = mock.empty<Element & {value: string}>({ value: '42' });
  let et: ElementTester;

  beforeEach(() => {
    et = renders(a).atText('');
  });

  test('get value', () => {
    expect(new ElementTester(() => e).value).toBe('42');
  });

  test('is valid', () => {
    expect(new ElementTester(() => e).isValid).toBeTruthy();
  });

  test('is not valid', () => {
    expect(new ElementTester(undefined as unknown as () => Element).isValid).toBeFalsy();
  });

  test('then returns new Tester', () => {
    const t = new ElementTester(() => e).then
    expect(t).toBeInstanceOf(Tester);
    expect(t.container).toBe(e);
  });

  test('click fires click event', () => {
    fireEvent.click = mock.return();
    et.click();
    expect(getByText).toHaveBeenCalledTimes(2);
    expect(fireEvent.click).toHaveBeenCalledWith(a);
  });

  test('type fires value change event', () => {
    fireEvent.change = mock.return();
    const value = 'hello';
    et.type(value);
    expect(getByText).toHaveBeenCalled();
    expect(fireEvent.change).toHaveBeenCalledWith(a, { target: { value } });
  });
});
