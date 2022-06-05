import { reject } from 'bcrypt/promises';
import bcrypt from 'bcryptjs';
import raw from 'body-parser/lib/types/raw';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);


let handleUserLogin = (userEmail, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(userEmail);
            console.log(isExist);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: userEmail },
                    raw: true,
                })
                //check user 
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3
                        userData.errMessage = 'Wrong password';
                    }

                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }

            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Plz try other your email!!!`;

            }
            resolve(userData);

        } catch (e) {
            reject(e);

        }
        //user already exist
        //compare password
    }        // bcrypt.compareSync('not_bacon', hash);
    )
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail || null }
            });
            if (user) {
                console.log(user);
                resolve(true)
            } else {
                resolve(false)

            }
            resolve(userData);

        } catch (e) {
            reject(e);
        }
    })
}

// api get user
let getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = '';
            if (userId === 'All') {
                user = await db.User.findAll(
                    {
                        attributes: {
                            exclude: 'password'
                        }
                    }
                );
                // resolve(user)
            }
            if (userId && userId !== 'All') {
                user = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: 'password'
                    }
                })
            }
            resolve(user)
        } catch (error) {
            reject(error)
        }

    })


}
let createNewUser = (data) => {
    //check email is exist
    return new Promise(async (resolve, reject) => {
        try {

            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used, Plz try another email!!',
                })
            } else {

                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
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
                resolve({
                    errCode: 0,
                    message: "create user success"
                });
            }
        } catch (e) {
            reject(e);
        }

    })
}
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
let deletUser = (userId) => {
    console.log('>>>Check id user: ', userId);
    return new Promise(async (resolve, reject) => {
        let dluser = await db.User.findOne({
            where: { id: userId }
        })
        if (!dluser) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist!!!`
            })

        }
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            message: `The user is delete`
        })

    })
}
let updateUserData = (data) => {
    console.log(">>>>id from reacjs: ", data.id);
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne(
                {
                    where: { id: data.id }
                })
            if (user) {
                await db.User.update({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                }, { where: { id: data.id } })
                let user = await db.User.findOne({
                    where: { id: data.id }
                })
                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!!!'
                });

            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Update th user not found!!!`
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeInput) {
                let res = {};
                let allcode = await db.allcodes.findAll({
                    where: { type: typeInput }
                });
                console.log('>>>check allcode:', allcode);
                res.errCode = 0;
                res.data = allcode
                resolve(res);

            } else {
                resolve(
                    {
                        errCode: 1,
                        errMessage: 'Missing required parameters!!!'
                    }

                )

            }


        } catch (error) {
            reject(error)
        }
    })


}
module.exports = {
    handleUserLogin: handleUserLogin,
    getUser: getUser,
    createNewUser: createNewUser,
    deletUser: deletUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService
}