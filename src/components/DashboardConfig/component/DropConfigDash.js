import React from 'react'
import { Col } from 'react-flexbox-grid';
import Dropdown from '@andes/dropdown'
import FloatingButtons from '../../FloatingButtons';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus)

const { DropdownItem } = Dropdown


export default class DropConfigDash extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: undefined
    };
    this.selectionHandler = this.selectionHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  selectionHandler(ev, value) {
    this.setState({selectedValue: value});
  }

  handleClick() {
    this.props.onClick(this.state.selectedValue)
  }

  componentWillReceiveProps(newprops) {}

  render() {
    return (
      <Col md={this.props.col} className="dash-config--section-drop">
        <Dropdown label={this.props.label} type="form"  onChange={this.props.onChangeHandler ? this.props.onChangeHandler : this.selectionHandler}>
        {this.props.data ? this.props.data.map((x, index) => {
            return <DropdownItem key={index} id={x[this.props.columnValue]} value={x[this.props.columnKey]} primary={x[this.props.columnValue]} />
          }) : ''}
          
        </Dropdown>
        {(this.props.button) ? <FloatingButtons heightWidth={45} bgColor={"#009ee3"} icon={faPlus} modifier={"filled"} onClick={this.handleClick}  /> : ''}
  
      </Col>
    )
  }

}

