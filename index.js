const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

mongoose.connect("mongodb://localhost:27017/multer",  { useNewUrlParser: true ,useUnifiedTopology: true } );
const app = express();


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
      callback(null,'userPost ' + file.originalname)
    }
  })
  const upload = multer({storage: storage})

app.use(bodyParser.urlencoded({
    extended: true
}));

const postSchema = new mongoose.Schema({
    postName:String,
      image: {
        type: String,
        required: true
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date },
  })
  
  const postData = mongoose.model("postData", postSchema);

app.post('/postImage', upload.single('image'),async (req, res) => {
    try {
        const postName = req.body.postName;
        const image = req.file.filename;
        const Data = new postData({
            postName: postName,
            image: image
        });
        await Data.save();
        return res.send(Data)
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
});

app.listen(3000, () => {
    console.log("App is running on port 3000");
});