const localStrategy = require('passport-local').Strategy
var bcrypt   = require('./bcrypt.js')

module.exports = function(passport, dbClass) {

    passport.use('localLogin', new localStrategy( function(username, password, callback) {
        dbClass.users.findOne({where:{[dbClass.Sequelize.Op.or]: [{email: username}, {username: username}]}}).then(user => {
            if (!user) return callback(null, false)
            if (!bcrypt.compare(password, user.password)) return callback(null, false)
            return callback(null, user)
        }).catch(function(err) {
            return callback(err)
        })
    }))

    passport.serializeUser((user, callback) => {
        callback(null, user.uid)
    })
      
    passport.deserializeUser((id, callback) => {
        dbClass.users.findOne({where:{uid: id}}).then(result => {
            callback(null, result)
        })
    })
}
