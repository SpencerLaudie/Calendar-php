const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = new Date();

const INITIAL_YEAR = TODAY.getFullYear();
const INITIAL_MONTH = TODAY.getMonth();

var MM = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
}

let selectedMonth = new Date(INITIAL_YEAR, INITIAL_MONTH, 1);
let currentMonthDays;
let prevMonthDays;
let nextMonthDays;

let loginShown = false;
let loginBox = "<form id='login-box' autocomplete='off'><input autocomplete='off' name='hidden' type='text' style='display:none;'> <h2 id='title'>Login</h2> <div id='inputs'> <div> <label for='username'>Username</label> <input class='input-text input' type='text' name='username' required> </div> <div> <label for='password'>Password</label> <input class='input-text input' type='password' minlength='8' name='password' required> </div> </div> <button type='submit'>Login</button> </form>"

let username;

$(document).ready(function () {

  WEEKDAYS.forEach((weekday) => {
    $("#days-of-week").append("<div class='day-of-week'>" + weekday + "</div>");
  });

  createCalendar();
  initMonthSelectors();
  initAccordion();

});

function createCalendar(year = INITIAL_YEAR, month = INITIAL_MONTH) {
  var $calendarDaysElem = $("#calendar-days");

  $("#selected-month").text(MM[month] + " " + year);

  $calendarDaysElem.empty();

  currentMonthDays = createCurrentMonth(year, month, new Date(year, month+1, 0).getDate());
  previousMonthDays = createPreviousMonth(year, month);
  nextMonthDays = createNextMonth(year, month);

  const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  for (let i = 0; i < days.length; i++) {
    appendDay(days[i], $calendarDaysElem);
  }
  loadEvents(previousMonthDays.length, year, month);
}

function loadEvents(offset, year, month) {
  $.ajax({
    method: "GET",
    url: "/php/holidays.php"
  }).done(function(data) {
    $.each(data, function(key, value) {
      let event = new Date(value['date']);
      if (event.getMonth() == month && event.getFullYear() == year) {
        let nth = event.getDate() + offset;
        $('#calendar-days div:nth-child('+ nth +')').append("<div class='event'>" + value['description']+"<div>");
        $('#calendar-days div:nth-child('+ nth +')').css({"background-color": "#A5D6A7", "color": "white"})
      }
    })
  })
  if ($('#username').length != 0) {
    $.ajax({
      method: "GET",
      url: "/php/events.php?un=" + $('#username').text(),
    }).done(function(data) {
      $.each(data, function(key, value) {
        let event = new Date(value['date']);
        if (event.getMonth() == month && event.getFullYear() == year) {
          let nth = event.getDate() + offset;
          $('#calendar-days div:nth-child('+ nth +')').append("<div class='event'>"+ event.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + event.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + " - " + value['description'] + "<div>");
          $('#calendar-days div:nth-child('+ nth +')').css({"background-color": "#EF9A9A", "color": "white"})
        }
      })
    })
  }
}

function createCurrentMonth(year, month, daysInMonth) {
  return [...Array(daysInMonth)].map((day, index)=> {
    let date = new Date(year, month, index + 1);

    return {
      date: new Date(year, month, index + 1),
      dayOfMonth: index + 1,
      isCurrentMonth: true
    };
  })
}

function createPreviousMonth(year, month) {
  const numVisibleDaysPrevMonth = currentMonthDays[0].date.getDay();

  var prevDays = new Date(year, month, 1);
  prevDays.setDate(prevDays.getDate()-numVisibleDaysPrevMonth);

  return [...Array(numVisibleDaysPrevMonth)].map((day, index) => {
    return {
      date: new Date(prevDays.getFullYear(), prevDays.getMonth(), prevDays.getDate() + index),
      dayOfMonth: prevDays.getDate() + index,
      isCurrentMonth: false
    };
  });
}

function createNextMonth(year, month) {
  const lastDayOfTheMonthWeekday = new Date(year, month+1, 0).getDay();

  const nextMonth = new Date(year, month+1, 1);

  const numberVisibleNextMonth = 6 - lastDayOfTheMonthWeekday;

  return [...Array(numberVisibleNextMonth)].map((day, index) => {
    return {
      date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), index + 1),
      dayOfMonth: index + 1,
      isCurrentMonth: false
    };
  });
}

function appendDay(day, calendarDaysElem) {
  if (day.isCurrentMonth)
    calendarDaysElem.append("<div class='calendar-day'><div class='dayNum'>" + day.dayOfMonth + "</div></div>");
  else
    calendarDaysElem.append("<div class='calendar-day off-month'><div class='dayNum'>" + day.dayOfMonth + "</div></div>");
}

function initMonthSelectors() {
  $('#prev-month-selector').click(function () {
    selectedMonth.setMonth(selectedMonth.getMonth()-1);
    createCalendar(selectedMonth.getFullYear(), selectedMonth.getMonth());
  });

  $('#next-month-selector').click(function () {
    selectedMonth.setMonth(selectedMonth.getMonth()+1);
    createCalendar(selectedMonth.getFullYear(), selectedMonth.getMonth());
  });
}

function initAccordion() {
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}

function login(event) {
  let un = $('#login-un').val();
  let pw = $('#login-pw').val();

  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      $('#sidebar').html(this.responseText);
      $('.panel').css('max-height', $('#login-panel').prop("scrollHeight") + "px");
      createCalendar();
      initAccordion();
    }
  };
  xhttp.open("GET", "/php/login.php?un="+un+"&pw="+pw, true);
  xhttp.send();


}

function makeEvent() {
  let desc = $('#event-desc').val();
  let date = $('#event-date').val().split('-');
  let time = $('#event-time').val().split(':');
  let event_date = new Date(date[0], date[1], date[2], time[0], time[1]);

  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      createCalendar();
    }
  };
  xhttp.open("GET", "/php/create_event.php?un="+$('#username').text()+"&desc="+desc+"&d="+date+" "+time, true);
  xhttp.send();
}
