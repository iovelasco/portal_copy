/* eslin disable */
import React from 'react'
import Modal from '@andes/modal';
import TextField from '@andes/textfield';
import Button from '@andes/button';
import Spinner from '@andes/spinner';
import { connect } from 'react-redux';
import { createNewKU } from '../redux/modalActions';
import '../Modals.scss';

const mapStateToProps = (state) => {
    return {
        showModal: state.modalKeyUser,
        currentBuId: state.buId,
        isWorking: state.isAddingKu
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        cancelToggle: function () {
            dispatch({ type: 'CLOSE_MODAL_KU' });
        },
        createKeyUser: function (buId, kuData) {
            dispatch(createNewKU(buId, kuData));
        }
    }
}



class ModalKU extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: undefined,
            country: undefined,
            email: undefined,
            specialties: undefined,
            pic: undefined
        };
        this.updateKuData = this.updateKuData.bind(this);
        this.handleCreateNewKU = this.handleCreateNewKU.bind(this);
    }

    updateKuData(ev) {
        this.setState({
            [ev.target.id]: ev.target.value
        });
    }

    handleCreateNewKU() {
        const { name, country, email, specialties, pic } = this.state;
        if (!(name && country && email && specialties && pic)) alert('No fields can be left blank');
        else this.props.createKeyUser(this.props.currentBuId, this.state);
    }

    render() {
        return (
            <Modal
                closable={false}
                visible={this.props.showModal}
                type="loose"
                title="Add Key User"
                onClose={this.props.cancelToggle}
                actions={{ buttonFilled: <Button modifier="outline" onClick={this.props.cancelToggle}>Cancel</Button>, buttonTransparent: <Button onClick={this.handleCreateNewKU}> Create </Button> }}>
                <div>
                    <div className="form-action">
                        <p className="form-label">Name</p>
                        <TextField id="name" className="form-input" textbox={true} onChange={this.updateKuData} />
                    </div>
                    <div className="form-action">
                        <p className="form-label">Country</p>
                        <TextField className="form-input" id="country" textbox={true} onChange={this.updateKuData} />
                    </div>
                    <div className="form-action">
                        <p className="form-label">E-mail</p>
                        <TextField className="form-input" id="email" textbox={true} onChange={this.updateKuData} />
                    </div>
                    <div className="form-action">
                        <p className="form-label">Specialty</p>
                        <TextField className="form-input" id="specialties" textbox={true} onChange={this.updateKuData} />
                    </div>
                    <div className="form-action">
                        <p className="form-label">Picture</p>
                        <TextField className="form-input" id="pic" textbox={true} onChange={this.updateKuData} />
                    </div>
                </div>
                <Spinner show={this.props.isWorking} modifier="fullscreen" label="Adding Key User" />
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalKU);