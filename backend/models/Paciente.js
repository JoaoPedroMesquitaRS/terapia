import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Paciente = sequelize.define('Paciente', {
   id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
   },
   nome: {
    type: DataTypes.STRING,
    allowNull: false
   },
   cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
   },
   sexo: {
    type: DataTypes.CHAR,
    allowNull: false
   },
   dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false
   }
}, {
        tableName: 'pacientes',
        timestamps: false
    }
);

Paciente.associate = (models) => {
    Paciente.hasMany(models.Tratamento, {
        foreignKey: 'idPaciente',
        as: 'tratamentos'
    });
}

export default Paciente;