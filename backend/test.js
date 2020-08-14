const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = process.env.PORT || 3000

const key = '91c59bd9b23c40248d54ffa568c0c33a'

const uniqueFilename = require('unique-filename')
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const fs = require('fs');
const awaitSpawn = require('await-spawn')

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(multer({dest: './temp/'}).any());

app.get('/', (req, res) => res.send('Hello World!'))
/*
async function callPythonCV(filename){
  let main = ''
  let size = ''
  let pyMain = await runPython('main.py', filename)
  .then(data => main = data.toString())

  let pySize = await runPython('size.py', filename)
  .then(data => size = data.toString())

  //console.log(main)
  //console.log(size)
  return ({
    main: main,
    size: size
  })
}
*/
async function runPython(pyname, filename){
  
  const python = awaitSpawn('python', [ pyname, filename, '5843edbf74934be5b2f5947361e4aa01','https://cv-20200706-eastasia.cognitiveservices.azure.com/'] );
  /*python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });*/
  return python
  /*
  python.stdout.on('data', data => {
    //console.log('Pipe data from python script ...');
    ret = data.toString();
    console.log("===================================")
    console.log(ret)
    return ret
  });
*/
  
/*
  python.on('close', (code, signal) => {
    if (code) {
      //console.error('Child exited with code', code)
    } else if (signal) {
      //console.error('Child was killed with signal', signal);
    } else {
      //console.log('Child exited okay');
    }
  });
  */
}

function dataURLtoFile(dataurl) {
  var matches = dataurl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
  response = {};
 
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = Buffer.from(matches[2], 'base64');

  return response;
 }
 
 
app.post('/recieve-img-url', async (req, res) => {
  var file = dataURLtoFile(req.body.file);
  var filename = uniqueFilename("./temp/", "img")　+ '.jpg'
  var targetPath = path.join(__dirname, filename)
  fs.writeFile(targetPath, file.data, err => {if(err) console.log(err)});
  console.log(`filename ${filename}`)
  let main = ''
  let size = ''
  let classification = ''

  let pyMain = await runPython('main.py', filename)
  .then(data => main = data.toString())
  .catch(err => console.log(err))

  let pySize = await runPython('size.py', filename)
  .then(data => size = data.toString())
  .catch(err => console.log(err))
  
  let pyClass = await runPython('classification.py', filename)
  .then(data => classification = data.toString())
  .catch(err => console.error(err))

  res.send({
    success: 'ok',
    data: {
      main: main,
      size: size,
      classification: classification
    }
  })
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
async (req, res) => {
  const f = req.files[0]
  const tempPath = f.path;
  var filename = uniqueFilename("./temp/", "img")　+ '.jpg'
  const targetPath = path.join(__dirname, filename);

  if (path.extname(f.originalname).toLowerCase() === ".jpg") {
    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);

      console.log("File uploaded!");
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) return handleError(err, res);
      console.log("Only .png files are allowed!");
    });
  }
  console.log(`filename ${filename}`)

  let main = ''
  let size = ''
  let classification = ''

  let pyMain = await runPython('main.py', filename)
  .then(data => main = data.toString())
  .catch(err => console.log(err))

  let pySize = await runPython('size.py', filename)
  .then(data => size = data.toString())
  .catch(err => console.log(err))
  
  let pyClass = await runPython('classification.py', filename)
  .then(data => classification = data.toString())
  .catch(err => console.error(err))

  res.send({
    success: 'ok',
    data: {
      main: main,
      size: size,
      classification: classification
    }
  })
  /*
  let mainandsize = callPythonCV(filename)
  .then(data => {
    console.log(data.toString())
    //res.send({success: 'ok', data: data.toString()})
  })
  */
}
)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))