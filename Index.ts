// Models
import TestMessage from './models/TestMessage';
import SloganTShirt from './models/SloganTShirt';
import FruitTransaction from './models/FruitTransaction';
// Database
import { addModels } from './Database/DataLayer';
import { repo } from './Database/Repository';

// Add models to database
addModels();

// Load repositories
const R_FruitTransaction = repo(FruitTransaction);
const R_SloganTShirt = repo(SloganTShirt);
const R_TestMessage = repo(TestMessage);


// Testing Zone 

// Create a new TestMessage
const testMessage = new TestMessage(1, 'Hello World');

R_TestMessage.create(testMessage).then(_ => R_TestMessage.all()
    .then(testMessages => {
        console.log(testMessages);
    }));

// Create a new SloganTShirt
const tshirt = new SloganTShirt(
    1,
    'I am a t-shirt',
    'I am a slogan',
    'XL',
    '100% RED',
);

R_SloganTShirt.create(tshirt).then(_ => R_SloganTShirt.all()
    .then(slogan_t_shirts => {
        console.log(slogan_t_shirts);
    }));



const q = `SELECT * FROM ${TestMessage.name}`;

console.log(q);

R_TestMessage.customQuery(q).then(testMessages => {
    console.log(testMessages);
});

R_FruitTransaction.all().then(fruitTransactions => {
    console.log(fruitTransactions);
});