const nodemailer = require('nodemailer')

//Solicitamos el email y el token enviado desde el registro
const notificationDelProductAdmin = async (email,html)=> {
    //Hacemos la configuracion de gmail, para que los correos se envien desde esta plataforma.
    const config = {
        host : process.env.HOST_EMAILVERIFICATION,
        port : process.env.PORT_EMAILVERIFICATION,
        auth: {
            user : process.env.ADMIN_EMAIL,
            pass : process.env.ADMIN_EMAIL_PASSWORD
        }
    }
    //Enviamos El correo del que envia (Nosotros) el email que va a recibir(cliente) un asunto y el texto
    const mensaje = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: 'Tu producto no fue publicado',
        html,
    }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje)
    console.log(info)
}
const getTemplateDelProductAdmin = (name, razon ) => {
    return `
    <head>
    <style>
    .email_content{
        text-align: center;
    }
    .btnverification {
        font-family: Arial, Helvetica, sans-serif;
        border-radius: 15px;
        margin: 30px 40px;
        padding: 15px 30px;
        border-style: none;
        background-color: #34a0a4;
    }
    .link {
        text-decoration: none;
        font-weight: bold;
    }
    .imagen {
        justify-content: center;
        align-items: center;
    }
    .footer {
        color: #6c757d;
    }
    </style
    </head>
    
    <div class="email_content">
        <img class="imagen" src="https://res.cloudinary.com/dd1nlgkmn/image/upload/v1698641109/assetsNodemailer/publicationdelete_g5jzvy.png" height="300" width="400"  alt="">
        <h2>Hola ${name}, Lamentamos hacerte llegar esta notificacion!</h2>
        <p>Hemos notado una irregularidar en cuanto a su publicacion de su producto en nuestra plataforma.</p>
        <p>Hemos tomado la decision de no autorizar la publicacion de su articulo</p>
        <p>Su articulo no fue publicado por la siguiente razon: ${razon},</p>
        <p>Nuestras normas son claras, ante un incumplimiento reiterado, su cuenta puede llegar a ser suspendida.</p>
        <p>Gracias por utilizar PATAGONIK</p>
    </div>
    <div class="footer">
    <p>Este mensaje fue enviado debido a un incumplimiento de nuestras reglas.</p>
    <p>Aclaracion: Esta pagina no realiza venta de zapatillas originales de marcas de renombre.</p>
    <p>&copy; Patagonik, Todos los derechos reservados</p>
    </div>`;
}

module.exports = {
    notificationDelProductAdmin,
    getTemplateDelProductAdmin
}