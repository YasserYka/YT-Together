import React from 'react';
import Watch from '../Watch';

const Index = (props) => {
    return (
        <React.Fragment>
            <Watch socket={props.socket} />
        </React.Fragment>
    )
}

export default Index;