const authController = require("../controllers/authController");
const defaultController = require("../controllers/defaultController");
const homeController = require("../controllers/homeController");
const realEstateController = require("../controllers/realEstateController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/realEstate', realEstateController);
    app.all('*', defaultController);
};