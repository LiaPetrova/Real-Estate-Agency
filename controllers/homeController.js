const homeController = require('express').Router();
const { getLastThree } = require('../services/realEstateService');

homeController.get('/', async (req, res) => {
    const realEstates = await getLastThree();
    res.render('home', {
        title: 'Home',
        realEstates
    });
});

module.exports = homeController;