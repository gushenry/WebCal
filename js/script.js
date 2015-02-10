var currentYear; // current year
var currentMonth; // current month
var firstDay;
var date = new Date();
var firstDate = new Date();
var dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var eventCount = 0;
var altKeyDown = false;
var data;

function initPage() {

	var weekTable = document.createElement("table");
	var row = document.createElement("tr");
	for (var i = 0; i < 7; i++) {
		var cell = document.createElement("td");
		cell.className = "dayCell";
		cell.id = dayArray[i];
		var text = document.createElement("P");
		text.className = "dayCellData";
		text.innerHTML = dayArray[i];
		cell.appendChild(text);
		row.appendChild(cell);
	}
	weekTable.appendChild(row);
	weekTable.className = "weekTable";
	document.getElementById("weekTableDiv").appendChild(weekTable);

	var cellCounter = 0;
	var table = document.createElement("table");
	table.id = "calendarTable";
	for (i = 0; i < 6; i++) {
		var row = document.createElement("tr");
		for (j = 0; j < 7; j++) {
			var cell = document.createElement("td");
			cell.className = "cell";
			cell.id = "cell" + cellCounter;
			cell.setAttribute("ondragenter", "return dragEnter(event)");
			cell.setAttribute("ondrop", "return dragDrop(event)");
			cell.setAttribute("ondragover", "return dragOver(event)");
			// cell.ondblclick = function() {createNewEvent(this)};
			var text = document.createElement("P");
			text.className = "dateNumber";
			cell.appendChild(text);
			row.appendChild(cell);
			cellCounter++;
		}
		table.appendChild(row);
	}
	document.getElementById("calendarTableDiv").appendChild(table);

	firstDate.setDate(1);
	currentMonth = date.getMonth(); // type: int 0-11
	currentYear = date.getFullYear(); // type: int xxxx
	firstDay = getFirstDay(date);
	document.getElementById("header1").innerHTML = monthArray[currentMonth] + " " + currentYear;

	fillCurrentMonth(monthArray[currentMonth], currentYear);

	fillPrevMonth(monthArray[currentMonth], currentYear);

	fillNextMonth(monthArray[currentMonth], currentYear);

	if ("calData" in window.localStorage) {
		data = JSON.parse(window.localStorage.getItem("calData"));
		loadEvents(currentMonth, currentYear);
	}
	else {
		data = {};
	}

	document.getElementById("createEventButton").onclick = function() {
		createNewEvent(document.getElementById("cell" + firstDay));
	}

	window.addEventListener('load', function(){

  	setTimeout(scrollTo, 0, 0, 1);

	}, false);

	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	if (width > 700) {
		$(function() {
	    $( ".datepicker" ).datepicker();
	  });
	}
	// else {
	// 	document.getElementById("eventStartDate").type = "date";
	//   document.getElementById("eventEndDate").type = "date";
	// }
}

function fillCurrentMonth(monthString, year) {
	// Fills in dates for current month
	var monthLength = getMonthLength(monthString, year) + firstDay;
	var dateCounter = 1;
	var todayDay = date.getDate();
	var todayMonth = date.getMonth();
	var todayYear = date.getFullYear();
	for (i = firstDay; i < monthLength ; i++) {
		var cell = document.getElementById("cell" + i);
		cell.ondblclick = function() {createNewEvent(this)};
		cell.firstChild.innerHTML = dateCounter;
		// Correctly adding the cell name: "month-day-year"
		var monthString;
		if (currentMonth < 9) {
			monthString = "0" + (currentMonth + 1).toString();
		} else {
			monthString = (currentMonth + 1).toString()
		}
		var dateCounterString;
		if (dateCounter < 10) {
			dateCounterString = "0" + dateCounter.toString();
		} else {
			dateCounterString = dateCounter.toString();
		}
		cell.name = monthString + "-" + dateCounterString + "-" + year.toString(); // Have to add 1 to month
		cell.firstChild.style.color = "black";
		// If this cell is today's date
		if (dateCounter == todayDay && monthArray[todayMonth] == monthArray[currentMonth] && currentYear == todayYear) {
			cell.style.background = "rgb(224,255,255)";
		} else {
			cell.style.background = "white";
		}
		dateCounter++;
	}
}

// NOTE: DO WE WANT CLIENT TO BE ABLE TO MAKE EVENTS ON DAYS FOR PREV OR NEXT MONTH?

