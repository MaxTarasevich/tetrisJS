// variables ************************************************************

const grid = document.querySelector(`.grid`)
const scoreDisplay = document.querySelector(`#score`)
const startBtn = document.querySelector(`#start-button`)
let squares = Array.from(document.querySelectorAll(`.grid div`))
let timerId
const width = 14
let nextRandom = 0
let score = 0
let gameFinish = false
const startTextBtn = document.getElementById(`start-btn-text`)

const Rotate = document.getElementById(`Rotate`)
const Left = document.getElementById(`Left`)
const Right = document.getElementById(`Right`)
const Down = document.getElementById(`Down`)

const colors = [
    '#052F5F',
    '#005377',
    '#06A77D',
    '#D5C67A',
    '#F1A208'
  ]

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

let currentPosition = 5
let currentRotation = 0

//randomly select a Tetromino and its first rotation
let random =Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]


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


// Functions*****************************************************

// draw the tetromino

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add(`tetromino`)
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

// undraw the testromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove(`tetromino`)
        squares[currentPosition + index].style.backgroundColor = ''
    })
}

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

//move right

function moveRight() {
    undraw()
    const isAtRight = current.some(index => (currentPosition + index) % width === width-1)

    if (!isAtRight) currentPosition +=1

    if (current.some(index => squares[currentPosition + index].classList.contains(`taken`))) {
        currentPosition -=1
    }

    draw()
}

///FIX ROTATION OF TETROMINOS A THE EDGE 

function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

  //rotate the tetromino

function  rotate() {
    undraw()

        currentRotation++
  if (currentRotation === current.length) {
      currentRotation = 0
  }
    
  current = theTetrominoes[random][currentRotation]
  checkRotatedPosition()
    draw()
}

// display the shape in the mini-grid display

function displayShape() {
    displaySquares.forEach(squares => {
        squares.classList.remove(`tetromino`)
        squares.style.backgroundColor = ''
        
    })
    upNextTetrominos[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add(`tetromino`)
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}


//add score
function addScore(){
    for(let i = 0; i < 279; i+=width) {
        
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
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i,width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

//Game Over 

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains(`taken`))){
        scoreDisplay.innerHTML = `end`
        clearInterval(timerId)
        timerId = null
       gameFinish = true
      startTextBtn.innerText = `end game`
       document.removeEventListener(`keydown`,control)
       Rotate.removeEventListener(`click`, rotate)
       Left.removeEventListener(`click`,moveLeft)
       Right.removeEventListener(`click`,moveRight)
       Down.removeEventListener(`click`,moveDown)
    }
}

//Start button events
function startButtonEvents(){
    if(timerId){
        clearInterval(timerId)
        timerId = null
        startTextBtn.innerText = `start`

        document.removeEventListener(`keydown`,control)
        Rotate.removeEventListener(`click`, rotate)
        Left.removeEventListener(`click`,moveLeft)
        Right.removeEventListener(`click`,moveRight)
        Down.removeEventListener(`click`,moveDown)

    }else if(gameFinish){
       squares.forEach((el,index)=>{
           if(index < 400){
            el.classList.remove(`tetromino`,`taken`)
            el.style.backgroundColor = ''
           }
           gameFinish = false
           scoreDisplay.innerHTML = `0`
           startTextBtn.innerText  = `New Game`
         
       })
    }else {
        document.addEventListener(`keydown`,control)
        Rotate.addEventListener(`click`, rotate)
        Left.addEventListener(`click`,moveLeft)
        Right.addEventListener(`click`,moveRight)
        Down.addEventListener(`click`,moveDown)
        setTimeout(()=>{
            draw()
            timerId = setInterval(moveDown, 1000)
            displayShape()
        },500) 
        startTextBtn.innerText = `pause`
    }
}

// Listeners**************************************************

document.addEventListener(`DOMContentLoaded`, () =>{



//add functionality to the buttons
startBtn.addEventListener(`click`, startButtonEvents)


})