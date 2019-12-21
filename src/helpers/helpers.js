const DAY_ENDINGS = ['', 'st', 'nd', 'rd']


export const COLORS = [
  '#B33C24', '#B37D47', '#B3A147', '#A1B347', '#7DB347',
  '#68B359', '#47B359', '#47B37D', '#47B3A1', '#47A1B3',
  'var(--c-blue)', '#4759B3', '#5947B3', '#7D47B3', '#A147B3',
  '#B359A4', '#B3477D', '#B34759', '#4D4D4D'
]


export const RANGE_OPTIONS = [{
	title: 'Current Week',
	value: 'current-week'
}, {
	title: 'Last Week',
	value: 'last-week'
}, {
	title: 'Current Month',
	value: 'current-month'
}, {
	title: 'Last Month',
	value: 'last-month'
}, {
	title: 'Custom',
	value: 'custom',
	disabled: true
}]


export const RANGE_MAP = {
	'current-week': 'Current Week',
	'last-week': 'Last Week',
	'current-month': 'Current Month',
	'last-month': 'Last Month',
	'custom': 'Custom'
}


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


export const dateDatabaseToDate = date => {
	const dateString = date.toString()
	return new Date(parseInt(dateString.substring(0, 4)), parseInt(dateString.substring(4, 6)) - 1, parseInt(dateString.substring(6, 8)) )
}


export const dateStringToDate = string => {
  const tmp = string.split('-')
  return new Date(parseInt(tmp[0]), parseInt(tmp[1]) - 1, parseInt(tmp[2]) )
}


export const dateGetHumanDate = (MONTHS, WEEKDAYS_SHORT, date, abbreviate = false) => {
	const dayString = DAY_ENDINGS[date.getDate()] ? date.getDate() + DAY_ENDINGS[date.getDate()] : date.getDate() + 'th',
		monthString = MONTHS[date.getMonth()].substr(0, (abbreviate ? 3 : 100)),
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


export const datePrevMonth = (date, howManyMonth = 1) => {
	let newDate = new Date(date)
	newDate.setMonth(newDate.getMonth() - howManyMonth)
	return newDate
}


export const dateNextMonth = (date, howManyMonth = 1) => {
	let newDate = new Date(date)
	newDate.setMonth(newDate.getMonth() + howManyMonth)
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
	return Math.round((date2.getTime() - date1.getTime())/(1000 * 60 * 60 * 24))
}


export function dateIsWeek(firstDate, lastDate) {
	return dateDaysBetweenDates(firstDate, lastDate) === 6 
		&& dateGetWeek(datePrevDate(firstDate)) != dateGetWeek(firstDate)
}


export function dateIsMonth(firstDate, lastDate) {
	return datePrevDate(firstDate).getMonth() != firstDate.getMonth()
		&& dateNextDate(lastDate).getMonth() != lastDate.getMonth()
		&& firstDate.getMonth() === lastDate.getMonth()
}


export function dateGetWeekStart(date = new Date()) {
	let dateTmp = new Date(date)
	while(dateGetWeek(datePrevDate(dateTmp)) === dateGetWeek(dateTmp)) {
		dateTmp = datePrevDate(dateTmp)
	}
	return dateTmp
}


export function dateGetMonthStart(date = new Date()) {
	let dateTmp = new Date(date)
	while((datePrevDate(dateTmp)).getMonth() === dateTmp.getMonth()) {
		dateTmp = datePrevDate(dateTmp)
	}
	return dateTmp
}


export function dateRangeGetStandard(standardRange) {

	let firstDate,
		lastDate

	if(standardRange === 'current-week') {
		firstDate = dateGetWeekStart()
		lastDate = dateNextDate(firstDate, 6)
	} else if(standardRange === 'last-week') {
		firstDate = dateGetWeekStart(datePrevDate(new Date(), 7))
		lastDate = dateNextDate(firstDate, 6)
	} else if(standardRange === 'current-month') {
		firstDate = dateGetMonthStart()
		lastDate = datePrevDate(dateNextMonth(firstDate))
	} else if(standardRange === 'last-month') {
		firstDate = dateGetMonthStart(datePrevMonth(new Date()))
		lastDate = datePrevDate(dateNextMonth(firstDate))
	}

	return {
		firstDate,
		lastDate
	}
}


export function dateRangeGetStandardForDates(firstDate, lastDate) {
	let firstDateTest = dateGetWeekStart(),
		lastDateTest = dateNextDate(firstDateTest, 6)

	if(isSameDate(firstDate, firstDateTest) && isSameDate(lastDate, lastDateTest)) {
		return 'current-week'
	}

	firstDateTest = dateGetWeekStart(datePrevDate(new Date(), 7))
	lastDateTest = dateNextDate(firstDate, 6)

	if(isSameDate(firstDate, firstDateTest) && isSameDate(lastDate, lastDateTest)) {
		return 'last-week'
	}

	firstDateTest = dateGetMonthStart()
	lastDateTest = datePrevDate(dateNextMonth(firstDate))

	if(isSameDate(firstDate, firstDateTest) && isSameDate(lastDate, lastDateTest)) {
		return 'current-month'
	}

	firstDateTest = dateGetMonthStart(datePrevMonth(new Date()))
	lastDateTest = datePrevDate(dateNextMonth(firstDate))

	if(isSameDate(firstDate, firstDateTest) && isSameDate(lastDate, lastDateTest)) {
		return 'last-month'
	}

	return 'custom'
}


function isSameDate(date1, date2) {
	return date1.getDate() === date2.getDate()
		&& date1.getMonth() === date2.getMonth()
		&& date1.getYear() === date2.getYear()
}


export const trailingZero = number => {
	return number < 10 ? '0' + number : number
}


export const getWindowWidth = () => {
	const w = window,
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


export function isEmailValid(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}