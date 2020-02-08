/* 
1. 使用者可從頁面上方的輸入欄位輸入年份，點選 Show 後頁面需顯示該年的年曆
若使用者無輸入任何年份，則輸入欄位值預設為今年
2. 輸入年份範圍為 1 ~ 9999
3. 若使用者輸入無效的年份，請於畫面上用紅字提示使用者，並引導使用者輸入正確的值
   例：* 請輸入 1 ~ 9999  訊息內容與提示方式若有其他想法可自行設計
4. 年曆需標示今日日期
   例：若今日為 2019 / 12 / 24，則需標示 2019 / 12 / 24 ( 請看示意圖 )
5. 須保證在不同的螢幕尺寸下，頁面皆能完整呈現年曆
6. 不限制實作的 framework / library
7. source code 請放在github或是任何git service 
*/
var monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
var dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// 給年份和月份，回傳該月份的所有日期
function getDaysInMonth(year, month) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// 給年份，回傳該年份每一個月的第一天的日期
function getMonthsInYear(year) {
  var date = new Date(year, 0, 1);
  var months = [];
  var monthCount = 0;
  while (monthCount < 12) {
    months.push(new Date(date));
    date.setMonth(date.getMonth() + 1);
    monthCount++;
  }
  return months;
}

function getMonthsInRange(startDate, endDate) {
  var start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  var end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  var months = [];
  var monthCount = 0;
  while (start <= end) {
    months.push(new Date(start));
    start.setMonth(start.getMonth() + 1);
    monthCount++;
  }
  return months;
}

// 製作一個完整的年曆
function buildYearCalendar(el, year) {
  var months = getMonthsInYear(year);

  var opts = {
    showMonth: true,
    showDaysOfWeek: true,
    showYear: false,
    clickHandler: function(e) {
      var day = e.target.getAttribute('data-date');
    }
  };
  months.forEach(function(a, b) {
    var monthNode = buildMonth(year, b, opts);
    el.appendChild(monthNode);
  });
}

function buildMonth(year, monthNum, opts) {
  // dtm === Date Time (日期時間)
  // year === 2020, monthNum === 1 (2020, Feb)
  var dtm = new Date(year, monthNum, 1);
  // getMonth()獲取當前月份
  var dtmMonth = dtm.getMonth();
  // setMonth()用於設置月份，分別設置前一個月和後一個月
  var prevMonth = new Date(dtm.setMonth(dtmMonth - 1));
  var nextMonth = new Date(dtm.setMonth(dtmMonth + 1));

  var daysInMonth = getDaysInMonth(year, monthNum);
  var daysPrevMonth = getDaysInMonth(
    prevMonth.getFullYear(),
    prevMonth.getMonth()
  );
  var daysNextMonth = getDaysInMonth(
    nextMonth.getFullYear(),
    nextMonth.getMonth()
  );

  var monthNode = document.createElement('div');
  var titleNode = document.createElement('h4');
  var skipLength = daysInMonth[0].getDay();
  var preLength = daysInMonth.length + skipLength;
  var postLength = function() {
    if (preLength % 7 === 0) {
      return 0;
    } else {
      if (preLength < 35) {
        return 35 - preLength;
      } else {
        return 42 - preLength;
      }
    }
  };

  monthNode.classList.add('month');

  // 在月份中加入標題
  if (opts.showMonth) {
    titleNode.innerText =
      monthNames[monthNum] + (opts.showYear ? ' ' + year : '');
    monthNode.appendChild(titleNode);
  }

  // 在日期的第一列加入星期
  if (opts.showDaysOfWeek) {
    dayNames.forEach(function(a, b) {
      var dayNode = document.createElement('div');
      dayNode.classList.add('dayOfWeek');
      dayNode.innerText = dayNames[b];
      monthNode.appendChild(dayNode);
    });
  }
  // 在每個月的第一天之前填滿整個星期
  for (let i = 0; i < skipLength; i++) {
    var dayNode = document.createElement('div');
    dayNode.classList.add('dummy-day');
    dayNode.innerText = daysPrevMonth.length - (skipLength - (i + 1));
    monthNode.appendChild(dayNode);
  }

  // Place a day for each day of the month
  daysInMonth.forEach(function(c, d) {
    // Date.setHours(hour, min, sec, millisec)
    var today = new Date(new Date().setHours(0, 0, 0, 0));
    var dayNode = document.createElement('div');
    dayNode.classList.add('day');
    dayNode.setAttribute('data-date', c);
    dayNode.innerText = d + 1;
    var dow = new Date(c).getDay();
    var dateParsed = Date.parse(c);
    var todayParsed = Date.parse(today);

    if (dateParsed === todayParsed) {
      dayNode.classList.add('today');
    } else if (dateParsed > todayParsed) {
      dayNode.classList.add('future');
    } else {
      dayNode.classList.add('past');
    }

    // 如果是禮拜六或是禮拜天則加入CSS樣式(Weekend)
    if (dow === 0 || dow === 6) dayNode.classList.add('weekend');
    monthNode.appendChild(dayNode);
  });
  // 填補月底後面的日期
  for (var j = 0; j < postLength(); j++) {
    var dayNode = document.createElement('div');
    dayNode.classList.add('dummy-day');
    dayNode.innerText = j + 1;
    monthNode.appendChild(dayNode);
  }
  return monthNode;
}

const submitBtn = document.querySelector('[data-action="submit"]');
submitBtn.addEventListener('click', initYearData);

function initYearData() {
  var calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  // 選擇form表單裡的id=selectYear
  let selectYear = document.getElementById('selectYear');
  let getYear = Number(selectYear.value);
  // 獲取今年是哪一年
  var currentYear = new Date().getFullYear();
  if (getYear === 0) {
    buildYearCalendar(calendar, currentYear);
  } else {
    buildYearCalendar(calendar, getYear);
  }
}

var currentYear = new Date().getFullYear();

buildYearCalendar(calendar, currentYear);
