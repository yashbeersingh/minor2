const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Router = require("./routers");
dotenv.config({ path: "./.env" });
const app = express();
const multer = require('multer');
const ejs = require('ejs');
const fs = require('fs');
const { createWorker } = require("tesseract.js");
const worker =  createWorker({
  logger: m => console.log(m),
});


const dbURI = process.env.DATABASE;
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(Router);
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(port);
    console.log("connected to mongodb and listening at port 5000");
  })
  .catch((err) => console.error(err));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
app.set('view engine', 'ejs');


app.get('/',(req,res) => {
  res.render('index');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Load the image file into Tesseract.js
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const imageBuffer = fs.readFileSync(req.file.path);
    const { data: { text } } = await worker.recognize(imageBuffer);

    // Render the OCR result in a view
    res.render('result', { text });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during OCR');
  } finally {
    // Terminate the worker after processing is complete
    await worker.terminate();
  }
});  
  
  



 
 
    
 
    


