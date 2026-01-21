import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountNumber:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    ci_rif:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('Pago Movil', 'Zelle', 'Transferencia', 'Efectivo'),
      allowNull: false,
      defaultValue: 'Pago Movil',
    },
    isActive: {
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
    tableName: 'payment_methods',
    timestamps: true,
  });

  return PaymentMethod;
};
