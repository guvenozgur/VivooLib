'use strict'

const {routeMappings} = require('../config/Mappings');
const {body, validationResult, check} = require('express-validator');
const RESTStatus = require('../config/RESTStatusCodes');
const userService = require('../service/UserService');
const libService = require('../service/LibService');
const jwt = require('jsonwebtoken');
const config = require('../config/Config');
const paths = require('../config/Mappings');


module.exports = (app) => {

    app.use(async function (req, res, next) {
        try{
            let notAuthorizedPaths = [
                paths.routeMappings.LOGIN,
                paths.routeMappings.CREATE_USER,
                paths.routeMappings.DELETE_ALL_BOOKS,
                paths.routeMappings.DELETE_ALL_USERS
            ]
            if(!(notAuthorizedPaths.includes(req.url))){
                const authHeader = req.headers.cookie;
                const token = authHeader && authHeader.split('=')[1];
                let identityResponse = await _auth(token);
                let identity = identityResponse.split('-');
                let {userId} =await userService().getUserInfo(identity[0]);

                req.loginUser = {
                    nickname: identity[0],
                    name: identity[1],
                    userId
                }

            }
            next();
        }catch (err){
            res.status(RESTStatus.UNAUTHORIZED.code).send(RESTStatus.UNAUTHORIZED.msg);
        }

    })


    app.post(routeMappings.CREATE_USER, async (req, res) => {
        try {
            await userService().createUser(req.body.firstname, req.body.surname, req.body.nickname);
            res.status(RESTStatus.OK.code).send();
        } catch (err) {
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });

    app.get(routeMappings.DELETE_ALL_USERS, async (req, res) => {
        try {
            await userService().deleteAllUsers();
            res.status(RESTStatus.OK.code).send();
        } catch (err) {
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });

    app.get(routeMappings.GET_USER_INFO, async (req, res) => {
        try {
            let userInfo = await userService().getUserInfo(req.params.nickname);
            let lendBooks = await libService().getAllBooksByUserId(req.params.nickname );
            res.status(RESTStatus.OK.code).json({userInfo, lendBooks});
        } catch (err) {
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });

    app.post(routeMappings.LOGIN, async (req, res) => {
        try {
            let nickName = req.body.nickname;
            let {name} = await userService().getUserInfo(req.body.nickname);
            let token = generateToken(nickName+'-'+name);
            res.cookie(config.LOGIN_TICKET, token, {expires: new Date(Date.now() + 90000)});
            res.status(RESTStatus.OK.code).send();
        } catch (err) {
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });

    app.get(routeMappings.LIST_ALL_USERS, async (req, res) => {
        try {
            res.status(RESTStatus.OK.code).json(await userService().listAllUsers());
        } catch (err) {
            res.status(RESTStatus.INTERNAL_SERVER_ERROR.code).send(RESTStatus.INTERNAL_SERVER_ERROR.msg);
        }
    });
}

function generateToken(nickname) {
    const token = jwt.sign(nickname, config.ACCESS_TOKEN_SECRET);
    return token;
}

async function _auth(token){
    return new Promise((resolve, reject)=>{
        if (token == null) reject(`Token can not be null..`);

        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user)=>{
            if(err) reject(`Token is not valid..`);
            resolve(user);
        })
    })
}