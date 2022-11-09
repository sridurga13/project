const request = require('request');
const express = require('express')
const app = express();
const port = 3000;

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount = require('./key.json')

initializeApp({
    credential: cert(serviceAccount)
});

const db=getFirestore();

app.set("view engine","ejs")
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/signin', (req, res) => {
    res.render("signin");
  })
app.get('/signinsubmit',(req,res)=>{
  const name=req.query.name;
    
  const email=req.query.email;
    const password=req.query.pwd;

    db.collection('users').add({
      name:name,
      email:email,
      password:password
    }).then(() =>{
      res.render("login");
    })
});
  app.get('/login', (req, res) => {
    res.render("login");
  })
  app.get('/signinfail',(req,res)=>{
    res.render("signinfail");
  })
app.get('/loginsubmit',(req,res) =>{
  const email=req.query.email;
    const password=req.query.password;
     db.collection("users")
     .where("email","==",email)
     .where("password","==",password)
     .get()
     .then((docs) =>{
      if(docs.size> 0){
        res.render("randomquote");
      }
      else{
        res.render("signinfail");
      }
     });
});

app.get('/randomquotesubmit',(req,res) =>{
  const cat = req.query.cat;
  console.log(cat);

  request.get({
      url: 'https://api.api-ninjas.com/v1/sentiment?text=' + cat,
    headers: {
      'X-Api-Key': 'tEzwBsJPHWaQoiLTsS6fyQ==CSo7ltqOV0W13poi'
    },
  }, function (error, response, body){
      if("error" in JSON.parse(body))
      {
        if((JSON.parse(body).error.code.toString()).length > 0)
        {
          res.render("randomquote");
        }
      }
      else
      {
        const score= JSON.parse(body).score;
        const text= JSON.parse(body).text;
        const sentiment= JSON.parse(body).sentiment;
       res.render('sen',{
  score:score,
  text:text,
  sentiment:sentiment
  
});

      } 
    }
    );
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})