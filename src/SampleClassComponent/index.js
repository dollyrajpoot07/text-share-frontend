import React from "react";


export class SampleComponent extends React.Component {
    constructor(props) {
        super(props);
        console.log('Constructor');
        this.state = {};
    }

    static getDerivedStateFromProps(props, state) {
        return { a : 1};
    }

    render() {
        return (
            <div />
        )
    }

    componentDidMount() { // one time call
        console.log('Mounted');
    }

    componentDidUpdate() {
        
    }

    componentWillUnmount() {
        
    }
}