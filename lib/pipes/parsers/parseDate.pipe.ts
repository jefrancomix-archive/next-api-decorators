import { BadRequestException } from '../../exceptions'
import type { PipeMetadata, PipeOptions } from '../ParameterPipe'
import { validateNullable } from '../validateNullable'
import { validatePipeOptions } from '../validatePipeOptions'

// The following variables and functions are taken from the validator.js (https://github.com/validatorjs/validator.js/blob/master/src/lib/isISO8601.js)

// from http://goo.gl/0ejHHW
const iso8601 = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
// same as above, except with a strict 'T' separator between date and time
const iso8601StrictSeparator = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/

const isValidDate = (str: string) => {
  // str must have passed the ISO8601 check
  // this check is meant to catch invalid dates
  // like 2009-02-31
  const match = (str.match(/(\d{4})-?(\d{0,2})-?(\d*)/) ?? []).map(Number)
  const year = match[1]
  const month = match[2]
  const day = match[3]
  const monthString = month ? `0${month}`.slice(-2) : month
  const dayString = day ? `0${day}`.slice(-2) : day

  // create a date object and compare
  const d = new Date(`${year}-${monthString || '01'}-${dayString || '01'}`)
  if (month && day) {
    return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month && d.getUTCDate() === day
  }

  return true
}

function isISO8601(str: string, options: { strictSeparator?: boolean; strict?: boolean } = {}) {
  const check = options.strictSeparator ? iso8601StrictSeparator.test(str) : iso8601.test(str)

  if (check && options.strict) {
    return isValidDate(str)
  }

  return check
}

/** Validates and transforms `Date` strings. Allows valid `ISO 8601` formatted date strings. */
export function ParseDatePipe(options?: PipeOptions) {
  return (value: any, metadata?: PipeMetadata) => {
    validatePipeOptions(value, metadata?.name, options)

    if (validateNullable(value, options?.nullable)) {
      return undefined
    }

    if (value && !isISO8601(value, { strict: true })) {
      throw new BadRequestException(
        `Validation failed${metadata?.name ? ` for ${metadata.name}` : ''} (date string is expected)`
      )
    }

    return new Date(value)
  }
}
