module.exports = function(req, res, next) {
    if (!req.user) {
        req.flash('error, not logged in to view this page');
        res.redirect('/auth/login'); // take to login
    } else {
        next();
    }
};
