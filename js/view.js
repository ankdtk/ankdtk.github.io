var id = -1;
var current = 0;
var max = -1;
var title = "Ошибка";

function onLoad() {
	let category = getParameterByName('id');
	if(typeof category != "undefined" && category != "" && category != null && category != "null") {
		id = category;
    }
    let index = getParameterByName('index');
    var indexSet = typeof index != "undefined" && index != "" && index != null && index != "null";
	if(indexSet) {
        current = index-1;
    }
    var titleElement = document.getElementById("categoryTitle");
    if(id == 0) {
        titleElement.innerHTML = 'Случайные анекдоты <a onclick="showRandomJoke()" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">arrow_forward</i></a>';
        document.title = "Случайные анекдоты";
        document.getElementById("forcat").style.visibility = 'hidden';
        showRandomJoke();
    } else {
        if(!indexSet) {
            let cookie = getCookieValue('current');
            if(cookie != null) {
                let json = JSON.parse(cookie);
                if(json.hasOwnProperty(id)){
                    current = json[id];
                }
            }
        }
        $.getJSON("jokes.json", function(data) {
            let i = 0;
            for(let key in data) {
                i++;
                if(i != id) {
                    continue;
                }
                title = key;
                max = data[key].length;
                break;
            }
            titleElement.innerHTML = title;
            document.title = title;
            document.getElementById("counter").innerHTML = (current + 1) + "/" + max;
        }).done(function () {
            updateJoke();
        }).fail(function () {
            titleElement.innerHTML = "Ошибка при загрузке";
        });
    }
}

function getParameterByName(name) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getCookieValue(key) {
    let results = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    if(results) {
        return (unescape(results[2]));
    } else {
        return null;
    }
}

function writeCookie() {
    let currentCookie = getCookieValue("current");
    if(currentCookie == null) {
        document.cookie = 'current={"' + id + '":"' + current + '"};expires=21/08/2991 00:00:00';
    } else {
        let data = JSON.parse(currentCookie);
        data[id] = current;
        document.cookie = "current=" + JSON.stringify(data) + ";expires=21/08/2991 00:00:00";
    }
}

function updateJoke() {
    let jokeElement = document.getElementById("joke");

    if(!validate(current)) {
        jokeElement.innerHTML = "Некорректный номер шутки: " + (current+1);
        return;
    }

    $.getJSON("jokes.json", function(data) {
        let joke = data[title][current];
        jokeElement.innerHTML = new DOMParser().parseFromString(joke, "text/html").documentElement.textContent;
        document.getElementById("counter").innerHTML = (current + 1) + "/" + max;
        writeCookie();
    }).fail(function () {
        jokeElement.innerHTML = "Ошибка при загрузке";
    });
}

function showRandomJoke() {
    let jokeElement = document.getElementById("joke");
    let cat = Math.floor(Math.random() * 38) + 1;
    $.getJSON("jokes.json", function(data) {
        let i = 0;
        for(let key in data) {
            i++;
            if(i != cat) {
                continue;
            }
            let num = Math.floor(Math.random() * data[key].length);
            let joke = data[key][num];
            jokeElement.innerHTML = new DOMParser().parseFromString(joke, "text/html").documentElement.textContent;
            break;
        }
    }).fail(function () {
        jokeElement.innerHTML = "Ошибка при загрузке";
    });
}

function prev() {
    move(current-1);
}

function next() {
    move(current+1);
}

function go() {
    move(document.getElementById("index").value-1);
}

function move(index) {
    if(id == 0) {
        showRandomJoke();
        return;
    }
    if(validate(index)) {
        current = index;
        updateJoke();
    }
}

function validate(index) {
    return index < max && index >= 0;
}