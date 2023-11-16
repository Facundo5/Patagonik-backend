const { getConnection } = require('./../database/database')

const viewOrders = async (req, res) => {

    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM virtualshopping')
        if (!result) {
            res.status(404).json({
                ok: false,
                msg: 'Aun no existe productos vendidos'
            })

        } else {
            res.send(result)
        }
    } catch {
        res.status(503).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}
module.exports = {
    viewOrders
}