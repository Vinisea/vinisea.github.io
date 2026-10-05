import { conn } from "../config/database.js";
import { DataTypes } from "sequelize";

export const usuario = conn.define(
  "usuario",
  {
    id_usuario: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Nome não pode estar vazio"},
            len: {args: [3, 100], msg: "O nome pode ter entre 3 e 100 caracteres"}
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "A senha não pode estar vazia"},
            len: {args: [8, 255], msg: "A senha precisa ter no mínimo 8 caracteres"}
        }
    },
  },
  {
    tableName: "usuario",
    timestamps: false,

    defaultScope: {
      attributes: {
        exclude: ["senha"],
      },
    },
    scopes: {
      ComSenha: {
        attributes: {},
      },
    },
  },
);
