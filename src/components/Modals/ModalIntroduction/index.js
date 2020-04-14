/* eslint-disable */
import React from 'react'
import Modal from '@andes/modal';
import TextField from '@andes/textfield';
import Button from '@andes/button';
import Spinner from '@andes/spinner';
import { connect } from 'react-redux';
import '../Modals.scss';
import { updateIntroduction } from '../../Pages/redux/pagesAction';

class ModalFAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      description: props.description
        };
        this.updIntroduction = this.updIntroduction.bind(this);
        this.handleUpdateIntroduction = this.handleUpdateIntroduction.bind(this);
    }

    updIntroduction(ev) {
        this.setState({
            [ev.target.id]: ev.target.value
        });
    }

    handleUpdateIntroduction() {
        const {title, description} = this.state;
        if (!(title&&description)) alert('No fields can be left blank');
        else this.props.modifyIntroduction(this.props.currentBuId, this.state);
    }

    render() {
        return (
            <Modal 
                closable={false}
                visible={this.props.showModal}
                type="loose"
                title="Modificar introducción"
                onClose={this.props.cancelToggle}
                className="modal"
                actions={{
                    buttonFilled:
                        <Button modifier="outline" onClick={this.props.cancelToggle}>Cancel</Button>,
                    buttonTransparent:
                        <Button onClick={this.handleUpdateIntroduction}> Actualizar </Button>
                }}>
                <div className="">
                    <div className="form-action">
                        <p className="form-label">Título</p>
                        <TextField id="title" value={this.state.title} className="form-input" textbox={true} onChange={this.updIntroduction}/>
                    </div>
                    <div className="form-action">
                        <p className="form-label">Description</p>
                        <TextField value={this.state.description} multiline={true} rows={20} className="form-input" id="description" textbox={true} onChange={this.updIntroduction}/>                    
                    </div>
                </div>
                <Spinner show={this.props.isWorking} modifier="fullscreen" label="¡Modifying introduction!"/>
            </Modal>
        )
    }
}


const mapStateToProps = (state) => {
    return {
      showModal: state.modalIntroduction,
      currentBuId: state.buId,
          isWorking: state.isModifyingIntroduction,
          title: state.introduction.title,
          description: state.introduction.description,
      }
  }
  
  const mapDispatchToProps = (dispatch, props) => {
    return {
      cancelToggle() {
              dispatch({type: 'CLOSE_MODAL_INTRODUCTION'});
          },
          modifyIntroduction: function(buId, introData) {
              dispatch(updateIntroduction(buId, introData));
          }
      }
  }


export default connect(mapStateToProps, mapDispatchToProps)(ModalFAQ);