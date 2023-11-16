const { getConnection } = require('../database/database')
const { verifyToken } = require('../middlewares/generateToken')


//Checkeamos el rol del usuario
const checkRoleAuth = (roles) => async (req = request,res = response, next) => {
    try {
        //Verificamos el token que se encuentra en el header del visitante (ya logeado)
        const token = req.headers.authorization.split(' ').pop()
        //Verificamos que nosotros hayamos firmado el token
        const tokenData = await verifyToken(token)
        //obtenemos el email y el role dentro de ese token
        const connection = await getConnection();
        const userData = await connection.query('SELECT role FROM users WHERE email = ?', [tokenData.id])
        //verificamos si el email que se pasa en el token es valido y si se encuentra en nuetra base de datos
        //Si se encuentra, compararemos el rol que pedimos que tenga con el rol que tiene almacenado en la base de datos
        if ([].concat(roles).includes(userData[0].role)) {
            //Si el rol requerido es el mismo que el rol del visistante, lo dejaremos seguir.
            next()
        } else {
            //Si el rol no es el que pedimos lo detenemos
            res.status(409)
            res.send({error: 'No tienes permisos'})
        }
    }catch (e){
        //Si ocurre algun error al intentar hacer alguna consulta a la base de datos, mostramos un error de servidor
        res.status(500).json({
            msg: e,
            msg: 'error en authRole'
        })
    }
}
module.exports = {
    checkRoleAuth
}