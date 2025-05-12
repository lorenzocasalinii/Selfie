import multer from "multer";
import path from "path";
import fs from "fs";

// Controllo se la directory in cui salvare le foto esiste, in caso negativo la creo
const uploadDirectory = "uploads/profilePictures";

// Definisco la directory in cui salvare le immagini e il nome da attribuirgli
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // File vengono salvati in 'uploads/profilePictures'
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // Prendo l'estensione del file
    const fileExtension = path.extname(file.originalname).toLowerCase();
    // Creo un nome unico
    const uniqueName = `${Date.now()}_${Math.round(
      Math.random() * 1e9
    )}${fileExtension}`;
    cb(null, uniqueName);
  },
});

// Filtro per accettare solo immagini jpeg, jpg, png
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const isExtensionValid = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeTypeValid = allowedFileTypes.test(file.mimetype);

  if (isExtensionValid && isMimeTypeValid) {
    // File valido
    cb(null, true);
  } else {
    // File non valido
    cb(new Error("Only image files (jpeg, jpg, png) are allowed!"), false);
  }
};

// Configuro multer
const upload = multer({
  storage,
  fileFilter,
  // Limite dimensione massima a 5MB
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
