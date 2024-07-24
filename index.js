const express = require('express');
const productCategories = require('./routes/productCategories');
const products = require('./routes/product');
const users = require('./routes/users');
const cors = require('cors');
const app = express();
const PORT = 5001;
const bodyparser = require('body-parser');

app.use(cors());
app.use(bodyparser.json());
app.use('/productCategories', productCategories);
app.use('/products', products);
app.use('/users', users);

const server = app.listen(5001, () => {
    console.log('App is running on the port-5001')
});