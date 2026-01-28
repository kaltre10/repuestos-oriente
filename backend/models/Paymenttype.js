import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PaymentType = sequelize.define('PaymentType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    properties: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      // Convertir a array antes de guardar
      set(value) {
        this.setDataValue('properties', Array.isArray(value) ? value : []);
      },
      // Asegurar que siempre se devuelva un array
      get() {
        const value = this.getDataValue('properties');
        return Array.isArray(value) ? value : [];
      }
    },
  }, {
    tableName: 'payment_types',
    timestamps: true,
  });

  return PaymentType;
};
