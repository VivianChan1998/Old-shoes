const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = process.env.PORT || 3000

const key = '91c59bd9b23c40248d54ffa568c0c33a'

const config = require('./db-config')
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const fs = require('fs')

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(multer({dest: './temp/'}).any());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/python', (req, res) => {
    var dataToSend;
    const python = spawn('python', ['test.py', 'hellllooo']);

    python.stdout.on('data', data => {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.send(dataToSend)
    });
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './temp/')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
}
})

const upload = multer({
  storage: storage
});

app.post('/recieve-img', upload.single("file"),
(req, res) => {
  const f = req.files[0]
  const tempPath = f.path;
  const targetPath = path.join(__dirname, "./temp/image.jpg");
  console.log(targetPath)

  if (path.extname(f.originalname).toLowerCase() === ".jpg") {
    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);

      res
        .status(200)
        .end("File uploaded!");
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) return handleError(err, res);

      res
        .status(403)
        .end("Only .png files are allowed!");
    });
  }
  
  res.send({success: 'go'})
}
)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))