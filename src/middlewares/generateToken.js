const jwt = require('jsonwebtoken');
const JWT_SECRET = `${process.env.JWT_SECRET}`
//Generamos un TOKEN con la informacion del email y el rol del usuario
const tokenSign = async (id_user,role,permissions) => {
  const sign = jwt.sign(
    {
      id: id_user,
      role: role,
      permissions: permissions
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  //Lo retornamos
  return sign
};
//Verificamos si el token que nos envian es el que firmamos nosotros con nuestra llave privada
const verifyToken = async (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
    console.log(jwt.verify(token, JWT_SECRET))
  } catch (error) {
    msg: 'Error al verificar'
  }
}
module.exports = {
  tokenSign,
  verifyToken
}
