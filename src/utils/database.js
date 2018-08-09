const Sequelize = require('sequelize')

const config = require('../config/database.json')
database = config.database
username = config.username
password = config.password
options = config.options

const db = new Sequelize(database, username, password, options)
db.authenticate().then(() => {
    console.log('Connection has been established successfully.')
}).catch(err => {
    console.error('Unable to connect to the database:', err)
})

var users = require('../schema/users.js')(db, Sequelize);
var groups = require('../schema/groups.js')(db,Sequelize);
var usersgroups = require('../schema/usersgroups.js')(db, Sequelize);
var payers = require('../schema/payers.js')(db, Sequelize);
var paymentflags = require('../schema/paymentflags.js')(db, Sequelize);

users.belongsToMany(groups, {through: usersgroups, foreignKey: 'uid'});
groups.belongsToMany(users, {through: usersgroups, foreignKey: 'gid'});
usersgroups.belongsTo(users, {foreignKey: 'uid'});
usersgroups.belongsTo(groups, {foreignKey: 'gid'});
paymentflags.belongsTo(users, {foreignKey: 'payee'});
paymentflags.belongsTo(groups, {foreignKey: 'gid'});
payers.belongsTo(users, {foreignKey: 'uid'});
payers.belongsTo(groups, {foreignKey: 'gid'});
payers.belongsTo(paymentflags, {foreignKey: 'pid'});
//usersgroups.belongsTo(users, {foreignKey: 'uid'});
//usersgroups.belongsTo(groups, {foreignKey: 'gid'});
//users.hasMany(groups, {joinTableName: 'users_groups', foreignKey: 'gid'})
//groups.hasMany(users, {joinTableName: 'users_groups', foreignKey: 'uid'})

//users.hasMany(groups, {through: 'usersgroups', foreignKey: 'gid'})
//groups.hasMany(users, {through: 'usersgroups', foreignKey: 'uid'})

module.exports = {
    Sequelize: Sequelize,
    db: db,
    users: users,
    groups: groups,
    usersgroups: usersgroups,
    payers: payers,
    paymentflags: paymentflags
}