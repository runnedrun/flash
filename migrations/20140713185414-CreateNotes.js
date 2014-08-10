module.exports = {
  up: function(migration, DataTypes, done) {
      migration.createTable(
          'Notes',
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

              UserId:  {
                  type: DataTypes.BIGINT,
                  references: "Users",
                  referenceKey: "id",
                  onUpdate: "CASCADE",
                  onDelete: "RESTRICT"
              },

              highlight: DataTypes.STRING,
              hint: DataTypes.STRING,
              scrollX: DataTypes.DECIMAL,
              scrollY: DataTypes.DECIMAL,
              clientSideId: DataTypes.STRING,
              nodeIndex: DataTypes.INTEGER,

              archiveUrl: DataTypes.STRING,
              originalUrl: DataTypes.STRING,
              title: DataTypes.STRING,

              easinessFactor: DataTypes.DECIMAL,
              nextShow: DataTypes.DATE,
              firstShow: DataTypes.DATE
          }
      ).complete(done);
  },
  down: function(migration, DataTypes, done) {
      migration.dropTable('Notes').complete(done);
  }
}
