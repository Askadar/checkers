export default class Timer {
	constructor() {
		this.reset();
	}
	set(time) {
		this.time = time;
	}
	start() {
		this.lastTS = Date.now();
		this.ticking = setInterval(this.tick, 200);
	}
	pause() {
		this.ticking = clearInterval(this.ticking);
	}
	reset() {
		this.elapsed = 0;
		this.ticking = clearInterval(this.ticking);
	}
	tick() {
		if(this.ticking) {
			const now = Date.now();
			this.elapsed += (this.lastTS - now) / 1000;
			if(this.elapsed > this.time)
				this.finished();
			this.lastTS = now;
		}
		else
			console.warn('tick() method called while timer stopped');
	}
	finished() {

	}
	// toString() {
	// }
}
