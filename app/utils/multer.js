const multer = require('multer');

const path = require('path');

module.exports = multer({
    //Declaramos donde se subira el archivo, como usare cloudinary no coloco nada
    storage: multer.diskStorage({}),
    //funcion para controlar que archivos se aceptan
    fileFilter: (req, file, cb) => {
        //extraemos la extension del archivo
        let ext = path.extname(file.originalname);
        if (ext!== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            //Para rechazar el archivo debemos pasar el "false" de la siguiente forma
            cb(
                new Error(
                    "El formato ingresado no es valido, los validos son: jpg, jpeg o png"
                ),
                false
            );
            return;
        }
        //Para aceptar el archivo debemos pasar el "true" de esta forma
        cb(null, true);
    }
});