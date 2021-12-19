const https = require('https');
const config = require('../config/Config');
const bookStatus = require('../config/BookStatus');

module.exports = ()=>{

    const googleAPIs = {
        getBook: async (bookName)=> {
            let googleBooks = await getReq(`${config.GOOGLE_URL}${bookName}&key=${config.GOOGLE_API_KEY}`);
            googleBooks = googleBooks.items.map((item)=>{
                let book = {
                    id:item.id,
                    title:item.volumeInfo.title,
                    authors:item.volumeInfo.authors,
                    publisher:item.volumeInfo.publisher,
                    publishedDate: item.volumeInfo.publishedDate,
                    pageCount: item.volumeInfo.pageCount,
                    categories:item.volumeInfo.categories,
                    averageRating:item.volumeInfo.averageRating === undefined ?
                        0: item.volumeInfo.averageRating,
                    ratingCount: item.volumeInfo.ratingsCount === undefined ?
                        0 : item.volumeInfo.ratingsCount,
                    language: item.volumeInfo.language,
                    status:bookStatus.NOT_IN_LIBRARY,
                }
                return book;
            });

            return googleBooks;
        }
    }

    return googleAPIs;
}

async function getReq(url){
    return new Promise((resolve, reject)=>{
        https.get(url, (resp    )=>{
            let books = '';

            resp.on('data', (chunk) => {
                books += chunk;
            });

            resp.on('end', () => {
                resolve(JSON.parse(books));
            });
        })
    })
}