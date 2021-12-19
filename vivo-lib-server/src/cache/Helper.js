const Promise = require('bluebird');
const redis = Promise.promisifyAll(require('redis'));
const config = require('../config/Config');
const redisClient = redis.createClient({host: config.REDIS_HOST, port: config.REDIS_PORT});

const self = {

    async getBook(bookId){
        let book = await redisClient.hmgetAsync(config.CACHE_BOOK_PREFIX, bookId);
        if(book && book[0]){
            return JSON.parse(book);
        }
        return null;
    },
    async upsertBook(book){

        await redisClient.hmsetAsync(config.CACHE_BOOK_PREFIX, book.id, JSON.stringify(book));
    },

    async clearCache() {
        await redisClient.del(config.CACHE_BOOK_PREFIX)
    },

}

module.exports = self;