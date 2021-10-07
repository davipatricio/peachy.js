'use strict';

class LimitedMap extends Map {
	constructor (limit) {
		super();
		this.limit = limit;
	}

	set (key, value) {
		if (this.limit <= 0) return;
		if (this.size >= this.limit) {
			this.delete(this.keys().next().value);
		}

		super.set(key, value);
	}

	keyArray () {
		return [...this.keys()];
	}

	valueArray () {
		return [...this.values()];
	}

	random () {
		return this.valueArray()[Math.floor(Math.random() * this.size)];
	}
}

module.exports = LimitedMap;
