import { ParseNumberPipe } from './parseNumber.pipe'

describe('ParseNumberPipe', () => {
  it('Should parse the given string as number', () => expect(ParseNumberPipe()('10')).toStrictEqual(10))

  it('Should parse the given string as number with decimal points', () =>
    expect(ParseNumberPipe()('07.99')).toStrictEqual(7.99))

  it('Should throw required error the given value is empty', () =>
    expect(() => ParseNumberPipe({ nullable: false })('')).toThrow())

  it('Should pass without a value when nullable', () =>
    expect(ParseNumberPipe({ nullable: true })(undefined)).toStrictEqual(undefined))

  it('Should throw when the given string is not a numeric string', () =>
    expect(() => ParseNumberPipe()('test')).toThrow())
})
