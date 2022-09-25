import './index.html';
import './style.css';
import "@babel/polyfill";

// Background ==================================

const apiKeyImage = process.env.IMAGE_KEY;
const requestUrl = `https://api.unsplash.com/photos/random?query=nature&client_id=${apiKeyImage}`
const display = document.querySelector('.backgroung-image')

async function getRandomImage() {
    return fetch(requestUrl)
    
    .then((response) => response.json())
    .then((data) => {
        return data.urls.regular;
    }) 
}

async function showImage() {
    let randomImage = await getRandomImage()
    display.src = randomImage;
}

showImage()

setInterval(() => showImage(), 5000);

// ToDo List ==================================

const input = document.querySelector(".input");
const ul = document.querySelector("ul");

function inputLength() {
    return input.value.length;
}

function createListElement() {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(input.value));
    ul.appendChild(li);

    let div = document.createElement("div");
    div.classList.add('buttons')
    li.appendChild(div)
    let buttonRemove = document.createElement("button");
    let buttonDone = document.createElement("button");
    buttonRemove.classList.add('btn');
    buttonRemove.classList.add('remove_btn');
    buttonDone.classList.add('btn');
    buttonDone.classList.add('done_btn');
    buttonRemove.innerHTML = 'remove';
    buttonDone.innerHTML = 'done';
    div.appendChild(buttonRemove);
    div.appendChild(buttonDone);
    
    function showButtons() {
        div.style.opacity = '1';
    }

    function hideButtons() {
        div.style.opacity = '0';
    }

    li.addEventListener('mouseover', showButtons)
    li.addEventListener('mouseout', hideButtons)

    input.value="";

    function randomColor() {
        let col = Math.round(255.0 * Math.random());
        let r = col.toString(16);
        col = Math.round(255.0 * Math.random());
        let g = col.toString(16);
        col = Math.round(255.0 * Math.random());
        let b = col.toString(16);
        col = r + g + b;
        let resultColor = '#' + col
        return resultColor;
    }
    
    randomColor()
    li.style.backgroundColor = randomColor();

    function deleteListElement() {
        li.classList.add('delete')
    }

    function done() {
        li.classList.toggle('done');
        if(this.innerHTML == 'done') {
            buttonDone.innerHTML = 'redo';
        } else {
            buttonDone.innerHTML = 'done';
        }
    }
    
    buttonRemove.addEventListener('click', deleteListElement)
    buttonDone.addEventListener('click', done)
}

function addListAfterKeypress(event) {
    if (inputLength() > 0 && event.which === 13) {
        createListElement();
    }
}

input.addEventListener("keypress", addListAfterKeypress);

// Weather ===========================

const weatherInfo = document.querySelector('.weather');
const weatherInput = document.querySelector('.weather_input');
const cityBtn = document.querySelector('.city_btn')
const inputCity = document.querySelector('.input_city');

let city = '';

const cityInput = () => {
    weatherInfo.classList.toggle('weather_input')
    weatherInfo.classList.toggle('weather')

    weatherInput.classList.toggle('weather')
    weatherInput.classList.toggle('weather_input')
}

document.querySelector('.city').addEventListener('click', cityInput);

const handleInput = (e) => {
    e.preventDefault()
    let value = inputCity.value
    if(!value) return false
    city = value
    cityInput()
    getCurrentWeather()
    inputCity.value = ''
}

cityBtn.addEventListener('click', handleInput);

const apiKeyWeather = process.env.WEATHER_KEY;

async function getCurrentWeather() {
    return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKeyWeather}`)
    
    .then((response) => response.json())
    .then((data) => {

        document.querySelector('.city').textContent = data.city.name;
        let getIcon = data.list[1].weather[0].icon;
        document.querySelector('.description').textContent = data.list[1].weather[0].description;
        document.querySelector('.icon').src = `https://openweathermap.org/img/wn/${getIcon}@2x.png`;
        document.querySelector('.temperature').innerHTML = Math.round(data.list[0].main.temp -273) + '&deg';
    }) 
    .catch(() => {
        alert('This city not found')
        cityInput()
    })
} 
