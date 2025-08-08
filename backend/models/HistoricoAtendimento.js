import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const HistoricoAtendimento = sequelize.define('HistoricoAtendimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
}


export default HistoricoAtendimento;