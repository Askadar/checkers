export default class Timer {
	constructor(callback) {
		this.reset();
		this.callback = callback;
	}
	set(time) {
		this.time = time;
	}
	start() {
		this.lastTS = Date.now();
		this.ticking = setInterval(this.tick.bind(this), 50);
	}
	pause() {
		this.ticking = clearInterval(this.ticking);
		return this.elapsed;
	}
	reset() {
		this.elapsed = 0;
		this.ticking = clearInterval(this.ticking);
	}
	tick() {
		if(this.ticking) {
			const now = Date.now();
			this.elapsed += (now - this.lastTS) / 1000;
			if(this.elapsed > this.time)
				this.finished();
			this.lastTS = now;
		}
		else
			console.warn('tick() method called while timer stopped');
	}
	finished() {
		console.log('timer finished, exact time is: ', this.elapsed);
		if(this.callback) {
			const { elapsed, time } = this;
			this.callback({ elapsed, time });
		}
		this.reset();
	}
}
