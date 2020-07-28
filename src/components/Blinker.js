import React from 'react';

/*

Blinker creates an image that smoothly blinks (opacity oscilates from 0 to 1)

Props:
-> className: for easier CSS selection
-> src: image source
-> interval: in ms

*/

class Blinker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hidden: false };
        this.toggleVisibility = this.toggleVisibility.bind(this);
    };

    componentDidMount() {
        this.interval = setInterval(this.toggleVisibility, this.props.interval);
    };
    
    componentWillUnmount() {
        clearInterval(this.interval);
    };
    
    toggleVisibility() {
        this.setState({ hidden: !this.state.hidden });
    };

    render() {

        const className = this.props.className + (this.state.hidden ? " hidden" : "");

        return(
            <img style = {{"transition": "opacity " + this.props.interval / 2000 + "s ease"}} className = {className} src = {this.props.src} alt = {this.props.alt} />
        );
    };
}

export default Blinker;