const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const router = express.Router()

const mongoUrl = 'mongodb+srv://59160316:a0147258369@student-cluster-ugzj4.gcp.mongodb.net/test?retryWrites=true&w=majority'

//allow client to access cross domain or ip-address 
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

router.post('/attendance', async(req, res) => {

    // Request Body
    let atten = req.body

    let client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
        console.log(err)
        res.status(500).json({ error: err })
    })

    try {
        let db = client.db('attenDB')

        let result = await db.collection('attendance').insertOne(atten)
        res.status(201).send({ mssage: 'Create attendance successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    } finally {
        client.close()
    }

})

router.get('/attendance', async(req, res) => {
    let client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
        console.log(err)
        res.status(500).json({ error: err })
    })

    try {
        let db = client.db('attenDB')

        let docs = await db.collection('attendance').find({}).toArray()
        res.json(docs)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    } finally {
        client.close()
    }
})

router.get('/attendance/:id', async(req, res) => {
    let id = req.params.id

    let client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
        console.log(err)
        res.status(500).json({ error: err })
    })

    try {
        let db = client.db('attenDB')

        let docs = await db.collection('attendance').findOne({ _id: ObjectID(id) })
        res.json(docs)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    } finally {
        client.close()
    }
})

router.get('/student/:key', async(req, res) => {
    let key = req.params.key

    let client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
        console.log(err)
        res.status(500).json({ error: err })
    })

    try {
        let db = client.db('attenDB')

        let docs = await db.collection('students').findOne({ key: key })
        res.json(docs)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    } finally {
        client.close()
    }
})

//test send data from index.html to socket
router.get('/', async(req, res) => {
    res.sendFile(__dirname + '/index.html')
})

module.exports = router