document.addEventListener('DOMContentLoaded', () => {
    generateDays();

    document.getElementById('addActivityBtn').addEventListener('click', addNewActivity);
});

function generateDays(){
    let parent = document.getElementById('createDaysHere');
    let date = new Date();

    let amountOfDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let currentDay = date.getDay();
    let currentMonth = date.getMonth() + 1;

    document.getElementById('monthName').innerHTML = getNameOfMonth(currentMonth);
    for(let index = 0; index < amountOfDays; index++) {
       let elem = document.createElement('div');
       elem.classList = currentDay == (index + 1) ? "dayTab todayTab" : "dayTab";
       elem.innerHTML = `<p>${index + 1}</p>`;
       elem.id = `day${index}`;
       elem.onclick = () => {getActivities((index + 1), currentMonth, `day${index}`);};
       parent.appendChild(elem);
    }
}

function getNameOfMonth(month){
    switch(month) {
        case 1:
            month = "January";
            break;
        case 2:
            month = "February"
            break;
        case 3:
            month = "March";
            break;
        case 4:
            month = "April";
            break;
        case 5:
            month = "May";
            break;
        case 6:
            month = "June";
            break;
        case 7:
            month = "July";
            break;
        case 8:
            month = "August";
            break;
        case 9:
            month = "September";
            break;
        case 10:
            month = "October";
            break;
        case 11:
            month = "November";
            break;
        case 12:
            month = "December";
            break;
        default:
            month = "January";
            break;
    }
    return month;
}


// -- Day activities
function resizeActivityList(elem){
    elem.style.backgroundColor = "red";
    
    
    setTimeout((elem = item) => {
        
        elem.style.height = "auto";
        elem.style.height = elem.scrollHeight + "px";
    }, 0);
}

let currentActivities = 0;
let currentlyViewingDay = 1;
let currentlyViewingMonth = 1;
let currentlyViewingElement = "day1";

function getActivities(day, month, element) {
    if(day == 0 || day == undefined) day = 1;
    if(month == 0 || month == undefined) month = 1;

    currentlyViewingDay = day;
    currentlyViewingMonth = month;


    // --
    let elements = document.getElementsByClassName('viewingDayTab');
    for(elem of elements) {
        if(elem.classList == "dayTab todayTab viewingDayTab") {
            elem.classList = "dayTab todayTab";
        } else {
            elem.classList = "dayTab";
        }
    }
    if(element == undefined) element = currentlyViewingElement;
    element == undefined ? element = currentlyViewingElement : currentlyViewingElement = element;
    if(document.getElementById(element).classList == "dayTab todayTab") {
        document.getElementById(element).classList = "dayTab todayTab viewingDayTab";
    } else {
        document.getElementById(element).classList = "dayTab viewingDayTab";
    }
    // --

    fetch(`/db/getActivities?day=${day}&month=${month}`)
    .then((res) => {
        if(res.status !== 200) console.log("Not status 200");
        
        return res.json();
    })
    .then((json) =>{
        // Remove old
        for(let index = 0; index < currentActivities; index++) {
            let act = document.getElementById(`activity${index}`);
            document.getElementById('dayActivities').removeChild(act);
        }
        currentActivities = 0;

        // Create new 
        for(const [index,act] of json.entries()) {
            currentActivities++;
            let elem = document.createElement('div');
            elem.classList = "activityTab";
            elem.innerHTML = `<div class="time">${act.time}</div><i class="fas fa-times" onclick="removeActivity(${act.id});"></i><textarea class="activityListItem" readonly>${act.activity}</textarea>`;
            elem.id = `activity${index}`;
            document.getElementById('dayActivities').appendChild(elem);
        }
    })
}
function removeActivity(id){
    if(id != undefined && id != 0 && !isNaN(id)) {
        fetch(`/db/removeActivity?id=${id}`);
        getActivities(currentlyViewingDay, currentlyViewingMonth);
    }
}

function addNewActivity(){
    if(currentlyViewingDay == 0 || currentlyViewingDay == undefined) currentlyViewingDay = 1;
    if(currentlyViewingMonth == 0 || currentlyViewingMonth == undefined) currentlyViewingMonth = 1;

    let time = document.getElementById('timeField').value;
    let message = document.getElementById('messageField').value;

    fetch(`/db/addActivity?day=${currentlyViewingDay}&month=${currentlyViewingMonth}&time=${time}&message=${message}`);
    getActivities(currentlyViewingDay, currentlyViewingMonth);
}