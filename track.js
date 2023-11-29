let startButton = document.querySelector('.start')
let stopButton = document.querySelector('.stop')
let timerInput = document.querySelector('.timerInput')
let displayEntries = document.querySelector('.displayEntries')
let categorySelect = document.querySelector('.categorySelect')
let projectSelect = document.querySelector('.projectSelect')
let inputTitle = document.querySelector('.inputTitle')
let weeklyTotal = document.querySelector('.weeklyTotal')
let categories = document.querySelector('.categories')
let categoriesContainer = document.querySelector('.categoriesContainer')
let projects = document.querySelector('.projects')
let deleteCategorySelect = document.querySelector('.deleteCategorySelect')
let editCategorySelect = document.querySelector('.editCategorySelect')


showEntries()
grabCategories()
grabProjects()

/* -------------------------- category options ---------------------------  */
async function grabCategories() {
    let response = await fetch('http://localhost:5501/categories')
    let categoryData = await response.json()

    categoryData.forEach(category => {
        let categoryOption = document.createElement("option")
        categoryOption.value = category.categoryID
        categoryOption.innerText = category.categoryName
        categorySelect.appendChild(categoryOption)
        deleteCategorySelect.appendChild(categoryOption.cloneNode(true))
        editCategorySelect.appendChild(categoryOption.cloneNode(true))
    })
    // console.log(categoryData)
}


// async function to create options for the project name select element
async function grabProjects() {
    let response = await fetch('http://localhost:5501/projects')
    let projectData = await response.json()

    projectData.forEach(project => {
        let projectOption = document.createElement("option")
        projectOption.value = project.projectID
        projectOption.innerText = project.projectName
        projectSelect.appendChild(projectOption)
    })
    // console.log(projectData)
}


// function to make checks and reset daily and weekly secons accordingly
async function checkDate() {
    let currentDate = new Date()
    let startDate = new Date().toLocaleDateString()
    // console.log(typeof(startDate))
    let response = await fetch('http://localhost:5501/entries')
    let entryDates = await response.json()
    let checkDailyDates = entryDates.some(entry => entry.entryDate === startDate)
    if (!checkDailyDates) { dailySeconds = 0 }

    if (currentDate.getDay() < 1) {
        weeklySeconds = 0
    } else {
        let entriesBeforeMonday = entryDates.some(entry => new Date(entry.entryDate).getDay() < 1)
        if (entriesBeforeMonday) { weeklySeconds = 0 }
        // console.log(entriesBeforeMonday)
    }
}


/* -------------------- Functions to get play and timer to work ------------- */
let timerInterval
let seconds = 0
let dailySeconds = 0
let weeklySeconds = 0
checkDate()
let totalDailyTime


// button to start timer
startButton.addEventListener('click', () => {
    // utilize setInterval to update the timer every second
    timerInterval = setInterval(updateTimer, 1000)
    // swaps out the start button for the stop button and also changes the color of the timer input
    startButton.classList.add('hidden')
    timerInput.classList.remove('text-slate-300')
    stopButton.classList.remove('hidden')
})

// function to add seconds to each timer and then gets formatted or displayed
function updateTimer() {
    seconds++
    dailySeconds++
    weeklySeconds++
    totalDailyTime = dailySeconds
    let formattedTime = formatTime(seconds)
    let weeklyTimeFormat = formatTime(weeklySeconds)
    timerInput.value = formattedTime
    weeklyTotal.value = weeklyTimeFormat
}


// function to convert the timers into hours, minutes, and seconds. After that it will add the colons
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
    let response = await fetch('http://localhost:5501/entries')
    let entryData = await response.json()

    e.preventDefault()

    clearInterval(timerInterval)
    stopButton.classList.add('hidden')
    startButton.classList.remove('hidden')
    timerInput.classList.add('text-slate-300')

    // gives us the selected project and category name
    let selectedProjectName = projectSelect.options[projectSelect.selectedIndex].text
    let selectedCategoryName = categorySelect.options[categorySelect.selectedIndex].text

    let newEntry = {
        entryTitle: inputTitle.value,
        // gives us the new date and filters it to just the MM/DD/YYYY format
        entryDate: new Date().toLocaleDateString(),
        entryProject: projectSelect.value,
        entryCategory: categorySelect.value,
        entryTime: timerInput.value,
    }

    fetch('http://localhost:5501/entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEntry)
    })
    .then(() => {
        // we then pass the new object and project and category names to the createNewEntry function
        createNewEntry(newEntry, selectedProjectName, selectedCategoryName, entryData)
    }) 
})


