const nodemailer = require('nodemailer')

//Solicitamos el email y el token enviado desde el registro
const contactUs = async (email,html)=> {
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
        subject: 'Confirma tu cuenta',
        html,
    }

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje)
    console.log(info)
}
const getTemplateContactus = (token, name) => {
    return `
    <head>
    <link rel="stylesheet" href="./styleverifycationemail.css">
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
        <img class="imagen" src="https://p4.wallpaperbetter.com/wallpaper/735/884/852/welcome-home-welcome-home-hd-wallpaper-preview.jpg" height="300" width="400"  alt="">
        <h2>Hola ${name} bienvenido a Patagonik, tu tienda online.</h2>
        <p>Recibimos tu solicitud para ponerte en contacto con nosotros</p>
        <p>Un asesor comercial va a estar contactandote lo antes posible!</p>
        <p>Gracias por utilizar nuestra plataforma!</p>
    </div>
    <div class="footer">
    <p>Este mensaje fue enviado debido a la aceptacion de los terminos y condiciones de nuestra web, si desea dejar de recibir estos mensajes, hace click aca.</p>
    <p>Aclaracion: Esta pagina no realiza venta de zapatillas originales de marcas de renombre.</p>
    <p>&copy; PatagonianStyles, Todos los derechos reservados</p>
    </div>`;
}

module.exports = {
    contactUs,
    getTemplateContactus
}