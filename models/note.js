module.exports = function(sequelize, DataTypes) {
    var Note = sequelize.define('Note', {
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
    }, {
        classMethods: {
            associate: function(models) {
                Note.belongsTo(models.User);
            },
            setEasinessFactorFromQ: function(q) {
                this.easinessFactor = q + 1 + 2;
                this.save().success(function() {})
            }
        }
    })

    return Note
}