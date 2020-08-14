module.exports = (sequelize, DataTypes) => {
  
    const Transaction = sequelize.define(
    "Transaction",
    {
      refNo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      
      rateId: {
        type: DataTypes.STRING,
      },

      totalRate: {
        type: DataTypes.FLOAT,
      },

      baseRate: {
        type: DataTypes.FLOAT,
      },

      depositRequired: {
        type: DataTypes.BOOLEAN,
      },

      guaranteeRequired: {
        type: DataTypes.BOOLEAN,
      },

      onlineCancellable: {
        type: DataTypes.BOOLEAN,
      },

      payAtHotel: {
        type: DataTypes.BOOLEAN,
      },

      providerId: {
        type: DataTypes.STRING,
      },

      refundable: {
        type: DataTypes.BOOLEAN,
      },

      currency: {
        type: DataTypes.STRING,
      },

      status: {
        type: DataTypes.STRING,
      },

      timestamp: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
    }
  )

  Transaction.associate = (models) => {
    models.Transaction.hasMany(models.Tax)
    models.Transaction.hasMany(models.Commission)

    models.Transaction.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
    })
  }

  return Transaction
}
