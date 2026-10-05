import Sequelize from "sequelize";

export const conn = new Sequelize({
    dialect: sqlite,
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