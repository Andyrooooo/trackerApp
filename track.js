let startButton = document.querySelector('.start')
let stopButton = document.querySelector('.stop')
let timerInput = document.querySelector('.timerInput')

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

// stops the timer when the stop button is clicked and we also hide the stop button after
stopButton.addEventListener('click', () => {
    clearInterval(timerInterval)
    stopButton.classList.add('hidden')
    startButton.classList.remove('hidden')
    timerInput.classList.add('text-slate-300')
})