'use strict';

var fs        = require('fs');
// fs - this reads all the files inside the models folder
var path      = require('path');
// path - this joins the path of each file in the current directory
var Sequelize = require('sequelize');
// sequelize - creating a new sequelize instance
var basename  = path.basename(module.filename);
// basename - grabs the filename from the path
var env       = process.env.NODE_ENV || 'development';
// NODE_ENV is a system environment variable that Node exposes w/ running scripts.
// It can state whether the environment is a production or development environment.
var config    = require(__dirname + '/../config/config.json')[env];
// connects to the config.json file and pulls from the development environment
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
