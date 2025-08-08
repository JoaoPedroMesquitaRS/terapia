import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Tratamento = sequelize.define('Tratamento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPaciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pacientes',
            key: 'id'
        }
    },
    idProfissional: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'profissionais',
            key: 'id'
        }
    },
    dataEntrada: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    indicacao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dataInicio: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    termoAssinado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
    },
    dataFinal: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    situacao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plano: {
        type: DataTypes.STRING,
        allowNull: true
    },
    preferencia: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'tratamentos',
    timestamps: true,
    indexes: [
        {
            name: 'idx_situacao',
            fields: ['situacao']
        }
    ]
});

Tratamento.associate = (models) => {
    Tratamento.belongsTo(models.Paciente, {
        foreignKey: 'idPaciente',
        as: 'paciente'
    });
    Tratamento.belongsTo(models.Profissional, {
        foreignKey: 'idProfissional',
        as: 'profissional'
    });
    Tratamento.hasMany(models.Guia, {
        foreignKey: 'idTratamento',
        as: 'guias'
    });
}

export default Tratamento;