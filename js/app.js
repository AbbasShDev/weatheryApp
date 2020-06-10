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
let darkMoodStatus;
let myDate = new Date();

let ApiKey = 'e0ad44b9250db28e45669dbbcc1f88a9';

let darkmodeStorge = localStorage.getItem('darkmoodStorge');

window.addEventListener('load', () => {
	getAllLocations();

	geolocationWeather();
});

//if darkmoodStorge in local storge not = to null
if (darkmodeStorge !== null && darkmodeStorge == 'true') {
	document.querySelector('.darkmode-toggler').classList.add('darkmode-toggler-dark');
	document.body.classList.add('body-dark');
	const allbtn = document.querySelectorAll('.loactionsChoice .btn');
	allbtn.forEach((btn) => {
		if (btn.classList.contains('btnActive')) {
			btn.classList.toggle('btnActive-dark');
		}
		btn.classList.add('btn-dark');
	});

	const allSections = document.querySelectorAll('.weather-style');

	allSections.forEach((sec) => {
		sec.classList.add('weather-style-dark');
	});

	document.querySelector('.navbar-brand').classList.add('navbar-brand-dark');
	document.querySelector('input').classList.add('input-dark');
	document.querySelector('.add-city-btn').classList.add('add-city-btn-dark');
}

//geting all locations btn
let locationsBtn = document.querySelectorAll('.loactionsChoice .btn');
//looping through the btns
document.addEventListener('click', (e) => {
	let target = e.target;
	if (target && target.classList.contains('btnStyle')) {
		let lat = target.dataset.latitude;
		let lang = target.dataset.longitude;

		if (lat == '' && lang == '') {
			//make sure geolacttin denied mesaage is not there
			notificationMesssge.innerText = '';
			geolocationWeather();
		} else {
			notificationMesssge.innerText = '';

			const currentNeerUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lang}&cnt=6&units=metric&appid=${ApiKey}`;
			//forcast for 7 neext 7 days api URL
			const WeekUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lang}&exclude=minutely,hourly&units=metric&appid=${ApiKey}`;

			getWeekWeather(WeekUrl);
			getCurrentNeerWeather(currentNeerUrl);
		}
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

		console.log(weather);
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
		console.log(weather);
	}
}
//dark mode
if (document.body.classList.contains('body-dark')) {
	//set while loading the page
	darkMoodStatus = true;
} else {
	darkMoodStatus = false;
}
const darkmodeToggler = document.querySelector('.darkmode-toggler');

darkmodeToggler.addEventListener('click', () => {
	darkmodeFunc();
	if (document.body.classList.contains('body-dark')) {
		//set while loading the page
		darkMoodStatus = true;
		//set after loading the page
		localStorage.setItem('darkmoodStorge', 'true');
	} else {
		darkMoodStatus = false;
		localStorage.setItem('darkmoodStorge', 'false');
	}
});

function darkmodeFunc() {
	document.body.classList.toggle('body-dark');

	const allbtn = document.querySelectorAll('.loactionsChoice .btn');
	allbtn.forEach((btn) => {
		if (btn.classList.contains('btnActive')) {
			btn.classList.toggle('btnActive-dark');
		}
		btn.classList.toggle('btn-dark');
	});

	const allSections = document.querySelectorAll('.weather-style');

	allSections.forEach((sec) => {
		sec.classList.toggle('weather-style-dark');
	});

	document.querySelector('.navbar-brand').classList.toggle('navbar-brand-dark');
	document.querySelector('.darkmode-toggler').classList.toggle('darkmode-toggler-dark');
	document.querySelector('input').classList.toggle('input-dark');
	document.querySelector('.add-city-btn').classList.toggle('add-city-btn-dark');
}

//adding new city
let addCityBtn = document.querySelector('.add-city-btn');

addCityBtn.addEventListener('click', () => {
	let inputValue = document.querySelector('input').value;
	if (inputValue == '') {
		alert('Enter Location Name');
	} else {
		let cityUrl = `https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=82d3487b13b54cddbda225f84f863798`;
		getCityLatLang(cityUrl, inputValue);
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
		}
	} catch (e) {
		// alert('Some thing went wrong, Try another name, for better result you can use country name');
		alert(e.message);
	}
}

