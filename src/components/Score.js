import React from 'react';
import Digits from '../components/Digits.js';
import score from '../assets/images/score.png'

/* Using the Digits component, creates a Score sprite in the form: Score N, where N are some digits

props:

score: score (integer)

*/

class Score extends React.Component {
    render() {
        return(
            <div className = "score"><img  src = {score} alt = "score" /><Digits s = {this.props.score} /></div>
        )
    }
}

export default Score;