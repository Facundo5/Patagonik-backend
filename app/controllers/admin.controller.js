const { getConnection } = require('./../database/database')




const getColours = async (req = request, res = response)=> {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM colour');
        if(!result) {
            res.statis(404).json({
                ok:false, 
                msg:'No se puede traer los colores'
            })
        } else {
            res.json(result);
        }
    } catch {
        res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        })
    }
}

const getCards = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM products WHERE reviewed = 0')

        if(!result) {
            res.status(404).json({
                ok:true,
                msg:'Error al traer los las tarjetas para administrar'
            })
        }
        else {
            res.status(201).json({
                ok:true,
                response: result
            })
        }
    } catch (err) {
        res.status(500).json({
            ok:false,
            msg:'Error en el servidor.'
        })
    }
}
const delProductdashboard = async (req, res) => {
    const {product } = req.body;
    try {
        const connection = await getConnection()
        const result = await connection.query('UPDATE products SET status = "deleteadmin" WHERE id_product = ?',[product])
        if (!result) {
            res.status(404).json({
                ok:false,
                msg:'Error al eliminar la publicacion.'
            })
        }else {
            res.status(201).json({
                ok:true,
                msg:'deleted successfully'
            })
        }
    }catch (error) {
        res.status(500).json({
            msg:error
        })
    }
}
const getDeletedProducts = async (req, res) => {
    try {
        const connection = await getConnection()
        const result = await connection.query('SELECT * FROM `products` WHERE status = "deleted" or status = "deletedAdmin"')
        if (!result) {
            res.status(404).json({
                ok:false,
                msg:'Error al eliminar la publicacion.'
            })
        }else {
            res.status(201).json({
                ok:true,
                msg:'deleted successfully'
            })
        }
    }catch (error) {
        res.status(500).json({
            msg:error
        })
    }
}
module.exports = {
    getColours,
    getCards,
    delProductdashboard,
    getDeletedProducts
}