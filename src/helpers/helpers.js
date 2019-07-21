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
  return new Date(parseInt(tmp[0]), parseInt(tmp[1]) - 1, parseInt(tmp[2]))
}


export const dateGetHumanDate = date => {
	const dayString = DAY_ENDINGS[date.getDate()] ? date.getDate() + DAY_ENDINGS[date.getDate()] : date.getDate() + 'th',
		monthString = MONTHS[date.getMonth()],
		weekdayString = WEEKDAYS_SHORT[date.getDay()]

	return dayString + ' ' + monthString + ', ' + weekdayString
}

export const datePrevDate = date => {
	date.setDate(date.getDate() - 1)
	return date
}

export const dateNextDate = date => {
	date.setDate(date.getDate() + 1)
	return date
}