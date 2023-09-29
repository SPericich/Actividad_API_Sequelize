import { Sequelize } from 'sequelize'

// Creación de la instancia de Sequelize
const db = new Sequelize(
    'xxxxxxxx', // DB name
    'xxxxxxxx', // User
    'xxxxxxxxxxxxxxxxxxxxx', // Password
    {
  host: 'silly.db.elephantsql.com',
  dialect: 'postgres',
  logging: true
})

export default db

