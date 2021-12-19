const user = require('../schema/User');
const config = require('../config/Config');

function userMapper(users) {
    let userList = users.map((item) => {
        let {nickname, name, surname} = item;
        return {nickname, name, surname};
    })

    return userList;
}


module.exports = () => {

    const self = {
        createUser: async (firstname, surname, nickname) => {
            const registeredUser = new user({
                userId: createRndId(config.USER_ID_LEN),
                nickname: nickname,
                name: firstname,
                surname: surname
            });
            await registeredUser.save();
        },
        getUserInfo: async (nick) => {
            const userInfo = await user.find({nickname: nick});
            let {nickname, name, surname, userId} = userInfo[0];
            return {nickname, name, surname, userId};
        },
        listAllUsers: async () => {
            const userList = await user.find();
            return userMapper(userList);
        },
        deleteAllUsers: async ()=>{
            const users = await user.find();
            users.forEach((user) => {
                user.remove();
            })
        }
    }
    return self;
}

function createRndId(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}