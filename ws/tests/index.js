const test = require('tape');
const { playHandler, enterHandler, moveHandler } = require('../src/handlers');
const AssocArray = require('../src/AssocArray');
const Room = require('../src/Room');
class Emitter {
	emit(message, data) {
		this.result = { type: message, data };
		this.room = null; // so it'l pretend to be freshsocket
		this.destination = null;
	}
	join(id) {
		// magic
	}
	to(id) {
		this.destination = '42';
		return this;
	}
	get broadcast() { return this;}
}

class ServerStub {
	constructor(data = { type: 'Zag', time: '30' }) {
		this.data = data;
		this.store = new AssocArray();
		this.emitter = new Emitter();
	}
}
test('[PHT] Player Handler Tests', finalAssert => {
	// finalAssert.plan(3);
	finalAssert.test('[PHT]	-- creates first room when store is empty', assert => {
		const stub = new ServerStub();
		assert.plan(1);

		playHandler(stub.data, stub.store, stub.emitter);
		assert.deepEqual(stub.emitter.result, { type: 'roomCreated', data: 'r36237' });

		// assert.end();
	});

	finalAssert.test('[PHT] -- creates second room once first is filled', assert => {
		const stub = new ServerStub();
		assert.plan(2);
		playHandler(stub.data, stub.store, stub.emitter);
		playHandler(stub.data, stub.store, stub.emitter);
		assert.deepEqual(stub.emitter.result, { type: 'roomCreated', data: 'r36237' }, 'room created');
		stub.store.r36237.join(stub.emitter);
		stub.store.r36237.join(stub.emitter);
		// assert.equal(stub.emitter.result, 'roomCreated : r36237', 'room created');
		playHandler(stub.data, stub.store, stub.emitter);
		assert.deepEqual(stub.emitter.result, { type: 'roomCreated', data: 'r36238' }, 'another room created after first been filled');

		// assert.end();
	});

	finalAssert.test('[PHT] -- creates rooms with different settings', assert => {
		const stub = new ServerStub();
		assert.plan(2);
		playHandler(stub.data, stub.store, stub.emitter);
		assert.deepEqual(stub.emitter.result, { type: 'roomCreated', data: 'r36237' }, 'should create first room');
		playHandler({ ...stub.data, type: 'NotZag' }, stub.store, stub.emitter);
		assert.deepEqual(stub.emitter.result, { type: 'roomCreated', data: 'r36238' }, 'should create first room');

		// assert.end();
	});
	finalAssert.end();
});

test('[EHT] Enter Handler Tests', assert => {
	const stub = new ServerStub();
	stub.store.create(new Room(null, stub.data, stub.store.counter));

	enterHandler({ id: 'r' + (stub.store.counter - 1) }, stub.store, stub.emitter);
	assert.notDeepEqual(stub.emitter.result, { type: 'err', data: { type: 'No room with such id' } }, 'should not throw error if we have room with such id');
	enterHandler({ id: '-58458' }, stub.store, stub.emitter);
	assert.deepEqual(stub.emitter.result, { type: 'wrongRoom', data: undefined }, 'should throw error because we do not have such room');
	assert.equal(stub.store.r36237.id, 'r36237', 'should create room with correct id');

	assert.end();
});

test('[MHT] Move Handler Tests', assert => {
	const data = { from: '5-C', to: '1-A' };
	const stub = new ServerStub(data);
	assert.plan(2);
	const pushMove = function pushMove() { return 'mock';};
	stub.emitter.room = { pushMove };
	// assert.equal(stub.emitter.to, null);
	assert.pass();
	moveHandler(stub.data, stub.store, stub.emitter);
	assert.deepEqual(stub.emitter.result, { type: 'move', data: { from: '5-C', to: '1-A' } });
});
