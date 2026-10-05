import { usuario } from "./userModel.js";
import { categoria } from "./categoriasMOdel.js";
import { atividade } from "./atividadesModel.js";

//usuario 1:N atividades
usuario.hasMany(atividade, {foreignKey: "id_usuario", as: "atividades"});
atividade.belongsTo(usuario, {foreignKey: "id_usuario", as: "usuario"});

//categoria 1:N atividades
categoria.hasMany(atividade, {foreignKey: "id_categoria", as: "atividades"});
atividade.belongsTo(categoria, {foreignKey: "id_categoria",  as: "categoria"});