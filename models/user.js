module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            validate: {
                len: [2, 30]
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Note, {foreignKey: "userId"})
            }
        }
    })

    return User
}