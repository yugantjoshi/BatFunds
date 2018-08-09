module.exports = function(db, Sequelize) {
  return db.define('payment_flags', {
    pid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    payee: {
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
    due: Sequelize.DATE,
    description: Sequelize.STRING
  })
}
