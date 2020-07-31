require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
// const encrypt = require('mongoose-encryption') // FOR ENCRYPTION
const md5 = require('md5') // FOR HASHING

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
  password: String,
  email: String
})

const User = mongoose.model("User",userSchema)

app.get('/', (req,res)=>{
  res.render('home');
})

app.get('/login', (req,res)=>{
  res.render('login',{errorText:"", display: 'display: none;'});
})

app.post('/login', (req,res)=>{
  User.findOne({email: req.body.username}, (err, foundUser)=>{
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === md5(req.body.password)){
          res.render('secrets')
        }else{
          res.render('login', {errorText: "Enter correct Password and try again please !", display: 'display:block;'})
        }
      }else{
        res.render('login', {errorText: "User not registered !", display: 'display:block;'})
      }
    }
  })
})

app.get('/register', (req,res)=>{
  res.render('register');
})

app.post('/register', (req,res)=>{
  email = req.body.username
  password = req.body.password

  const newUser = new User({
    email: email,
    password: md5(password)
  })
  newUser.save((err)=>{
    if(!err){
      res.render('secrets')
    }else{
      console.log(err)
    }
  })

})


// setting up the server
const port = process.env.PORT || 3000

app.listen(port, ()=>{
  let dt = new Date();
  let time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  console.log(`Server started on port ${port} at ${time}`);
})
