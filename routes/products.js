const express = require('express');
const routes = express.Router();

const { getAllProductStatic, getAllProduct } = require('../controllers/products');

routes.route('/').get(getAllProduct);
routes.route('/static').get(getAllProductStatic);

module.exports = routes;