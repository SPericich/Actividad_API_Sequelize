import { DataTypes } from 'sequelize'
import db from '../db/connection.js'

const Producto = db.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING 
    },
    tipo: {
        type: DataTypes.STRING 
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null
    },
},
{timestamps:false,
tableName:'productos'}
)

export default Producto