let LocationsObj = new Locations();

let clearAll = document.querySelector('.clear-all-btn');

clearAll.addEventListener('click', () => {
	clearAllLocations();
});

async function clearAllLocations() {
	if (confirm('Clear All?')) {
		let clear = await LocationsObj.clear();
		clear.onsuccess = () => {
			document.querySelector('.loactionsChoice').innerHTML = '';
			if (darkmodeStorge == 'true' || darkMoodStatus == true) {
				//if darkmood is on add dark my location btn
				document.querySelector('.loactionsChoice').innerHTML = `<div>
			<button class="btn btn-dark  my-2 mx-2 btnActive btnActive-dark" data-latitude="" data-longitude="" type="button">My Location</button>
			  </div>`;
			} else {
				//if darkmood is off add normal my location btn
				document.querySelector('.loactionsChoice').innerHTML = ` <div>
				<button class="btn my-2 mx-2 btnActive" data-latitude="" data-longitude="" type="button">My Location</button>
			  </div>`;
			}
		};

		clear.onerror = () => {
			alert('Something Went Wrong While Deleting All Locations!!!');
		};
	} else {
		return false;
	}
}
async function addLocation(loc, lat, long) {
	let add = await LocationsObj.add({ location: loc, latitude: lat, longitude: long });

	add.onsuccess = () => {
		getAllLocations();
	};
}
async function getAllLocations() {
	let request = await LocationsObj.getAll();
	let locationArray = [];
	request.onsuccess = () => {
		let cursor = request.result;
		if (cursor) {
			locationArray.push(cursor.value);
			cursor.continue();
		} else {
			displayLocation(locationArray);
		}
	};
}
function displayLocation(locationArray) {
	let locationDiv = document.querySelector('.loactionsChoice');
	locationDiv.innerHTML = '';

	if (darkmodeStorge == 'true' || darkMoodStatus == true) {
		//if darkmood is on add dark my location btn
		locationDiv.innerHTML = `<div>
	<button class="btn btn-dark  my-2 mx-2 btnActive btnActive-dark" data-latitude="" data-longitude="" type="button">My Location</button>
 	 </div>`;
	} else {
		//if darkmood is off add normal my location btn
		locationDiv.innerHTML = `<div>
	<button class="btn my-2 mx-2 btnActive" data-latitude="" data-longitude="" type="button">My Location</button>
  	</div>`;
	}
	for (let i = 0; i < locationArray.length; i++) {
		let newDiv = document.createElement('div');
		newDiv.id = 'location-' + locationArray[i].id;

		let lat = locationArray[i].latitude;
		let long = locationArray[i].longitude;
		let locationName = locationArray[i].location;
		let id = locationArray[i].id;

		if (darkmodeStorge == 'true' || darkMoodStatus == true) {
			//if darkmood is on add dark btn
			newDiv.innerHTML = `
			<button class="btn btnStyle btn-dark my-2 mx-2"  data-latitude=${lat} data-longitude=${long} type="button">${locationName}<span class="location-span"><i class="fa fa-times-circle deleteLoc" data-id=${id} ></i></span></button>
			`;
		} else {
			//if darkmood is off add normal btn
			newDiv.innerHTML = `
			<button class="btn btnStyle my-2 mx-2"  data-latitude=${lat} data-longitude=${long} type="button">${locationName}<span class="location-span"><i class="fa fa-times-circle deleteLoc" data-id=${id} ></i></span></button>
			`;
		}

		locationDiv.append(newDiv);
	}
}

//deleting location
document.addEventListener('click', (e) => {
	let { target } = e;
	if (target && target.classList.contains('deleteLoc')) {
		let loacId = parseInt(target.dataset.id);
		console.log(loacId);

		deleteLocation(loacId);
	}
});

async function deleteLocation(loacId) {
	if (confirm('Confirm Deleting?')) {
		let deleteRequest = await LocationsObj.delete(loacId);

		deleteRequest.onsuccess = () => {
			document.getElementById('location-' + loacId).remove();
		};
		deleteRequest.onerror = () => {
			alert('Something Went Wrong While Deleting!!!');
		};
	} else {
		return false;
	}
}
