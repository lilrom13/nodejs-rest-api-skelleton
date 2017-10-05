var express     = require('express');
var router      = express.Router();
var User        = require('../../models/userModel');
var jwt         = require('jwt-simple');
var config      = require('../../config/config');

router.post('/', function(req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.status(403).send({
                message: 'Authentication failed. User not found.'
            });
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, config.opt.secret);
                    return res.status(200).send({
                        token: token
                    });
                } else {
                    return res.status(403).send({
                        message: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
});

module.exports = router;
