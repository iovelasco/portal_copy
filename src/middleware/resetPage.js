import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';

const mapDispatchToProps = (dispatch) => {
    return {
        resetDashboard: function(nextPage) {
            dispatch({type: 'RESET_DASHBOARD', payload: nextPage});
        }
    }
}

const resetPageWrapper = (Component, nextPage) => {
    class resetPage extends React.Component {
        constructor(props) {
            super(props);
        }

        componentWillMount() {
            console.log('resetting dashboards');
            this.props.resetDashboard(nextPage);
        }

        render() {
            return <Component/>
        }
    }

    return connect(null, mapDispatchToProps)(resetPage)
}

export default resetPageWrapper;