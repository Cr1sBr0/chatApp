// console.log(__dirname); 


import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import {showChat,insertChat,getFriends,check,check_user} from "./sql.js";


const app=express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var friends=[];
var user;
var flag=0;
app.get('/', (req, res) => {
    friends=[];
    res.render("login",{flag:flag});
  });
  app.post('/',async (req, res) => {
    user=req.body.name;
    var pass=req.body.password;
    if(await check_user(user,pass)){
        flag=1;
        res.redirect('/');
    }
    else{
        flag=0;
    res.redirect("/"+user);
    }
  });
app.get('/:user',async (req, res) => {
    var friends= await getFriends(req.params.user);
    res.render("home",{user:user,friends:friends,flag:flag});
  });
app.post('/:user',async (req,res)=>{
    flag=0;
  var name=req.body.newName;
  //friends.push(name);
  if(await check(name))
  await insertChat(user,name,'');
  else
  flag=1;
  res.redirect('/'+user);
})
app.get('/chat/:name',async (req,res)=>{
    const arr=await showChat(user,req.params.name);
    res.render("pmssg",{user:user,name:req.params.name,arr:arr});
})
app.post('/chat/:name',async (req,res)=>{
    var message=req.body.message;
    await insertChat(user,req.params.name,message);
    console.log(user);
    res.redirect('/chat/'+req.params.name);
  })
  app.listen(80, () => {
    console.log(`Example app listening on port }`)
  })
