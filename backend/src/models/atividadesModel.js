import { conn } from "../config/database.js";
import { DataTypes } from "sequelize";

export const atividade = conn.define(
  "atividade",
  {
    id_atividade: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "O título não pode estar vazio"},
            len: {args: [4, 150], msg: "O título precisa ter entre 4 e 150 caracteres"}
        }
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "A descrição da atividade não pode ficar vazio"}
        }
    },
    tecnologias: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {args: [2, 40], msg: "Deve conter no máximo 40 caracteres"}
        }
    },
    instituicao: {
        type: DataTypes.ENUM(["SESI", "SENAI"]),
        allowNull: false,
    },
    habilidades: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {args: [2, 15], msg: "As habilidades devem conter X caracteres"} //Mudar o X para a quantidade que realmente é
        }
    },
    dataEntrega: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {msg: "A data não está formatado da forma correta."},
            isFuture(value) {
                if(new Date(value) > new Date()) {
                    throw new Error("A data do evento não pode ser futura!")
                }
            }
        }
    },
    img_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "A url da imagem é obrigatório"},
            isURL: {msg: "Insira um link válido"},
        }
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "categorias",
            key: "id_categoria"
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "usuario",
            key: "id_usuario"
        }
    },
  },
  {
    tableName: "atividade",
    timestamps: true,
  },
);
