/* eslin disable */
import React from 'react'
import Modal from '@andes/modal';
import TextField from '@andes/textfield';
import Button from '@andes/button';
import Spinner from '@andes/spinner';
import { connect } from 'react-redux';
import { createNewSection } from '../redux/modalActions';
import '../Modals.scss';

class ModalAddSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      section_name: undefined
    };
    this.updateSectionName = this.updateSectionName.bind(this);
    this.createNewSection = this.createNewSection.bind(this);
  }

  updateSectionName(ev) {
    this.setState({ section_name: ev.target.value });
  }

  createNewSection() {
    if (!this.state.section_name) alert('El Name no puede estar en blanco');
    else this.props.createSection(this.props.currentBuId, this.state.section_name);
  }

  render() {
    return (
      <Modal
        closable={false}
        visible={this.props.showModal}
        type="loose"
        title="Add section"
        onClose={this.props.cancelToggle}
        actions={{
          buttonFilled :
  <Button modifier="outline" onClick={this.props.cancelToggle}>Cancel</Button>,
          buttonTransparent :
  <Button onClick={this.createNewSection}>Crear</Button> }}
      >
        <div>
          <p>Section's name</p>
          <TextField textbox={true} onChange={this.updateSectionName} />
        </div>
        <Spinner show={this.props.isWorking} modifier="fullscreen" label="Adding section" />
      </Modal>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    showModal: state.modalSection,
    currentBuId: state.buId,
    isWorking: state.isAddingSection,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    cancelToggle: function () {
      dispatch({ type: 'CLOSE_MODAL_SECTION' });
    },
    createSection: function (buId, section_name) {
      dispatch(createNewSection(buId, section_name));
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ModalAddSection);