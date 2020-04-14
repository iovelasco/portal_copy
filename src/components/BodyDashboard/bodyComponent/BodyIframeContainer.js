import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from "@andes/spinner";
import {toggleDrawerAction} from "../../Drawer/redux/drawerActions"
const jsStringEscape = require('js-string-escape');


const mapStateToProps = (store, props) => ({
  toggleDrawer:store.toggleDrawer
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleDrawer: () => {
      dispatch(toggleDrawerAction())
    },
  }
};

const BodyIframeContainer = (props) => {
    return (
      <div className="body-iframe">
      {!props.url ? undefined : <iframe src={jsStringEscape(props.url)}>
        </iframe>}
        <Spinner modifier="block" label="Loading dashboard" show={false}/>
      </div>
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(BodyIframeContainer);

