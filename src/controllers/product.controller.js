const { getConnection } = require("../database/database");
const { getTemplateAcceptProductAdmin, notificationAcceptProductAdmin } = require("../helpers/notificationAcceptProduct");
const { notificationDelProductAdmin, getTemplateDelProductAdmin } = require("../helpers/notificationDelProduct");
const cloudinary = require('../utils/cloudinary')

const addProduct = async (req = request, res = response) => {
    const { price, stock, description, title, category, id } = req.body
    const ahora = new Date();
    const date_create = ahora;
    try {
        const uploader = async (path) => await cloudinary.uploads(path, 'Images', { height: 200, width: 200, crop: "crop" });
        if (req.method === 'POST') {
            var urls = []
            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath)
            }
            var urlwithastag = []
            // console.log(urls.res)
            for (let x = 0; x < urls.length; x++) {
                urlwithastag.push(`${urls[x].res}#`)
            }
            const urlwithcoma = urlwithastag.join()
            const image = urlwithcoma.replace(/,/g, '')
            //Creamos la lista ordenada de el producto con la informacion ingresada por el administrador
            const connection = await getConnection();
            const data = await connection.query('SELECT id_user FROM users WHERE email = ?', [id])
            // Verifica si hay algún resultado antes de intentar acceder a las propiedades
            if (data && data.length > 0) {
                const firstRow = data[0];  // Accede al primer elemento del array
                const advertiser_identifier = firstRow.id_user;

                console.log(data);
                console.log(advertiser_identifier);

                const newProduct = {
                    title,
                    description,
                    price,
                    category,
                    stock,
                    date_create,
                    image,
                    advertiser_identifier
                };
                const sql = ('INSERT INTO products SET ?')
                const result = await connection.query(sql, [newProduct]);
                if (result.length > 0) {
                    res.status(404).json({
                        ok: false,
                        msg: 'Ocurrio un error al crear el producto'
                    })
                }
                else {
                    res.status(200).json({
                        ok: true,
                        msg: 'Imagen subida con exito',
                        data: urls
                    });
                }
            }
        }
        else {
            res.status(405).json({
                err: `${req.method} metodo no`
            })
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
}

const getProduct = async (req = request, res = response) => {
    const { product } = req.params;
    console.log(product)
    try {
        const connection = await getConnection()
        const result = await connection.query('SELECT * FROM products WHERE id_product = ?', [product])
        var str = result[0].image
        const url = str.split('#')
        result[0].image = url
        if (!result) {
            res.status(404).json({
                ok: false,
                msg: "Error al obtener el producto"
            })
        }
        res.json(result[0])
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const getProducts = async (req = request, res = response) => {
    try {
        const connection = await getConnection()
        const result = await connection.query('SELECT * FROM products WHERE statusCheck = "approved" AND status = "active"');
        console.log(result)
        if (!result) {
            console.log(result)
            res.status(404).json({
                ok: false,
                msg: "Ocurrio un error al intentar obtener estas zapatillas"
            })
        }
        var str = result[0].image
        const url = str.split('#', 1)
        result[0].image = url
        res.json(result)
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const getProductsAdmin = async (req = request, res = response) => {
    try {
        const connection = await getConnection()
        const result = await connection.query('SELECT * FROM products WHERE statusCheck = "in-review"')
        if (!result) {
            res.status(404).json({
                ok: false,
                msg: "Ocurrio un error al intentar obtener estas zapatillas"
            })
        }
        var str = result[0].image
        const url = str.split('#', 1)
        result[0].image = url[0];
        res.json(result)
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }
}

const updateProduct = async (req = request, res = response) => {
    const { id_product } = req.params;
    const { title, price, image, discount, description } = req.body
    try {
        const connection = await getConnection()
        const result = await connection.query('UPDATE products SET title = ?, price = ?, image = ?, discount = ?, description = ? WHERE id_product = ?'[title, price, image, discount, description, id_product])
        if (!result) {
            res.status(404).json({
                ok: false,
                msg: "Ocurrio al actualizar el producto"
            })
        } else {
            res.status(200).json({
                ok: true,
                msg: 'todo salio bien, producto actualizado'
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "No se pudo conectar al servidor"
        })
    }
}


const delProduct = async (req = request, res = response) => {
    const { id_shoes } = req.params;
    console.log(id_shoes)
    try {
        const connection = await getConnection();
        const result = await connection.query('UPDATE products SET status = "inactive" WHERE id_product = ?', [id_shoes]);
        if (!result) {
            res.status(404).json({
                ok: false,
                msg: 'El producto no se encontro o ya fue eliminado.'
            })
        }
        else {
            res.status(200).json({
                ok: true,
                msg: 'Producto eliminado con exito!'
            })
        }
    } catch {
        return res.status(500).json({
            ok: false,
            msg: 'No se pudo conectar al servidor deleteProduct'
        })
    }
}
// Suponiendo que estás usando Express y algún middleware para el manejo de las solicitudes

// Controlador o ruta en tu backend
const delProductAdmin = async (req, res) => {
    const { product, id_user, razon} = req.body;
    try {
        // Aquí deberías tener la lógica para conectarte a la base de datos y realizar la actualización
        const connection = await getConnection(); // Define tu lógica para obtener la conexión a la base de datos
        const del = await connection.query('UPDATE products SET statusCheck = "rejected" WHERE id_product = ?', [product]);

        if (!del) {
            return res.status(404).json({ msg: 'Error al enviar la petición.' });
        }
        else {
            const data = await connection.query('SELECT email, nombre FROM users WHERE id_user = ?', [id_user])
            const name = data[0].nombre
            const email = data[0].email
            const template = getTemplateDelProductAdmin(name, razon)
            //Enviamos el email y el token a la funcion de enviar email para verificar
            notificationDelProductAdmin(email, template)
            res.status(201).json({
                msg:'exito'
            })
        }
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};
const acceptProductAdmin = async (req, res) => {
    const { product, id_user} = req.body;
    try {
        // Aquí deberías tener la lógica para conectarte a la base de datos y realizar la actualización
        const connection = await getConnection(); // Define tu lógica para obtener la conexión a la base de datos
        const accept = await connection.query('UPDATE products SET statusCheck = "approved" WHERE id_product = ?', [product]);

        if (!accept) {
            return res.status(404).json({ msg: 'Error al enviar la petición.' });
        }
        else {
            const data = await connection.query('SELECT email, nombre FROM users WHERE id_user = ?', [id_user])
            const name = data[0].nombre
            const email = data[0].email
            const template = getTemplateAcceptProductAdmin(name)
            notificationAcceptProductAdmin(email, template)
            res.status(201).json({
                msg:'exito'
            })
        }
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};
module.exports = {
    addProduct,
    getProduct,
    updateProduct,
    delProduct,
    getProducts,
    getProductsAdmin,
    delProductAdmin,
    acceptProductAdmin
}