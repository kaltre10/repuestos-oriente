import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Config = sequelize.define('Config', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dolarRate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    freeShippingThreshold: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 200,
    },
    shippingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'configs',
    timestamps: true,
  });

  return Config;
};
