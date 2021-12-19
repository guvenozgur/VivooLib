'use strict'

module.exports.routeMappings = {
    LIST_ALL_USERS: '/users',  // GET
    GET_USER_INFO: '/users/:nickname', // GET
    CREATE_USER: '/users',    // POST
    GET_ALL_BOOKS: '/books',  // GET
    SEARCH_BOOK: '/lib/searchBook/:bookLabel',
    GET_BOOK_INFO: '/books/:bookId', // GET
    CREATE_BOOK: '/books', // POST
    LEND_BOOK: '/users/:userId/lend/:bookId',  // POST
    RETURN_BOOK: '/users/:userId/return/:bookId', // POST
    LOGIN: '/login', // POST
    DELETE_ALL_BOOKS: '/lib/deleteAll', // GET
    DELETE_ALL_USERS: '/user/deleteAll' // GET

}