/* -------------------- new entry that gets displayed to the UI ------------- */
function createNewEntry(newEntry, projectName, categoryName, entryData) {
    
    // boolean to check if the entry date already exists
    let existingEntryDate = entryData.some(entry => entry.entryDate === newEntry.entryDate)

    let entryListItem = document.createElement("li")

    // This will be the project type of the entry
    let entryProjectName = document.createElement("p")
    entryProjectName.value = newEntry.entryProject
    entryProjectName.innerText = (projectName === 'Project Name') ? '' : projectName

    // this will be the category of the entry
    let entryCategoryName = document.createElement("p")
    entryCategoryName.value = newEntry.entryCategory
    entryCategoryName.classList.add('text-right')
    entryCategoryName.innerText = (categoryName === 'Category') ? '' : categoryName

    // this will be the title of the entry
    let entryTitleName = document.createElement("p")
    entryTitleName.value = newEntry.entryTitle
    entryTitleName.innerText = newEntry.entryTitle

    // this will display the amounted time of the entry
    let entryTimeNumber = document.createElement("p")
    entryTimeNumber.value = newEntry.entryTime
    entryTimeNumber.classList.add('text-right')
    entryTimeNumber.innerText = newEntry.entryTime

    // dividers and styling
    let listSorting = document.createElement("div")
    listSorting.classList.add('basis-8/12')
    let listDescription = document.createElement("div")
    listDescription.classList.add('basis-3/12')
    let changeDeleteTimeEnry = document.createElement("div")
    changeDeleteTimeEnry.classList.add('basis-1/12')
    let changeButton = document.createElement("button")
    changeButton.classList.add('fa-solid', 'fa-ellipsis-vertical', 'float-right')

    // more dividers
    let entrySection = document.createElement("div")
    entrySection.classList.add('flex', 'bg-slate-100')

    // appends for the elements
    listSorting.appendChild(entryProjectName)
    listSorting.appendChild(entryTitleName)
    listDescription.appendChild(entryCategoryName)
    listDescription.appendChild(entryTimeNumber)
    changeDeleteTimeEnry.appendChild(changeButton)
    entrySection.appendChild(listSorting)
    entrySection.appendChild(listDescription)
    entrySection.appendChild(changeDeleteTimeEnry)
    entryListItem.appendChild(entrySection)
    displayEntries.appendChild(entryListItem)

    // conditioning to check if the entry date already exists and update the daily total time
    if (existingEntryDate) {
        // clear input fields and reset timer
        inputTitle.value = ''
        projectSelect.value = ''
        categorySelect.value = ''
        timerInput.value = '00:00:00'
        seconds = 0
        // variable to hold the total daily time, it uses an attribute to get the date of the entry
        let dailyTotalTimeOne = document.querySelector(`.dailyTotalTimeOne[data-date="${newEntry.entryDate}"]`)
        // formats and updates the daily total time
        dailyTotalTimeOne.innerText = formatTime(totalDailyTime)
        // console.log(dailyTotalTimeOne)
    } 
    else if (!existingEntryDate) 
    {
        // This will display our date, total daily time, delete button, and collapse button
        let dailyInfoBar = document.createElement("div")
        dailyInfoBar.classList.add('flex', 'flex-row', 'bg-slate-200', 'mt-4')

        // date of info bar
        let dailyDate = document.createElement("p")
        let dailyDateContainer = document.createElement("div")
        dailyDateContainer.appendChild(dailyDate)
        dailyDateContainer.classList.add('basis-6/12')
        // dailyDate.classList.add('text-right', 'w-full')
        dailyDate.innerText = newEntry.entryDate

        // total daily time of info bar
        let dailyTotalTimeOneContainer = document.createElement("div")
        dailyTotalTimeOneContainer.classList.add('basis-2/12')
        let dailyTotalTimeOne = document.createElement("p")
        dailyTotalTimeOneContainer.appendChild(dailyTotalTimeOne)
        dailyTotalTimeOne.setAttribute('data-date', newEntry.entryDate)
        dailyTotalTimeOne.classList.add('dailyTotalTimeOne','float-right')
        // formats and updates the daily total time
        dailyTotalTimeOne.innerText = formatTime(totalDailyTime)

        // delete button of info bar
        let dailyDeleteButton = document.createElement("button")
        let dailyDeleteButtonContainer = document.createElement("div")
        dailyDeleteButtonContainer.appendChild(dailyDeleteButton)
        dailyDeleteButtonContainer.classList.add('basis-2/12')
        dailyDeleteButton.classList.add('fa-solid', 'fa-trash')

        // collapse button of info bar
        let dailyCollapseButton = document.createElement("button")
        let dailyCollapseButtonContainer = document.createElement("div")
        dailyCollapseButtonContainer.appendChild(dailyCollapseButton)
        dailyCollapseButtonContainer.classList.add('basis-2/12')
        dailyCollapseButton.classList.add('fa-solid', 'fa-chevron-up')

        // MORE appends
        dailyInfoBar.appendChild(dailyDateContainer)
        dailyInfoBar.appendChild(dailyTotalTimeOneContainer)
        dailyInfoBar.appendChild(dailyDeleteButtonContainer)
        dailyInfoBar.appendChild(dailyCollapseButtonContainer)
        listSorting.appendChild(entryProjectName)
        listSorting.appendChild(entryTitleName)
        listDescription.appendChild(entryCategoryName)
        listDescription.appendChild(entryTimeNumber)
        changeDeleteTimeEnry.appendChild(changeButton)
        entryListItem.appendChild(dailyInfoBar)
        entrySection.appendChild(listSorting)
        entrySection.appendChild(listDescription)
        entrySection.appendChild(changeDeleteTimeEnry)
        entryListItem.appendChild(entrySection)
        displayEntries.appendChild(entryListItem)

        // clear input fields and reset timer
        inputTitle.value = ''
        projectSelect.value = ''
        categorySelect.value = ''
        timerInput.value = '00:00:00'
        seconds = 0

    }
}


