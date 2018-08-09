module.exports = function(db, Sequelize) {
  return db.define('group', {
      gid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV1,
          primaryKey: true
      },
      name: Sequelize.STRING,
      description: Sequelize.STRING
  })
}