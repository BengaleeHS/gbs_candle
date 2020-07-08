var mealstate = 0
function ChangeMenu(num) {
    var sides = document.getElementsByClassName('sidebutton');
    for (var i = 0; i < sides.length; i++) {
        sides[i].removeAttribute('selected');
    }
    sides[num].setAttribute('selected', '');
    mealstate = 0;
    var content = document.getElementById("content")
    while (content.hasChildNodes()) {
        content.removeChild(content.firstChild);
    }
    if (num === 1) GetMeal(GetDate(mealstate));
}

function ChangeMeal(dif) {
    mealstate += dif;
    var content = document.getElementById("content")
    while (content.hasChildNodes()) {
        content.removeChild(content.firstChild);
    }
    GetMeal(getdate(mealstate));
}

function GetMeal(ymd) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var meal = JSON.parse(xhr.responseText).meal;
            var today = document.createElement("div");
            today.setAttribute("class", "card");
            var todayh = document.createElement("h2")
            var ddd = ymd.split('-')
            todayh.innerHTML = ddd[0] + "년 " + ddd[1] + "월 " + ddd[2] + "일"

            today.appendChild(todayh)

            var morning = document.createElement("div");
            morning.setAttribute("class", "card");
            morning.innerHTML = "<h3> 아침 </h3> <p style=\"white-space: pre-line\">" + meal[0] + "</p>";
            var lunch = document.createElement("div");
            lunch.setAttribute("class", "card");
            lunch.innerHTML = "<h3> 점심 </h3> <p style=\"white-space: pre-line\">" + meal[1] + "</p>";
            var dinner = document.createElement("div");
            dinner.setAttribute("class", "card");
            dinner.innerHTML = "<h3> 저녁 </h3> <p style=\"white-space: pre-line\">" + meal[2] + "</p>"
            document.getElementById("content").appendChild(today)
            document.getElementById("content").appendChild(morning)
            document.getElementById("content").appendChild(lunch)
            document.getElementById("content").appendChild(dinner);

        }
    };
    xhr.open('GET', '/meal?date=' + ymd.toString());
    xhr.send();
}
function GetDate(dif) {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();

    date = new Date(y, m, d + dif);

    y = date.getFullYear();
    m = date.getMonth()+1;
    d = date.getDate();
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    return y+"-"+m+"-"+d;
}

function Logout() {
    window.location.href = '/logout';
}

