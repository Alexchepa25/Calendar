import { days, workFrom, workTo } from "./const";
import Store from "./store";
import $ from "jquery";
import { composeEventId } from "./utils";

window.Store = Store;

const users = Store.getUsers();

function Calendar() {
  ////////// Name /////////
  function createUserList() {
    const select = document.getElementById("nameSelect");
    const select_1 = document.getElementById("nameSelectFirst");
    for (var i = 0; i < users.length; i++) {
      let userName = users[i].userName;
      let listElem = document.createElement("option");
      let listElemSecond = document.createElement("option");
      listElem.innerHTML = userName;
      listElemSecond.innerHTML = userName;
      select.appendChild(listElem);
      select_1.appendChild(listElemSecond);
    }
  }
  ///////// /Name /////////

  ////////// Day //////////
  function createDayList() {
    const select = document.getElementById("daySelect");
    for (var i = 1; i < days.length; i++) {
      let day = days[i].toUpperCase();
      let listElem = document.createElement("option");
      listElem.innerHTML = day;
      select.appendChild(listElem);
    }
  }
  ///////// /Day //////////

  ///////// Time //////////
  function createTimeList() {
    const select = document.getElementById("timeSelect");
    for (var i = workFrom; i < workTo + 1; i++) {
      let time = i + ":" + "00";
      let listElem = document.createElement("option");
      listElem.innerHTML = time;
      select.appendChild(listElem);
    }
  }
  //////// /Time //////////

  //////// Data Input //////////
  function dataInput() {
    const inputValue = document.getElementById("eventInput").value;
    const textField = document.getElementById("textField");
    textField.innerHTML = inputValue;
    document.getElementById("eventInput").value = "";
  }
  /////// /Data Input //////////

  ///////// New Event //////////
  function createNewEvent() {
    const nameEvent = document.getElementById("eventInput").value;
    const selectPersonName = document.getElementById("nameSelect").value;
    const selectDay = document.getElementById("daySelect").value;
    const selectTime = document.getElementById("timeSelect").value;
    const textField = document.getElementById("textField");
    const nameField = document.getElementById("nameField");
    const dayField = document.getElementById("dayField");
    const timeField = document.getElementById("timeField");
    textField.innerHTML = nameEvent;
    nameField.innerHTML = selectPersonName;
    dayField.innerHTML = selectDay;
    timeField.innerHTML = selectTime;

    const newtask = {
      id: Date.now(),
      userId: users[document.getElementById("nameSelect").selectedIndex].userId,
      task: document.getElementById("eventInput").value,
      day: document.getElementById("daySelect").selectedIndex + 1,
      time: document.getElementById("timeSelect").selectedIndex + 10,
    };

    if (Store.getEvendById(composeEventId(newtask))) {
        showError('An event already exists at this time!!!')
    }else{
        Store.insertEvent(newtask);
        createTable();
        document.getElementById("eventInput").value = "";
    }    
  }

  //////// /New Event //////////
  function showError(err){
    $('#errmsg').text(err);
    $('#errmsg').show();
  }

  function hideError(){
    $('#errmsg').hide();
  }
  //////////// Show ////////////
  function show() {
    document.getElementById("editFormBack").style.display = "block";
    document.getElementById("card").style.display = "block";
  }
  function saveClick() {
    hideError();
    createNewEvent();
    hideSaveDialog();
  }
  function cancelClick() {
    hideError();
    hideSaveDialog();
  }

  function hideSaveDialog(){
    document.getElementById("editFormBack").style.display = "none";
    document.getElementById("card").style.display = "none";
  }
  /////////// /Show ////////////

  function createTable(userId) {
    const viewData = {};
    Store.getEvents().forEach((sd) => {      
      sd.user = users.find((u) => u.userId == sd.userId);
      viewData[ composeEventId(sd) ] = sd;
    });

    const tableMain = document.getElementById("tableMain");
    tableMain.innerHTML = "";
    var tableElem, rowElem, colElem;
    const d = days.length;

    tableElem = document.createElement("TABLE");
    tableElem.id = "tableone";
    tableElem.border = "1px solid black";
    tableElem.style.width = "75%";
    tableElem.style.margin = "0 auto";
    tableElem.style.marginBottom = "2%";
    tableElem.style.borderCollapse = "collapse";

    rowElem = document.createElement("TR");
    for (var j = 0; j < d; j++) {
      colElem = document.createElement("TH");
      colElem.style.border = "1px solid black";
      colElem.style.padding = "15px";
      colElem.style.textAlign = "center";
      colElem.style.fontSize = "1.3rem";
      colElem.style.backgroundColor = "#f1e5c1";
      colElem.style.borderCollapse = "collapse";

      var weekDay = days[j].toUpperCase();
      colElem.innerHTML = weekDay ? weekDay : "";
      rowElem.appendChild(colElem);
    }
    tableElem.appendChild(rowElem);

    for (var i = workFrom; i < workTo + 1; i++) {
      rowElem = document.createElement("TR");
      rowElem.style.borderCollapse = "collapse";

      for (var j = 0; j < d; j++) {
        colElem = document.createElement("TD");
        colElem.style.border = "1px solid black";
        colElem.style.borderCollapse = "collapse";
        colElem.style.padding = "15px";
        colElem.style.textAlign = "left";
        colElem.style.backgroundColor = "#f1f1d9";

        if (j == 0) {
          const worktime = i + ":" + "00";
          colElem.innerHTML = worktime;
          colElem.style.textAlign = "center";
          colElem.style.fontSize = "1.3rem";
          colElem.style.backgroundColor = "#f1e5c1";
        }

        const key = i + "_" + j;
        const found = viewData[key];

        if (found && userId && userId == found.userId) {
          colElem.innerHTML = createEventHTML(found);
        }
        if (found && !userId) {
          colElem.innerHTML = createEventHTML(found);
        }
        rowElem.appendChild(colElem);
      }
      tableElem.appendChild(rowElem);
    }
    tableMain.appendChild(tableElem);
  }

  function userFilterChange(e) {
    createTable(users[e.target.selectedIndex].userId);
  }

  function createEventHTML(event) {
    return `<b>${event.user.userName}</b><br/> ${
      event.task
    } <button onClick="deleteEvent('${
      composeEventId(event)
    }')"> x </button> `;
  }

  function deleteEvent(id) {
    Store.deleteEvent(id);
    createTable(
      users[document.getElementById("nameSelectFirst").selectedIndex].userId
    );
  }
  window.deleteEvent = deleteEvent;

  $(function () {
    createUserList();
    createDayList();
    createTimeList();
    createTable();

    $("#newEventBtn").on("click", dataInput);
    $("#newEventBtn").on("click", show);
    $("#saveEventBtn").on("click", saveClick);
    $("#cancelEventBtn").on("click", cancelClick);
    $("#nameSelectFirst").on("change", userFilterChange);
  });
}

export default Calendar;
