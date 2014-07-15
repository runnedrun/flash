module.exports = {
  up: function(migration, DataTypes, done) {
      migration.createTable(
          'Users',
          {
              id: {
                  type: DataTypes.BIGINT,
                  primaryKey: true,
                  autoIncrement: true
              },
              createdAt: {
                  type: DataTypes.DATE
              },
              updatedAt: {
                  type: DataTypes.DATE
              },
              username: {
                  type: DataTypes.STRING,
                  allowNull: false
              }
          }
      ).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('Users').complete(done);
  }
}
