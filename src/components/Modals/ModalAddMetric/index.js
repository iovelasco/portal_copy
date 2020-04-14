import React from 'react'
import Modal from '@andes/modal';
import TextField from '@andes/textfield';
import Button from '@andes/button';
import Spinner from '@andes/spinner';
import { connect } from 'react-redux';
import { createNewMetric, updateMetric } from '../redux/modalActions';
import '../Modals.scss';
import axios from 'axios';

class ModalMetric extends React.Component {
  constructor(props) {
    super(props);
    if (props.editMetric === false) {
      this.state = {
        name: undefined,
        description: undefined,
        buttonModal: 'Create',
        titleModal: 'Create metric',
        lastExecution: {
          isError: false,
          message: undefined
        }
      }
    } else {
      this.state = {
        name: this.props.name,
        description: this.props.description,
        toogleMetricButton: false,
        titleModal: 'Add Metric',
        buttonModal: 'Save',
        lastExecution: {
          isError: false,
          message: undefined
        }
      }
    }
    this.handlerOnChange = this.handlerOnChange.bind(this);
    this.handleCreateMetric = this.handleCreateMetric.bind(this);
  }

  componentWillUpdate(nextProps) {
    let data = {
      name: '',
      description: '',
      buttonModal: '',
      titleModal: '',
      lastExecution: {
        isError: false,
        message: undefined
      }
    }

    if (nextProps.editMetric != this.props.editMetric) {
      if (nextProps.editMetric === true) {
        data.buttonModal = 'Save';
        data.titleModal = 'Edit metric';
        data.name = nextProps.name;
        data.description = nextProps.description;
      } else {
        data.buttonModal = 'Create';
        data.titleModal = 'Add metric'
      }
      this.setState({...data});
    }
  }

  handlerOnChange(ev) {
    this.setState({
      [ev.target.id]: ev.target.value
    });
  }

  handleCreateMetric() {
    const { currentBuId, metricId, token, editMetric, callbackUpdate } = this.props
    const { name, description } = this.state;

    if (!(name && description)) return alert('No fields can be left blank');

    if (editMetric === false) {
      axios.post(`/api/business_units/${currentBuId}/metrics`,{ name, description }, { headers: { 'X-DSH-Token': token }})
        .then((data) => {
          let newState = this.state;
          newState.lastExecution.isError = false;
          newState.lastExecution.message = 'The metric was created correctly';
          this.setState({ newState });
        }).catch((error) =>{
          let newState = this.state;
          newState.lastExecution.isError = true;
          newState.lastExecution.message = error.response.data.error.message;
          this.setState({ newState });
        })
    } else {
      axios.put(`/api/business_units/${currentBuId}/metrics/${metricId}`, { name, description }, { headers: { 'X-DSH-Token': token }})
        .then((data) => {
          let newState = this.state;
          newState.lastExecution.isError = false;
          newState.lastExecution.message = 'The metric was updated correctly';
          this.setState({ newState });
          callbackUpdate();
        })
        .catch((error) => {
          let newState = this.state;
          newState.lastExecution.isError = true;
          newState.lastExecution.message = error.response.data.error.message;
          callbackUpdate();
          this.setState({ newState });
        });
    }
  }

  render() {
    return (
      <Modal
        closable={false}
        visible={this.props.showModal}
        type="loose"
        title={this.state.titleModal}
        onClose={this.props.closeModal}
        actions={{
          buttonFilled:
            <Button modifier="outline" onClick={this.props.closeModal}>Cancelar</Button>,
          buttonTransparent:

            <Button onClick={this.handleCreateMetric}>{this.state.buttonModal}</Button>
        }}
      >
        <div>
          <div className="form-action">
            <p className="form-label">Name</p>
            <TextField id="name" className="form-input" textbox={true} onChange={this.handlerOnChange} value={this.state.name} />
          </div>
          <div className="form-action">
            <p className="form-label">Description</p>
            <TextField className="form-input" id="description" textbox={true} multiline={true} onChange={this.handlerOnChange} value={this.state.description} />
          </div>
          <p>{this.state.lastExecution.message}</p>
        </div>
        <Spinner show={this.props.isWorking} modifier="fullscreen" label="Adding metric" />
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showModal: state.modalMetric,
    currentBuId: state.buId,
    isWorking: state.isAddingMetric,
    result: state.resultAddingMetric,
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    createMetric: (buId, metricData, token) => {
      dispatch(createNewMetric(buId, metricData, token));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalMetric);