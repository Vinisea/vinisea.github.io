import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const pastaUploads = path.resolve(diretorioAtual, "../../uploads");

const armazenamento = multer.diskStorage({
  destination: pastaUploads,
  filename: (req, file, callback) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extensao}`);
  },
});

const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

const filtroArquivo = (req, file, callback) => {
  if (!tiposPermitidos.includes(file.mimetype)) {
    return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }

  callback(null, true);
};

export const uploadImagem = multer({
  storage: armazenamento,
  fileFilter: filtroArquivo,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("imagem");

export const tratarErroUpload = (error, req, res, next) => {
  if (!error) return next();

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "A imagem deve ter no máximo 5 MB",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Envie uma imagem PNG, JPEG ou WebP no campo imagem",
      });
    }
  }

  return res.status(400).json({
    message: "Não foi possível processar a imagem enviada",
  });
};
