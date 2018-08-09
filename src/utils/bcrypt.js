const bcrypt = require('bcrypt-nodejs')

function hash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}
function compare(password, hash) {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hash: hash,
    compare: compare
}