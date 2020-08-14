module.exports = (sequelize, DataTypes) => {
  const Tax = sequelize.define(
    "Tax",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      amount: {
        type: DataTypes.FLOAT,
      },

      description: {
        type: DataTypes.STRING,
      },

      type: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  )

  Tax.associate = (models) => {
    models.Tax.belongsTo(models.Transaction, {
      foreignKey: {
        allowNull: false,
      },
    })
  }

  return Tax
}
