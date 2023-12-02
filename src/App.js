import React from 'react';
import Widget1 from '@modules/Widget1';
import Widget2 from '@modules/Widget2';

import './App.css';

const components = {
    Widget1,
    Widget2
}

const App = (props) => {
    const { config } = props;
    const DynamicComponent = components[config.module];

    if (!DynamicComponent) {
        return (
            <div className="error-main">
                <p>Oops! Không tìm thấy trang.</p>
                <h1>404</h1>
            </div>
        );
    }
    
    return (
        <div className="app">
            <DynamicComponent />
        </div>
    );
};

export default App;
