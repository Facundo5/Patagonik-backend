const app = require("../app");
const mercadopago = require("mercadopago");
const ACCESS_TOKEN = `${process.env.ACCESS_TOKEN}`

mercadopago.configure({
    access_token: ACCESS_TOKEN
})

const main = () => {
    app.listen(app.get('port'));
    console.log(`Servidor corriendo en el puerto: ${app.get('port')}`)
}

main();