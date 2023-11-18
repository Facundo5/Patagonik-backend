const { verifyToken } = require('../middlewares/generateToken')
//Verificamos si el usuario tiene un token generado (Sesion iniciada)
const checkAuth = async (req = request, res = response, next) => {
    try {
        //En el header solicitamos el TOKEN 
        const token = req.headers.authorization.split(' ').pop()
        //Verificamos si el token es valido
        const tokenData = await verifyToken(token)
        //Si el TOKEN esta firmado de forma correcta, lo dejamos ingresar
        if(tokenData.id) {
            next()
        } else {
            //Si el token es invalido le damos un error para que no pueda ingresar
            res.status(409)
            res.send({error: 'No tenes una sesion activa'})
        }
        //Si el usuario no tiene TOKEN rechazamos su peticion
    } catch (e){
        console.log(e)
        res.status(409)
        res.send({error: 'No tenes una sesion activa'})
    }
}
module.exports = {
    checkAuth
}