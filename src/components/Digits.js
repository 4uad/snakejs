import React from 'react';
import digit0 from '../assets/images/0.png';
import digit1 from '../assets/images/1.png';
import digit2 from '../assets/images/2.png';
import digit3 from '../assets/images/3.png';
import digit4 from '../assets/images/4.png';
import digit5 from '../assets/images/5.png';
import digit6 from '../assets/images/6.png';
import digit7 from '../assets/images/7.png';
import digit8 from '../assets/images/8.png';
import digit9 from '../assets/images/9.png';

const digits = [
  digit0,
  digit1,
  digit2,
  digit3,
  digit4,
  digit5,
  digit6,
  digit7,
  digit8,
  digit9
];

/* Digits uses a set of images from 0 to 9 to create any number with a special font.

i.e., for prop s = 10, Digits returns concatenation of digits 1 and 0.

props:

s: number.

*/

class Digits extends React.Component {
    render() {
        var these_digits = (""+this.props.s).split("");

        var output = []
    
        for(var i = 0; i < these_digits.length; i++) {
          output.push(<img key = {i} src = {digits[these_digits[i]]} alt = {these_digits[i]} className = "digit" />)
        }

        return(
            output
        )
    }
}

export default Digits;