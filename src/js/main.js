		//json

		var json = '{ \
  "events": [ \
    {"title":"Напиться!","date":"2018-11-30T12:00:00.000Z", "members":"Витя Костин, Петр Михайлов."}, \
    {"title":"ДР!","date":"2018-11-22T12:00:00.000Z", "members":"Витя Молодцов"}, \
    {"title":"Юбилей-100лет!!","date":"2018-12-18T12:00:00.000Z", "members":"Алевтина Павловна"} \
  ]\
}';
		//распаковка json
		var events = JSON.parse(json, function(key, value) {
			if (key == 'date') return new Date(value);
			return value;
		});
		var eventsDates = [];
		for (let i = 0; i < events.events.length; i++) {
			eventsDates.push(events.events[i].date);
		}
		console.log(eventsDates);
		//переменные для текущей даты
		var myDate = new Date();
		var myWeekDay = myDate.getDay();
		var myDay = myDate.getDate();
		var myMonth = myDate.getMonth();
		var myYear = myDate.getFullYear();
		//классы
		var anotherMonthCells = 'another__cells';
		var actualMonthCells = 'actual__cells';

		//переменные для dom=элемеентов	
		var plate = document.querySelector('.calendar_plate');
		var actualMonthAndYear = document.querySelector('.current');
		var previousMonth = document.querySelector('.js-previousMonth');
		var nextMonth = document.querySelector('.js-nextMonth');
		var actualMonth = document.querySelector('.js-actualMonth');
		var cells = plate.childNodes;

		//неделя начинается с понедельника
		function mondayFirst(weekDay) {
			return (weekDay == 0) ? weekDay = 6 : weekDay -= 1;
		}

		// последний день месяца
		function getLastDay(year, month) {
			let date = new Date(year, month + 1, 0);
			return date;
		}



		//создание одной ячейки
		function createACell(className, text, year, month) {
			let cell = document.createElement('div');
			cell.classList.add(className);
			cell.classList.add('cell');
			let date_day = text;
			let data_year = year;
			let date_month = month + 1;
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
		}


		//ячейки для прошлого месяца
		function genPreviosMonth(year, month) {
			let firstDay = new Date(year, month).getDay();
			firstDay = mondayFirst(firstDay);
			let lastDay = getLastDay(year, month - 1).getDate();
			let docFrag = document.createDocumentFragment();
			for (let i = 0, j = lastDay - firstDay + 1; i < firstDay; i++) {
				if (month == 0){
					month = 12;
				}
				
				docFrag.appendChild(createACell(anotherMonthCells, j, year, month - 1));
				j++;
			}
			plate.appendChild(docFrag);
		}


		//ячейки для текущего месяца
		function genActualMonth(year, month) {
			let lastDay = getLastDay(year, month).getDate();
			let docFrag = document.createDocumentFragment();
			for (let i = 1; i <= lastDay; i++) {
				docFrag.appendChild(createACell(actualMonthCells, i, year, month));
			}
			plate.appendChild(docFrag);

		}

		//ячейки для следующего месяца
		function genNextMonth(year, month) {
			let lastWeekDay = getLastDay(year, month).getDay();
			lastWeekDay = mondayFirst(lastWeekDay);
			if (lastWeekDay != 6) {
				let docFrag = document.createDocumentFragment();
				for (let i = lastWeekDay, j = 1; i < 6; i++) {

					docFrag.appendChild(createACell(anotherMonthCells, j, year, month + 1));
					j++;
				}
				plate.appendChild(docFrag);
			}
		}
		//отображение названия месяца и года

		function setMonthAndYear(month, year) {
			let months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
			let currentMonth = months[month];
			actualMonthAndYear.innerHTML = currentMonth + ", " + year;
		}


		// создание страницы календаря
		function generateCalendar(year, month) {
			genPreviosMonth(year, month);
			genActualMonth(year, month);
			genNextMonth(year, month);
			setMonthAndYear(month, year);
			currentDay();
		}
		generateCalendar(myYear, myMonth);





		// переход на предыдцщий месяц
		previousMonth.addEventListener('click', function() {
			myMonth -= 1;
			if (myMonth < 0) {
				myMonth = 11;
				myYear -= 1;
			}
			plate.innerHTML = ('');
			generateCalendar(myYear, myMonth)

		});

		// переход на следующий месяц
		nextMonth.addEventListener('click', function() {
			myMonth += 1;
			if (myMonth > 11) {
				myMonth = 0;
				myYear += 1;
			}
			plate.innerHTML = ('');
			generateCalendar(myYear, myMonth)

		})
		// отображение текущего месяца
		actualMonth.addEventListener('click', function() {
			myMonth = myDate.getMonth();
			myYear = myDate.getFullYear();
			plate.innerHTML = ('');
			generateCalendar(myYear, myMonth)



		})

		// подсветка текущего/заполненного дня
		function currentDay() {
		let currentMonth= myDate.getMonth();
			let currentYear = myDate.getFullYear();
			for (let i = 0; i < cells.length; i++) {
				if (cells[i].dataset.day == myDay && cells[i].dataset.month == currentMonth+1 && cells[i].dataset.year == currentYear) {
					cells[i].classList.add('today');
				}
				for (let j = 0; j < eventsDates.length; j++) {
					if (cells[i].dataset.day == eventsDates[j].getDate() && cells[i].dataset.month == eventsDates[j].getMonth() + 1 && cells[i].dataset.year == eventsDates[j].getFullYear()) {
						let title = document.createElement('p');
						title.classList.add('event__title');
						title.innerHTML = events.events[j].title;
						cells[i].appendChild(title);
						let members = document.createElement('p');
						members.classList.add('event__members');
						members.innerHTML = events.events[j].members;
						cells[i].appendChild(members);
						cells[i].classList.add('full');
					}
				}
			}
		}