function fillPrevMonth(monthString, year) {
	// Fills in dates for end of previous month
	var monthLength = getMonthLength(monthString, year) + firstDay;
	var lastMonth = (currentMonth - 1 + 12) % 12;
	var lastMonthLength = getMonthLength(monthArray[lastMonth], year);
	for (i = firstDay - 1; i >= 0; i--) {
		var cell = document.getElementById("cell" + i);
		cell.ondblclick = function() {createNewEvent(this); prevMonth();};
		cell.firstChild.innerHTML = lastMonthLength;
		// Correctly adding the cell name: "month-day-year"
		var monthString;
		if (lastMonth < 10) {
			monthString = "0" + (lastMonth).toString();
		} else {
			monthString = (lastMonth).toString();
		}
		cell.name = monthString + "-" + lastMonthLength.toString() + "-" + year.toString();
		lastMonthLength--;
		cell.firstChild.style.color = "lightgrey";
	}
}

function fillNextMonth(monthString, year) {
	// Fills in dates for beginning of next month
	var monthLength = getMonthLength(monthString, year) + firstDay;
	var nextNextMonth = (currentMonth + 1) % 12;
	var counter = 1;
	for (i = monthLength; i <= 41; i++) {
		var cell = document.getElementById("cell" + i);
		cell.firstChild.innerHTML = counter;
		// Correctly adding the cell name: "month-day-year"
		var monthString;
		if (nextNextMonth < 9) {
			monthString = "0" + (nextNextMonth+1).toString();
		} else {
			monthString = (nextNextMonth+1).toString();
		}
		var dayString;
		if (counter < 10) {
			dayString = "0" + counter.toString();
		} else {
			dayString = counter.toString();
		}
		cell.name = monthString + "-" + dayString + "-" + year.toString();
		counter++;
		cell.firstChild.style.color = "lightgrey";
		cell.ondblclick = function() {createNewEvent(this); nextMonth();};
	}
}

function getFirstDay(date) {
	var number = (date.getDate() % 7) - 7;
	var day = date.getDay() % 7;
	while (number < 1) {
		number++;
		day++;
	}
	return day % 7;
}

function getMonthLength(month, year) {
	if (["January", "March", "May", "July", "August", "October", "December"].indexOf(month) > -1) return 31;
	if (["April", "June", "September", "November"].indexOf(month) > -1) return 30;
	if (month == "February" && year % 4 == 0) return 29;
	if (month == "February" && year % 4 != 0) return 28;
}

function loadEvents(currentMonth, currentYear) {
	currentMonth++;
	if (data[currentYear] != undefined) {
		for (eachDay in data[currentYear][currentMonth]) {
			for (i = 0; i < data[currentYear][currentMonth][parseInt(eachDay)].length; i++) {
				data[currentYear][currentMonth][parseInt(eachDay)][i].divId;
				createLoadedEvent(data[currentYear][currentMonth][parseInt(eachDay)][i]);
				addEventToList(data[currentYear][currentMonth][parseInt(eachDay)][i]);
			}
		}
	}
}

function populateList(currentMonth, currentYear) {
	currentMonth++;
	if (data[currentYear] != undefined) {
		for (eachDay in data[currentYear][currentMonth]) {
			for (i = 0; i < data[currentYear][currentMonth][parseInt(eachDay)].length; i++) {
				addEventToList(data[currentYear][currentMonth][parseInt(eachDay)][i]);
			}
		}
	}
}

function refreshList() {
	removeEventsFromList();
  populateList(currentMonth, currentYear);
}

function addEventToList(eventObj) {
	var listItem = document.createElement("div");
	listItem.className = "listItem";
	var eventName = eventObj.eventName;
	var eventStartMonth = eventObj.eventStart.month - 1;
	var eventStartDay = eventObj.eventStart.day;
	var divTitle = document.createElement("p");
	divTitle.innerHTML = eventName;
	divTitle.className = "listDivTitle";
	var divDate = document.createElement("p");
	divDate.innerHTML = monthArray[eventStartMonth] + " " + eventStartDay.toString();
	divDate.className = "listDivDate";
	listItem.appendChild(divTitle);
	listItem.appendChild(divDate);
	var hr = document.createElement("hr");
	listItem.appendChild(hr);
	listItem.onclick = function() {
		deleteEventObject(eventObj);
		openEvent(eventObj, eventObj.divId);
	}
	document.getElementById("listContainer").appendChild(listItem);
}

