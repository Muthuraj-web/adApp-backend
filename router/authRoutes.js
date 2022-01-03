const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../connection');
require('dotenv').config()

router.post('/signup', (req, res) => {
	const { name, email, password } = req.body;

	if (name === undefined || name.length === 0) return res.send({ err: 'Please provide a valid name', field: ['name'] });
	else if (email === undefined || email.length === 0) return res.send({ err: 'Please provide a valid name', field: ['email'] });
	else if (password === undefined || password.length < 8) return res.send({ err: 'Please provide a valid name', field: ['password'] });

	const selectQuery = 'SELECT email FROM USERS WHERE email = ?';

	db.query(selectQuery, [req.body.email], (err, results, fields) => {
		if (err) return res.send({ err: err.code });

		else if (results.length) {
			return res.send({
				err: 'User with Email Already Exists',
				fields: ['email']
			});
		}

		const insertQuery = 'INSERT INTO USERS (name,email,password,oAuth) VALUES(?,?,?,?);';
		const selectQuery = 'SELECT (userID) FROM USERS WHERE email = ?'

		db.query(insertQuery+selectQuery,[name, email, password, false,email],(err, results, fields) => {
			if (err) return res.send({ err: err.code });
			else{
				const {userID} = results[1][0]
				const token = jwt.sign({userID,name,email,password},process.env.JWT_PRIVATEKEY)
				res.send({token})
			}
		});
	});
});

router.post('/login',(req,res)=>{
	const { email, password } = req.body;


	if (email === undefined || email.length === 0) return res.send({ err: 'Please provide a valid name', field: ['email'] });
	else if (password === undefined || password.length < 8) return res.send({ err: 'Please provide a valid name', field: ['password'] });

	const selectQuery = 'SELECT userID,name FROM USERS WHERE email = ? and password = ?'
	
	db.query(selectQuery,[email,password],(err,results,fields)=>{
		if (results.length===0) res.send({err:"Invalid email or password"})
		else if (results.length===1){
			const {userID,name} = results[0]
			const token = jwt.sign({userID,name,email,password},process.env.JWT_PRIVATEKEY)
			res.send({token})
		} 
		else res.send({err:"Fatal Error due to existing of multiple accounts with same credentials : try again later"})
	})	

})
module.exports = router;
