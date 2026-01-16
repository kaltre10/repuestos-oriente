import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Model = sequelize.define('Model', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brandId: {
      type: DataTypes.INTEGER,
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
    tableName: 'models',
    timestamps: true,
  });

  Model.associate = (models) => {
    Model.belongsTo(models.Brand, {
      foreignKey: 'brandId',
      as: 'brand',
    });
  };

  return Model;
};
