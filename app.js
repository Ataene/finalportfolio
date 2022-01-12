const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const textarea = req.body.textarea;

    const listId = "b2254cac75";

    const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        textarea: textarea
    };
    
    mailchimp.setConfig({
    apiKey: "ee4364a8ecd8eb7885afde5de5674927-us20",
    server: "us20",
    });

    async function run() { 

        const response = await mailchimp.lists.addListMember(listId, {
        email_address: data.email,
        status: "subscribed",
        merge_fields:{
            FNAME: data.firstName,
            LNAME: data.lastName,
            TEXT : data.textarea
            }
        });
    res.sendFile(__dirname + "/success.html");
    // console.log(`Successfully added contact as and audience member. The contact id is ${response.id}`)
    } 
    run()
    .catch(e => 
        res.sendFile(__dirname + "/failure.html"));
});


app.post("/index.html", function(req, res){
    res.redirect("/failure.html");
});


app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(port, () => {
    
    console.log(`App is listening on ${port}`)
});

// ApiKey
// ee4364a8ecd8eb7885afde5de5674927-us20