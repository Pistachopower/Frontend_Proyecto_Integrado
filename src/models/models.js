// Enumeraciones para tipos de tarjeta y billetera digital
const TipoTarjeta = {
    VISA: 1,
    MASTERCARD: 2,
    AMEX: 3,
    properties: {
        1: { name: "Visa" },
        2: { name: "Mastercard" },
        3: { name: "American Express" }
    }
};

const ProveedorBilletera = {
    PAYPAL: 1,
    STRIPE: 2,
    GOOGLEPAY: 3,
    properties: {
        1: { name: "PayPal" },
        2: { name: "Stripe" },
        3: { name: "Google Pay" }
    }
};

class Tarjeta {
    constructor({
        tipoTarjeta, // Debe ser uno de TipoTarjeta
        metodoPago,  // Referencia a un objeto MetodoPago
        numTarjetaEncriptado,
        propietario,
        fechaCaducidad, // Formato MM/AA
        moneda
    }) {
        this.tipoTarjeta = tipoTarjeta;
        this.metodoPago = metodoPago;
        this.numTarjetaEncriptado = numTarjetaEncriptado;
        this.propietario = propietario;
        this.fechaCaducidad = fechaCaducidad;
        this.moneda = moneda;
    }
}

class CuentaBancaria {
    constructor({
        metodoPago, // Referencia a un objeto MetodoPago
        iban,
        banco,
        moneda
    }) {
        this.metodoPago = metodoPago;
        this.iban = iban;
        this.banco = banco;
        this.moneda = moneda;
    }
}

class BilleteraDigital {
    constructor({
        proveedor, // Debe ser uno de ProveedorBilletera
        metodoPago, // Referencia a un objeto MetodoPago
        email
    }) {
        this.proveedor = proveedor;
        this.metodoPago = metodoPago;
        this.email = email;
    }
}

// Exportar las clases y enums si es necesario
module.exports = {
    Tarjeta,
    CuentaBancaria,
    BilleteraDigital,
    TipoTarjeta,
    ProveedorBilletera
};