categories.addEventListener('click', () => {
    categoriesContainer.classList.toggle('hidden')
})
















// ------------------------------ Testing function for temp time entry ----------------------------
async function showEntries() {
    let response = await fetch('http://localhost:5501/entries')
    let entryData = await response.json()
    entryData.forEach(entry => {
        let entryListItem = document.createElement("li")

        // This will display our date, total daily time, delete button, and collapse button
        let dailyInfoBar = document.createElement("div")
        dailyInfoBar.classList.add('flex', 'flex-row', 'bg-slate-200', 'mt-4')

        let dailyDate = document.createElement("p")
        let dailyDateContainer = document.createElement("div")
        dailyDateContainer.appendChild(dailyDate)
        dailyDateContainer.classList.add('basis-6/12')
        dailyDate.classList.add('w-full')
        dailyDate.innerText = entry.entryDate

        // let dailyTotalTime = document.createElement("p")
        let dailyTotalTimeContainer = document.createElement("div")
        let dailyTotalTime = document.createElement("p")
        dailyTotalTimeContainer.appendChild(dailyTotalTime)
        dailyTotalTimeContainer.classList.add('basis-2/12')
        dailyTotalTime.classList.add('float-right')
        dailyTotalTime.innerText = entry.entryTime

        let dailyDeleteButton = document.createElement("button")
        let dailyDeleteButtonContainer = document.createElement("div")
        dailyDeleteButtonContainer.appendChild(dailyDeleteButton)
        dailyDeleteButtonContainer.classList.add('basis-2/12')
        dailyDeleteButton.classList.add('fa-solid', 'fa-trash')

        let dailyCollapseButton = document.createElement("button")
        let dailyCollapseButtonContainer = document.createElement("div")
        dailyCollapseButtonContainer.appendChild(dailyCollapseButton)
        dailyCollapseButtonContainer.classList.add('basis-2/12')
        dailyCollapseButton.classList.add('fa-solid', 'fa-chevron-up')

        // This will be the project type of the entry
        let entryProjectName = document.createElement("p")
        entryProjectName.value = entry.entryProject
        entryProjectName.innerText = entry.entryProject

        // this will be the category of the entry
        let entryCategoryName = document.createElement("p")
        entryCategoryName.classList.add('text-right')
        entryCategoryName.value = entry.entryCategory
        entryCategoryName.innerText = entry.entryCategory

        // this will be the title of the entry
        let entryTitleName = document.createElement("p")
        entryTitleName.value = entry.entryTitle
        entryTitleName.innerText = entry.entryTitle

        // this will display the amounted time of the entry
        let entryTimeNumber = document.createElement("p")
        entryTimeNumber.classList.add('text-right')
        entryTimeNumber.value = entry.entryTime
        entryTimeNumber.innerText = entry.entryTime

        // dividers and styling
        let listSorting = document.createElement("div")
        listSorting.classList.add('basis-8/12')
        let listDescription = document.createElement("div")
        listDescription.classList.add('basis-3/12')
        let changeDeleteTimeEnry = document.createElement("div")
        changeDeleteTimeEnry.classList.add('basis-1/12')
        let changeButton = document.createElement("button")
        changeButton.classList.add('fa-solid', 'fa-ellipsis-vertical', 'float-right')

        // more dividers
        let entrySection = document.createElement("div")
        entrySection.classList.add('flex', 'bg-slate-100')

        dailyInfoBar.appendChild(dailyDateContainer)
        dailyInfoBar.appendChild(dailyTotalTimeContainer)
        dailyInfoBar.appendChild(dailyDeleteButtonContainer)
        dailyInfoBar.appendChild(dailyCollapseButtonContainer)
        listSorting.appendChild(entryProjectName)
        listSorting.appendChild(entryTitleName)
        listDescription.appendChild(entryCategoryName)
        listDescription.appendChild(entryTimeNumber)
        changeDeleteTimeEnry.appendChild(changeButton)
        entryListItem.appendChild(dailyInfoBar)
        entrySection.appendChild(listSorting)
        entrySection.appendChild(listDescription)
        entrySection.appendChild(changeDeleteTimeEnry)
        entryListItem.appendChild(entrySection)
        displayEntries.appendChild(entryListItem)
    })
}