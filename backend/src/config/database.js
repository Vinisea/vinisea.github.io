import Sequelize from "sequelize";
import dotenv from "dotenv"

dotenv.config()
const databaseURL = process.env.DATABASE_URL

//Quando for subir a api tem que descomentar
// export const conn = new Sequelize(databaseUrl, {
//     dialect: "postgres",
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false
//         }
//     },
//     logging: false
// })

export const conn = new Sequelize({
    dialect: "sqlite",
    storage: "./database/db.sqlite"
})

const testeConexao = () => {
    try {
        conn.authenticate();
        console.log("Conexão com o banco de dados estabelecida com sucesso!")
    } catch (error) {
        console.log({msg: "Houve um erro ao se conectar ao banco", err: error.message})
    }
}
testeConexao()