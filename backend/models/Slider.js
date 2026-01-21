import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Slider = sequelize.define('Slider', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description1:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description2:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    buttonText:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    buttonLink:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    image:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    tableName: 'sliders',
    timestamps: true,
  });

  return Slider;
};
