import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import { SvgIcon } from '@media/ui/icons';
import { 
	ArrowDownIcon, 
	ArrowUpIcon
} from '@media/ui/icons/svgs';
import { isFunction } from 'util';

class DropText extends Component {
    static propTypes = {
        dropWidth: PropTypes.number,
        dropData: PropTypes.array,
        text: PropTypes.string,
        onChange: PropTypes.func
    }

    static defaultProps = {
        dropWidth: 130,
        dropData: ['Solid Color'],
        text: 'Solid Color',
        onChange() {}
    }
    
    constructor() {
        super();

        this.state = {
            displayMenu: false
        };

        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);

    };

    showDropdownMenu(e) {
        e.preventDefault();

        this.setState({ 
            displayMenu: true 
        }, () => {
            document.addEventListener('click', this.hideDropdownMenu);
        });
    }

    hideDropdownMenu() {
        this.setState({ 
            displayMenu: false 
        }, () => {
            document.removeEventListener('click', this.hideDropdownMenu);
        });
    }

    onSelect = (e) => {
        const { onChange } = this.props;

        let selectedText = e.target.innerText;
        
        if (isFunction(onChange)) {
            onChange(selectedText);
        }
    }

    render() {
        const { dropWidth, text, dropData } = this.props;
        const { displayMenu } = this.state;

        return (
            <div styleName="dropdown">
                <div styleName="button" onClick={this.showDropdownMenu}>
                    { text }
                    <SvgIcon icon={(() => {
						if (displayMenu) {
                            return <ArrowUpIcon />;
                        }

						return <ArrowDownIcon />;
					})()} size={10} color="#666" />
                </div>
                <ul style={{
                    width: dropWidth,
                    display: displayMenu ? 'block' : 'none'
                }}>
                    {
                        dropData.map((data, idx) => (
                            <li onClick={this.onSelect} key={idx}><a styleName={`${(text == data) ? 'active' : ''}`}>{ data }</a></li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

export default DropText;