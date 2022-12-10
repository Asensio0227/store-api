const notFound = (req, res) => res.status(404).send('Routes does not exists');

module.exports = notFound;