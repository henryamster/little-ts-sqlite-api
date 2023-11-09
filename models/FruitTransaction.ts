interface IFruitTransaction {
    id: number;
    fruitid: number;
    quantity: number;
    price: number;
    date: Date;
}
export default class FruitTransaction implements IFruitTransaction{
    id: number;
    fruitid: number;
    quantity: number;
    price: number;
    date: Date;
    constructor(id: number, fruitid: number, quantity: number, price: number, date: Date) {
        this.id = id;
        this.fruitid = fruitid;
        this.quantity = quantity;
        this.price = price;
        this.date = date;
    }
}

