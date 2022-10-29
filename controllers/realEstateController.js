const realEstateController = require('express').Router();

const { hasUser, isOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');
const { createRealEstate, getAll, rent, edit, deleteRealEstate, searchRealEstate } = require('../services/realEstateService');
const { parseError } = require('../util/parser');

realEstateController.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Real Estate Housing'
    });
});

realEstateController.post('/create', hasUser(), async (req, res) => {
    const realEstate = req.body;
    realEstate.owner = req.user._id;

    try {
        await createRealEstate (realEstate);
        res.redirect('/realEstate/catalog');
    } catch (error) {
        res.render('create', {
            title: 'Create Real Estate Housing',
            errors: parseError(error),
            realEstate
        });
    }
});

realEstateController.get('/catalog', async (req, res) => {
    const realEstates = await getAll();

    res.render('catalog', {
        title: 'Housing for Rent',
        realEstates
    });
});

realEstateController.get('/:id/details', preload(true), async (req, res) => {
    const realEstate = res.locals.realEstate;
    realEstate.isOwner = req.user?._id.toString() == realEstate.owner.toString();
    realEstate.hasRented = realEstate.renters.some(r => r._id.toString() == req.user?._id.toString());
    realEstate.isNotAvailable = realEstate.availablePieces == 0;
    realEstate.rentersNames = realEstate.renters.map(r => r.name).join(', ');

    res.render('details', {
        title: `${realEstate.name}`,
        realEstate
    });
});

realEstateController.get('/:id/rent', hasUser(), preload(true), async (req, res)=> {
    const realEstate = res.locals.realEstate;
    
    try {
        if(req.user._id.toString() == realEstate.owner.toString()) {
            realEstate.isOwner = true;
            realEstate.rentersNames = realEstate.renters.map(r => r.name).join(', ');
            throw new Error('You cannot rent your own Real estate offer');
        }

        if(realEstate.renters.some(r => r._id.toString() == req.user._id.toString())) {
            realEstate.hasRented = true;
            realEstate.rentersNames = realEstate.renters.map(r => r.name).join(', ');
            throw new Error('You cannot rent the same real estate twice');
        }
        
        if(realEstate.availablePieces == 0) {
            realEstate.rentersNames = realEstate.renters.map(r => r.name).join(', ');
            throw new Error('There are no move available pieces for this real estate');
        }

        await rent(req.user._id, realEstate._id);
        res.redirect(`/realEstate/${realEstate._id}/details`);

    } catch (error) {
        res.render('details', {
            title: `${realEstate.name}`,
            realEstate,
            errors: parseError(error)
        });
    }
});

realEstateController.get('/:id/edit', preload(true), isOwner(), (req, res)=> {
    const realEstate = res.locals.realEstate;

    res.render('edit', {
        title: `Edit ${realEstate.name}`,
        realEstate
    });
});

realEstateController.post('/:id/edit', preload(true), isOwner(), async (req, res) => {
    const existing = res.locals.realEstate;
    const realEstate = req.body;

    try {

        await edit(existing._id, realEstate);
        res.redirect(`/realEstate/${existing._id}/details`);
    } catch(error) {

        realEstate._id = existing._id;
        res.render('edit', {
            title: `Edit ${existing.name}`,
            realEstate,
            errors: parseError(error)
        });
    }
});

realEstateController.get('/:id/delete', preload(true), isOwner(), async (req, res)=> {
    const realEstate = res.locals.realEstate;
    await deleteRealEstate(realEstate._id);
    res.redirect('/realEstate/catalog');
});

realEstateController.get('/search', async (req, res) => {
    const search = req.query.search;

    try {
        const results = await searchRealEstate(search);
        res.render('search', {
            title: 'Search Real Estates',
            results
        });
    } catch (error) {
        res.render('search', {
            title: 'Search Real Estates',
            errors: parseError(error)
        });
    }
});

module.exports = realEstateController;