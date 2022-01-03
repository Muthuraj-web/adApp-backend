const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./router/authRoutes');
const adRoutes = require('./router/adRoutes');
const commentRoutes = require('./router/commentRoutes')
const {db} = require('./connection')

app.use(cors({
  origin:"*"
}))
app.use(express.json());

app.use('/ad',adRoutes)
app.use('/auth',authRoutes)
app.use('/comment',commentRoutes)

app.listen(process.env.PORT || 8080,()=>{console.log('Connected App')})