function createLoadedEvent(eventObj) { // Goes through and creates physical divs on cal from whats in dataStorage
	var newEvent = document.createElement("div");
	newEvent.id = "event" + eventCount;
	eventObj.divId = newEvent.id;
	newEvent.className = "event";
	newEvent.draggable = "true";
	newEvent.ondragstart = function(e) { // IS THIS A PROBLEM?? CREATING COPIES OF THE EVENT
		var eventObjectCopy = eventObj;
		deleteEventObject(eventObj);
		return dragStart(e, eventObjectCopy);
	}
	newEvent.ondblclick = function(e) {
    // var eventObjectCopy = eventObj; // HERE TOO
    deleteEventObject(eventObj);
    e.preventDefault();
    if ('bubbles' in e) {
      e.stopPropagation();
      openEvent(eventObj, eventObj.divId); // change made here
    }
    else {
      e.cancelBubble = true;
      openEvent(eventObj, eventObj.divId);
    }
  }
	var eventName = document.createElement("P");
	eventName.className = "eventName";
	eventName.innerHTML = eventObj.eventName;
	newEvent.appendChild(eventName);
	document.getElementById("cell" + (parseInt(eventObj.eventStart.day) + firstDay - 1)).appendChild(newEvent);
	eventCount++;
}

function removeEvents() {
	var eventList = document.getElementsByClassName('event');
	while(eventList[0]) {
    eventList[0].parentNode.removeChild(eventList[0]);
  }
}

function removeEventsFromList() {
	var eventDivList = document.getElementsByClassName('listItem');
	while(eventDivList[0]) {
    eventDivList[0].parentNode.removeChild(eventDivList[0]);
  }
}

function saveData() {
	window.localStorage.setItem("calData", JSON.stringify(data));
}

function prevMonth() {
	currentMonth--;
	if (currentMonth == -1) {currentMonth = 11; currentYear--;}
	firstDate.setDate(0);
	firstDate.setDate(1);
	firstDay = getFirstDay(firstDate);
	removeEvents();
	for (i = 0; i < 42; i++) {
		var cell = document.getElementById("cell" + i).style.background = "white";
	}
	fillCurrentMonth(monthArray[currentMonth], currentYear);
	fillPrevMonth(monthArray[currentMonth], currentYear);
	fillNextMonth(monthArray[currentMonth], currentYear);
	loadEvents(currentMonth, currentYear);
	refreshList();
	document.getElementById("header1").innerHTML = monthArray[currentMonth] + " " + currentYear;
}

function nextMonth() {
	currentMonth++;
	if (currentMonth == 12) {currentMonth = 0; currentYear++; firstDate.setFullYear(currentYear)}
	firstDate.setMonth(currentMonth);
	firstDate.setDate(1);
	firstDay = getFirstDay(firstDate);
	removeEvents();
	fillCurrentMonth(monthArray[currentMonth], currentYear);
	fillPrevMonth(monthArray[currentMonth], currentYear);
	fillNextMonth(monthArray[currentMonth], currentYear);
	loadEvents(currentMonth, currentYear);
	refreshList();
	document.getElementById("header1").innerHTML = monthArray[currentMonth] + " " + currentYear;
}

function keyDown(event) {
	if (!(document.getElementById("pageCover").style.display == "initial" 
		&& document.getElementById("createEventWindow").style.display == "initial")) {
		var key = event.keyCode || event.which;
		if (key == 37) {
			// Left arrow key pressed
			prevMonth();
		} else if (key == 39) {
			// Right arrow key pressed
			nextMonth();
		} else if (key == 84) {
			// 't' char pressed, go to today
			goToToday();
		} else if (key == 78) {
			// 'n' char pressed, create event
			createNewEvent(document.getElementById("cell" + firstDay));
		} else if (key == 18) {
			// 'alt' char pressed, copy and paste
			altKeyDown = true;
		}
	}
}

function keyUp(event) {
	if (!(document.getElementById("pageCover").style.display == "initial" 
		&& document.getElementById("createEventWindow").style.display == "initial")) {
		var key = event.keyCode || event.which;
		if (key == 18) {
			altKeyDown = false;
		}
	}
}

function deleteCurrentYearsEvents() {
	delete data[2014];
	window.localStorage.removeItem("calData");
	location.reload();
}

function determineDirection(todayMonth, todayDay, todayYear) {
	if (todayYear < currentYear) {
		return 1;
	} else if (todayYear > currentYear) {
		return -1;
	} else {
		if (todayMonth < currentMonth) {
			return 1;
		} else if (todayMonth > currentMonth) {
			return -1;
		} else {
			return 0;
		}
	}
}

