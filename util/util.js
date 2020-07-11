function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = parseInt(time % 60)
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function formatDate(date, type){
  if(!date){
    return
  }
  if(date.toString().indexOf('-')!= -1){
    date = new Date(date.toString().replace(/\-/g,'/'))
  } else {
    date = new Date(date)
  }
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 // 月
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() // 日
  var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() // 时
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() // 分
  var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() // 秒
  var milliseconds = date.getMilliseconds() < 10 ? '0' + date.getMilliseconds() : date.getMilliseconds() // 毫秒
  if (type === 1) {
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds + '.' + milliseconds
  } else if (type === 2) {
    return year + '' + month + '' + day + '' + hour + '' + minutes + '' + seconds
  } else if (type === 3) {
    return year + '-' + month + '-' + day
  } else if (type === 4) {
    return hour + ':' + minutes
  } else if (type === 5) {
    return hour + minutes
  } else if (type === 6) {
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
  } else if (type === 7) {
    return year + '年' + month + '月' + day + '日'
  } else if (type === 8) {
    return month + '月' + day + '日'
  } else if (type === 9) {
    return month + '月' + day + '日' + hour + ':' + minutes
  } else if (type === 10) {
    return  day + '日'
  } else if (type === 11) {
    return year + '年' + month + '月' + day + '日' + hour + ':' + minutes   
  } else if (type === 12) {
    return  day 
  } else if (type === 13) {
    return year + '年' + month + '月'
  } else if (type === 'yyyy/mm/dd') {
    return year + '/' + month + '/' + day
  }else if (type === 'yyyy,mm,dd') {
    return year + ',' + month + ',' + day
  } else if (type === 'yyyy-mm') {
    return year + '-' + month 
  } else {
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  }
}

// 获取 日期 例如: fun_date(7); // 7天后的日期 fun_date(-7); //7天前的日期
function fun_date(num){ 
  var dd = new Date(); 
  dd.setDate(dd.getDate() + num);//获取AddDayCount天后的日期 
  var y = dd.getFullYear(); 
  var m = dd.getMonth()+1;//获取当前月份的日期 
  var d = dd.getDate();
  m = m.toString().length === 1 ? '0'+ m : m
  d = d.toString().length === 1 ? '0'+ d : d
  return y + "-" + m + "-" + d; 
} 

/**
* 获取传入日期的所在月份的第一天
* 
*/
function currentMonthFirst(date){
  const localDate = new Date(date.toLocaleDateString());
  localDate.setDate(1);
  var month = parseInt(localDate.getMonth());
  var day = localDate.getDate();
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return new Date(localDate.getFullYear(), month, day);
}

/**
* 获取传入日期的所在月份的最后一天
* 
*/
function currentMonthLast(date){
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  var lastTime = new Date(nextMonthFirstDay - oneDay);
  var month = parseInt(lastTime.getMonth());
  var day = lastTime.getDate();
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return new Date(date.getFullYear(), month, day);
}

/**
 * 获取n天后的日期 不格式化
 * @param {} num 
 */
function addDay(date, num){
  const localDate = new Date(date.toLocaleDateString());
  localDate.setDate(localDate.getDate() + num);//获取AddDayCount天后的日期 
  return localDate;
}

/**
 * 获取n天后的日期 不格式化
 * @param {} num 
 */
function addMonth(date, num){
  const localDate = new Date(date.toLocaleDateString());

  localDate.setMonth(localDate.getMonth() + num);//获取AddDayCount天后的日期 
  return localDate;
}

/**
 * 计算两个日期间隔的天数 
 * @param {*} fromDate 
 * @param {*} toDate 
 */
function computeDiffDay(fromDate, toDate){
  var localFromDate = fromDate.toLocaleDateString();
  var localEndDate = toDate.toLocaleDateString();
  var timestampFrom = new Date(localFromDate).getTime();
  var timestampTo = new Date(localEndDate).getTime();
  var diffDay = parseInt((timestampFrom - timestampTo) / (1000 * 3600 * 24));

  return diffDay;
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  formatDate: formatDate,
  fun_date:fun_date,
  currentMonthLast: currentMonthLast,
  currentMonthFirst: currentMonthFirst,
  addDay: addDay,
  addMonth: addMonth,
  computeDiffDay: computeDiffDay
}
