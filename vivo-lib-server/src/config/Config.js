const config = {
    SESSION_KEY:'key',
    SERVER_PORT: 4000,
    REDIS_HOST: 'localhost',
    REDIS_PORT: 6379,
    REDIS_REQ_TIMEOUT: 5000,
    DATABASE_URL: 'mongodb://localhost:27017/vivooLib',
    DATABASE_URL_TEST: 'mongodb://localhost:27017/vivooLibTest',
    ACCESS_TOKEN_SECRET: '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611',
    JWT_EXPIRE_TIME: 1800,
    CACHE_BOOK_PREFIX: 'CACHED_BOOK',
    GOOGLE_API_KEY: 'ENTER A KEY',
    GOOGLE_URL: 'https://www.googleapis.com/books/v1/volumes?maxResults=3&q=intitle:',
    USER_ID_LEN: 6,
    LOGIN_TICKET: 'vivooTicket'
}

module.exports = config;