const bcrypt = require('bcrypt')
const { getConnection } = require('./../database/database')
const { tokenSign } = require('../middlewares/generateToken')
const { emailVerification, getTemplateVerification } = require('../helpers/verifyEmail')

const userRegister = async (req, res) => {
    const ahora = new Date();
    const date_create = ahora;
    const date_joined = date_create
    //
    const { user, email, password } = req.body
    //Creamos un array con la informacion del usuario la cual fue ingresada por el mismo y ademas tomamos el dia que lo hizo.
    const usuario = {
        email,
        password,
        date_joined
    }
    const connection = await getConnection();
    const result = await connection.query('SELECT email FROM users WHERE email = ?', email);
    //Revisamos si el usuario esta creado, si lo esta enviamos un error y un mensaje
    if (result.length > 0) {
        res.status(404).json({
            ok: false,
            msg: 'El correo ya se encuentra registrado'
        })
    } else {
        //Si no esta creado lo almacenamos en la base
        //encriptamos la password:
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        const createUser = connection.query('INSERT INTO users SET ?', [usuario])
        if (createUser > 0) {
            res.status(404).json({
                ok: false,
                msg: 'Oh algo salio mal..'
            });
        }
        else {
            const emailverify = usuario.email
            //Tomamos los datos por default (cuenta no verificada)
            const detailsAccount = await connection.query('SELECT * FROM users WHERE email = ?', [emailverify]);
            const email = detailsAccount[0].email
            const role = detailsAccount[0].role
            const permissions = detailsAccount[0].permissions
            //Creamos un token con la informacion de la cuenta
            const token = await tokenSign(email, role, permissions)
            const template = getTemplateVerification(token)
            //Enviamos el email y el token a la funcion de enviar email para verificar
            emailVerification(emailverify, template)
            res.status(202).json({
                ok: true,
                msg: 'Usuario creado con exito'
            })
        }
    }
}
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM users WHERE email = ?', email);

        if (result.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'El correo no esta registrado'
            });
        }

        const verify = result[0].status;

        if (verify === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'Debes confirmar tu cuenta antes de poder ingresar, revisa tu casilla de correo.'
            });
        }

        const hashPassword = result[0].password;
        const check = await bcrypt.compare(password, hashPassword);

        if (!check) {
            return res.status(401).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            });
        }

        const emaile = result[0].email;
        const role = result[0].role;
        const permissions = result[0].permissions;
        const token = await tokenSign(emaile, role, permissions);
        console.log(token)

        return res.status(200).json({
            ok: true,
            token
        });

    } catch (error) {
        console.error('Error en el controlador de autenticación:', error);

        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        });
    }
};
module.exports = {
    userLogin,
    userRegister
}