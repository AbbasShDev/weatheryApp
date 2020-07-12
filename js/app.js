let notificationMesssge = document.querySelector('.notification');
let currentLocation = document.querySelector('.current-location');
let dayAndDate = document.querySelector('.day-date');
let weatherIcon = document.querySelector('.weather-icon');
let mainTemp = document.querySelector('.main-temp-value');
let tempDescription = document.querySelector('.temp-description');
let humidityValue = document.querySelector('.humidity-value');
let windValue = document.querySelector('.wind-value');
let MaxTempValue = document.querySelector('.max-temp-value');
let MinTempValue = document.querySelector('.min-temp-value');

let myDate = new Date();

let ApiKey = 'e0ad44b9250db28e45669dbbcc1f88a9';

window.addEventListener('load', () => {
	getAllLocations();

	geolocationWeather();
});

//geting all locations btn
let locationsBtn = document.querySelectorAll('.loactionsChoice .btn');
//looping through the btns
document.addEventListener('click', (e) => {
	let target = e.target;
	if (target && target.classList.contains('btnStyle')) {
		document.querySelector('.loading').style.display = 'block';
		let lat = target.dataset.latitude;
		let lang = target.dataset.longitude;

		notificationMesssge.innerText = '';

		const currentNeerUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lang}&cnt=6&units=metric&appid=${ApiKey}`;
		//forcast for 7 neext 7 days api URL
		const WeekUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lang}&exclude=minutely,hourly&units=metric&appid=${ApiKey}`;

		getWeekWeather(WeekUrl);
		getCurrentNeerWeather(currentNeerUrl);
	}
	if (target && target.classList.contains('my-location')) {
		document.querySelector('.loading').style.display = 'block';
		//make sure geolacttin denied mesaage is not there
		notificationMesssge.innerText = '';
		geolocationWeather();
	}
});

function geolocationWeather() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setPostion, showError);
	} else {
		notificationMesssge.innerText = "Your browser dosn't support Geolocation";
	}
}

function getTodayName(dayNum) {
	let days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

	return days[dayNum];
}

function showError(error) {
	document.querySelector('.loading').style.display = 'none';
	//show message if user denied allowing Geolocation
	notificationMesssge.innerText = error.message;
}

function setPostion(postion) {
	//geting the longitude
	let lang = postion.coords.longitude;
	//geting the latitude
	let lat = postion.coords.latitude;
	//currnt locations and loacions neer you api URL
	const currentNeerUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lang}&cnt=6&units=metric&appid=${ApiKey}`;
	//forcast for 7 neext 7 days api URL
	const WeekUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lang}&exclude=minutely,hourly&units=metric&appid=${ApiKey}`;

	getWeekWeather(WeekUrl);
	getCurrentNeerWeather(currentNeerUrl);
}

async function getCurrentNeerWeather(currentNeerUrl) {
	let resopnse = await fetch(currentNeerUrl);

	if (resopnse.ok) {
		let weather = await resopnse.json();
		let neerLocationHeading = document.querySelector('.section2 h4');
		neerLocationHeading.innerText = `Locations Neer ${weather.list[0].name}`;

		//cureent Weather info
		currentLocation.innerText = `${weather.list[0].name} ${weather.list[0].sys.country}`;
		dayAndDate.innerText = `${getTodayName(myDate.getDay())} ${myDate.getDate()}/${myDate.getMonth() + 1}`;
		weatherIcon.setAttribute('src', `icons/${weather.list[0].weather[0].icon}.png`);
		mainTemp.innerText = `${Math.floor(weather.list[0].main.temp)}° `;
		tempDescription.innerText = `${weather.list[0].weather[0].description}`;
		humidityValue.innerText = `${weather.list[0].main.humidity}%`;
		windValue.innerText = `${weather.list[0].wind.speed} m/s`;

		//weather info for 5 locations neer
		let locationsNeerDiv = document.querySelector('.locatiosNeerYou');
		locationsNeerDiv.innerHTML = '';

		for (let i = 1; i < weather.list.length; i++) {
			let location = weather.list[i].name;
			let weatherTemp = Math.floor(weather.list[i].main.temp);
			let weatherIcon = weather.list[i].weather[0].icon;
			let newDiv = document.createElement('div');
			newDiv.innerHTML = `
		    <div class="col-lg-0 text-center justify-content-center">
        	<div class="neer-you-location pt-3">${location}</div>
        	<div class="location-temp-value pt-2"><p class="mb-0">${weatherTemp}° <span>C</span></p></div>
        	<div><img class="location-weather-icon" src="icons/${weatherIcon}.png" alt=""></div>
      		</div>
		`;
			locationsNeerDiv.append(newDiv);
		}
		document.querySelector('.loading').style.display = 'none';
	}
}
//calling the api
async function getWeekWeather(WeekUrl) {
	let resopnse = await fetch(WeekUrl);

	if (resopnse.ok) {
		let weather = await resopnse.json();

		let weekDiv = document.querySelector('.week-weather');
		weekDiv.innerHTML = '';

		for (let i = 1; i < weather.daily.length; i++) {
			let unix_timestamp = weather.daily[i].dt;
			let date = new Date(unix_timestamp * 1000);
			let dayNum = date.getDay();
			let dayName = getTodayName(dayNum);
			let dayAndMonth = `${date.getDate()}/${date.getMonth() + 1}`;
			let weatherTemp = Math.floor(weather.daily[i].temp.day);
			let weatherIcon = weather.daily[i].weather[0].icon;
			let newDiv = document.createElement('div');
			newDiv.innerHTML = `
		    <div class="col-lg-0 text-center justify-content-center py-lg-2">
		    <div class="week-day">${dayName}</div>
		    <div class="week-day-date">${dayAndMonth}</div>
		    <div class="week-temp-value pt-3"><p class="mb-0">${weatherTemp}° <span>C</span></p></div>
		    <div><img class="week-weather-icon" src="icons/${weatherIcon}.png" alt=""></div>
		    </div>
		`;
			weekDiv.append(newDiv);
		}

		MaxTempValue.innerText = `${Math.floor(weather.daily[0].temp.max)}° `;
		MinTempValue.innerText = `${Math.floor(weather.daily[0].temp.min)}° `;
	}
}

