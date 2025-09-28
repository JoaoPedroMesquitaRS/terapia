import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const HistoricoAtendimento = sequelize.define('HistoricoAtendimento', {
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
    idGuia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'guias',
            key: 'id'
        }
    },
    dataAtendimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    situacao: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'historico_atendimentos',
    timestamps: false
});

HistoricoAtendimento.associate = (models) => {
    HistoricoAtendimento.belongsTo(models.Guia, {
        foreignKey: 'idGuia',
        as: 'guia'
    });

    HistoricoAtendimento.belongsTo(models.Paciente, {
        foreignKey: 'idPaciente',
        as: 'paciente'
    });

}


export default HistoricoAtendimento;