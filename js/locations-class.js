class Locations {
	dbVersion = 1;
	dbName = 'myDataBase';

	connect() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.dbVersion);

			request.onupgradeneeded = () => {
				let db = request.result;
				if (!db.objectStoreNames.contains('locations')) {
					db.createObjectStore('locations', { keyPath: 'id', autoIncrement: true });
				}
			};

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error.message);
			request.onblocked = () => console.log('Storge is blocked');
		});
	}

	async storeAccess(type) {
		let connect = await this.connect();
		let tx = connect.transaction('locations', type);
		return tx.objectStore('locations');
	}

	async add(location) {
		let store = await this.storeAccess('readwrite');
		return store.put(location);
	}

	async getAll() {
		let locations = await this.storeAccess('readonly');
		return locations.openCursor(null, 'next');
	}
	async delete(locationId) {
		let store = await this.storeAccess('readwrite');
		return store.delete(locationId);
	}
	async clear() {
		let locations = await this.storeAccess('readwrite');
		return locations.clear();
	}
}
