import express from "express";
import { Route } from "express";
import { route } from "express/lib/router";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController"
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD)
    router.get('/delete-crud', homeController.deleteCRUD);
    /////////////////////////////////////////////
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-user', userController.handleGetUser);
    router.post('/api/create-new-user', userController.handleCreatteNewUser)
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser)
    //////
    router.get('/api/allcode', userController.getAllCode)
    return app.use("/", router);
}

module.exports = initWebRoutes;