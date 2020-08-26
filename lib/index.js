/*
 * tswrapper
 * Esteban Fuster Pozzi
 * <estebanrfp@gmail.com>
 * Aug 9, 2016
 * ts-wrapper is an ultra lightweight timeStamp wrapper
 * timestamps (e.g. "tswrapper('2016-06-09 00:02:12')" == "about 1 day ago").
 *
 * @name timestamp-wrapper
 * @version 0.1.1
 * @author Esteban Fuster Pozzi
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * https://desarrolloactivo.com/articulos/tswrapper/
 *
 * Copyright (c) 2008-2011, Esteban Fuster Pozzi (estebanrfp -[at]- desarrolloactivo [*dot*] com)
 */

const settings = {
  allowFuture: false,
  strings: {
    prefixAgo: 'hace',
    prefixFromNow: null,
    suffixAgo: null,
    suffixFromNow: 'dentro de',
    seconds: 'menos de un minuto',
    minute: 'un minuto',
    minutes: 'unos %d minutos',
    hour: 'una hora',
    hours: '%d horas',
    day: 'un día',
    days: '%d días',
    month: 'un mes',
    months: '%d meses',
    year: 'un año',
    years: '%d años',
    numbers: []
  }
}

const $l = settings.strings

function distance (date) {
  return (new Date().getTime() - date.getTime())
}

function req (date) {
  return $l.req(distance(date))
}

function parse (ts) {
  if (!ts) return
  var s = ts.trim()
  s = s.replace(/\.\d\d\d+/, '') // remove milliseconds
  s = s.replace(/-/, '/').replace(/-/, '/')
  s = s.replace(/T/, ' ').replace(/Z/, ' UTC')
  s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2') // -04:00 -> -0400
  return new Date(s)
}

module.exports = function (ts) {
  if (ts instanceof Date) {
    return req(ts)
  } else if (typeof ts === 'string') {
    return req(parse(ts))
  } else if (typeof ts === 'number') {
    return req(new Date(ts))
  }
}

module.exports.settings = settings

$l.req = function (distanceMillis) {
  var prefix = $l.prefixAgo
  var suffix = $l.suffixAgo
  if (settings.allowFuture) {
    if (distanceMillis < 0) {
      prefix = $l.prefixFromNow
      suffix = $l.suffixFromNow
    }
  }

  var seconds = Math.abs(distanceMillis) / 1000
  var minutes = seconds / 60
  var hours = minutes / 60
  var days = hours / 24
  var years = days / 365

  function substitute (stringOrFunction, number) {
    var string = typeof stringOrFunction === 'function' ? stringOrFunction(number, distanceMillis) : stringOrFunction
    var value = ($l.numbers && $l.numbers[number]) || number
    return string.replace(/%d/i, value)
  }

  var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
    seconds < 90 && substitute($l.minute, 1) ||
    minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
    minutes < 90 && substitute($l.hour, 1) ||
    hours < 24 && substitute($l.hours, Math.round(hours)) ||
    hours < 48 && substitute($l.day, 1) ||
    days < 30 && substitute($l.days, Math.floor(days)) ||
    days < 60 && substitute($l.month, 1) ||
    days < 365 && substitute($l.months, Math.floor(days / 30)) ||
    years < 2 && substitute($l.year, 1) ||
    substitute($l.years, Math.floor(years))

  return [prefix, words, suffix].join(' ').toString().trim()
}

$l.parse = parse
