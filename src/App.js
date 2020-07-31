import React from 'react';
import './assets/style/App.css';
import header from './assets/images/snake.png';
import gameover from './assets/images/gameover.png';
import pressany from './assets/images/pressany.png';
import pressanyr from './assets/images/pressanyr.png';
import wasd from './assets/images/wasd.png';
import speed from './assets/images/speed.png';
import len from './assets/images/length.png'
import Blinker from './components/Blinker.js';
import Snake from './components/Snake.js';
import Score from './components/Score.js';
import NumericInput from './components/NumericInput.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {playing: false, gameover: false, score: NaN, speed: 5, len: 5};
    this.startGame = this.startGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
  };

  componentDidMount() {
    window.addEventListener("keydown", this.startGame);
  }

  startGame() {
    this.setState({playing: true})
  }

  gameOver(score) {
    this.setState({playing: false, gameover: true, score: score})
  }

  setSpeed(speed) {
    this.setState({speed: speed})
  }

  setLength(len) {
    this.setState({len: len})
  }

  render() {

    var scoreTxt = []

    if(this.state.gameover) {
      scoreTxt = <Score score = {this.state.score} />
    } else {
      scoreTxt = <img className = "wasd" src = {wasd} alt = "Use W, A, S and D to control the snake" />
    }

    return(
      <div className={"App" + (this.state.playing ? " playing" : "")}>
        <div className = "nomob">
          <span>:(</span><br />
          Snake is not mobile-friendly yet...<br />
          But it's 100% worth switching on your laptop :)
        </div>
        <img className = "title" src = {this.state.gameover? gameover : header} alt = {this.state.gameover? "game over" : "snake"} /><br />
        <br />

        {scoreTxt}
        {this.state.playing? <></>: <div className = "numinput">
          <NumericInput alt = "speed" min = {1} max = {99} label = {speed} value = {this.state.speed} edit = {this.setSpeed.bind(this)} /><br />
          <NumericInput alt = "length" min = {1} max = {50} label = {len} value = {this.state.len} edit = {this.setLength.bind(this)} />
        </div>}
        
        <br />
        <Blinker interval = {1000} className = "pressany" src = {this.state.gameover? pressanyr : pressany} alt = {this.state.gameover? "Press any key to restart" : "Press any key to start"} />
        <Snake  key = {this.state.playing + this.state.len + this.state.speed}
                demo = {!this.state.playing}
                margin = {1}
                cells = {50}
                pos = {[0, 0]}
                length = {this.state.len}
                direction = "W"
                speed = {this.state.speed}
                gameover = {this.gameOver} />
      </div>
      
    );
  };
}

export default App;