function goToToday() {
	var todayDay = date.getDate();
	var todayMonth = date.getMonth();
	var todayYear = date.getFullYear();
	var direction = determineDirection(todayMonth, todayDay, todayYear);
	if (direction < 0) {
		while (todayMonth != currentMonth || todayYear != currentYear) {
			nextMonth();
		}
	} else if (direction > 0) {
		while (todayMonth != currentMonth || todayYear != currentYear) {
			prevMonth();
		}
	} else {
		return;
	}
}

function createNewEvent(obj) {
	document.getElementById("pageCover").style.display = "initial";
	document.getElementById("createEventWindow").style.display = "initial";
	var temp = obj.name.split("-");
	var tempMonth = temp[0];
	var tempDay = temp[1];
	var tempYear = temp[2];
	var popUp = document.getElementById("eventEdit");
	popUp.elements["eventName"].value = "";
	popUp.elements["eventDescription"].value = "";
	popUp.elements["deleteButton"].style.display = "none";
	popUp.elements["eventStartDate"].value = (tempMonth.toString() + "/" + tempDay.toString() + "/" + tempYear.toString());
	popUp.elements["eventEndDate"].value = (tempMonth.toString() + "/" + tempDay.toString() + "/" + tempYear.toString());
	popUp.elements["eventStartTime"].value = "12:00:00";
	popUp.elements["eventEndTime"].value = "13:00:00";
	popUp.elements["saveButton"].onclick = function() { saveEvent() };
	popUp.elements["cancelButton"].onclick = function() { closeForm(); };
	popUp.elements["eventName"].focus();
}

// NOTE: THIS FUNCITON DOESNT WORK 100% YET - COOL STORY JAMES

function allDayToggle(obj) {
	var start = document.getElementById("eventStartTime");
	var end = document.getElementById("eventEndTime");
	if (obj.checked) {
		start.style.display = "none";
		end.style.display = "none";
	} else {
		start.style.display = "initial";
		end.style.display = "initial";
	}
}

function dragStart(ev, eventObj) {
	var temp = ev.target.parentNode.name.split("-");
	var tempMonth = temp[0];
	var tempDay = temp[1];
	var tempYear = temp[2];
	eventObj.eventStart.month = tempMonth;
	eventObj.eventStart.day = tempDay;
	eventObj.eventStart.year = tempYear;
  ev.dataTransfer.effectAllowed='move';
  ev.dataTransfer.setData("id", ev.target.getAttribute('id'));
  ev.dataTransfer.setData("object", JSON.stringify(eventObj));
}
function dragEnter(ev) {
  ev.preventDefault();
}
function dragOver(ev) {
	ev.preventDefault();
}

function dragDrop(ev) {
  var info = ev.dataTransfer.getData("id");
  if (ev.target.className == "dateNumber" || 
  	ev.target.className == "event") {
   	ev.target.parentNode.appendChild(document.getElementById(info));
    var targetDate = ev.target.parentNode.name.split("-");
  }
  else if (ev.target.className == "eventName") {
  	ev.target.parentNode.parentNode.appendChild(document.getElementById(info));
  	var targetDate = ev.target.parentNode.parentNode.name.split("-");
  }
  else {
   	ev.target.appendChild(document.getElementById(info));
   	var targetDate = ev.target.name.split("-");
  }
	var targetMonth = targetDate[0];
	var targetDay = targetDate[1];
	var targetYear = targetDate[2];
	var newEventObj = JSON.parse(ev.dataTransfer.getData("object"));
	// if (altKeyDown) {
	// 	createLoadedEvent(newEventObj);
	// }
	// else {
	// 	deleteEventObject(newEventObj);
	// }
	deleteEventObject(JSON.parse(ev.dataTransfer.getData("object")));
	newEventObj.eventStart.day = targetDay;
	newEventObj.eventStart.month = targetMonth;
	newEventObj.eventStart.year = targetYear;
	//deleteEventObject(eventObj);
	addEventToData(newEventObj);
	removeEvents();
	loadEvents(currentMonth, currentYear);
	refreshList();
  ev.stopPropagation();
}

