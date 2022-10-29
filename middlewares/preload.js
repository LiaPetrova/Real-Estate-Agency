const { getById, getByIdRaw } = require("../services/realEstateService"); //TODO

module.exports = (lean) => async (req, res, next) => {
    if (lean) {
        res.locals.realEstate = await getById(req.params.id);
    } else {
        res.locals.realEstate = await getByIdRaw(req.params.id);
    }

    next();
};