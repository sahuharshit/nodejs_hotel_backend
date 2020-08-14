// refer to https://github.com/sequelize/express-example
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
// var env       = process.env.NODE_ENV || 'development';
// var config    = require(__dirname + '/../config/config.js')[env];
var db        = {};

// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }


const sequelize = new Sequelize("hoteldb", "cwqbadfs", "w2V9ih7_zdzmR_a2jH9smaEMQhlDWnag", {
	host: "satao.db.elephantsql.com",
	dialect: "postgres",
	operatorAliases: false,
	pool: {
		max: 5, //maximum number of connections allowed
		min: 0, // min no. of connections
		aquire: 30000, //max time in milliseconds to get a connection before sending error
		idle: 10000 //max time connection can be idle for
	}
})


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;