//darkmode
const darkmodeToggler = document.querySelector('.darkmode-toggler');
let darkmodeStorge = localStorage.getItem('darkmood');
if (darkmodeStorge == null) {
	localStorage.setItem('darkmood', 'css/main.css');
}

if (darkmodeStorge != null) {
	document.getElementById('css-link').href = localStorage.getItem('darkmood');
	if (localStorage.getItem('darkmood') == 'css/main.css') {
		document.querySelector('.darkmode-toggler').classList.remove('darkmode-toggler-dark');
	} else if (localStorage.getItem('darkmood') == 'css/main-dark.css') {
		document.querySelector('.darkmode-toggler').classList.add('darkmode-toggler-dark');
	}
}
darkmodeToggler.addEventListener('click', () => {
	if (localStorage.getItem('darkmood') == 'css/main.css') {
		localStorage.setItem('darkmood', 'css/main-dark.css');
		document.getElementById('css-link').href = 'css/main-dark.css';
	} else if (localStorage.getItem('darkmood') == 'css/main-dark.css') {
		localStorage.setItem('darkmood', 'css/main.css');
		document.getElementById('css-link').href = 'css/main.css';
	}
	document.querySelector('.darkmode-toggler').classList.toggle('darkmode-toggler-dark');
});
//darkmode
let locations = [];

let clearAll = document.querySelector('.clear-all-btn');

clearAll.addEventListener('click', () => {
	clearAllLocations();
});

async function clearAllLocations() {
	if (confirm('Clear All?')) {
		Storage.clearAllLocations();

		document.querySelector('.loactionsChoice').innerHTML = '';

		//add  my location btn
		document.querySelector('.loactionsChoice').innerHTML = ` <div>
				<button class="btn my-2 mx-2 btnActive my-location" type="button">My Location</button>
			  </div>`;
		locations = [];
	} else {
		return false;
	}
}
//adding new city
let addCityBtn = document.querySelector('.add-city-btn');

addCityBtn.addEventListener('click', () => {
	document.querySelector('.loading').style.display = 'block';
	let inputValue = document.querySelector('input').value;
	if (inputValue == '') {
		alert('Enter Location Name');
		document.querySelector('.loading').style.display = 'none';
	} else {
		let cityUrl = `https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=82d3487b13b54cddbda225f84f863798`;
		getCityLatLang(cityUrl, inputValue);
		document.querySelector('input').value = '';
	}
});

async function getCityLatLang(cityUrl, inputValue) {
	try {
		let resopnse = await fetch(cityUrl);
		if (resopnse.ok) {
			let cityIinfo = await resopnse.json();

			let lat = cityIinfo.results[0].geometry.lat;
			let long = cityIinfo.results[0].geometry.lng;

			addLocation(inputValue, lat, long);
			document.querySelector('.loading').style.display = 'none';
		}
	} catch (e) {
		// alert('Some thing went wrong, Try another name, for better result you can use country name');
		alert(e.message);
	}
}

let locationsStorage = Storage.getLocations();
if (locationsStorage) {
	for (let i = 0; i < locationsStorage.length; i++) {
		locations.push(locationsStorage[i]);
	}
}
async function addLocation(loc, lat, long) {
	let id = Date.now();
	locations.push({ location: loc, latitude: lat, longitude: long, id: id });
	Storage.saveLocations(locations);
	getAllLocations();
}
function getAllLocations() {
	if (Storage.getLocations()) {
		displayLocation(Storage.getLocations());
	}
}

function displayLocation(locationArray) {
	let locationDiv = document.querySelector('.loactionsChoice');
	locationDiv.innerHTML = '';

	//add my location btn
	locationDiv.innerHTML = `<div>
	<button class="btn my-2 mx-2 btnActive my-location" type="button">My Location</button>
  	</div>`;

	for (let i = 0; i < locationArray.length; i++) {
		let newDiv = document.createElement('div');
		newDiv.id = 'location-' + locationArray[i].id;

		let lat = locationArray[i].latitude;
		let long = locationArray[i].longitude;
		let locationName = locationArray[i].location;
		let id = locationArray[i].id;

		//add  btn
		newDiv.innerHTML = `
			<button class="btn btnStyle my-2 mx-2"  data-latitude=${lat} data-longitude=${long} type="button">${locationName}<span class="location-span"><i class="fa fa-times-circle deleteLoc" data-id=${id} ></i></span></button>
			`;

		locationDiv.append(newDiv);
	}
}

//deleting location
document.addEventListener('click', (e) => {
	let { target } = e;
	if (target && target.classList.contains('deleteLoc')) {
		let loacId = parseInt(target.dataset.id);

		deleteLocation(loacId);
	}
});

function deleteLocation(loacId) {
	if (confirm('Confirm Deleting?')) {
		Storage.deleteLocation(loacId);
		locations = locations.filter((location) => location.id != loacId);
		document.getElementById('location-' + loacId).remove();
	} else {
		return false;
	}
}
