//Declaring the canvas and drawing variables:
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

//Time variable:
let prevTime = new Date().getTime();
let time = null;
let newTime = null;

//variables for the circle:
let startX = canvas.width / 3;
let x = startX;
let startDx = 0.3;
let dx = startDx;
let startY = canvas.height - 30;
let y = startY;
let startDy = 0.3;
let dy = -startDy;
let ballRadius = 15;

//variables for the paddle:
let paddleHeight = 10;
let paddleWidth = 75;
let paddleDx = 3;
let paddleX = (canvas.width - paddleWidth) / 3;
let rightPressed = false;
let leftPressed = false;

//variables for the bricks:
let brickRowCount = 4;
let brickColumnCount = 24;
let brickWidth = 35;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

//Score:
let score = 0;

//Lives:
let lives = 3;

//Creating an array to store the bricks:
let bricks = [];
for (c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (r = 0; r < brickRowCount; r++) {
		bricks[c][r] = {
			x: 0,
			y: 0,
			status: 1
		};
	}
}
//Function for drawing the bricks:
function drawBricks() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#ffffff"; //Colour Blue
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

//Function for drawing the ball:
function drawBall() {
	ctx.beginPath(); //Starts drawing the circle
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2); //Defines dimensions of the circle
	ctx.fillStyle = "#ffffff"; //Fill colour (Blue)
	ctx.fill();
	ctx.closePath(); //Stops Drawing the circle
}

//Function for drawing the paddle at the bottom of the screen:
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#ffffff";
	ctx.fill();
	ctx.closePath();
}

//Loop function for drawing all the elements:
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clears previous ball from the previous frame
	newTime = new Date().getTime();
	time = newTime - prevTime;
	prevTime = newTime;
	drawBricks();
	drawBall(); //Calls the drawBall(); function to draw the circle
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
	if (y + dy < ballRadius) { //Conditional if the ball hits the top/bottom edges of the canvas
		dy = Math.abs(dy);
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			lives--; //Reduce lives letiable by 1
            if (!lives) { //if there are no lives left:
                alert('YOU LOSE!')
                document.location.reload();
                
			} else {
				x = startX; //Positions the x-coordinate of the ball
				y = startY; //Positions the y-coordinate of the ball
				dx = startDx;
				dy = -startDy;
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}
	if (x + dx < ballRadius) { //Conditional if the ball hits the right/left edges of the canvas
		dx = Math.abs(dx);
	} else if (x + dx > canvas.width - ballRadius) {
		dx = -Math.abs(dx);
	}
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += paddleDx;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= paddleDx;
	}
	x += dx * time; //updates the x-position of the circle
	y += dy * time; //updates the y-position of the circle
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

//Function for collision detection between the ball and the bricks, and increasing the score if the bricks hit, and for checking if all bricks are destroyed:
function collisionDetection() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r];
			if (b.status == 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score == brickRowCount * brickColumnCount) {
                        alert('YOU WIN!')
                        document.location.reload();
					}
				}
			}
		}
	}
}
//Function for drawing the score variable onto the screen:
function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Score: " + score, 8, 20);
}

//Function for drawing the lives variable onto the screen:
function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}
//Mouse Controls;
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
	let relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

//Animate Everything through the draw() function:
setInterval(draw, 0);
