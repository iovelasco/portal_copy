/* eslint-disable */
import React from 'react'
import Modal from '@andes/modal';
import TextField from '@andes/textfield';
import Button from '@andes/button';
import Spinner from '@andes/spinner';
import { connect } from 'react-redux';
import { createNewFAQ } from '../../Pages/redux/pagesAction';
import * as types from '../../../store/constants/ActionTypes';
import '../Modals.scss';

class ModalFAQ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: undefined,
            answer: undefined
        };
        this.updateFAQ = this.updateFAQ.bind(this);
        this.handleCreateFAQ = this.handleCreateFAQ.bind(this);
    }

    updateFAQ(ev) {
        this.setState({
            [ev.target.id]: ev.target.value
        });
    }

    handleCreateFAQ() {
        const { question, answer } = this.state;
        if (!(question && answer)) alert('No fields can be left blank');
        else this.props.createFAQ(this.props.currentBuId, this.state);
    }

    render() {
        return (
            <Modal closable={false}
                visible={this.props.showModal}
                type="loose"
                title="Add FAQ"
                onClose={this.props.cancelToggle}
                actions={{
                    buttonFilled:
                        <Button modifier="outline" onClick={this.props.cancelToggle}>Cancel</Button>,
                    buttonTransparent:
                        <Button onClick={this.handleCreateFAQ}> Add </Button>,
                }}>
                <div>
                    <div className="form-action">
                        <p className="form-label">Pregunta</p>
                        <TextField id="question" className="form-input" textbox={true} onChange={this.updateFAQ} />
                    </div>
                    <div className="form-action">
                        <p className="form-label">Respuesta</p>
                        <TextField multiline={true} rows={6} className="form-input" id="answer" maxLength={600} textbox={true} onChange={this.updateFAQ} />
                    </div>
                </div>
                <Spinner show={this.props.isWorking} modifier="fullscreen" label="¡Adding FAQ!" />
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        showModal: state.modalFAQ,
        currentBuId: state.buId,
        isWorking: state.isAddingFAQ
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        cancelToggle: function () {
            dispatch({ type: types.CLOSE_MODAL_FAQ });
        },
        createFAQ: function (buId, faqData) {
            dispatch(createNewFAQ(buId, faqData));
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ModalFAQ);