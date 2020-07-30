import React from 'react';
import Score from './Score.js'

/* Checks if an array exists within another array of arrays */
function searchForArray(haystack, needle){
    var i, j, current;
    for(i = 0; i < haystack.length; ++i){
      if(needle.length === haystack[i].length){
        current = haystack[i];
        for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
        if(j === needle.length)
          return i;
      }
    }
    return -1;
}
  
/* Creates a Snake game or demo (background before starting the game)

demo: boolean, indicates if it's an actual game or just demo before playing
margin: float, margin between cells, in pixels
cells: integer, number of cells in the X direction
pos: int Array [2], initial position of the snake, relative to the center of the grid
length: int, initial snake length in cells
direction: "W", "S", "E", "N", initial direction the snake should move in
speed: int, snake speed in cells per second
gameover: bound function to call when the game is over. It should accept score as a parameter.
*/

class Snake extends React.Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0, cellsize: 0, pos: [], dir: [], food: [], score: 0};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.move = this.move.bind(this);
        this.control = this.control.bind(this);

        this.changingDir = false; // has the user changed direction since the last movement?

        // if the window size changes, grid cell size changes too
        window.addEventListener('resize', this.updateWindowDimensions);
        // handles W, A, S, D so snake can be controlled
        window.addEventListener("keydown", this.control);
    };
      
    componentDidMount() {
        // defines cell grid size
        this.updateWindowDimensions()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener('keydown', this.control);
        if(this.props.speed > 0) {
            clearInterval(this.interval);
        }
    };
    
    updateWindowDimensions() {
        // once window size is determined, load the game
        this.setState({ width: window.innerWidth, height: window.innerHeight }, () => {
            // calculate grid parameters
            var cellSize = this.state.width / this.props.cells; // cell size in pixels (width = height)
            this.xcells = Math.floor(this.state.width / cellSize); // no. cells in X direction
            this.ycells = Math.floor(this.state.height / cellSize); // no. cells in Y direction
            this.center = { // position of the center
                x: Math.floor(this.xcells * 0.5),
                y: Math.floor(this.ycells * 0.5)
            }

            // in which direction x, y should the snake initially grow?
            this.expansion = {
                x: (this.props.direction === "E" ? -1 : (this.props.direction === "W" ? 1 : 0)),
                y: (this.props.direction === "N" ? -1 : (this.props.direction === "S" ? 1 : 0))
            }
    
            var initialPos = []; // each element of initial Pos is a cell occupied by the snake

            // construct the snake
            for (var i = 0; i < this.props.length; i++) {

                initialPos.push([
                    this.center.y + this.props.pos[0] + i * this.expansion.y,
                    this.center.x + this.props.pos[1] + i * this.expansion.x
                ]);
            };
            
            // save initial snake position and direction on state

            this.setState({cellsize: cellSize, pos: initialPos, dir: [-this.expansion.x, -this.expansion.y], food: []}, () => {
                this.setFood(); // once the grid is defined, set food
                if(this.props.speed > 0) {
                    this.interval = setInterval(this.move, 1000 / this.props.speed); // and move the snake in accordance with selected speed
                }
            });

        });
    };

    control(e) { // handle key stroke
        const key = e.key.toLowerCase();
        if(['w', 'a', 's', 'd'].indexOf(key) > -1 && !this.changingDir) { // if player has already changed direction since the last movement, ignore.

            // translate w, a, s, d to coordinates

            var newDirs = [
                (key === 'a' ? -1 : (key === 'd' ? 1 : 0)),
                (key === 'w' ? -1 : (key === 's' ? 1 : 0))
            ]

            if(newDirs[0] !== -this.state.dir[0] && newDirs[1] !== -this.state.dir[1]) {
                this.setState({ // define the new direction according to these coordinates
                    dir: newDirs
                })

                this.changingDir = true;
            }
        }
    }

    move() { // move the snake in an interval
        const x = this.state.dir[0]; // direction of movement
        const y = this.state.dir[1];

        var newPos = this.state.pos.map(p => p); // shallow copy of state position

        // save tail pos (in case the snake eats something and has to grow)
        const tail = newPos[newPos.length - 1];

        // delete tail
        newPos.pop();

        // create new element and add it to head in the current direction (x, y)
        var newHead = [
            newPos[0][0] + y,
            newPos[0][1] + x
        ]

        // what if the snake tries to go off grid?
        if(this.props.demo) { // if it's a demo (before starting a game), move it to the opposite side
            if(newHead[1] >= this.xcells) newHead[1] = 0;
            if(newHead[1] < 0) newHead[1] = this.xcells - 1;
            if(newHead[0] >= this.ycells) newHead[0] = 0;
            if(newHead[0] < 0) newHead[0] = this.ycells - 1;
        } else { // else, game over
            if(newHead[1] >= this.xcells) this.props.gameover(this.state.score);
            if(newHead[1] < 0) this.props.gameover(this.state.score);
            if(newHead[0] >= this.ycells) this.props.gameover(this.state.score);
            if(newHead[0] < 0) this.props.gameover(this.state.score);

            // check if new head position is already part of the snake
            if(searchForArray(newPos, newHead) > -1) {
                this.props.gameover(this.state.score); // if it is, the snake hit itself -> game over
            }
        }

        var newScore = this.state.score;

        // check if new pos matches food pos
        if(this.state.food[0] === newHead[0] && this.state.food[1] === newHead[1]) {
            this.setFood(); // reset food
            newPos.push(tail); // the snake grows
            newScore++; // score++
        }

        newPos.unshift(newHead); // add the new head as the first position

        this.changingDir = false;

        this.setState({
            pos: newPos,
            score: newScore
        })
    }

    setFood() {
        var foodPos = [
            Math.floor(Math.random() * this.ycells),
            Math.floor(Math.random() * this.xcells)
        ] // randomize food position

        // repeat until this position doesn't happen to be occupied by the snake
        while(searchForArray(this.state.pos, foodPos) > -1) {
            foodPos = [
                Math.floor(Math.random() * this.ycells),
                Math.floor(Math.random() * this.xcells)
            ]
        }

        this.setState({food: foodPos})
    }

    render() {

        const cellsize = this.state.cellsize || 0;

        // creates the divs that make each cell of the snake
        const parts = this.state.pos.map((p, i) => <div key = {i} className = "snakepart" style = {{top: p[0] * cellsize, left: p[1] * cellsize, width: cellsize - 2 * this.props.margin, height: cellsize - 2 * this.props.margin}} />);

        var food = []

        // add food
        if(this.state.food.length > 0 && !this.props.demo) {
            food = <div style = {{
                top: this.state.food[0] * cellsize,
                left: this.state.food[1] * cellsize,
                height: cellsize / 2,
                width: cellsize / 2
            }} className = "snakepart food" />
        }

        // the hr defines the lower bound, since there's always some remaining space below the grid in the Y axis

        return(
            <div className = "grid">
                {this.props.demo ? <></> : <Score score = {this.state.score} />}
                {parts}
                {food}
                <hr style = {{top: this.ycells * cellsize || 0, opacity: this.props.demo ? 0 : 1}} />
            </div>
        );
    };
}

export default Snake;