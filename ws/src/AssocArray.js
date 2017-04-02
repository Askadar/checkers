// module.exports =
class AssocArray extends Array {
	// this one depends on overriden toString method to identify entries, that should be pretty obvious, though
	constructor() {
		super();
	}
	static get [Symbol.species]() { return Array; }
	create(entry) {
		if (!this[entry]) {
			const index = this.push(entry);
			this[entry] = entry;
			return index;
		}
		throw new Error('Such entry already exist');
	}
	destroy(id) {
		switch (typeof id) {
		case 'number':
			if (id < this.length && id >= 0) {
				let removed = this.splice(id, 1)[0];
				delete this[removed];
				return removed;
			}
			throw new Error('Index out of bounds');
		case 'string':
			const index = this.findIndex(entry => entry === id);
			if(index >= 0) {
				delete this[id];
				return this.splice(index, 1);
			}
			throw new Error('Could not find provided key');
		}
		return null;
	}
}

class Rooms extends AssocArray {
	constructor() {
		super();
		this.counter = '36237';
	}
	create(entry) {
		if (!this[entry]) {
			this.push(entry);
			this[entry] = entry;
			return 'r' + (this.counter++);
		}
		throw new Error('Such room already exist');
	}
	toTransferenceProtocol() {
		console.log(this);
		const arr = this.filter(a => !a.closed).map(({ players, id, type, time }) => {return { players, roomId: id, type, time };});
		return arr.length === 0 ? [] : arr;
	}
}

module.exports = { Rooms, AssocArray };
