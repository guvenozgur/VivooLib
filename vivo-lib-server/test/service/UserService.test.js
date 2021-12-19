const assert = require('assert');
const sinon = require("sinon");
const userService = require('../../src/service/UserService');
const config = require('../../src/config/Config');

const mongoose = require('mongoose');

afterEach(() => {
    sinon.verifyAndRestore();
});


describe('As a user:', () => {
    let mockNickname = 'test';
    let mockResult = {nickname: mockNickname, name: mockNickname, surname: mockNickname};
    before(function (done) {
        mongoose.connect(config.DATABASE_URL_TEST);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });

    it('save', async () => {
        await userService().createUser('test', 'test', 'test');
        assert.ok(true);
    });

    it('getUser', async () => {

        let {nickname, name, surname} = await userService().getUserInfo(mockNickname);

        assert.deepEqual({nickname, name, surname}, mockResult);
    });

    it('listAllUsers', async () => {

        let listResult = [mockResult];

        let result = await userService().listAllUsers();

        assert.deepEqual(result, listResult);
    });

    it('deleteAllUsers', async () => {
        await userService().deleteAllUsers();
        assert.ok(true);
    });
    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});
