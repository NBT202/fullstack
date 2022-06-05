import userService from '../services/userService'
import bcrypt from 'bcryptjs';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input pramater'
        })
    }
    let userData = await userService.handleUserLogin(email, password);

    console.log(userData);
    //check email exist
    //compare password
    //return userInfor
    //access_token: JWT json web token

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    })

}

let handleGetUser = async (req, res) => {
    let id = req.query.id;
    console.log(id);
    let users = await userService.getUser(id);
    console.log(users);
    if (!id) {
        return res.status(200).json(
            {
                errCode: 1,
                message: 'Missing required parameters',
                user: [],
            }
        );
    }
    return res.status(200).json(
        {
            errCode: 0,
            message: 'ok',
            user: users,
        }
    );

}
let hashUserPassword = async (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
        // Store hash in your password DB.
    })

}
let handleCreatteNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message)
}
// edit-user api
let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!!!'
        })

    }
    let message = await userService.deletUser(req.body.id)
    return res.status(200).json(message)
}
//api getallcode
let getAllCode = async (req, res) => {
    try {

        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data)

    } catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }

}
module.exports = {
    handleLogin: handleLogin,
    handleGetUser: handleGetUser,
    handleCreatteNewUser: handleCreatteNewUser,
    hashUserPassword: hashUserPassword,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}