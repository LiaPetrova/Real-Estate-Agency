const RealEstate = require("../models/RealEstate");

async function getLastThree () {
    return RealEstate.find({}).sort({ 'createdAt': -1}).limit(3).lean();
}

async function getAll () {
    return RealEstate.find({}).lean();
}

async function getById (id) {
    return RealEstate.findById(id).lean().populate('renters');
}

async function getByIdRaw (id) {
    return RealEstate.findById(id);

}

async function rent(userId, realEstateId) {
    const realEstate = await RealEstate.findById(realEstateId);
    realEstate.renters.push(userId);
    realEstate.availablePieces--;

    return realEstate.save();
}

async function createRealEstate (realEstate) {
    return RealEstate.create({
        name: realEstate.name,
        type: realEstate.type,
        year: Number(realEstate.year),
        city: realEstate.city,
        imageUrl: realEstate.imageUrl,
        description: realEstate.description,
        availablePieces: Number(realEstate.availablePieces),
        owner: realEstate.owner
    });
}

async function edit (realEstateId, data) {
    const realEstate = await RealEstate.findById(realEstateId);

    realEstate.name = data.name;
    realEstate.type = data.type;
    realEstate.year = Number(data.year);
    realEstate.city = data.city;
    realEstate.imageUrl = data.imageUrl;
    realEstate.description = data.description;
    realEstate.availablePieces = Number(data.availablePieces);

   return realEstate.save();
}

async function deleteRealEstate (realEstateId) {
    return RealEstate.findByIdAndDelete(realEstateId);
}

async function searchRealEstate (search) {
    
    return RealEstate.find({ 'type': new RegExp(search, 'i')}).lean();
}

module.exports = {
    getLastThree,
    getAll,
    getById,
    getByIdRaw,
    createRealEstate,
    rent,
    edit,
    deleteRealEstate,
    searchRealEstate
}