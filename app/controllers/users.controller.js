const { getConnection } = require('../database/database');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middlewares/generateToken')

const getUsers = async (req, res) => {
    try {
        const connection = await getConnection();

        const users = await connection.query("SELECT * FROM users");
        console.log(users, 'aaaaa')

        if (!users) {
            res.status(404).json({
                ok: false,
                msg: 'Error al hacer la consulta en el servidor'
            })
        }
        res.json(users)
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
}
const editUsers = async (req, res) => {

    const { id_user } = req.params;


    try {
        const { } = req.body
        const connection = await getConnection();
        const result = await connection.query("UPDATE users set ? WHERE id_user=?", [id]);
        res.status(200).json({
            ok: true,
            result,
            msg: 'Usuario Actualizado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
}


const confirm = async (req, res) => {
    try {
        const { token } = req.params;
        const tokenize = await verifyToken(token)
        if (tokenize.length > 0) {
            res.json({
                ok: false,
                msg: 'Error al obtener la data'
            });
        } else {
            console.log(tokenize)
            const email = tokenize.id
            const connection = await getConnection();
            const user = await connection.query('SELECT * FROM users WHERE email = ?', email);
            if (user.length === 0) {
                res.json({
                    ok: false,
                    msg: 'El usuario no existe'
                })
            }
            const verificated = await connection.query('UPDATE users SET status = true WHERE email = ?', email)
            if (verificated.affectedRows === 0) {
                res.json({
                    ok: false,
                    msg: 'Imposible verificar el usuario'
                })
            } else {
                res.json({
                    ok: true,
                    msg: 'El usuario a sido verificado con exito'
                })
            }
        }
    } catch (error) {
        console.log(error)
        return res.json({
            ok: false,
            msg: 'Error al confirmar el usuario'
        })
    }
}
const delUser = async (req, res) => {
    const { id_user } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query('DELETE FROM users WHERE id_user = ?', [id_user]);
        if (!result) {
            res.status(404).json({
                ok: false,
                msg: 'No se encontro al usuario o ya fue eliminado'
            })
        }
        res.status(200).josn({
            ok: true,
            msg: 'Usuario Eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
}
const getUser = async (req, res) => {
    const id = req.params.id
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM users WHERE id_user = ?', [id])
        if (!result) {
            res.status(404).json({
                ok: false,
                msg: 'Error al traer el usuario'
            })
        } else {
            res.json(result)
        }
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error en el servidor'
        })
    }
}

module.exports = {
    getUsers,
    editUsers,
    delUser,
    getUser,
    confirm
}