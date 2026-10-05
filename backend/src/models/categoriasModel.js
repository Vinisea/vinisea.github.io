import { conn } from "../config/database.js";
import { DataTypes } from "sequelize";

export const categorias = conn.define(
  "categorias",
  {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "O nome não pode estar vazio"},
            isAlpha: {msg: "O nome deve conter letras"},
            len: {args: [2, 100], msg: "O nome deve conter entre 2 e 100 caracteres"}
        }
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {args: [0, 200], msg: "A descrição pode conter até 200 caracteres"}
        }
    },
  },
  {
    tableName: "categorias",
    timestamps: false,
  },
);
