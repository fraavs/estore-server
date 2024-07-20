const express = require('express');
const productCategories = require('./routes/productCategories');
const products = require('./routes/product');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());

app.use('/productCategories', productCategories);
app.use('/products', products);

const server = app.listen(5001, () => {
    console.log('App is running on the port-5001')
});