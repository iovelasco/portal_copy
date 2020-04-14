/* eslin disable */
import React from 'react'
import Modal from '@andes/modal';
import TextField from '@andes/textfield';
import Button from '@andes/button';
import Spinner from '@andes/spinner';
import { connect } from 'react-redux';
import { updateDashboards } from '../../../components/DashboardConfig/redux/DashboardConfigActions';
import axios from 'axios';
import '../Modals.scss';

const mapDispatchToProps = (dispatch) => {
    return {
        updateDashboards: function() {
            dispatch(updateDashboards());
        }
    }
};

class ModalEditKU extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            country: props.country,
            email: props.email,
            specialties: props.specialties,
            pic: props.pic,
            ku_id: props.ku_id,
            resultText: undefined,
            resultColor: undefined,
            updatingKu: false
        };
        this.saveKu = this.saveKu.bind(this); 
        this.updateKuData = this.updateKuData.bind(this);
        this.deleteKu = this.deleteKu.bind(this);
    }

    updateKuData(ev, value) {
        this.setState({
            [ev.target.id]: ev.target.value
        });
    }

    async saveKu() {
        try {
            this.setState({
                updatingKu: true
            });
            await axios.put(`/api/business_units/${this.props.buId}/key_users/${this.state.ku_id}`, {name: this.state.name, country: this.state.country, email: this.state.email, specialties: this.state.specialties, profile_picture: this.state.pic}, {headers: {'X-DSH-Token': this.props.token}});
            this.setState({
                resultText: 'El key user se actualizó correctamente',
                updatingKu: false,
                resultColor: 'green'
            });
            this.props.onFinish();
            this.props.updateDashboards();
        } catch (error) {
            console.log(error);
            this.setState({
                resultText: 'Hubo un error al actualizar el key user',
                updatingKu: false,
                resultColor: 'red'
            });
        }
    }

    async deleteKu() {
        try {
            this.setState({
                updatingKu: true
            });
            await axios.delete(`/api/business_units/${this.props.buId}/key_users/${this.state.ku_id}`, {headers:{'X-DSH-Token': this.props.token}});
            this.setState({
                resultText: 'El key user se eliminó correctamente',
                updatingKu: false
            });
            this.props.onFinish();
            this.props.updateDashboards();
        } catch (error) {
            this.setState({
                resultText: 'Hubo un error al eliminar el key user',
                updatingKu: false
            });
        }
    }

    render() {
        const {name, country, specialties, pic, email} = this.state;
        return (
            <Modal 
                closable={false}
                visible={this.props.showModal}
                type="loose"
                title="Editar Key User"
                onClose={this.props.onFinish}
                actions={{buttonFilled:<Button  modifier="outline" onClick={this.deleteKu}>Eliminar Key User</Button> , buttonTransparent: <Button onClick={this.saveKu}>Guardar Cambios</Button> }}>
                <div>
                    <div className="form-action">
                        <p className="form-label" style={{color: this.state.resultColor}}>{this.state.resultText}</p>
                    </div>
                    <div className="form-action">
                        <p className="form-label">Name</p>
                        <TextField id="name" className="form-input"  value={name} textbox={true} onChange={this.updateKuData} />
                    </div>
                    <div className="form-action">
                        <p className="form-label">País</p>
                        <TextField className="form-input" id="country"  value = {country} textbox={true} onChange={this.updateKuData}/>                    
                    </div>
                    <div className="form-action">
                        <p className="form-label">E-mail</p>
                        <TextField className="form-input" id="email"  value={email} textbox={true} onChange={this.updateKuData}/>
                    </div>
                    <div className="form-action">
                        <p className="form-label">Especialidad</p>
                        <TextField className="form-input" id="specialties" value={specialties} textbox={true} onChange={this.updateKuData}/>                    
                    </div>
                    <div className="form-action">
                        <p className="form-label">Picture</p>
                        <TextField className="form-input" id="pic"  value={pic} textbox={true} onChange={this.updateKuData}/>                    
                    </div>

                </div>
                <Spinner show={this.state.updatingKu} modifier="fullscreen" label="Editing Key User"/>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        buId: state.buId
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditKU);