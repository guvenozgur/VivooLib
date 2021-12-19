'use strict'

const {routeMappings} = require('../config/Mappings');
const RESTStatus = require('../config/RESTStatusCodes');
const libService = require('../service/LibService');

module.exports = (app)=>{


    app.get(routeMappings.GET_BOOK_INFO, async (req, res)=>{
        try{
            let book = await libService().getBook(req.params.bookId);
            let {title, authors, categories, averageRating,language} = book;
            res.status(RESTStatus.OK.code).json({title, authors, categories, averageRating,language});
        }catch (err){
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });

    app.get(routeMappings.GET_ALL_BOOKS, async (req, res)=>{
        try{
            res.status(RESTStatus.OK.code).json(await libService().getAllBooks());
        }catch (err){
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });

    app.post(routeMappings.LEND_BOOK, async (req, res)=>{
        try{
            await libService().lendBook(req.body.bookId, req.loginUser.nickname);
            res.status(RESTStatus.OK.code).send();
        }catch (err){
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(err.message);
        }
    });

    app.post(routeMappings.RETURN_BOOK, async (req, res)=>{
        try{
            await libService().returnBook(req.body.bookId, req.loginUser.nickname, req.body.rating);
            res.status(RESTStatus.OK.code).send();
        }catch (err){
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });

    app.get(routeMappings.SEARCH_BOOK, async (req, res)=>{
        try{
            let book = await libService().searchBook(req.params.bookLabel);
            res.status(RESTStatus.OK.code).json(book);
        }catch (err){
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });

    app.get(routeMappings.DELETE_ALL_BOOKS, async (req, res)=>{
        try{
            await libService().deleteAllBooks();
            res.status(RESTStatus.OK.code).send();
        }catch (err){
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    })

}


