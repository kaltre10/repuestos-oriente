//advertising model
//id, image, link, createdAt, updatedAt
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Advertising = sequelize.define('Advertising', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    buttonText: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Ver más',
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'advertising',
    timestamps: true,
  });

  return Advertising;
};
