let startButton = document.querySelector('.start')
let stopButton = document.querySelector('.stop')
let timerInput = document.querySelector('.timerInput')
let displayEntries = document.querySelector('.displayEntries')
let categorySelect = document.querySelector('.categorySelect')
let projectSelect = document.querySelector('.projectSelect')
let inputTitle = document.querySelector('.inputTitle')
let weeklyTotal = document.querySelector('.weeklyTotal')

// showEntries()

/* -------------------------- category options ---------------------------  */
async function grabCategories() {
    let response = await fetch('http://localhost:5501/categories')
    let categoryData = await response.json()

    categoryData.forEach(category => {
        let categoryOption = document.createElement("option")
        categoryOption.value = category.categoryID
        categoryOption.innerText = category.categoryName
        categorySelect.appendChild(categoryOption)
    })
    // console.log(categoryData)
}



/* -------------------------- project name options ---------------------------  */
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
grabCategories()
grabProjects()


/* -------------------- Functions to get play and timer to work ------------- */
let timerInterval
let seconds = 0
let weeklySeconds = 0

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
    weeklySeconds++
    let formattedTime = formatTime(seconds)
    let weeklyTimeFormat = formatTime(weeklySeconds)
    timerInput.value = formattedTime
    weeklyTotal.value = weeklyTimeFormat
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



// function timerTotal(time) {
//     // console.log(time)
//     weeklyTotal.value += time
//     console.log(weeklyTotal.value)
//     /* let time = 0
//     let formattedTime = formatTime(time)
//     timerInput.value = formattedTime
//     weeklyTotal.value = formattedTime */
// }


// stops the timer when the stop button is clicked and we also hide the stop button after
stopButton.addEventListener('click', async (e) => {
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
        entryDate: new Date(),
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
        // timerTotal(timerInput.value)
        createNewEntry(newEntry, selectedProjectName, selectedCategoryName)
    })
})

/* -------------------- new entry that gets displayed to the UI ------------- */
async function createNewEntry(newEntry, projectName, categoryName) {
    let response = await fetch('http://localhost:5501/entries')
    let entryData = await response.json()

    // WE STILL HAVE TO FIGURE OUT THE DAILY SECTION BAR---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /* let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    let entryDate = newEntry.entryDate
    entryDate.setHours(0, 0, 0, 0) */

    // console.log(entryData)
    // if (entryDate.getTime() === currentDate.getTime() && entryData.length === 0) {
        let entryListItem = document.createElement("li")
        entryListItem.classList.add('flex')

        // This will display our date, total daily time, delete button, and collapse button
        let dailyInfoBar = document.createElement("div")
        let dailyDate = document.createElement("p")
        dailyDate.innerText = newEntry.entryDate
        let dailyTotalTime = document.createElement("p")
        dailyTotalTime.innerText = newEntry.entryTime
        let dailyDeleteButton = document.createElement("button")
        dailyDeleteButton.classList.add('fa-solid', 'fa-trash')
        let dailyCollapseButton = document.createElement("button")
        dailyCollapseButton.classList.add('fa-solid', 'fa-chevron-up')

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

        // dividers and styling
        let listSorting = document.createElement("div")
        listSorting.classList.add('basis-8/12', 'bg-red-400')
        let listDescription = document.createElement("div")
        listDescription.classList.add('basis-3/12', 'bg-red-400')
        let changeDeleteTimeEnry = document.createElement("div")
        changeDeleteTimeEnry.classList.add('basis-1/12', 'bg-red-400')
        let changeButton = document.createElement("button")
        changeButton.classList.add('fa-solid', 'fa-ellipsis-vertical')


        dailyInfoBar.appendChild(dailyDate)
        dailyInfoBar.appendChild(dailyTotalTime)
        dailyInfoBar.appendChild(dailyDeleteButton)
        dailyInfoBar.appendChild(dailyCollapseButton)
        listSorting.appendChild(entryProjectName)
        listSorting.appendChild(entryTitleName)
        listDescription.appendChild(entryCategoryName)
        listDescription.appendChild(entryTimeNumber)
        changeDeleteTimeEnry.appendChild(changeButton)
        entryListItem.appendChild(dailyInfoBar)
        entryListItem.appendChild(listSorting)
        entryListItem.appendChild(listDescription)
        entryListItem.appendChild(changeDeleteTimeEnry)
        displayEntries.appendChild(entryListItem)

        inputTitle.value = ''
        projectSelect.value = ''
        categorySelect.value = ''
        timerInput.value = '00:00:00'
        seconds = 0
        console.log(newEntry)
    // } else {
    //     let entryListItem = document.createElement("li")
    //     entryListItem.classList.add('flex')

    //     // This will be the project type of the entry
    //     let entryProjectName = document.createElement("p")
    //     entryProjectName.value = newEntry.entryProject
    //     entryProjectName.innerText = (projectName === 'Project Name') ? '' : projectName

    //     // this will be the category of the entry
    //     let entryCategoryName = document.createElement("p")
    //     entryCategoryName.value = newEntry.entryCategory
    //     entryCategoryName.innerText = (categoryName === 'Category') ? '' : categoryName

    //     // this will be the title of the entry
    //     let entryTitleName = document.createElement("p")
    //     entryTitleName.value = newEntry.entryTitle
    //     entryTitleName.innerText = newEntry.entryTitle

    //     // this will display the amounted time of the entry
    //     let entryTimeNumber = document.createElement("p")
    //     entryTimeNumber.value = newEntry.entryTime
    //     entryTimeNumber.innerText = newEntry.entryTime

    //     // dividers and styling
    //     let listSorting = document.createElement("div")
    //     listSorting.classList.add('basis-8/12', 'bg-red-400')
    //     let listDescription = document.createElement("div")
    //     listDescription.classList.add('basis-3/12', 'bg-red-400')
    //     let changeDeleteTimeEnry = document.createElement("div")
    //     changeDeleteTimeEnry.classList.add('basis-1/12', 'bg-red-400')
    //     let changeButton = document.createElement("button")
    //     changeButton.classList.add('fa-solid', 'fa-ellipsis-vertical')

        
    //     listSorting.appendChild(entryProjectName)
    //     listSorting.appendChild(entryTitleName)
    //     listDescription.appendChild(entryCategoryName)
    //     listDescription.appendChild(entryTimeNumber)
    //     changeDeleteTimeEnry.appendChild(changeButton)
    //     entryListItem.appendChild(listSorting)
    //     entryListItem.appendChild(listDescription)
    //     entryListItem.appendChild(changeDeleteTimeEnry)
    //     displayEntries.appendChild(entryListItem)

    //     inputTitle.value = ''
    //     projectSelect.value = ''
    //     categorySelect.value = ''
    //     timerInput.value = '00:00:00'
    //     seconds = 0
    //     console.log(newEntry)
    // }
}
// Still need to figure out how to get the date and weekly total to display for each day in the createNewEntry function. We also still need to add the buttons






















