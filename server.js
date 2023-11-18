const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 5500

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let entries = [
    { 
        entryID: 1, 
        entryTitle: 'Worked on svelte component',
        entryDate: '2023-11-17',
        entryProject: 1,
        entryCategory: 1,
        entryTime: '00:01:23', 
    }
]

let categories = [
    { 
        categoryID: 1, 
        categoryName: 'School' 
    },
    { 
        categoryID: 2, 
        categoryName: 'Work' 
    },
]

let projects = [
    { 
        projectID: 1, 
        projectName: 'DGM3770' 
    },
    { 
        projectID: 2, 
        projectName: 'Adobe Developer Team' 
    },
]

app.get('/entries', (req, res) => {
    res.send(entries)
    console.log("its working")
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})