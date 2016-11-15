module.exports = class AssocArray extends Array {
	// this one depends on overriden toString method to identify entries, that should be pretty obvious, though
	constructor() {
		super();
		this.counter = '36237';
	}
	static get [Symbol.species]() { return Array; }
	create(entry) {
		if (!this[entry]) {
			this.push(entry);
			this[entry] = entry;
			return 'r' + (this.counter++);
		}
		else
      throw new Error('Such room already exist');
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
};
