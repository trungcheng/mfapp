import { Component } from 'react';
import PropTypes from 'prop-types';
import checkPermission from './check-permisson';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class Can extends Component {
	static propTypes = {
		ability: PropTypes.any,
		children: PropTypes.any
	}

	static defaultProps = {
		ability: null,
		children: null
	}
	
	constructor(props) {
		super(props);
	}

	render() {
		const { children, ability, store } = this.props;

		if (!checkPermission(ability, store.currentUser)) return null;

		return children;
	}
}

export default Can;