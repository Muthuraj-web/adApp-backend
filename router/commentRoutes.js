const express = require('express')
const router = express.Router()
const {checkValidUser,useQuery} = require('./utils')

const addCommentQuery = `INSERT INTO COMMENTS(userID,adID,comments,created) VALUES (?,?,?,CURDATE())`
const getCommentsbyadID = 'SELECT c.userID,c.adID,u.name,u.email,c.comments,c.created FROM (SELECT * FROM COMMENTS WHERE adID = ?) as c INNER JOIN USERS as u ON c.userID = u.userID'


router.post('/add',checkValidUser,(req,res,next)=>{
    const {adID,comments} = req.body
    const {userID} = res.locals.tokenValues
    
    res.locals.query = addCommentQuery
    res.locals.placeHolder = [userID,adID,comments]
    next()
},useQuery)

router.get('/:adID',(req,res,next)=>{ 
	res.locals.query = getCommentsbyadID
	res.locals.placeHolder = [req.params.adID]
	next()
},useQuery);

module.exports = router