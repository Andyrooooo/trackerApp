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
let projectsContainer = document.querySelector('.projectsContainer')
let addCategoryForm = document.querySelector('.addCategoryForm')
let addCategoryInput = document.querySelector('.addCategoryInput')
let deleteCategoryForm = document.querySelector('.deleteCategoryForm')
let editCategoryInput = document.querySelector('.editCategoryInput')
let editCategoryForm = document.querySelector('.editCategoryForm')
let addProjectForm = document.querySelector('.addProjectForm')
let addProjectInput = document.querySelector('.addProjectInput')
let deleteProjectSelect = document.querySelector('.deleteProjectSelect')
let editProjectSelect = document.querySelector('.editProjectSelect')
let deleteProjectForm = document.querySelector('.deleteProjectForm')
let editProjectInput = document.querySelector('.editProjectInput')
let editProjectForm = document.querySelector('.editProjectForm')
let closeAlert = document.querySelector('.closeAlert')
let message = document.querySelector('.message')
let alertMessageContainer = document.querySelector('.alertMessageContainer')
let entriesContainer = document.querySelector('.entriesContainer')
let cancelEdit = document.querySelector('.cancelEdit')
let cancelProject = document.querySelector('.cancelProject')
let cancelCategories = document.querySelector('.cancelCategories')
let entryCategorySelect = document.querySelector('.entryCategorySelect')
let entryProjectSelect = document.querySelector('.entryProjectSelect')
let editEntryInput = document.querySelector('.editEntryInput')
let editEntryTotal = document.querySelector('.editEntryTotal')
let editEntryButton = document.querySelector('.editEntryButton')
let deleteEntryButton = document.querySelector('.deleteEntryButton')
let deleteAlertMessageContainer = document.querySelector('.deleteAlertMessageContainer')
let deleteMessage = document.querySelector('.deleteMessage')
let deleteAlert = document.querySelector('.deleteAlert')
let cancelDeleteAlert = document.querySelector('.cancelDeleteAlert')
/* ------------------------------------ end of element creations -------------------------------------------------- */


// showEntries()
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
        entryCategorySelect.appendChild(categoryOption.cloneNode(true))
    })
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
        deleteProjectSelect.appendChild(projectOption.cloneNode(true))
        editProjectSelect.appendChild(projectOption.cloneNode(true))
        entryProjectSelect.appendChild(projectOption.cloneNode(true))
    })
}


