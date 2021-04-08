document.addEventListener(`DOMContentLoaded`, () =>{

const grid = document.querySelector(`.grid`)
const scoreDisplay = document.querySelector(`#score`)
const startBtn = document.querySelector(`#start-button`)
let squares = Array.from(document.querySelectorAll(`.grid div`))
let timerId
const width = 20
let nextRandom = 0
let score = 0


//The Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

let currentPosition = 8
let currentRotation = 0

//randomly select a Tetromino and its first rotation
let random =Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]


// draw the tetromino

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add(`tetromino`)
    })
}

// undraw the testromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove(`tetromino`)
    })
}

//make the tetromino move every second

//timerId = setInterval(moveDown, 1000)

// assign functions to keyCodes

function control(e) {
if(e.keyCode === 37) {
    moveLeft()
} else if (e.keyCode === 38){
    rotate()
} else if (e.keyCode === 39){
    moveRight()
} else if (e.keyCode === 40){
    moveDown()
}
}

document.addEventListener(`keyup`,control)

//move down function

function moveDown() {
    undraw()
    currentPosition +=width
    draw()
    freeze()
}

//function freeze
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains(`taken`))){
        current.forEach(index => {
            squares[currentPosition + index].classList.add(`taken`)
        })
        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random()* theTetrominoes.length)
        current = theTetrominoes[random][0]
        currentPosition =8
        draw()
      displayShape()
      addScore()
      gameOver()
    }
}


// move left
  
function moveLeft() {
    undraw()
    const isAtLeft = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeft) currentPosition -=1

    if (current.some(index => squares[currentPosition + index].classList.contains(`taken`))) {
        currentPosition +=1
    }

    draw()
}

function moveRight() {
    undraw()
    const isAtRight = current.some(index => (currentPosition + index) % width === width-1)

    if (!isAtRight) currentPosition +=1

    if (current.some(index => squares[currentPosition + index].classList.contains(`taken`))) {
        currentPosition -=1
    }

    draw()
}

//rotete the tetromino

function  rotate() {
    undraw()

        currentRotation++
  if (currentRotation === current.length) {
      currentRotation = 0
  }
    
  current = theTetrominoes[random][currentRotation]

    draw()
}

//show up-next tetromino in mini-grid

const displaySquares = document.querySelectorAll(`.mini-grid div`)
const displayWidth = 4
let displayIndex = 0


// the Tetrominos without rotations
const upNextTetrominos = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

// display the shape in the mini-grid display

function displayShape() {
    displaySquares.forEach(squares => {
        squares.classList.remove(`tetromino`)
    })
    upNextTetrominos[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add(`tetromino`)
    })
}



//add functionality to the buttons
startBtn.addEventListener(`click`, () => {
    if(timerId){
        clearInterval(timerId)
        timerId = null
    }else {
        setTimeout(()=>{
            draw()
            timerId = setInterval(moveDown, 1000)
            displayShape()
        },500)
      
        //nextRandom = Math.floor(Math.random()* theTetrominoes.length)
       
    }
})

//add score
function addScore(){
    for(let i = 0; i < 399; i+=width) {
        
        let row = []
        for(let k = 0; k < width; k++){
        row.push(i+k)
        }

        if(row.every(index => squares[index].classList.contains(`taken`))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove(`taken`)
                squares[index].classList.remove(`tetromino`)
            })
            const squaresRemoved = squares.splice(i,width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains(`taken`))){
        scoreDisplay.innerHTML = `end`
        clearInterval(timerId)
        timerId = null
      
    }
}




})