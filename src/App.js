import React from 'react';
import Widget1 from './modules/Widget1';
import Widget2 from './modules/Widget2';

import './App.css';

const components = {
    Widget1,
    Widget2
}

const App = (props) => {
    const { config } = props;
    const DynamicComponent = components[config.module];
    
    return (
        <div className="app">
            <DynamicComponent />
        </div>
    );
};

export default App;
