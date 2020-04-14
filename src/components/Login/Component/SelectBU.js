import React, {Fragment} from 'react'
import { connect } from 'react-redux';
import Card from '@andes/card';
import Button from '@andes/button';
import List from '@andes/list';
import axios from 'axios';
import { withRouter} from 'react-router';
import { IoMdChatbubbles } from 'react-icons/io';
import { IconContext } from "react-icons";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowRight);

const { ListItem, ListGroup } = List;

class SelectBU extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bus: []
    }
    this.goToBu = this.goToBu.bind(this);
  }

  async componentWillMount() {
    try {
      const bus = await axios.get('/api/business_units', {headers: {'X-DSH-Token': this.props.token}});
      this.setState({
        bus: bus.data.business_units
      });
    } catch (error) {
    }
  }

  goToBu(buid) {
    this.props.history.push(`/business_unit/${buid}/favourites`);
  }

  render() {
    const buList = this.state.bus.map((x,bu_id)=>
      (<ListItem key={bu_id} onClick={() => this.goToBu(x.bu_id)} primary={x.bu_name}>
        <Button>
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </ListItem>)
    );
    return (
      <Fragment>


      <Card paddingSize={0} className="login__card login--list">
        <List>
          <ListGroup label="Select BU">
            <List size="compact">
              {buList}
            </List>
          </ListGroup>
        </List>
      </Card>
      <div className="login--float-box">
      <IconContext.Provider value={{ color: "white", size:"2em",className: "icon" }}>
          <IoMdChatbubbles />
          <p>¿Can we help you?</p>
      </IconContext.Provider>
      </div>
      </Fragment>
    );
  }
};


const mapStateToProps = (store, props) => ({
  token: store.token,
  ...props,
});

const mapDispatchToProps = (dispatch, props) => ({
  handleInput: (ev) => {},
});

const connectedSelectBU = connect(mapStateToProps, mapDispatchToProps);
export default connectedSelectBU(withRouter(SelectBU));
