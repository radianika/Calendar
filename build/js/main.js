"use strict";

//json
var json = '{ \
  "events": [ \
    {"title":"Напиться!","date":"2018-11-30T12:00:00.000Z", "members":"Витя Костин, Петр Михайлов."}, \
    {"title":"ДР!","date":"2018-11-22T12:00:00.000Z", "members":"Витя Молодцов"}, \
    {"title":"Юбилей-100лет!!","date":"2018-12-18T12:00:00.000Z", "members":"Алевтина Павловна"} \
  ]\
}'; //распаковка json

var events = JSON.parse(json, function (key, value) {
  if (key == 'date') return new Date(value);
  return value;
});
var eventsDates = [];

for (var i = 0; i < events.events.length; i++) {
  eventsDates.push(events.events[i].date);
} //переменные для текущей даты


var myDate = new Date();
var myWeekDay = myDate.getDay();
var myDay = myDate.getDate();
var myMonth = myDate.getMonth();
var myYear = myDate.getFullYear(); //классы

var anotherMonthCells = 'another__cells';
var actualMonthCells = 'actual__cells';
var open = 'open';
var close = 'close'; //переменные для dom=элемеентов	

var plate = document.querySelector('.calendar_plate');
var actualMonthAndYear = document.querySelector('.current');
var previousMonth = document.querySelector('.js-previousMonth');
var nextMonth = document.querySelector('.js-nextMonth');
var actualMonth = document.querySelector('.js-actualMonth');
var cells = plate.childNodes;
var closeBtn = document.querySelector('.js-closeBtn');
var insertBtn = document.querySelector('.js-insert');
var modal = document.querySelector('.js-modal'); //неделя начинается с понедельника

function mondayFirst(weekDay) {
  return weekDay == 0 ? weekDay = 6 : weekDay -= 1;
} // последний день месяца


function getLastDay(year, month) {
  var date = new Date(year, month + 1, 0);
  return date;
} //создание одной ячейки


function createACell(className, text, year, month) {
  var cell = document.createElement('div');
  cell.classList.add(className);
  cell.classList.add('cell');
  var date_day = text;
  var data_year = year;
  var date_month = month + 1;

  if (date_month > 12) {
    date_month = 1;
    data_year += 1;
  }

  cell.setAttribute('data-day', date_day);
  cell.setAttribute('data-month', date_month);
  cell.setAttribute('data-year', data_year);
  console.log('бля');
  cell.appendChild(document.createTextNode(text));
  return cell;
} //ячейки для прошлого месяца


function genPreviosMonth(year, month) {
  var firstDay = new Date(year, month).getDay();
  firstDay = mondayFirst(firstDay);
  var lastDay = getLastDay(year, month - 1).getDate();
  var docFrag = document.createDocumentFragment();

  for (var _i = 0, j = lastDay - firstDay + 1; _i < firstDay; _i++) {
    if (month == 0) {
      month = 12;
    }

    docFrag.appendChild(createACell(anotherMonthCells, j, year, month - 1));
    j++;
  }

  plate.appendChild(docFrag);
} //ячейки для текущего месяца


function genActualMonth(year, month) {
  var lastDay = getLastDay(year, month).getDate();
  var docFrag = document.createDocumentFragment();

  for (var _i2 = 1; _i2 <= lastDay; _i2++) {
    docFrag.appendChild(createACell(actualMonthCells, _i2, year, month));
  }

  plate.appendChild(docFrag);
} //ячейки для следующего месяца


function genNextMonth(year, month) {
  var lastWeekDay = getLastDay(year, month).getDay();
  lastWeekDay = mondayFirst(lastWeekDay);

  if (lastWeekDay != 6) {
    var docFrag = document.createDocumentFragment();

    for (var _i3 = lastWeekDay, j = 1; _i3 < 6; _i3++) {
      docFrag.appendChild(createACell(anotherMonthCells, j, year, month + 1));
      j++;
    }

    plate.appendChild(docFrag);
  }
} //отображение названия месяца и года


function setMonthAndYear(month, year) {
  var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  var currentMonth = months[month];
  actualMonthAndYear.innerHTML = currentMonth + ", " + year;
} // создание страницы календаря


function generateCalendar(year, month) {
  genPreviosMonth(year, month);
  genActualMonth(year, month);
  genNextMonth(year, month);
  setMonthAndYear(month, year);
  currentDay();
}

generateCalendar(myYear, myMonth); // переход на предыдцщий месяц

previousMonth.addEventListener('click', function () {
  myMonth -= 1;

  if (myMonth < 0) {
    myMonth = 11;
    myYear -= 1;
  }

  plate.innerHTML = '';
  generateCalendar(myYear, myMonth);
}); // переход на следующий месяц

nextMonth.addEventListener('click', function () {
  myMonth += 1;

  if (myMonth > 11) {
    myMonth = 0;
    myYear += 1;
  }

  plate.innerHTML = '';
  generateCalendar(myYear, myMonth);
}); // отображение текущего месяца

actualMonth.addEventListener('click', function () {
  myMonth = myDate.getMonth();
  myYear = myDate.getFullYear();
  plate.innerHTML = '';
  generateCalendar(myYear, myMonth);
}); // подсветка текущего/заполненного дня

function currentDay() {
  var currentMonth = myDate.getMonth();
  var currentYear = myDate.getFullYear();

  for (var _i4 = 0; _i4 < cells.length; _i4++) {
    if (cells[_i4].dataset.day == myDay && cells[_i4].dataset.month == currentMonth + 1 && cells[_i4].dataset.year == currentYear) {
      cells[_i4].classList.add('today');
    }

    for (var j = 0; j < eventsDates.length; j++) {
      if (cells[_i4].dataset.day == eventsDates[j].getDate() && cells[_i4].dataset.month == eventsDates[j].getMonth() + 1 && cells[_i4].dataset.year == eventsDates[j].getFullYear()) {
        var title = document.createElement('p');
        title.classList.add('event__title');
        title.innerHTML = events.events[j].title;

        cells[_i4].appendChild(title);

        var members = document.createElement('p');
        members.classList.add('event__members');
        members.innerHTML = events.events[j].members;

        cells[_i4].appendChild(members);

        cells[_i4].classList.add('full');
      }
    }
  }
} //открытие модального окна


function openModal() {
  modal.classList.remove(close);
  modal.classList.add(open);
}

function closeModal() {
  modal.classList.add(close);
  modal.classList.remove(open);
}

insertBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);