import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Card from '@andes/card';
import ToolsIcon from '../../../assets/image/tools.svg';

import '../Pages.scss';
import './Tools.scss';
import PagesTitle from '../Component/pagesTitle';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)

class Tools extends React.Component {
  constructor(props) {
    super(props)
  }

  
  componentDidMount() {
    if (window.dataLayer) {
        window.dataLayer.push({
            'event': 'trackPageview',
            'businessUnit': this.props.buName,
            'section': 'Options',
            'title': 'Tools'
          });
    }
}

componentDidUpdate() {
    if (window.dataLayer) {
        window.dataLayer.push({
            'event': 'trackPageview',
            'businessUnit': this.props.buName,
            'section': 'Options',
            'title': 'Tools'
          });
    }
}

  render() {
    const props = this.props;
    const toolList = (props.tools).map((x) => {
      return (
        <Col md={2} >
          <a href={x.url} target="_blank">
            <Card paddingSize={0} className="pages-tool--card" >
              <div >
                <img src={x.icon} />
              </div>       
              <p>{x.name}</p>
            </Card>
          </a>
        </Col>
      );
    })
    return (
      <Fragment>
        <PagesTitle
          title="Herramientas"
          icon={ToolsIcon}
        />
        <Grid>
          <Row className="pages-tool">
            {toolList}
          </Row>
        </Grid>
      </Fragment>
    );
  }

};

const mapStateToProps = (store, props) => {
  return {
    tools: store.tools,
    buName: store.buName,
    ...props,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {}
}


const connectTools = connect(mapStateToProps, mapDispatchToProps);
export default connectTools(Tools);