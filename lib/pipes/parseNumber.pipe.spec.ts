import { ParseNumberPipe } from './parseNumber.pipe';

describe('ParseNumberPipe', () => {
  it('Should parse the given string as number', () => expect(ParseNumberPipe('10')).toStrictEqual(10));

  it('Should parse the given string as number with decimal points', () =>
    expect(ParseNumberPipe('07.99')).toStrictEqual(7.99));

  it('Should return the given string as string', () => expect(ParseNumberPipe('test')).toStrictEqual('test'));
});