function saveEvent() {
	// get info from form here
	var popUp = document.getElementById("eventEdit");
	var eventName = popUp.elements["eventName"].value;
	if (eventName == "") {
		eventName = "New Event";
	}
	// Get start date
	var tempStartDate = popUp.elements["eventStartDate"];
	var tempStartTime = popUp.elements["eventStartTime"];
	tempStartDate = tempStartDate.value.split("/");
	tempStartTime = tempStartTime.value.split(":");
	var startYear = tempStartDate[2];
	var startMonth = tempStartDate[0];
	var startDay = tempStartDate[1];
	var startHour = tempStartTime[0];
	var startMinute = tempStartTime[1];
	var eventStart = new dateObject(startYear, startMonth, startDay, startHour, startMinute);
	// Get end date
	var tempEndDate = popUp.elements["eventEndDate"];
	var tempEndTime = popUp.elements["eventEndTime"]
	tempEndDate = tempEndDate.value.split("/");
	tempEndTime = tempEndTime.value.split(":");
	var endYear = tempEndDate[2];
	var endMonth = tempEndDate[0];
	var endDay = tempEndDate[1];
	var endHour = tempEndTime[0];
	var endMinute = tempEndTime[1];
	var eventEnd = new dateObject(endYear, endMonth, endDay, endHour, endMinute);	// Get other info, not yet defined/built in HTML
	var eventDescription = popUp.elements["eventDescription"].value;
	var eventCalendar = "None";
	var eventType = "None";
	var divID = "event" + eventCount;

	var eventObj = new eventObject(eventName, eventType, eventStart, eventEnd, eventDescription, eventCalendar);

	var newEvent = document.createElement("div");
	newEvent.id = "event" + eventCount;
	eventObj.divId = newEvent.id;
	addEventToData(eventObj);
	newEvent.className = "event";
	newEvent.draggable = "true";
	//newEvent.setAttribute("ondragstart", "return dragStart(event)");
	newEvent.ondragstart = function(e) {
		var eventObjectCopy = eventObj;
		deleteEventObject(eventObj);
		return dragStart(e, eventObjectCopy);
	}
	newEvent.ondblclick = function(e) {
    // var eventObjectCopy = eventObj;
    deleteEventObject(eventObj);
    e.preventDefault();
    if ('bubbles' in e) {
      e.stopPropagation();
      openEvent(eventObj, eventObj.divId); // cahnge made here
    }
    else {
        e.cancelBubble = true;
        openEvent(eventObj, eventObj.divId);
    }
  }
	var eventP = document.createElement("P");
	eventP.className = "eventName";
	eventP.innerHTML = eventName;
	newEvent.appendChild(eventP);
	document.getElementById("cell" + (parseInt(startDay) + firstDay - 1)).appendChild(newEvent);
	eventCount++;

	closeForm();
}


function openEvent(eventObj, divID) {
	document.getElementById("pageCover").style.display = "initial";
	document.getElementById("createEventWindow").style.display = "initial";

	var popUp = document.getElementById("eventEdit");
	popUp.elements["eventName"].value = eventObj.eventName;

	// Set start date
	var eventStart = eventObj.eventStart;
	var startMonth = eventStart.month;
	var startDay = eventStart.day;
	var startYear = eventStart.year;
	var startHour = eventStart.hour;
	var startMinute = eventStart.minute;

	// Set end date
	var eventEnd = eventObj.eventEnd;
	var endMonth = eventStart.month;
	var endDay = eventEnd.day;
	var endYear = eventEnd.year;
	var endHour = eventEnd.hour;
	var endMinute = eventEnd.minute;

	var eventDescription = eventObj.eventDescription;

	popUp.elements["deleteButton"].style.display = "initial";
	popUp.elements["eventStartDate"].value = (startMonth + "/" + startDay + "/" + startYear);
	popUp.elements["eventEndDate"].value = (endMonth + "/" + endDay + "/" + endYear);
	popUp.elements["eventStartTime"].value = (startHour + ":" + startMinute);
	popUp.elements["eventEndTime"].value = (endHour + ":" + endMinute);
	popUp.elements["eventDescription"].value = eventDescription;
	popUp.elements["cancelButton"].onclick = function() { 
		addEventToData(eventObj);
		closeForm();
	}

	var saveButton = popUp.elements["saveButton"];
	saveButton.onclick = function(e) {
    e.preventDefault();
    if ('bubbles' in e) {
      e.stopPropagation();
      saveEventEdit(eventObj, divID);
    }
    else {
        e.cancelBubble = true;
        saveEventEdit(eventObj, divID);
    }
  }

  var deleteButton = popUp.elements["deleteButton"];
	deleteButton.onclick = function(e) {
    e.preventDefault();
    if ('bubbles' in e) {
      e.stopPropagation();
      deleteEventObject(eventObj);
      var child = document.getElementById(divID);
      var parent = child.parentNode;
      parent.removeChild(child);
      closeForm();

    }
    else {
      e.cancelBubble = true;
      deleteEventObject(eventObj);
      var child = document.getElementById(divID);
      var parent = child.parentNode;
      parent.removeChild(child);
      closeForm();
    }
  }
}

