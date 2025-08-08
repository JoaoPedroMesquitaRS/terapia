import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Profissional = sequelize.define('Profissional', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    registro:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'profissionais',
    timestamps: false
    }
);

Profissional.associate = (models) => {
    Profissional.hasMany(models.Tratamento, {
        foreignKey: 'idProfissional',
        as: 'tratamentos'
    });
}

export default Profissional;