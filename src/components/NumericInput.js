import React from 'react';
import Digits from '../components/Digits.js';
import up from '../assets/images/up.png';
import down from '../assets/images/down.png';

/* NumericInput adds a NumericInput field with two arrows. On click, these arrows change the input

props:

value: initial value
max: maximum value
min: minimum value
edit: bound function to call when the value is edited by the user

*/

class NumericInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: this.props.value};
        this.add = this.add.bind(this);

        window.addEventListener("click", (e) => console.log(e));
    }

    add(n) {
        var v = this.state.value + n;
        if(v > this.props.max) v = this.props.max;
        if(v < this.props.min) v = this.props.min;
        this.setState({value: v});
        this.props.edit(v);
    }

    render() {

        return(
            <>
                <div className = "numinput">
                    <img alt = {this.props.alt} src = {this.props.label} />
                    <span><Digits s = {this.state.value || this.props.value} /></span>
                    <img onClick = {() => this.add(1)} className = "inputarr" alt = "up" src = {up} />
                    <img onClick = {() => this.add(-1)} className = "inputarr" alt = "down" src = {down} />
                </div>
            </>
        )
    }
}

export default NumericInput;