function closeForm() {
	var popUp = document.getElementById("eventEdit");
	document.getElementById("pageCover").style.display = "none";
	document.getElementById("createEventWindow").style.display = "none";
	popUp.elements["eventName"].value = "";
	popUp.elements["eventDescription"].value = "";
	refreshList();
}

function deleteEventObject(eventObj) {
	var year = parseInt(eventObj.eventStart.year);
	var month = parseInt(eventObj.eventStart.month);
	var day = parseInt(eventObj.eventStart.day);
	for (i = 0; i < data[year][month][day].length; i++) {
		if (_.isEqual(eventObj, data[year][month][day][i])) {
			delete data[year][month][day][i];
			data[year][month][day].sort();
			data[year][month][day].pop();
			break;
		}
	}
}

function createNewCalendar() {}

function saveEventEdit(eventObj, divID) {

	// get info from form here
	var popUp = document.getElementById("eventEdit");
	eventObj.eventName = popUp.elements["eventName"].value;
	// Get start date
	var startDate = popUp.elements["eventStartDate"];
	var startTime = popUp.elements["eventStartTime"];
	startDate = startDate.value.split("/");
	startTime = startTime.value.split(":");
	eventObj.eventStart.year = startDate[2];
	eventObj.eventStart.month = startDate[0];
	eventObj.eventStart.day = startDate[1];
	eventObj.eventStart.hour = startTime[0];
	eventObj.eventStart.minute = startTime[1];
	
	// Get end date
	var endDate = popUp.elements["eventEndDate"];
	var endTime = popUp.elements["eventEndTime"]
	endDate = endDate.value.split("/");
	endTime = endTime.value.split(":");
	eventObj.eventEnd.year = endDate[2];
	eventObj.eventEnd.month = endDate[0];
	eventObj.eventEnd.day = endDate[1];
	eventObj.eventEnd.hour = endTime[0];
	eventObj.eventEnd.minute = endTime[1];

	eventObj.eventDescription = popUp.elements["eventDescription"].value;
	eventObj.eventCalendar = popUp.elements["eventCalendar"];
	eventObj.eventType = popUp.elements["eventType"];

	addEventToData(eventObj);

	// change eventDiv

	document.getElementById(divID).firstChild.innerHTML = popUp.elements["eventName"].value;

	$("#" + divID)
    .appendTo("#cell" + (parseInt(eventObj.eventStart.day) + firstDay - 1));

	closeForm();
}

function addEventToData(newEvent) {
	var tempYear = newEvent.eventStart.year;
	if (!(tempYear in data)) {
		data[tempYear] = new yearObject(tempYear);
	}
  var tempMonth = parseInt(newEvent.eventStart.month);
  var tempDay = parseInt(newEvent.eventStart.day);
  data[tempYear][tempMonth][tempDay].push(newEvent);
}

function dateObject(dateYear, dateMonth, dateDay, dateHour, dateMinute) {
	this.year = dateYear;
	this.month = dateMonth;
	this.day = dateDay;
	this.hour = dateHour;
	this.minute = dateMinute;
};

function eventObject(eventName, eventType, eventStart, eventEnd, eventDescription, eventCalendar) {
	this.eventName = eventName;
	this.eventType = eventType;
	this.eventStart = eventStart;
	this.eventEnd = eventEnd;
	this.eventDescription = eventDescription;
	this.eventCalendar = eventCalendar;
};

function yearObject(name) {
	//this.name = name;
	this[1] = new monthObject("January");
	this[2] = new monthObject("February");
	this[3] = new monthObject("March");
	this[4] = new monthObject("April");
	this[5] = new monthObject("May");
	this[6] = new monthObject("June");
	this[7] = new monthObject("July");
	this[8] = new monthObject("August");
	this[9] = new monthObject("September");
	this[10] = new monthObject("October");
	this[11] = new monthObject("November");
	this[12] = new monthObject("December");
}

function monthObject(name) {
	//this.name = name;
	for (i = 1; i < getMonthLength(name)+1; i++) {
		this[i] = [];
	}
}

