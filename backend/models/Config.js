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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'configs',
    timestamps: true,
  });

  return Config;
};
