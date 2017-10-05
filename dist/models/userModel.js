'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var modelHelpers = require('./modelHelpers.js');

var UserSchema = new Schema({
    password: { type: String },
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    registrationDate: { type: Date, required: false }
});

UserSchema.methods.toDTO = function () {
    var _dto;

    var obj = this.toJSON();
    var dto = (_dto = {
        email: obj.email,
        firstName: obj.firstName,
        lastName: obj.lastName
    }, _defineProperty(_dto, 'firstName', obj.firstName), _defineProperty(_dto, 'phoneNumber', obj.phoneNumber), _defineProperty(_dto, 'registrationDate', obj.registrationDate), _dto);
    return dto;
};

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports.updateUser = function (_id, user, options, callback) {
    var query = { _id: user._id };
    var update = {
        firstName: user.firstName,
        lastName: user.lastName
    };
    User.findOneAndUpdate(query, update, options, callback);
};

UserSchema.plugin(mongoosePaginate);
UserSchema.method('toJSON', modelHelpers.toJSON);
var User = module.exports = mongoose.model('User', UserSchema);
//# sourceMappingURL=userModel.js.map