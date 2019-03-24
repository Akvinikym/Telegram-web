'use strict'
/* global describe, it, inject, expect, beforeEach */

describe('phoneNumber filter', function () {
  beforeEach(module('myApp.filters'))

  beforeEach(inject(function (_$filter_) {
    this.$filter = _$filter_
  }))

  beforeEach(function () {
    this.phoneNumberFilter = this.$filter('phoneNumber')
  })

  it('can handle "zero" values', function () {
    var input
    var expected = '+'
    var result = this.phoneNumberFilter(input)

    expect(result).toBe(expected)

    input = null
    result = this.phoneNumberFilter(input)

    expect(result).toBe(expected)

    input = 0
    result = this.phoneNumberFilter(input)

    expect(result).toBe(expected)
  })

  it('removes all non-digits from a phoneNumber', function () {
    var input = '123nonnumber333333e3'
    var expected = '+1233333333'
    var result = this.phoneNumberFilter(input)

    expect(result).toBe(expected)
  })

  it('converts phone number to a readable phone number (for Russia)', function () {
    // 7 is for russian Country calling code (https://en.wikipedia.org/wiki/Telephone_numbers_in_Europe)
    var input = '71234567890'
    var expected = '+7 (123) 456-78-90'
    var result = this.phoneNumberFilter(input)

    expect(result).toBe(expected)
  })

  it('can handle random inputs', function () {
    function generateRandomPhoneNumber () {
      var alphabet = 'ABCDEFuvwxyz0123456789'
      var numberLength = Math.floor(Math.random() * Math.floor(30))
      var number = ''
      for (var i = 0; i < numberLength; i++) {
        number += alphabet[Math.floor(Math.random() * Math.floor(alphabet.length))]
      }
      return number
    }
    function isRussianNumber (number) {
      return number[0] === '7' && number.length === 11
    }
    var russians = 0, nonRussians = 0
    function oracle (initialNumber, filteredNumber) {
      var russianNumberRegex = /^\+7\s\([0-9]{3}\)\s[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/g
      var anyNumberRegex = /^(\+)[0-9]*$/g

      var initialNumberWithoutChars = initialNumber.replace(/\D/g, '')
      var filteredNumberWithoutChars = filteredNumber.replace(/\D/g, '')
      expect(filteredNumberWithoutChars).toBe(initialNumberWithoutChars)

      // var russians = 0, nonRussians = 0
      if (isRussianNumber(initialNumberWithoutChars)) {
        expect(filteredNumber).toMatch(russianNumberRegex)
        russians++
      } else {
        expect(filteredNumber).toMatch(anyNumberRegex)
        nonRussians++
      }
      return [russians, nonRussians]
    }

    for (var i = 0; i < 100000; i++) {
      var number = generateRandomPhoneNumber()
      var filtered = this.phoneNumberFilter(number)
      oracle(number, filtered)
    }
    console.log('Russian numbers: ' + russians + '; other numbers: ' + nonRussians)
  })
})
