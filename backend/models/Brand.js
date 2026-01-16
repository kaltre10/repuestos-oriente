import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Brand = sequelize.define('Brand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: {
      type: DataTypes.STRING,
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
    tableName: 'brands',
    timestamps: true,
  });

  Brand.associate = (models) => {
    Brand.hasMany(models.Model, {
      foreignKey: 'brandId',
      as: 'models',
    });
  };

  return Brand;
};
