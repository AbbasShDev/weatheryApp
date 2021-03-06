class Storage {
	static saveLocations(locations) {
		localStorage.setItem('locations', JSON.stringify(locations));
	}
	static getLocations() {
		if (localStorage.getItem('locations')) {
			return JSON.parse(localStorage.getItem('locations'));
		} else {
			return false;
		}
	}
	static deleteLocation(id) {
		let locations = JSON.parse(localStorage.getItem('locations'));
		locations = locations.filter((location) => location.id != id);
		localStorage.setItem('locations', JSON.stringify(locations));
	}
	static clearAllLocations() {
		localStorage.setItem('locations', null);
	}
}