// async function showEntries() {
//     let response = await fetch('http://localhost:5501/entries')
//     let entryData = await response.json()
//     entryData.forEach(entry => {
//         let entryListItem = document.createElement("li")
//         entryListItem.classList.add('flex', 'flex-wrap')

//         // This will display our date, total daily time, delete button, and collapse button
//         let dailyInfoBar = document.createElement("div")
//         dailyInfoBar.classList.add('basis-full')
//         let dailyDate = document.createElement("p")
//         dailyDate.innerText = entry.entryDate
//         let dailyTotalTime = document.createElement("p")
//         dailyTotalTime.innerText = entry.entryTime
//         let dailyDeleteButton = document.createElement("button")
//         dailyDeleteButton.classList.add('fa-solid', 'fa-trash')
//         let dailyCollapseButton = document.createElement("button")
//         dailyCollapseButton.classList.add('fa-solid', 'fa-chevron-up')

//         // This will be the project type of the entry
//         let entryProjectName = document.createElement("p")
//         entryProjectName.value = entry.entryProject
//         entryProjectName.innerText = entry.entryProject

//         // this will be the category of the entry
//         let entryCategoryName = document.createElement("p")
//         entryCategoryName.value = entry.entryCategory
//         entryCategoryName.innerText = entry.entryCategory

//         // this will be the title of the entry
//         let entryTitleName = document.createElement("p")
//         entryTitleName.value = entry.entryTitle
//         entryTitleName.innerText = entry.entryTitle

//         // this will display the amounted time of the entry
//         let entryTimeNumber = document.createElement("p")
//         entryTimeNumber.value = entry.entryTime
//         entryTimeNumber.innerText = entry.entryTime

//         // dividers and styling
//         let listSorting = document.createElement("div")
//         listSorting.classList.add('basis-8/12', 'bg-red-400')
//         let listDescription = document.createElement("div")
//         listDescription.classList.add('basis-3/12', 'bg-red-400')
//         let changeDeleteTimeEnry = document.createElement("div")
//         changeDeleteTimeEnry.classList.add('basis-1/12', 'bg-red-400')
//         let changeButton = document.createElement("button")
//         changeButton.classList.add('fa-solid', 'fa-ellipsis-vertical')


//         dailyInfoBar.appendChild(dailyDate)
//         dailyInfoBar.appendChild(dailyTotalTime)
//         dailyInfoBar.appendChild(dailyDeleteButton)
//         dailyInfoBar.appendChild(dailyCollapseButton)
//         listSorting.appendChild(entryProjectName)
//         listSorting.appendChild(entryTitleName)
//         listDescription.appendChild(entryCategoryName)
//         listDescription.appendChild(entryTimeNumber)
//         changeDeleteTimeEnry.appendChild(changeButton)
//         entryListItem.appendChild(dailyInfoBar)
//         entryListItem.appendChild(listSorting)
//         entryListItem.appendChild(listDescription)
//         entryListItem.appendChild(changeDeleteTimeEnry)
//         displayEntries.appendChild(entryListItem)

//         inputTitle.value = ''
//         projectSelect.value = ''
//         categorySelect.value = ''
//         timerInput.value = '00:00:00'
//         seconds = 0
//     })
// }