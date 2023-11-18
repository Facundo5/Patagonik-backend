const mercadopago = require("mercadopago");
const { getConnection } = require("../database/database");

const generateLink = (req, res) => {
  const { quantity_purchase, price_product, title_product, image_product, id_size, id_shoes } = req.body;
  // Crea un objeto de preferencia
  const number = parseInt(quantity_purchase)
  let preference = {
    back_urls: {
      success: 'http://localhost:3000/api/success',

    },
    items: [
      {
        id: id_shoes,
        title: title_product,
        unit_price: price_product,
        quantity: number,
        picture_url: image_product,
        currency_id: "ARS"
      },
    ],
    notification_url: 'https://48c9-181-105-33-165.sa.ngrok.io/api/notification',
    metadata: { id_size }
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json(response.body.init_point)
    })
    .catch(function (error) {
      console.log(error);
    });
};

const statusNotificationMP = async (req, res) => {
  console.log("NOTIFICADO")
  const { query } = req;
  //console.log(query);
  const topic = query.topic || query.type;
  var merchantOrder
  switch (topic) {
    case "payment":
      const paymentId = query.id || query['data.id'];
      //console.log(topic, 'getting payment', paymentId);
      const payment = await mercadopago.payment.findById(paymentId);
      console.log(payment);
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //|||SE CREA EL PAGO Y AL OBTENER EL ID DEL PAGO LO BUSCAMOS CON UN GET A MERCADO MAGO (findById) DE ESTA MANERA OBTENDREMOS TODOS ESTOS DATOS A CONTINUACION|||
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||



      //Informacion del usuario
      const ip_address = payment.body.additional_info.ip_address
      const first_name = payment.body.payer.first_name
      const last_name = payment.body.payer.last_name
      const email = payment.body.payer.email
      const identification_type = payment.body.payer.identification.type
      const identification_number = payment.body.payer.identification.number
      const area_code_phone = payment.body.payer.phone.area_code
      const phone_number = payment.body.payer.phone.number
      //Informacion del producto
      const title_product = payment.body.additional_info.items[0].title
      const quantity = payment.body.additional_info.items[0].quantity
      const price_unit = payment.body.additional_info.items[0].unit_price
      //Informacion de envio
      const shipping_amount = payment.body.shipping_amount
      //REVEER INFORMACION PARA PAGO DE ENVIO EN MERCADO PAGO, DOCUMENTACION DE MERCADO PAGO DEPRECADO
      // const shipping_street_name = payment.body.additional_info.shipments.receiver_adress.street_name//
      // const shipping_street_number = payment.body.additional_info.shipments.receiver_adress.street_number
      // const shipping_zip_code = payment.body.additional_info.shipments.receiver_adress.zip_code//
      // const shipping_city_name = payment.body.additional_info.shipments.receiver_adress.city_name//
      // const shipping_state_name = payment.body.additional_info.shipments.receiver_adress.state_name//
      //Comisiones externas a la web
      //Con este ID podemos ver toda la informacion que almacena mercado pago y el estado de la misma. METODO GET
      const id_payment = payment.body.id
      //Informacion de la transaccion
      //const order_type = payment.body.order.type//
      const payment_method_id = payment.body.payment_method_id//
      const transaction_amount = payment.body.transaction_amount//
      const transaction_amount_refunded = payment.body.transaction_amount_refunded//
      const net_received_amount = payment.body.transaction_details.net_received_amount//
      const total_paid_amount = payment.body.transaction_details.total_paid_amount//
      const installment_amount = payment.body.transaction_details.installment_amount//
      const installments = payment.body.installments//
      //Estado de la transaccion
      const status_detail = payment.body.status_detail//   
      const statuse = payment.body.status//
      const date_approved = payment.body.date_approved
      const date_created = payment.body.date_created
      const date_last_update = payment.body.date_last_updated

      //Creamos la conexion a la base de datos
      const connection = await getConnection();
      // const res = await connection.query('SELECT id_user FROM users WHERE email = ?', email)
      // console.log(res)
        const id_user = 3
        const paymentdetails = {
          ip_address,
          email,
          id_user,
          price_unit,
          quantity,
          date_approved,
          date_created,
          date_last_update,
          id_payment,
          first_name,
          last_name,
          identification_type,
          identification_number,
          area_code_phone,
          phone_number,
          title_product,
          shipping_amount,
          payment_method_id,
          transaction_amount,
          transaction_amount_refunded,
          net_received_amount,
          total_paid_amount,
          installment_amount,
          installments,
          status_detail,
          statuse
        }
        console.log(paymentdetails)
        const createpayment = await connection.query('INSERT INTO virtualshopping SET ?', [paymentdetails])
        //CONSULTAMOS A LA BASE DE DATOS SI ESE ID_PAYMENT YA ESTA CREADO EN LA BASE DE DATOS, SI DEVUELVE UN FALSE CREAREMOS UN PAYMENT CON ESE ID JUNTO A TODA LA INFORMACION
        if (!createpayment) {
          const id_payment_created = result.id_payment
          const updatePayment = await connection.query('UPDATE virtualshoppingd SET = ?  WHERE id_payment = ?', [paymentdetails, id_payment_created])
        }
        else {
          console.log('El pago fue registrado en la base de datos con exito')
        }
      break;
    case "merchant_order":
      const orderId = query.id
      merchantOrder = await mercadopago.merchant_orders.findById(orderId);
      break;
  }
  res.send();
}
module.exports = {
  generateLink,
  statusNotificationMP
}