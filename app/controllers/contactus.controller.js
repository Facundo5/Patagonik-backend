const { getConnection } = require('./../database/database')
const { contactUs, getTemplateContactus } = require('../helpers/ContactUs')

const sendEmailContactUs = async (req, res) => {
    const {email, content, name, last } = req.body
    const details = [
        email,
        content,
        name,
        last
    ]
    const connection = await get.connection()
    const query = await connection.query('INSERT INTO contactus SET  ?', [details])
    if(!query) {
        res.status(404).json({
            ok: false,
            msg:'Error, algun dato no esta completo.'
        })
    }
    else {
        
    }
}