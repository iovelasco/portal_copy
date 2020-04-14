import React from "react";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { connect } from 'react-redux';

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      configurationSaved:false,
      accountantLabel:undefined,
      labels:[],
      showOtherNotification:false,
    }
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();

  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.configurationSaved == true && this.props.configurationSaved == false) {
      this.addNotification();
    }
    if (nextProps.emptyData == true && this.props.emptyData == false){
      this.addNotification();
    }
  }

  addNotification() {
      this.notificationDOMRef.current.addNotification({
        message: this.props.message,
        type: this.props.type,
        insert: this.props.type,
        container:this.props.container,
        animationIn: ["removal", "fadeIn"],
        animationOut: ["removal", "fadeOut"],
        dismiss: { duration: this.props.duration },
        dismissable: { click: true },
      });
  };

  render() {
    return (
        <ReactNotification ref={this.notificationDOMRef} />
    );
  };
};


const mapStateToProps = (store, props) => ({

});

const mapDispatchToProps = dispatch => ({
});



export default connect(mapStateToProps, mapDispatchToProps)(Notification);