// function to make checks and reset daily and weekly secons accordingly
async function checkDate() {
    let currentDate = new Date()
    let startDate = new Date().toLocaleDateString()
    let response = await fetch('http://localhost:5501/entries')
    let entryDates = await response.json()
    let checkDailyDates = entryDates.some(entry => entry.entryDate === startDate)
    if (!checkDailyDates) { dailySeconds = 0 }

    if (currentDate.getDay() < 1) {
        weeklySeconds = 0
    } else {
        let entriesBeforeMonday = entryDates.some(entry => new Date(entry.entryDate).getDay() < 1)
        if (entriesBeforeMonday) { weeklySeconds = 0 }
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

    let newEntryID = entryData.length === 0 ? 1 : entryData.at(-1).entryID + 1

    let newEntry = {
        entryID: newEntryID,
        entryTitle: inputTitle.value,
        // gives us the new date and filters it to just the MM/DD/YYYY format
        entryDate: new Date().toLocaleDateString(),
        entryProject: projectSelect.value,
        entryCategory: categorySelect.value,
        entryTime: timerInput.value,
    }

    let newTime = {
        dailyTime: totalDailyTime
    }

    fetch('http://localhost:5501/dailyTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTime)
    })
    
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




let dailyTotalTimeOne = document.createElement("p")
/* -------------------- new entry that gets displayed to the UI ------------- */
function createNewEntry(newEntry, projectName, categoryName, entryData) {

    let entryListItem = document.createElement("li")
    let entryUIID = newEntry.entryID
    entryListItem.setAttribute('data-entry-id', entryUIID)
    let dailyCollapseButton = document.createElement("button")
    let entryDateForExistingEntries = newEntry.entryDate
    let dailyDeleteButton = document.createElement("button")
    
    // boolean to check if the entry date already exists
    let existingEntryDate = entryData.some(entry => entry.entryDate === newEntry.entryDate)

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
    entryListItem.classList.add('bg-white', 'shadow-md', 'border-t-2', 'p-4', 'pt-8')
    let listSorting = document.createElement("div")
    listSorting.classList.add('basis-8/12')
    let listDescription = document.createElement("div")
    listDescription.classList.add('basis-3/12')
    let changeDeleteTimeEnry = document.createElement("div")
    changeDeleteTimeEnry.classList.add('basis-1/12')
    let changeButton = document.createElement("button")
    changeButton.classList.add('fa-solid', 'fa-ellipsis-vertical', 'float-right', 'text-xl', 'text-emerald-400', 'align-middle', 'hover:text-emerald-100')
    entryProjectName.classList.add('text-emerald-500', 'mb-2')
    entryTitleName.classList.add('text-emerald-500')
    entryCategoryName.classList.add('text-emerald-500', 'mb-2')
    entryTimeNumber.classList.add('text-emerald-500')

    // more dividers
    let entrySection = document.createElement("div")
    entrySection.classList.add('flex')

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

    inputTitle.value = ''
    projectSelect.value = ''
    categorySelect.value = ''
    timerInput.value = '00:00:00'
    seconds = 0

    // conditioning to check if the entry date already exists and update the daily total time
    if (existingEntryDate) {
        async function grabTime() {
            let response = await fetch('http://localhost:5501/dailyTime')
            let grabTime = await response.json()
            dailyTotalTimeOne.innerText = formatTime(grabTime[0].time)

        }
        grabTime()
            // clear input fields and reset timer
        inputTitle.value = ''
        projectSelect.value = ''
        categorySelect.value = ''
        timerInput.value = '00:00:00'
        seconds = 0  

    } 
    else if (!existingEntryDate) 
    {
        async function grabTime() {
            let response = await fetch('http://localhost:5501/dailyTime')
            let grabTime = await response.json()
            dailyTotalTimeOne.innerText = formatTime(grabTime[0].time)
             
        }
        grabTime()
                // This will display our date, total daily time, delete button, and collapse button
            let dailyInfoBar = document.createElement("div")
            dailyInfoBar.classList.add('flex', 'flex-row', 'bg-emerald-400', 'p-4', 'text-emerald-50')
 
            // date of info bar
            let dailyDate = document.createElement("p")
            let dailyDateContainer = document.createElement("div")
            dailyDateContainer.appendChild(dailyDate)
            dailyDateContainer.classList.add('basis-7/12', 'float-right')
            // dailyDate.classList.add('text-right', 'w-full') 
            dailyDate.innerText = newEntry.entryDate

            // total daily time of info bar 
            let dailyTotalTimeOneContainer = document.createElement("div")
            dailyTotalTimeOneContainer.classList.add('basis-3/12')
               
            dailyTotalTimeOneContainer.appendChild(dailyTotalTimeOne)
            
            dailyTotalTimeOne.classList.add('float-right')
            // formats and updates the daily total time 
            

            // delete button of info bar
            let dailyDeleteButtonContainer = document.createElement("div")
            dailyDeleteButtonContainer.appendChild(dailyDeleteButton)
            dailyDeleteButtonContainer.classList.add('basis-1/12')
            dailyDeleteButton.classList.add('fa-solid', 'fa-trash', 'float-right', 'text-xl', 'hover:text-emerald-200')

            // collapse button of info bar
            let dailyCollapseButtonContainer = document.createElement("div")
            dailyCollapseButtonContainer.appendChild(dailyCollapseButton)
            dailyCollapseButtonContainer.classList.add('basis-1/12')
            dailyCollapseButton.classList.add('fa-solid', 'fa-chevron-up', 'float-right', 'text-xl', 'hover:text-emerald-200', 'hidden')

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
            displayEntries.appendChild(dailyInfoBar)
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

    /* ----------------------------------------- deletes and updates all time intervals ----------------------------- */
    dailyDeleteButton.addEventListener('click', async () => {
        let response = await fetch('http://localhost:5501/dailyTime')
        let dailyTime = await response.json()
 
        // let allEntries = displayEntries.children

        // console.log(allEntries)

        // for (let i = 0; i < allEntries.length; i++) {
        //     allEntries[i].remove()
        // }
        displayEntries.innerHTML = ''
        let updatedWeeklyTime = weeklySeconds - dailyTime[0].time
        weeklyTotal.value = formatTime(updatedWeeklyTime)
        weeklySeconds = updatedWeeklyTime
        dailySeconds = 0
        randomNumber = 1

        await fetch(`http://localhost:5501/entries/all/${randomNumber}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        
    })


    /* ------------------------------------------ hides all entries ----------------------------------------------- */
    dailyCollapseButton.addEventListener('click', () => {
 
        let children = document.querySelectorAll(`li`)

        if (entryDateForExistingEntries) {
            for (let i = 0; i < children.length; i++) {
                children[i].classList.toggle('hidden');
            }
        }

    })



    // ---------- event listener to open edit entry menu and grab the new entry values -------------
    changeButton.addEventListener('click', () => {
        
        entriesContainer.classList.remove('hidden')
        editEntryInput.value = entryTitleName.innerText 
        entryCategorySelect.value = entryCategoryName.value
        entryProjectSelect.value = entryProjectName.value
        editEntryTotal.value = entryTimeNumber.value

        // --------------------------- event listener to delete an entry ---------------------------
        deleteEntryButton.onclick = () => {
            deleteAlertMessageContainer.classList.remove('hidden')
            deleteMessage.innerText = "Are you sure you would like to delete this entry?"

            cancelDeleteAlert.onclick = () => {
                deleteAlertMessageContainer.classList.add('hidden')
            }

            // deletes the entry from the UI and the server and all the necessary messages
            deleteAlert.onclick = () => {
                deleteTheNewEntry(entryUIID, newEntry.entryTime)
                
            }   

        } 

        // --------------------------- event listener to edit an entry ---------------------------
        editEntryButton.addEventListener('click', async () => { 
                
            // new name 
            let newNameChange = editEntryInput.value

            // new category
            let newCategoryValue = entryCategorySelect.value
            let newCategoryText = entryCategorySelect.options[entryCategorySelect.selectedIndex].text
            if (newCategoryText === 'Category') {newCategoryText = ''}

            // new project
            let newProjectValue = entryProjectSelect.value
            let newProjectText = entryProjectSelect.options[entryProjectSelect.selectedIndex].text
            if (newProjectText === 'Project Name') {newProjectText = ''}

            // new time
            let newTime = editEntryTotal.value
            let splitNewTime = newTime.split(':').join('')
            let newTimeSeconds = splitNewTime.replace(/^0+|(?<=:0)0+/g, '')

            // old time
            let oldTime = newEntry.entryTime
            let splitOldTime = oldTime.split(':').join('')
            let oldTimeSeconds = splitOldTime.replace(/^0+|(?<=:0)0+/g, '')
            
            if (newTimeSeconds > oldTimeSeconds) {
                let timeDifference = newTimeSeconds - oldTimeSeconds
                // this is where we will add the time difference to the daily time and it will be daily time plus the newTimeSeconds
                let response = await fetch('http://localhost:5501/dailyTime')
                let grabTime = await response.json()
                newTimeForServer = grabTime[0].time + timeDifference
                
            } else if (newTimeSeconds < oldTimeSeconds) {
                let timeDifference = oldTimeSeconds - newTimeSeconds 
                // this is where we will subtract the time difference to the daily time and it will be newTimeSeconds minus the daily time
                let response = await fetch('http://localhost:5501/dailyTime')
                let grabTime = await response.json()
                newTimeForServer = grabTime[0].time - timeDifference
                
            } else if (newTimeSeconds === oldTimeSeconds) {
                newTimeForServer = newTimeSeconds
            }
            
            let date = newEntry.entryDate
            

            let timeToChangeTheDailyTotalTime = {
                theTime: newTimeForServer
            }

            fetch('http://localhost:5501/dailyTime/change', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(timeToChangeTheDailyTotalTime) 
            })
            
            changeEntryValues(entryTitleName, newNameChange, newCategoryText, newProjectText, newTime, entryUIID, date, newTimeForServer, newProjectValue, newCategoryValue) 
        })

        // --------------------------- ansync function to change all the values -----------------------
        async function changeEntryValues(entryTitleName, newNameChange, newCategoryText, newProjectText, newTime, entryUIID, date, newTimeForServer, newProjectValue, newCategoryValue) {
            dailyTotalTimeOne.innerText = formatTime(newTimeForServer)

            let editedEntryTime = dailyTotalTimeOne.innerText


            entryTitleName.innerText = newNameChange
            entryCategoryName.innerText = newCategoryText
            entryProjectName.innerText = newProjectText
            entryTimeNumber.innerText = newTime
            dailySeconds = newTimeForServer
            weeklyTotal.value = formatTime(newTimeForServer)
            weeklySeconds = newTimeForServer
            

            let editedEntry = {
                entryID: entryUIID,
                entryTitle: entryTitleName.innerText,
                entryDate: date,
                entryProject: newProjectValue,
                entryCategory: newCategoryValue,
                entryTime: editedEntryTime,
            }

            fetch(`http://localhost:5501/entries/${entryUIID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedEntry)
            })

            alertMessageContainer.classList.remove('hidden')
            message.innerText = 'Awesome! Your entry has been updated.'

            entriesContainer.classList.add('hidden')
        }


        /* --------------- async function that deletes the entry -------------------------------------- */
        async function deleteTheNewEntry(entryUIID, oldTime) {
            
            if (displayEntries.children.length === 1) {  
                alertMessageContainer.classList.remove('hidden')
                message.innerText = 'There is only one entry left. You must delete the whole day. In your entry list, this will be the trash icon.'
                deleteAlertMessageContainer.classList.add('hidden')
                closeAlert.onclick = () => {
                    entriesContainer.classList.add('hidden')
                }  
            } else if (displayEntries.children.length > 1) {
                let entryToRemove = document.querySelector(`li[data-entry-id="${entryUIID}"]`)
                // deletes the entry from the UI
                if (entryToRemove) {
                    entryToRemove.parentNode.removeChild(entryToRemove)
                }
                // message modal
                deleteAlertMessageContainer.classList.add('hidden')
                entriesContainer.classList.add('hidden')
                // message modal
                alertMessageContainer.classList.remove('hidden')
                message.innerText = 'Entry has been deleted!'

                // old time
                let splitOldTime = oldTime.split(':').join('')
                let oldTimeSeconds = splitOldTime.replace(/^0+|(?<=:0)0+/g, '')
 
                // updates the time in the UI
                let response = await fetch('http://localhost:5501/dailyTime')
                let grabTime = await response.json()
                // helps us get the correct time to use for the UI
                let newTimeAfterDeletionForServer = grabTime[0].time - oldTimeSeconds
                // displays the new time in the UI
                dailyTotalTimeOne.innerText = formatTime(newTimeAfterDeletionForServer)
                // updates the timer for the daily total time
                dailySeconds = newTimeAfterDeletionForServer
                weeklyTotal.value = formatTime(newTimeAfterDeletionForServer)
                weeklySeconds = newTimeAfterDeletionForServer
                

                let timeToChangeTheDailyTotalTime = { 
                    theTime: newTimeAfterDeletionForServer
                }
    
                fetch('http://localhost:5501/dailyTime/change', {  
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(timeToChangeTheDailyTotalTime)
                })

                // deletes the entry from the server
                fetch(`http://localhost:5501/entries/${entryUIID}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
            } 
        }
    })
} /* ----------------------------------------- end of creating an entry ---------------------------- */


// close edit entry modal
cancelEdit.addEventListener('click', () => {
    entriesContainer.classList.add('hidden')
})


// toggles the categories and projects containers when clicked
// categories
categories.addEventListener('click', () => {
    categoriesContainer.classList.remove('hidden')
})
cancelCategories.addEventListener('click', () => {
    categoriesContainer.classList.add('hidden')
})
// projects
projects.addEventListener('click', () => {
    projectsContainer.classList.remove('hidden')
})
cancelProject.addEventListener('click', () => {
    projectsContainer.classList.add('hidden')
})
// alert modal
closeAlert.addEventListener('click', () => {
    alertMessageContainer.classList.add('hidden')
})

// ------------------------------ add a category function ----------------------------
addCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    if (addCategoryInput.value === '') {
        alertMessageContainer.classList.remove('hidden')
        message.innerText = 'No input was made. Please add a category name.'
    } else {
        // grabs the array of categories and gives us a new id
        let response = await fetch('http://localhost:5501/categories')
        let categoryData = await response.json()
        let newCategoryID = categoryData.length === 0 ? 1 : categoryData.at(-1).categoryID + 1

        let newCategory = {
            categoryID: newCategoryID,
            categoryName: addCategoryInput.value,
        }

        fetch('http://localhost:5501/category', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCategory)
        })

        .then(() => {
            // adds the new option to each of the category select elements
            let categoryOption = document.createElement("option")
            categoryOption.value = newCategory.categoryID
            categoryOption.innerText = addCategoryInput.value
    
            categorySelect.appendChild(categoryOption)
            deleteCategorySelect.appendChild(categoryOption.cloneNode(true))
            editCategorySelect.appendChild(categoryOption.cloneNode(true))
            entryCategorySelect.appendChild(categoryOption.cloneNode(true))
            addCategoryInput.value = ''
        })
    }
})


// ------------------------------ delete a category function ----------------------------
deleteCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (deleteCategorySelect.value === '') {
        alertMessageContainer.classList.remove('hidden')
        message.innerText = 'No option was selected. Please select a category to delete.'
    } else {
        fetch(`http://localhost:5501/categories/${deleteCategorySelect.value}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(categoryToDelete)
        })
        .then(() => {
            // deletes the option from each of the category select elements
            let categoryToDelete = deleteCategorySelect.options[deleteCategorySelect.selectedIndex].text
            removeCategoryFromSelect(categorySelect, categoryToDelete)
            removeCategoryFromSelect(deleteCategorySelect, categoryToDelete)
            removeCategoryFromSelect(editCategorySelect, categoryToDelete)
            removeCategoryFromSelect(entryCategorySelect, categoryToDelete)

            function removeCategoryFromSelect(selectOption, categoryName) {
                for (let i = 0; i < selectOption.options.length; i++) {
                    if (selectOption.options[i].text === categoryName) {
                        selectOption.remove(i)
                        break
                    }
                }
            }

            deleteCategorySelect.value = ''
        })
    }
})


// --------------------------------- edits a category function --------------------------
editCategorySelect.addEventListener('change', async () => {

    editCategoryInput.removeAttribute('readonly', true)
    editCategoryInput.value = editCategorySelect.options[editCategorySelect.selectedIndex].text
})


// ---------------------- submits that edited category function ------------------------
editCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    let editedCategory = {
        categoryName: editCategoryInput.value,
    }

    fetch(`http://localhost:5501/categories/${editCategorySelect.value}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedCategory)
    })
    .then(() => {
        // edits the option from each of the category select elements
        let categoryToChange = editCategorySelect.options[editCategorySelect.selectedIndex].text

        changeCategorySelectOption(categorySelect, categoryToChange)
        changeCategorySelectOption(deleteCategorySelect, categoryToChange)
        changeCategorySelectOption(editCategorySelect, categoryToChange)
        changeCategorySelectOption(entryCategorySelect, categoryToChange)

        function changeCategorySelectOption(selectOptions, categoryToChange) {
            for (let i = 0; i < selectOptions.options.length; i++) {
                if (selectOptions.options[i].text === categoryToChange) {
                    selectOptions.options[i].text = editCategoryInput.value
                    break
                }
            }
        }
        
        editCategoryInput.value = ''
        editCategorySelect.value = ''
        editCategoryInput.setAttribute('readonly', true)
    })
})


// ------------------------------ add a Project Name function ----------------------------
addProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    if (addProjectInput.value === '') {
        alertMessageContainer.classList.remove('hidden')
        message.innerText = 'No input was made. Please add a project name.'
    } else {
        // grabs the array of project names and gives us a new id
        let response = await fetch('http://localhost:5501/projects')
        let projectData = await response.json()
        let newProjectID = projectData.length === 0 ? 1 : projectData.at(-1).projectID + 1

        let newProject = {
            projectID: newProjectID,
            projectName: addProjectInput.value,
        }

        fetch('http://localhost:5501/project', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProject)
        })

        .then(() => {
            // adds the new option to each of the project select elements
            let projectOption = document.createElement("option")
            projectOption.value = newProject.projectID
            projectOption.innerText = addProjectInput.value
    
            projectSelect.appendChild(projectOption)
            deleteProjectSelect.appendChild(projectOption.cloneNode(true))
            editProjectSelect.appendChild(projectOption.cloneNode(true))
            entryProjectSelect.appendChild(projectOption.cloneNode(true))
            addProjectInput.value = ''
        })
    }
})


// ------------------------------ delete a project name function ----------------------------
deleteProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (deleteProjectSelect.value === '') {
        alertMessageContainer.classList.remove('hidden')
        message.innerText = 'No option was selected. Please select a project name to delete.'
    } else {
        fetch(`http://localhost:5501/projects/${deleteProjectSelect.value}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(() => {
            // deletes the option from each of the project select elements
            let ProjectToDelete = deleteProjectSelect.options[deleteProjectSelect.selectedIndex].text
            removeProjectOption(projectSelect, ProjectToDelete)
            removeProjectOption(deleteProjectSelect, ProjectToDelete)
            removeProjectOption(editProjectSelect, ProjectToDelete)
            removeProjectOption(entryProjectSelect, ProjectToDelete)

            function removeProjectOption(selectOption, projectName) {
                for (let i = 0; i < selectOption.options.length; i++) {
                    if (selectOption.options[i].text === projectName) {
                        selectOption.remove(i)
                        break
                    }
                }
            }

            deleteProjectSelect.value = ''
        })
    }
})


