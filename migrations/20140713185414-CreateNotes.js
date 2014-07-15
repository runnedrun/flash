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

              userId:  {
                  type: DataTypes.BIGINT,
                  references: "Users",
                  referenceKey: "id",
                  onUpdate: "CASCADE",
                  onDelete: "RESTRICT"
              },

              highlight: DataTypes.STRING,
              hint: DataTypes.STRING,
              scrollX: DataTypes.INTEGER,
              scrollY: DataTypes.INTEGER,
              clientSideId: DataTypes.STRING,
              nodeIndex: DataTypes.INTEGER,

              archiveUrl: DataTypes.STRING,
              originalUrl: DataTypes.STRING,
              title: DataTypes.STRING,

              easinessFactor: DataTypes.INTEGER,
              nextShow: DataTypes.DATE
          }
      ).complete(done);
  },
  down: function(migration, DataTypes, done) {
      migration.dropTable('Notes').complete(done);
  }
}
