const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 5501

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

  // - Testing variable for temp time entries -
// let entries = [
   
//     {  
//         entryID: 1, 
//         entryTitle: 'working on designs', 
//         entryDate: '11/26/2023',
//         entryProject: 'Adobe Developer Team',
//         entryCategory: 'Work',
//         entryTime: '00:02:00',
//     },
//     {
//         entryID: 2,
//         entryTitle: 'working on designs',
//         entryDate: '11/27/2023',
//         entryProject: 'Adobe Developer Team',
//         entryCategory: 'Work',
//         entryTime: '00:01:00',
//     },
// ]

let dailyTotalTime = [
    {
        time: 0
    },
]

let entries = []

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

// Get all entries, categories, and project names
app.get('/entries', (req, res) => {
    res.send(entries)
    // console.log("its working")
})

app.get('/categories', (req, res) => {
    res.send(categories)
    // console.log("its working")
})

app.get('/projects', (req, res) => {
    res.send(projects)
    // console.log("its working")
})


// Post request to add new entry
app.post('/entry', (req, res) => {
    // let newEntryID = entries.length === 0 ? 1 : entries.at(-1).entryID + 1

    let turnProjectToNumber = parseInt(req.body.entryProject)
    let turnCategoryToNumber = parseInt(req.body.entryCategory)
    if (isNaN(turnProjectToNumber)) {turnProjectToNumber = 0}
    if (isNaN(turnCategoryToNumber)) {turnCategoryToNumber = 0}

    let newEntry = {
        entryID: req.body.entryID,
        entryTitle: req.body.entryTitle, 
        entryDate: req.body.entryDate,
        entryProject: turnProjectToNumber,
        entryCategory: turnCategoryToNumber,
        entryTime: req.body.entryTime,
    }
 
    entries = [...entries, newEntry]
    res.send(entries)
    console.log(entries) 
}) 

app.post('/dailyTime', (req, res) => {
    newTime = req.body.dailyTime  

    dailyTotalTime[0].time = newTime
    
res.send(dailyTotalTime)
})

app.get('/dailyTime', (req, res) => {
    res.send(dailyTotalTime)
})

app.post('/dailyTime/change', (req, res) => {
    let timeToChange = parseInt(req.body.theTime)
    dailyTotalTime[0].time = timeToChange
    console.log(timeToChange)
    res.send(dailyTotalTime)
})

// Post request to add new category
app.post('/category', (req, res) => {
    let newCategory = {
        categoryID: req.body.categoryID,
        categoryName: req.body.categoryName,
    }
 
    categories = [...categories, newCategory]
    res.send(categories)
    console.log(categories)  
})

// delete reauest to delete a category
app.delete('/categories/:categoryID', (req, res) => {
    let categoryToDelete = parseInt(req.params.categoryID)
    let newCategories = categories.filter(category => category.categoryID != categoryToDelete)

    categories = [...newCategories]

    console.log(categories) 
    res.send(categories)   
})

// put request to update a category
app.put('/categories/:categoryID', (req, res) => {
    let categoryToUpdate = parseInt(req.params.categoryID)

    categories.find(category => category.categoryID == categoryToUpdate).categoryName = req.body.categoryName

    console.log(categories)
    res.send(categories)
})

// Post request to add new project name
app.post('/project', (req, res) => {
    let newProject = {
        projectID: req.body.projectID,
        projectName: req.body.projectName,
    }
 
    projects = [...projects, newProject]
    res.send(projects)
    console.log(projects)  
})

// delete request to delete a project name
app.delete('/projects/:projectID', (req, res) => {
    let projectToDelete = parseInt(req.params.projectID)
    let newProjects = projects.filter(project => project.projectID != projectToDelete)

    projects = [...newProjects]

    console.log(projects) 
    res.send(projects)   
})

// put request to update a project name
app.put('/projects/:projectID', (req, res) => {
    let projectToUpdate = parseInt(req.params.projectID)

    projects.find(project => project.projectID == projectToUpdate).projectName = req.body.projectName

    console.log(projects) 
    res.send(projects)
})

// put request to update an entry
app.put('/entries/:entryID', (req, res) => {
    let entryToUpdate = parseInt(req.params.entryID)
    let turnProjectToNumber = parseInt(req.body.entryProject)
    let turnCategoryToNumber = parseInt(req.body.entryCategory) 
 
    if (isNaN(turnProjectToNumber)) {turnProjectToNumber = 0}
    if (isNaN(turnCategoryToNumber)) {turnCategoryToNumber = 0}

    let newEntry = { 
        entryID: entryToUpdate, 
        entryTitle: req.body.entryTitle, 
        entryDate: req.body.entryDate, 
        entryProject:  turnProjectToNumber,
        entryCategory: turnCategoryToNumber, 
        entryTime: req.body.entryTime,
    
    }

    let entryWereReplacing = entries.find(entry => entry.entryID == entryToUpdate)
    entryWereReplacing = newEntry
    

    console.log(entryWereReplacing) 
    res.send(entries)
})

// delete request to delete an entry
app.delete('/entries/:entryID', (req, res) => {
    let entryToDelete = parseInt(req.params.entryID)

    let newSetOfEntries = entries.filter(entry => entry.entryID != entryToDelete)

    entries = [...newSetOfEntries]
    
    // console.log(entries) 
    res.send(entries)
})

// delete request to delete all entries
app.delete('/entries/all/:entryID', (req, res) => {

    let random = req.params.entryID
    entries = []
    
    res.send(console.log(entries))
})
 
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})