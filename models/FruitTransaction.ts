import { ColumnType } from "../Database/ColumnType";

interface IFruitTransaction {
    id: number;
    fruitid: number;
    quantity: number;
    price: number;
    date: Date;
}
export default class FruitTransaction implements IFruitTransaction{
    
    @ColumnType('number')
    id: number;
    @ColumnType('number')
    fruitid: number;
    @ColumnType('number')
    quantity: number;
    @ColumnType('number')
    price: number;
    @ColumnType('Date')
    date: Date;

    constructor(id: number,
        fruitid: number,
        quantity: number, 
        price: number, 
        date: Date) {
        this.id = id;
        this.fruitid = fruitid;
        this.quantity = quantity;
        this.price = price;
        this.date = date;
    }
}

