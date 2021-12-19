const assert = require('assert');
const sinon = require('sinon');
const Promise = require('bluebird');
const redis = Promise.promisifyAll(require('redis'));



describe('Cache', ()=>{

    const bookId = 'test';
    const book = '{"title":"test","id":"test"}';
    const redisClient = {
        'hmgetAsync': () => {
            return book
        }
    }
    const redisClientStub = sinon.stub(redis,
        "createClient").callsFake(() => {return redisClient});

    const helper = require('../../src/cache/Helper');

    it('get book', async ()=>{
        let res = await helper.getBook(bookId);
        assert.deepEqual(res, JSON.parse(book));
    });


})