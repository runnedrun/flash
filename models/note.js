module.exports = function(sequelize, DataTypes) {
    var Note = sequelize.define('Note', {
        text: DataTypes.STRING,
        scrollX: DataTypes.INTEGER,
        scrollY: DataTypes.INTEGER,
        clientSideId: DataTypes.STRING,
        nodeIndex: DataTypes.INTEGER,

        archiveUrl: DataTypes.STRING,
        originalUrl: DataTypes.STRING,
        title: DataTypes.STRING,
        deleted: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                Note.belongsTo(models.User);
            }
        }
    })

    return Note
}
