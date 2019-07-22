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


export const dateToDatestring = date => {
	const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
		month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
	year = date.getFullYear()
	return year + '-' + month + '-' + day
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

export const datePrevDate = date => {
	let newDate = new Date(date)
	newDate.setDate(newDate.getDate() - 1)
	return newDate
}

export const dateNextDate = date => {
	let newDate = new Date(date)
	newDate.setDate(newDate.getDate() + 1)
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