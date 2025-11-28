class Pedidos {
    constructor(mesa, data_hora, status, valor_total){
        this.mesa = mesa;
        this.data_hora = data_hora;
        this.status = status;
        this.valor_total = valor_total; 

    }


    get status(){
        return this.status;
    }
    
    get valor_total(){
        return this.valor_total;
    }

}

class CriarPedido {
    //constructor(mesa, data_hora)
}
export { Pedidos}; 