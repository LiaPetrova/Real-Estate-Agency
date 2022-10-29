function hasUser() {
    return (req, res, next) => {
        if(req.user) {
                next();
        } else {
            res.redirect('/auth/login');
        }
    }
}

function isGuest (){
    return (req, res, next) => {
        if(req.user) {
            res.redirect('/'); //TODO check assignment
        } else {
            next();
        }
    }
}
//TODO
function isOwner () {
    return (req, res, next) => {
        if (req.user && res.locals.realEstate.owner.toString() == req.user._id.toString()) {
            res.locals.isOwner = true;
            next();
        } else {
            res.redirect('/auth/login');
        }
    }
}

module.exports = {
    hasUser,
    isGuest,
    isOwner
}