var express     = require('express');
var router      = express.Router();
var User        = require('../../models/userModel');
var auth        = require('../../middleware/authentification');

router.get('/', auth.isAuthenticated, function(req, res) {
    var limit = parseInt(req.get('X-Pagination-Limit')) || 10;
    var page = parseInt(req.get('X-Pagination-Pages')) || 1;

    User.paginate({}, { page: page, limit: limit }, function (err, users) {
        if (err) {
            res.status(500).send(
                {
                    message: 'Oupps something goes wrong',
                    error: err
                }
            );
        }
        res.send(users);
    });
});

router.put('/', function(req, res) {
    if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
        return res.status(400).send({
            message: 'Missing parameter',
            require_model: {
                email: 'email',
                firstName: 'firstname',
                lastName: 'lastname',
                passport: 'password'
            }
        });
    } else {
        User.findOne({'email': req.body.email }, function (err, user) {
            if (err) {
                res.status(500).send(
                    {
                        message: 'Oupps something goes wrong',
                        error: err
                    }
                );
            }
            if (user) {
                return res.status(409).send({
                    message: 'This email is already used.'
                });
            } else {
                var newUser = new User({
                    id: req.body.id,
                    password: req.body.password,
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    registrationDate: Date.now()
                });
                newUser.save(function (err) {
                    if (err) {
                        return res.status(403).send({
                            message: 'Can\'t create user',
                            error: err
                        });
                    }
                    return res.status(201).send({
                        message: 'Created'
                    });
                });
            }
        })
    }
});

router.get('/:id', auth.isAuthenticated,  function (req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            res.status(500).send(
                {
                    message: 'Oupps something goes wrong',
                    error: err
                }
            );
        } else {
            if (user) {
                res.send(user);
            } else {
                res.status(404).send(
                    {
                        message: 'No user found'
                    }
                );
            }
        }
    });
});

router.post('/:id', auth.isAuthenticated, auth.isCurrentUser, function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({
            message: 'Missing parameter'
        });
    }
    User.findOne({_id: req.params.id}, function (err, user) {
        if (!user) {
            return res.status(403).send({
                message: 'User ' + req.params.id + ' does not exist.'
            });
        }
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        User.findOneAndUpdate({_id: user._id}, user, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send({
                    message: 'User updated'
                });
            }
        });
    });
});

router.delete('/:id', auth.isAuthenticated, auth.isCurrentUser, function (req, res) {
    User.findOneAndRemove({_id: req.params.id}, function (err, user) {
        if (err) {
            res.status(500).send(
                {
                    message: 'Oupps something goes wrong',
                    error: err
                }
            );
        } else {
            if (user) {
                res.send(
                    {
                        message: 'User deleted'
                    }
                );
            } else {
                res.status(404).send(
                    {
                        message: 'No user found'
                    }
                );
            }
        }
    });
});

module.exports = router;
