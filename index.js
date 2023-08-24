
const multer = require("multer");
const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const File = require("./models/File");
const app = express();
const port = process.env.PORT || 3000;
const DB = 'mongodb+srv://ranjan9977:ranjan@cluster0.8qbqbka.mongodb.net/?retryWrites=true&w=majority'

const upload = multer({ dest: "uploads" });
mongoose.set("strictQuery", false);
mongoose.connect(DB);
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/upload", upload.single("file"), async (req, res) => {
  const filedata = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  if (req.body.password != null && req.body.password !== "") {
    filedata.password = await bcrypt.hash(req.body.password, 10);
  }
  const file = await File.create(filedata);
  res.render("index", { filelink: `${req.headers.origin}/file/${file.id}` });
});
app.route('/file/:id').get(handlevent).post(handlevent)

async function handlevent(req,res){
  const file = await File.findById(req.params.id);
  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
  
      return;
    }
   if(!await bcrypt.compare(req.body.password,file.password)) {
res.render('password',{error: true})
return
   }
  } 
  file.downloadcount++;
  await file.save();
  res.download(file.path, file.originalName)
  
}

app.listen(port, (e) => {
  if (e) throw e;
  console.log("started ");
});
