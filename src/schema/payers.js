module.exports = function(db, Sequelize) {
  return db.define('payers', {
    pid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    uid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    gid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    amount: Sequelize.DECIMAL(8,2),
    status: Sequelize.STRING
  })
}