import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const mapStateToProps = (state, props) => {
    return {
        loggedIn: state.token ? true : false,
        ...props
    }
}

class requiresAuth extends Component {
    constructor(props) {
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        this.configureIntercom = this.configureIntercom.bind(this);
    }

    componentWillMount() {
        this.configureIntercom();
    }

    componentDidUpdate() {
        this.configureIntercom();
    }

    configureIntercom() {
        console.log(window.supportApi);
        let newData = localStorage.getItem("login_data");
        newData = JSON.parse(newData);
        if (window.supportApi) {
            if (this.props.loggedIn) {
                window.supportApi.setProfile("BI");
                window.supportApi.setUser({full_name: newData.user_id, username: newData.user_id, email: newData.mail});
            } else window.supportApi.destroyUser();
          }
    }

    logoutUser() {
        console.log('El user fue deslogueado');
    }
    
    render() {
        return (
            <Fragment>
                {React.cloneElement(this.props.children, {
                    isAuthenticated: this.props.loggedIn,
                    logoutUser: this.logoutUser
                })}
            </Fragment>
        )
    }
}

export default withRouter(connect(mapStateToProps)(requiresAuth));