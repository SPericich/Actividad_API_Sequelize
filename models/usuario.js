import { DataTypes } from 'sequelize'
import db from '../db/connection.js'

const Usuario = db.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dni: {
        type: DataTypes.STRING
    },
    nombres: {
        type: DataTypes.STRING 
    },
    apellidos: {
        type: DataTypes.STRING 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null 
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null  
    },
},
{timestamps:false,
tableName: 'usuarios'}
)

export default Usuario

