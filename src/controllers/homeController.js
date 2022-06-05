
import { all } from 'express/lib/application';
import db from '../models/index'
import CRUDService from '../services/CRUDService'
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll({ raw: true });
        return res.render('homepage.ejs',
            { data: JSON.stringify(data) });

    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {

    return res.render('test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('test/crud.ejs');
}
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    console.log(message);
    return res.send("post curd from sever")
}
let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('test/displayCRUD.ejs', {
        dataTable: data
    });
}
let editCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {

        let userData = await CRUDService.getUserinfoById(userId);
        //check userData no found
        return res.render('test/editCRUD.ejs', {
            user: userData
        });
    } else {
        return res.send("Edit from server with controller is not success!!!");
    }
}
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    return res.render('test/displayCRUD.ejs', {
        dataTable: allUser
    });

}
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    console.log(".>>>>", id);
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('Delete the user succeed!!');

    } else {
        return res.send('User not found');

    }

}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}
