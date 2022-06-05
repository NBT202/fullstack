import db from '../models/index'
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.passworld);
            await db.User.create(
                {
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                    positionId: data.positionId


                }
            )
            resolve('create a new user success!!!');
        } catch (e) {
            reject(e);
        }
    })
}

//hashpassword
let hashUserPassword = (password) => {
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

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({ raw: true })
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })

}
let getUserinfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }, raw: true
            })
            if (user) {
                resolve(user)
            } else {
                resolve({})
            }

        } catch (e) {
            reject(e);

        }
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne(
                {
                    where: { id: data.id }
                })
            console.log(user);
            if (user) {
                await db.User.update({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                }, { where: { id: data.id } })
                let allUser = await db.User.findAll();
                resolve(allUser);

            } else {
                resolve();
            }
        } catch (e) {
            reject(e);

        }
    })

}
let deleteUserById = (id) => {

    return new Promise(async (resolve, reject) => {
        try {
            let userId = id;
            await db.User.destroy({
                where: { id: userId }
            })
            resolve()
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserinfoById: getUserinfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
} 