const mysql=require("mysql2");
const {faker}=require("@faker-js/faker");
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"vs",
    password:"7801888849",
});

let random=()=>{
    return[
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
    ];
};

app.listen("8080",(req,res)=>{
    console.log("start");
})
app.get("/",(req,res)=>{
    q="select count(*) from user";
try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let count=result[0]["count(*)"];
        res.render("home.ejs",{count});

    });
 }catch(err){
    console.log(err);
    res.send(err);
    }
});

app.get("/user",(req,res)=>{
    q="select * from user";
try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        res.render("user.ejs",{result});

    });
 }catch(err){
    console.log(err);
    res.send(err);
    }
});

//edit route

app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    q=`select * from user where id='${id}'`;
try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        
        let user=result[0];
        res.render("edit.ejs",{user});
    });
 }catch(err){
    console.log(err);
    res.send(err);
    }
})

//update (DB) route

app.patch("/user/:id",(req,res)=>{

        let {id}=req.params;
        let {password,username}=req.body;

        q=`SELECT * FROM user where id='${id}'`;

        try{
                connection.query(q,(err,result)=>{
                    if(err) throw err;
                    let resu=result[0];

                    if(resu.password==password){

                        qq=`UPDATE  user set username='${username}' where id='${id}'`;
                        try{
                            connection.query(qq,(err,result)=>{
                                if(err) throw err;
                                res.redirect("/user");
                            });
                            
                        }catch(err){
                            console.log(err);
                        }
                        
                    }else{
                        res.send("password is incorrect");
                    }
                });
                
            }catch(err){
                console.log(err);
            }
            
            
        
});

//add new user

app.get("/user/new",(req,res)=>{
    res.render("new.ejs")
});

app.post("/user",(req,res)=>{
    let {username,email,password}=req.body;
    
    q=`SELECT count(*) from user where email='${email}' OR username='${username}'`;

    try{
            connection.query(q ,(err,result)=>{
                if(err) throw err;
                let resul=result[0]["count(*)"];
                
                if(resul==0){
                    id=faker.string.uuid();

                    try{
                        q2=`INSERT INTO user values ('${id}','${username}','${email}','${password}')`;
                    connection.query(q2,(err,result)=>{
                        if(err) throw err;
                        res.redirect("/");
                    })
                    }catch(err){
                        res.send("invalid");
                    }
                    
                }else{
                    res.send("you are entered duplicate data");
                }
            });
            
        }catch(err){
            console.log(err);
        }
        
    
})

//DELETE user

app.get("/user/:id/delete",(req,res)=>{
    res.render("delete.ejs");
});

app.delete("/user/delete",(req,res)=>{
    let {email,password}=req.body;
    
    q=`DELETE from user where email='${email}' AND password='${password}'`;

    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            
            if(result.affectedRows==1){
                res.redirect("/user");
            }else{
                res.send("email or password is not valid");
            }
            
        });
    }catch(err){
        res.send(err);
    }
})

