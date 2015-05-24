module.exports = function(sequelize, DataTypes) {
  var Challenge = sequelize.define('Challenge', {
    text: DataTypes.STRING,
    hint: DataTypes.STRING,
    EF: DataTypes.DECIMAL,
    nextShow: DataTypes.DATE,
    lastShow: DataTypes.DATE,
    interval: DataTypes.DECIMAL,
    numberShows: DataTypes.DECIMAL,
    deleted: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Challenge.belongsTo(models.User);
        Challenge.belongsTo(models.Note);
      },
      setEasinessFactorFromQ: function(q) {
        this.easinessFactor = q + 1 + 2;
        this.save();
      }
    }
  })

  return Challenge
}
