const express = require('express')
const {checkValidUser,useQuery} = require('./utils')
const router = express.Router()
const { db } = require('../connection')

const getAll = 'SELECT a.adID,a.userID,u.name,u.email,a.title,a.description,a.created,a.edited FROM ADS as a INNER JOIN USERS as u ON a.userID = u.userID'
const getAdbyadID = 'SELECT a.adID,a.userID,u.name,u.email,a.title,a.description,a.created,a.edited FROM (SELECT * FROM ADS WHERE adID = ?) as a INNER JOIN USERS as u ON a.userID=u.userID'
const updateQuery = 'UPDATE ADS SET title = ?,description = ?,edited=CURDATE() WHERE adID = ?;'
const selectDateQuery = 'SELECT edited from ADS WHERE adID=?'
const deleteQuery = 'DELETE FROM COMMENTS WHERE adID = ?;DELETE FROM ADS WHERE adID = ?'
const addNewAdQuery = 'INSERT INTO ADS (userID,title,description,created) VALUES (?,?,?,CURDATE())'
const getAdbyUserID = 'SELECT a.adID,a.userID,u.name,u.email,a.title,a.description,a.created,a.edited FROM ADS as a INNER JOIN USERS as u ON a.userID = u.userID WHERE u.userID = ?'

router.get('/getAll',(req,res,next)=>{
	res.locals.query = getAll;
	res.locals.placeHolder = []
	next() 
},useQuery);

router.get('/:adID',(req,res,next)=>{ 
	res.locals.query = getAdbyadID
	res.locals.placeHolder = [req.params.adID,req.params.adID]
	next()
},useQuery);

router.get('/myAds/:userID',(req,res,next)=>{

    res.locals.query = getAdbyUserID
    res.locals.placeHolder = [req.params.userID]
    next()
},useQuery)


router.post('/update',checkValidUser,async(req,res)=>{
    const {title,description,adID} = req.body

    db.query(updateQuery+selectDateQuery,[title,description,adID,adID],(err,results,field)=>{
        if(err) return res.send({err:err.code})
        else return res.send([{edited:results[1][0]}]) 
    })
})

router.post('/delete',checkValidUser,async(req,res,next)=>{
    res.locals.query = deleteQuery
    res.locals.placeHolder = [req.body.adID,req.body.adID]
    next()
},useQuery)

router.post('/new',checkValidUser,async(req,res,next)=>{
    res.locals.query = addNewAdQuery
    res.locals.placeHolder = [req.body.userID,req.body.title,req.body.description]
    next()
},useQuery)

module.exports = router