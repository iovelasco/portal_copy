/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import axios from 'axios';
import Tag from '@andes/tag';
import '../Body.scss';
import { toggleDrawerBodyAction } from '../redux/bodyActions';
import { withRouter } from 'react-router';
import BodyIframeContainer from '../bodyComponent/BodyIframeContainer';
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import { runInThisContext } from 'vm';

class BodyDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update_status: undefined,
      dashboard: {
        id: -1,
        title: '',
        description: '',
        author: '',
        collaborators: [],
        metrics: [],
        attributes: [],
        url: undefined
      }
    };
    this.getDependenciesStatus = this.getDependenciesStatus.bind(this);
  }

  componentWillMount() {
    if (this.props.dashboards) {
      if (this.props.dashboards[this.props.match.params.dashboardId]) {
        this.setState({ dashboard: this.props.dashboards[this.props.match.params.dashboardId] });
        this.props.onDashboardLoaded(this.props.dashboards[this.props.match.params.dashboardId]);
      }
    }
  }

  componentDidMount() {
    if (window.dataLayer&&this.state.dashboard.id!=-1) {
      window.dataLayer.push({
        'event': 'trackPageview',
        'section': 'Dashboards',
        'businessUnit': this.props.buName,
        'dashboardName': this.state.dashboard ? this.state.dashboard.title.replace(/ /g, "-") : undefined
      });
      this.getDependenciesStatus();
    }
  }

  async getDependenciesStatus() {
    try {
      const {data} = await axios.get(`/api/business_units/${this.props.match.params.buId}/dashboards/${this.props.match.params.dashboardId}/dependencies`, {headers: {'X-DSH-Token': this.props.token}});
      this.setState({update_status: data});
    } catch (error) {
      console.error(error);
    }
  }

  componentDidUpdate(oldprops, oldstate) {
    if (this.props.match.params.dashboardId != oldstate.dashboard.id) {
      if (this.props.dashboards) {
        if (this.props.dashboards[this.props.match.params.dashboardId]&&this.props.match.params.dashboardId!=this.state.dashboard.id) {
          if (window.dataLayer) {
            window.dataLayer.push({
              'event': 'trackPageview',
              'section': 'Dashboards',
              'businessUnit': this.props.buName,
              'dashboardName': this.props.dashboards[this.props.match.params.dashboardId].title.replace(/ /g, "-")
            });
            console.log('datalayer',window.datalayer)
          }
          this.setState({ dashboard: this.props.dashboards[this.props.match.params.dashboardId] });
          this.getDependenciesStatus();
          this.props.onDashboardLoaded(this.props.dashboards[this.props.match.params.dashboardId]);
        }
      }
    }
  }

  resolveStatusClass(status) {
    switch (status) {
      case 'ON TIME':
        return 'on-time-status';
      case 'DELAYED':
        return 'delayed-status';
      case 'UPDATED':
        return 'on-time-status';
    }
  }

  render() {
    const { showMetrics, showResume, showAttributes, showDrawerDoby, handlerHeader } = this.props;
    const { dashboard } = this.state;
    return (
      <Fragment>
        <div className={(showDrawerDoby) ? "body-drawer drawer-body-open" : "body-drawer"} paddingSize={0} >
          <div className="body-drawer__container">
            <Col onClick={() => handlerHeader(false, false, false, true)} sm={12} className="body-drawer__section body-drawer--header" >
              <p>Summary of {dashboard.title} </p>
            </Col>
            <Row className={!showResume ? 'body-drawer--description-closed' : 'body-drawer--description'}>
              <Col className="text-info">
                <p>Description</p>
                <p>{dashboard.description}</p>
              </Col>
              <Col className="text-info">
                <p>Author</p>
                <p>{dashboard.author}</p>
              </Col>
              <Col className="text-info">
                <p>Collaborators</p>
                <p>{dashboard.collaborators.length > 0 ? dashboard.collaborators.reduce((x, y) => { return x + ', ' + y }) : ''}</p>
              </Col>
            </Row>
            <Col onClick={() => handlerHeader(false, true, false, false)} sm={12} className="body-drawer__section" >
              <p>Metrics</p>
            </Col>
            {!showMetrics ? '' : <Grid>
              <div className="body-drawer--metric">
                {dashboard.metrics.map((x) => {
                  return (
                    <Accordion className="body-drawer--list-group">
                      <AccordionItem expanded={dashboard.metrics.length < 4 ? true : false} >
                        <AccordionItemTitle hideBodyClassName="accordion--arrow">
                          <p>{x.name}</p>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                          <p>{x.description}</p>
                        </AccordionItemBody>
                      </AccordionItem>
                    </Accordion>)
                })
                }
              </div>
            </Grid>}
            <Col onClick={() => handlerHeader(false, false, true, false)} sm={12} className="body-drawer__section" >
              <p>Attributes</p>
            </Col>
            {!showAttributes ? '' : <Grid>
              <Row className="body-drawer--description">
                {dashboard.attributes.map((x) => {
                  return (
                    <Accordion className="body-drawer--list-group">
                    <AccordionItem expanded={dashboard.attributes.length < 4 ? true : false} >
                      <AccordionItemTitle hideBodyClassName="accordion--arrow">
                        <p>{x.name}</p>
                      </AccordionItemTitle>
                      <AccordionItemBody>
                      <p>{x.value}</p>
                      </AccordionItemBody>
                    </AccordionItem>
                  </Accordion>
                  )})}
              </Row>
            </Grid>}
          </div>
        </div>
        <div className='status-tag'>
          {this.state.update_status&&this.state.update_status.status!='UNKNOWN'&&<Tag label={this.state.update_status.status} className={this.resolveStatusClass(this.state.update_status.status)}/>}
        </div>
        <BodyIframeContainer url={dashboard.url} />
      </Fragment>

    )
  }
};


const mapDispatchToProps = (dispatch) => {
  return {
    handlerHeader: function (toggle, metrics, attributes, resume) {
      dispatch(toggleDrawerBodyAction(toggle, metrics, attributes, resume));
    }
  }
}
const mapStateToProps = (store, props) => {
  return {
    dashboards: store.dashboards,
    showMetrics: store.showMetrics,
    showResume: store.showResume,
    showAttributes: store.showAttributes,
    showDrawerDoby: store.toggleDrawerBody,
    buName: store.buName,
    token: store.token,
    ...props
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BodyDrawer));