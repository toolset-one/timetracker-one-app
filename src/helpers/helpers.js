const DAY_ENDINGS = ['', 'st', 'nd', 'rd']

const MONTHS = [
	'January',
	'February',
	'March', 'April',
	'May',
	'June',
	'Juli',
	'August',
	'September',
	'October',
	'November',
	'December'
]

const WEEKDAYS_SHORT = [
	'Sun',
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat'
]

export const COLORS = [
  '#B33C24', '#B37D47', '#B3A147', '#A1B347', '#7DB347',
  '#68B359', '#47B359', '#47B37D', '#47B3A1', '#47A1B3',
  '#477DB3', '#4759B3', '#5947B3', '#7D47B3', '#A147B3',
  '#B359A4', '#B3477D', '#B34759', '#4D4D4D'
]


export const dateToDatestring = date => {
	const day = trailingZero(date.getDate()),
		month = trailingZero((date.getMonth() + 1)),
		year = date.getFullYear()
	return year + '-' + month + '-' + day
}

export const dateToDatabaseDate = date => {
	const day = trailingZero(date.getDate()),
		month = trailingZero((date.getMonth() + 1)),
		year = date.getFullYear()
	return parseInt(year + '' + month + '' + day)
}

export const dateStringToDate = string => {
  const tmp = string.split('-')
  return new Date(parseInt(tmp[0]), parseInt(tmp[1]) - 1, parseInt(tmp[2]) )
}


export const dateGetHumanDate = date => {
	const dayString = DAY_ENDINGS[date.getDate()] ? date.getDate() + DAY_ENDINGS[date.getDate()] : date.getDate() + 'th',
		monthString = MONTHS[date.getMonth()],
		weekdayString = WEEKDAYS_SHORT[date.getDay()]

	return dayString + ' ' + monthString + ', ' + weekdayString
}

export const dateGetDay = date => {
	return DAY_ENDINGS[date.getDate()] ? date.getDate() + DAY_ENDINGS[date.getDate()] : date.getDate() + 'th'
}

export const dateGetWeekday = date => {
	return WEEKDAYS_SHORT[date.getDay()]
}

export const dateGetMonth = date => {
	return MONTHS[date.getMonth()]
}

export const dateGetWeek = date => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1),
    	pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export const datePrevDate = (date, howManyDays = 1) => {
	let newDate = new Date(date)
	newDate.setDate(newDate.getDate() - howManyDays)
	return newDate
}

export const dateNextDate = (date, howManyDays = 1) => {
	let newDate = new Date(date)
	newDate.setDate(newDate.getDate() + howManyDays)
	return newDate
}


export const dateTimeToDuration = time => {
	const arrDuration = time.split(':'),
		duration = arrDuration[0] * (60 * 60) + arrDuration[1] * 60
		return duration
} 


export const dateGetHours = duration => Math.floor(duration / (60 * 60))

export const dateGetMinutes = duration => {
  const minutes = Math.floor(duration / 60)
  const hours = Math.floor(minutes / 60)

  const leftMinutes = minutes - hours * 60
  const stringifiedMinutes = leftMinutes < 10 ? '0' + leftMinutes : leftMinutes

  return stringifiedMinutes
}

export const dateGetSeconds = duration => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration - minutes * 60
  const stringifiedSeconds = seconds < 10 ? '0' + seconds : seconds
  return stringifiedSeconds
}

export const dateDaysBetweenDates = (date1, date2) => {
	return Math.ceil((date2.getTime() - date1.getTime())/(1000 * 60 * 60 * 24))
}



export const trailingZero = number => {
	return number < 10 ? '0' + number : number
}


export const getWindowWidth = () => {
	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight
	    return x
}

export const getUrlParameter = (attr, url) => {
    attr = attr.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]")
    const regexS = "[\\?&]" + attr + "=([^&#]*)",
    	regex = new RegExp(regexS),
    	results = regex.exec( url )
    return results == null ? null : results[1]

}