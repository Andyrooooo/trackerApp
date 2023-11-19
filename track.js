let startButton = document.querySelector('.start')
let stopButton = document.querySelector('.stop')
let timerInput = document.querySelector('.timerInput')
let displayEntries = document.querySelector('.displayEntries')
let categorySelect = document.querySelector('.categorySelect')
let projectSelect = document.querySelector('.projectSelect')
let inputTitle = document.querySelector('.inputTitle')


/* -------------------------- category options ---------------------------  */
async function grabCategories() {
    let response = await fetch('http://localhost:5500/categories')
    let categoryData = await response.json()

    categoryData.forEach(category => {
        let categoryOption = document.createElement("option")
        categoryOption.value = category.categoryID
        categoryOption.innerText = category.categoryName
        categorySelect.appendChild(categoryOption)
    })
    // console.log(categoryData)
}
grabCategories()


/* -------------------------- project name options ---------------------------  */
async function grabProjects() {
    let response = await fetch('http://localhost:5500/projects')
    let projectData = await response.json()

    projectData.forEach(project => {
        let projectOption = document.createElement("option")
        projectOption.value = project.projectID
        projectOption.innerText = project.projectName
        projectSelect.appendChild(projectOption)
    })
    // console.log(projectData)
}
grabProjects()


/* -------------------- Functions to get play and timer to work ------------- */
let timerInterval
let seconds = 0

startButton.addEventListener('click', () => {
    // utilize setInterval to update the timer every second
    timerInterval = setInterval(updateTimer, 1000)
    // swaps out the start button for the stop button and also changes the color of the timer input
    startButton.classList.add('hidden')
    timerInput.classList.remove('text-slate-300')
    stopButton.classList.remove('hidden')
})

// adds 1 to the seconds variable every second
// we then grab the formatTime function and add the seconds variable to it to format the time correctly and put that value inside the formattedTime variable
function updateTimer() {
    seconds++
    let formattedTime = formatTime(seconds)
    timerInput.value = formattedTime
}

// if the totalSeconds has a remained that is below 60 seconds then it will count as seconds
// if the totalSeconds has a remainer that is above 60 seconds and below 60 minutes then it will count as minutes
// if the totalSeconds has a remainder that is above 3600 seconds then it will count as hours
function formatTime(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600)
    let minutes = Math.floor((totalSeconds % 3600) / 60)
    let seconds = totalSeconds % 60

    // When we return we add the colon between the hours, minutes, and seconds
    return (
        colons(hours) + ':' +
        colons(minutes) + ':' +
        colons(seconds)
    )
}

// if number is less than 10 then we add a 0 in front, if not then we just return the number
function colons(number) {
    return (number < 10 ? '0' : '') + number
}
/* ------------------ end of play and timer functions ---------------------- */




// stops the timer when the stop button is clicked and we also hide the stop button after
stopButton.addEventListener('click', async (e) => {
    e.preventDefault()

    clearInterval(timerInterval)
    stopButton.classList.add('hidden')
    startButton.classList.remove('hidden')
    timerInput.classList.add('text-slate-300')

    let selectedProjectName = projectSelect.options[projectSelect.selectedIndex].text
    let selectedCategoryName = categorySelect.options[categorySelect.selectedIndex].text

    let newEntry = {
        entryTitle: inputTitle.value,
        entryDate: new Date(),
        entryProject: projectSelect.value,
        entryCategory: categorySelect.value,
        entryTime: timerInput.value,
    }

    fetch('http://localhost:5500/entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEntry)
    })
    .then(() => {
        createNewEntry(newEntry, selectedProjectName, selectedCategoryName)
    })
})

function createNewEntry(newEntry, projectName, categoryName) {
    // console.log(entryData)
    let entryListItem = document.createElement("li")
    // This will be the project type of the entry
    let entryProjectName = document.createElement("p")
    entryProjectName.value = newEntry.entryProject
    entryProjectName.innerText = (projectName === 'Project Name') ? '' : projectName

    // this will be the category of the entry
    let entryCategoryName = document.createElement("p")
    entryCategoryName.value = newEntry.entryCategory
    entryCategoryName.innerText = (categoryName === 'Category') ? '' : categoryName

    // this will be the title of the entry
    let entryTitleName = document.createElement("p")
    entryTitleName.value = newEntry.entryTitle
    entryTitleName.innerText = newEntry.entryTitle

    // this will display the amounted time of the entry
    let entryTimeNumber = document.createElement("p")
    entryTimeNumber.value = newEntry.entryTime
    entryTimeNumber.innerText = newEntry.entryTime

    entryListItem.appendChild(entryProjectName)
    entryListItem.appendChild(entryCategoryName)
    entryListItem.appendChild(entryTitleName)
    entryListItem.appendChild(entryTimeNumber)
    displayEntries.appendChild(entryListItem)

    inputTitle.value = ''
    projectSelect.value = ''
    categorySelect.value = ''
    timerInput.value = '00:00:00'
    seconds = 0
    console.log(newEntry)
}
