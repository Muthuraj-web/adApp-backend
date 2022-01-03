const {verify} = require('jsonwebtoken')
const {db} = require('../connection')
require('dotenv').config()

const checkValidUser = (req,res,next)=>{
    if (! 'token' in req.body) return res.send({err:"Token not provided"})
    try{
        const tokenValues = verify(req.body.token,process.env.JWT_PRIVATEKEY)
        res.locals.tokenValues = tokenValues
        next()
    }
    catch(e){
        res.send({err:e.message})
    }
}

const useQuery = (req,res,next)=>{
	const {query,placeHolder} = res.locals
	db.query(query,placeHolder,(err,result,field)=>{
		if(err){
			return res.send({err:err.code})
		}
		else{
			return res.send(result || {})
		}
	})
}

module.exports = {
    checkValidUser,
    useQuery
}