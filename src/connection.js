const mysql = require('mysql');
require('dotenv').config()

const db = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: process.env.DB_PORT,
	multipleStatements: true
});

var error = false;

db.connect((err)=>{
	if(err){
		error = err
		return 
	}
	else console.log('Connected DB')
	setInterval(()=>{
		db.query('SELECT CURDATE()',(err,results,fields)=>{})
	},2000)
})

module.exports = {
	db,
	error
};
