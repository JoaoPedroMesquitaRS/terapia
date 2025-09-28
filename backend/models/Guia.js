import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Guia = sequelize.define('Guia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idTratamento: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: true
    },
    indicacao:{
        type: DataTypes.STRING,
        allowNull: true
    },
    validade:{
        type: DataTypes.STRING,
        allowNull: true
    },
    qtdAtendimentoAutorizado:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    qtdAtendida: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdFalta: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    qtdJustificada: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idServico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'servicos',
            key: 'id'
        }
    },
    situacao:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
        tableName: 'guias',
        timestamps: false
    }
);

Guia.associate = (models) => {
    Guia.hasOne(models.Tratamento, {
        foreignKey: 'idGuia',
        as: 'tratamento'
    });
    Guia.hasMany(models.HistoricoAtendimento, {
        foreignKey: 'idGuia',
        as: 'historicos'
    });
    Guia.belongsTo(models.Servico, {
        foreignKey: 'idServico',
        as: 'servico'
    });
};



export default Guia;