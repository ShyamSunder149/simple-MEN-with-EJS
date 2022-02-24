const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')
const app = express()
dotenv.config()
connectionString = process.env.CONN_STR
port = process.env.PORT

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    app.locals.quotesCollection = quotesCollection
    app.locals.db = db
  })
  .catch(error => console.error(error))

app.get('/',(req,res)=> {
    const quotesCollection = app.locals.quotesCollection
    quotesCollection.find().toArray()
    .then(result => {
        res.render('index.ejs',{ quotes:result })
    })
    .catch(error => console.error(error))
})

app.post('/quotes', (req, res) => {
    const quotesCollection = app.locals.quotesCollection
    quotesCollection.insertOne(req.body)
      .then(result => {
        console.log(result)
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })
  
  app.listen(port,()=> {
    console.log(`listening to port ${port}`)
})
