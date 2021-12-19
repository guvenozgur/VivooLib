'use strict'

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');


const userController = require('./controller/UserController');
const libController = require('./controller/LibController');

const config = require('./config/Config');
const RESTStatus = require('./config/RESTStatusCodes');


const PORT = process.env.PORT || config.SERVER_PORT;

process.on('uncaughtException', (err) => {
    console.error('>>> Unhandled Exception', err)
});

process.on('uncaughtRejection', (err, promise) => {
    console.error('>>> Unhandled Rejection', err)
});

(async function initialize (){

    const app = express();
    await initMongo(app);
    //app.use(helmet());
    app.use((err, req, res, next) => {
        res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
    })
    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));


    userController(app);
    libController(app);

    app.listen(PORT, () => {
        console.log(`Server listening on Port ${PORT}`)
    })

}());


async function initMongo(app){
    return new Promise((resolve, reject)=>{
        mongoose.connect(config.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = mongoose.connection;
        app.on('close', () => {
            db.disconnect()
        })
        db.on('error', (err) => {
            console.log(err);
            reject();
        })
        db.on('open', () => {
            console.log('Mongo db connected');
            resolve();
        })

    })
};




