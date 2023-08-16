const path = require('path');
const Sequelize = require('sequelize');
const config = require('config');
const db = config.get('db');
const fs = require('fs');

const sequelize = new Sequelize(db.database, db.user, db.password, db);
const basename = path.basename(module.filename);
const models = {};

const fileNames = fs.readdirSync(__dirname);
const modelFileNames = fileNames.filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.indexOf('.model.js') === file.length - 9);
});

modelFileNames.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize);

  models[model.name] = model;
});

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
