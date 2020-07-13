const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000

const key = '91c59bd9b23c40248d54ffa568c0c33a'

const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('./db-config')
const url = require('url');
const { query } = require('express');

const endpoint = config.endpoint
const dbkey = config.key

const databaseId = config.database.id
const containerId = config.container.id
const partitionKey = { kind: 'Hash', paths: ['/Country'] }

const client = new CosmosClient(endpoint)

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

async function queryContainer() {
    console.log(`Querying container:\n${config.container.id}`)
  
    // query to return all children in a family
    // Including the partition key value of lastName in the WHERE filter results in a more efficient query
    const querySpec = {
      query: 'SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName',
      parameters: [
        {
          name: '@lastName',
          value: 'Andersen'
        }
      ]
    }
  
    const { resources: results } = await client
      .database(databaseId)
      .container(containerId)
      .items.query(querySpec)
      .fetchAll()
    for (var queryResult of results) {
      let resultString = JSON.stringify(queryResult)
      console.log(`\tQuery returned ${resultString}\n`)
    }
}

app.get('/query-test', (req, res) => {
    console.log('startQuery')
    queryContainer()
        .catch(err => console.log(err))
    console.log('endQuery')
    res.send('success')
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))