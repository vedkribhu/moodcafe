const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/emailDB", {useNewUrlParser:true});

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const emailSchema = new mongoose.Schema({
  emailId: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  }
});

const Email = mongoose.model("Email", emailSchema);

app.route("/emails")

.get(function(req, resp){
    
  Email.find({}, function(err ,allEmails){
      console.log(err, allEmails);
      resp.send(allEmails);
  });
})

.post(function(req, resp){
  console.log(req.body.title);
  console.log(req.body.content);
  var postArticle = new Email({emailId: req.body.emailId});
  postArticle.save();
  resp.send("Done data update!");
})

.delete(function(req, resp){
  Article.deleteMany({}, function(err){
    if(!err){resp.send("Done the Delete.");}
    else{resp.send("err")}
  })
})

.put(function(req, resp){
  Email.update(
    {emailId: req.params.emailId},
    {emailId: req.body.emailId},
    {overwrite: true},
    function(err){
      if(!err){resp.send("Done Update!")}
      else{resp.send(err)}
    }
  )
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});