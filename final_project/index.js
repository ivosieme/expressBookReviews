const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "secret_key",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }

    // Get username and password from request body
    const { username, password } = req.body;
    
    // Hardcoded user and password check
    if (username === "user" && password === "password") {
        // If credentials are correct, generate JWT token
        const accessToken = jwt.sign({ username: username }, "secret_key");
        
        // Attach the token to request object for further use
        req.accessToken = accessToken;

        req.session.authorization = {
            accessToken,username
        }
        
        // Proceed to next middleware
        next();
    } else {
        // If credentials are incorrect, send unauthorized response
        res.status(401).json({ message: "Unauthorized call" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
