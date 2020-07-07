const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000

const key = '91c59bd9b23c40248d54ffa568c0c33a'

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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))