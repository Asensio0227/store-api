const Product = require('../models/product');

const getAllProductStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort('price')
    .select('name price');
  
  res.status(200).json({ products, nbHits: products.length })
};

const getAllProduct = async (req, res) => {
  const { featured, name, company,sort,fields,numericFilters } = req.query;
  const objectQuery = {};

  if (featured) {
    objectQuery.featured = featured === 'true' ? true : false;
  };

  if (name) {
    objectQuery.name = { $regex: name, $options: 'i' };
  };

  if (company){
    objectQuery.company = company;
  }

  if (numericFilters) {
    const operatorMap = {
      '>':'$gt',
      '>=':'$gte',
      '=':'$eq',
      '<':'$lt',
      '<=':'$lte'
    }
    const venom = /\b(|<|>|=|>=|<=|>)\b/g;
    let filters = numericFilters.replace(
      venom,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        objectQuery[field] = { [operator]: Number(value) };
      }
    })
  }

  console.log(objectQuery);
  let result = Product.find(objectQuery);

  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  }else{
    result=result.sort('createdAt')
  };

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  };
  
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await result;
  res.status(200).json({products,nbHits: products.length})
};

module.exports = { getAllProduct, getAllProductStatic };