// --------------------------------- edits a project name function --------------------------
editProjectSelect.addEventListener('change', async () => {

    editProjectInput.removeAttribute('readonly', true)
    editProjectInput.value = editProjectSelect.options[editProjectSelect.selectedIndex].text
})


// ---------------------- submits the edited project name function ------------------------
editProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    let editedProject = {
        projectName: editProjectInput.value,
    }

    fetch(`http://localhost:5501/projects/${editProjectSelect.value}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedProject)
    })
    .then(() => {
        // edits the option from each of the project name select elements
        let projectToChange = editProjectSelect.options[editProjectSelect.selectedIndex].text

        changeProjectOption(projectSelect, projectToChange)
        changeProjectOption(deleteProjectSelect, projectToChange)
        changeProjectOption(editProjectSelect, projectToChange)
        changeProjectOption(entryProjectSelect, projectToChange)

        function changeProjectOption(selectOptions, projectToChange) {
            for (let i = 0; i < selectOptions.options.length; i++) {
                if (selectOptions.options[i].text === projectToChange) {
                    selectOptions.options[i].text = editProjectInput.value
                    break
                }
            }
        }
        
        editProjectInput.value = ''
        editProjectSelect.value = ''
        editProjectInput.setAttribute('readonly', true)
    })
})























































































































































// ------------------------------ Testing function for temp time entry ----------------------------
// async function showEntries() {
//     let response = await fetch('http://localhost:5501/entries')
//     let entryData = await response.json()
//     entryData.forEach(entry => {
//         let entryListItem = document.createElement("li")

//         // This will display our date, total daily time, delete button, and collapse button
//         let dailyInfoBar = document.createElement("div")
//         dailyInfoBar.classList.add('flex', 'flex-row', 'bg-slate-200', 'mt-4')

//         let dailyDate = document.createElement("p")
//         let dailyDateContainer = document.createElement("div")
//         dailyDateContainer.appendChild(dailyDate)
//         dailyDateContainer.classList.add('basis-6/12')
//         dailyDate.classList.add('w-full')
//         dailyDate.innerText = entry.entryDate

//         // let dailyTotalTime = document.createElement("p")
//         let dailyTotalTimeContainer = document.createElement("div")
//         let dailyTotalTime = document.createElement("p")
//         dailyTotalTimeContainer.appendChild(dailyTotalTime)
//         dailyTotalTimeContainer.classList.add('basis-2/12')
//         dailyTotalTime.classList.add('float-right')
//         dailyTotalTime.innerText = entry.entryTime

//         let dailyDeleteButton = document.createElement("button")
//         let dailyDeleteButtonContainer = document.createElement("div")
//         dailyDeleteButtonContainer.appendChild(dailyDeleteButton)
//         dailyDeleteButtonContainer.classList.add('basis-2/12')
//         dailyDeleteButton.classList.add('fa-solid', 'fa-trash')

//         let dailyCollapseButton = document.createElement("button")
//         let dailyCollapseButtonContainer = document.createElement("div")
//         dailyCollapseButtonContainer.appendChild(dailyCollapseButton)
//         dailyCollapseButtonContainer.classList.add('basis-2/12')
//         dailyCollapseButton.classList.add('fa-solid', 'fa-chevron-up')

//         // This will be the project type of the entry
//         let entryProjectName = document.createElement("p")
//         entryProjectName.value = entry.entryProject
//         entryProjectName.innerText = entry.entryProject

//         // this will be the category of the entry
//         let entryCategoryName = document.createElement("p")
//         entryCategoryName.classList.add('text-right')
//         entryCategoryName.value = entry.entryCategory
//         entryCategoryName.innerText = entry.entryCategory

//         // this will be the title of the entry
//         let entryTitleName = document.createElement("p")
//         entryTitleName.value = entry.entryTitle
//         entryTitleName.innerText = entry.entryTitle

//         // this will display the amounted time of the entry
//         let entryTimeNumber = document.createElement("p")
//         entryTimeNumber.classList.add('text-right')
//         entryTimeNumber.value = entry.entryTime
//         entryTimeNumber.innerText = entry.entryTime

//         // dividers and styling
//         let listSorting = document.createElement("div")
//         listSorting.classList.add('basis-8/12')
//         let listDescription = document.createElement("div")
//         listDescription.classList.add('basis-3/12')
//         let changeDeleteTimeEnry = document.createElement("div")
//         changeDeleteTimeEnry.classList.add('basis-1/12')
//         let changeButton = document.createElement("button")
//         changeButton.classList.add('fa-solid', 'fa-ellipsis-vertical', 'float-right')

//         // more dividers
//         let entrySection = document.createElement("div")
//         entrySection.classList.add('flex', 'bg-slate-100')

//         dailyInfoBar.appendChild(dailyDateContainer)
//         dailyInfoBar.appendChild(dailyTotalTimeContainer)
//         dailyInfoBar.appendChild(dailyDeleteButtonContainer)
//         dailyInfoBar.appendChild(dailyCollapseButtonContainer)
//         listSorting.appendChild(entryProjectName)
//         listSorting.appendChild(entryTitleName)
//         listDescription.appendChild(entryCategoryName)
//         listDescription.appendChild(entryTimeNumber)
//         changeDeleteTimeEnry.appendChild(changeButton)
//         entryListItem.appendChild(dailyInfoBar)
//         entrySection.appendChild(listSorting)
//         entrySection.appendChild(listDescription)
//         entrySection.appendChild(changeDeleteTimeEnry)
//         entryListItem.appendChild(entrySection)
//         displayEntries.appendChild(entryListItem)
//     })
// }