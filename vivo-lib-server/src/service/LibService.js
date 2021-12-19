const book = require('../schema/Book');
const lend = require('../schema/Lend');
const cache = require('../cache/Helper');
const bookStatus = require('../config/BookStatus');
const googleAPIs = require('./GoogleAPIService');


async function updateBookStatus(selectedBook, newStat) {
    let updatedBook = await book.findOneAndUpdate({bookId: selectedBook.id}, {status: newStat}, {
        returnOriginal: false
    });
    let updateRes = await updatedBook.save()
    await cache.upsertBook(updateRes);
}

function bookMapper(books) {
    let bookList = books.map((item) => {
        let {id, title, authors, categories, averageRating, language, status} = item;
        return {id, title, authors, categories, averageRating, language, status};
    })

    return bookList;
}


module.exports = () => {

    const self = {

        getAllBooks: async () => {
            try {
                const books = await book.find();
                return bookMapper(books);
            } catch (err) {
                throw new Error('Book service unavailable.')
            }

        },
        searchBook: async (keyWorld) => {
            try {
                let books = await book.find({title: {$regex: keyWorld, $options: 'i'}});
                if (!books || books.length === 0) {
                    let googleBooks = await googleAPIs().getBook(keyWorld);
                    for (const item of googleBooks) {
                        item.status = bookStatus.AVAILABLE;
                        let registeredBook = new book(item);
                        books.push(await registeredBook.save());
                    }
                }
                return bookMapper(books);
            } catch (err) {
                throw new Error('Book search service unavailable.')
            }
        },
        getBook: async (bookId) => {
            try {
                let cachedBook = await cache.getBook(bookId);
                if (cachedBook) {
                    return cachedBook;
                }
                const requestedBook = await book.find({id: bookId});
                await cache.upsertBook(bookMapper(requestedBook)[0]);
                return bookMapper(requestedBook)[0];
            } catch (err) {
                throw new Error('Book search service unavailable.')
            }
        },
        lendBook: async (bookId, userId) => {
            try {
                const selectedBook = await self.getBook(bookId);
                if (selectedBook.status === bookStatus.AVAILABLE) {
                    await updateBookStatus(selectedBook, bookStatus.LEND);
                    const lendBook = new lend({
                        bookId: bookId,
                        userId: userId,
                        bookStatus: bookStatus.LEND,
                        lendDate: new Date().toLocaleString(),
                        isReturned: false
                    });
                    await lendBook.save();
                }else{
                    throw new Error('Book is not available.')
                }



            } catch (err) {
                throw new Error('Book search service unavailable.')
            }
        },
        returnBook: async (bookId, userId, rating) => {
            try {
                const selectedBook = await self.getBook(bookId);
                if (rating && parseInt(rating) > 0) {
                    selectedBook.ratingCount++;
                    selectedBook.averageRating = (selectedBook.averageRating + parseInt(rating)) / selectedBook.ratingCount;
                }

                if (selectedBook.status === bookStatus.LEND) {
                    await updateBookStatus(selectedBook, bookStatus.AVAILABLE);
                } else {
                    throw new Error('Book was not reserved.');
                }
                await lend.findOneAndUpdate({bookId: bookId, userId: userId, isReturned: false},
                    {
                        bookStatus: bookStatus.AVAILABLE,
                        returnDate: new Date().toLocaleString(),
                        isReturned: true,
                        rating: rating
                    })

            } catch (err) {
                throw new Error('Book return service unavailable.')
            }
        },

        deleteAllBooks: async () => {
            const books = await book.find();
            books.forEach((book) => {
                book.remove();
            })
            const lends = await lend.find();
            lends.forEach((lend) => {
                lend.remove();
            })

            await cache.clearCache();
        },
        getAllBooksByUserId: async (userId) => {
            try {
                const lends = await lend.find({userId: userId});
                let bookInfo = [];
                for(let key in lends){
                    let books = await book.find({id: lends[key].bookId});
                    let {title} = books[0];
                    bookInfo.push({
                        isReturned: lends[key].isReturned,
                        title
                    });
                }

                return bookInfo;
            } catch (err) {
                throw new Error('Book service unavailable.')
            }

        }


    }
    return self;
}