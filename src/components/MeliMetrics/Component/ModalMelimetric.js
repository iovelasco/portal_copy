/* eslint-disable */
import React from 'react'
import Modal from '@andes/modal';
import TextField from '@andes/textfield';
import Button from '@andes/button';
import Spinner from '@andes/spinner';
import { connect } from 'react-redux';
import '../../Modals/Modals.scss';
import PropTypes from 'prop-types';
import { closeAlert, deleteAlert, settingAlarm } from '../redux/action';
import RadioButton from '@andes/radio-button';
import { warning, deleted } from '../../../assets/image/icons';
import Dropdown from '@andes/dropdown';
import moment from 'moment';
import Image from '../../Image';
import axios from 'axios';
import ld from 'lodash'
const { RadioGroup } = RadioButton
const { DropdownItem } = Dropdown;

const mapStateToProps = (store) => {
    return {
        token: store.token,
        openAlert: store.meliMetricAlert.alert,
        userName:store.userName,
        metric_name: store.meliMetricAlert.metric_data.metric_name,
        alertConfiguration: store.meliMetricAlert.alert_data
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        handleCloseAlert: (propsAlert) => {
            dispatch(closeAlert(propsAlert));
        },
        handleSettingAlarm: (configAlert) => {
            dispatch(settingAlarm(configAlert));
        },
        hadleDeleteAlert: (id, userName) => {
            dispatch(deleteAlert(id, userName));
        }
    }
}

class ModalMelimetric extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoadingAlert: false,
            site_id: undefined,
            comparison: undefined,
            comparison_unit: undefined,
            comparison_amount: 0,
            comparison_period: undefined,
            deviation_period: 'ly',
            deviation_amount: 0,
            deviation_unit: 'percentage',
            selectedSite: undefined,
            hasConfiguration: false,
            configuredAlert: {
                deviation_period: 'ly',
                deviation_amount: 0,
                deviation_unit: 'percentage',
                level: [],
                filters: []
            },
            triggers: [],
            level: [{"field": "timestamp", "interval_type": "month"}],
            filters: [{"field": "timestamp", "range": {"gte": "now-1d/M", "lte": "now-1d/M"}}]
        };
        this.updateAlertConfiguration = this.updateAlertConfiguration.bind(this);
        this.buildConfiguredAlert = this.buildConfiguredAlert.bind(this);
        this.updateKey = this.updateKey.bind(this);
        this.createAlert = this.createAlert.bind(this);
        this.deleteAlert = this.deleteAlert.bind(this);
        this.onSiteChange = this.onSiteChange.bind(this);
        this.removeTrigger = this.removeTrigger.bind(this);
        this.addTrigger = this.addTrigger.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    async updateAlertConfiguration(metricId) {
        try {
            this.setState({isLoadingAlert: true});
            const alertData = await this.getAlarmDefinition(metricId, this.props.token);
            if (alertData) {
                this.setState({triggers: alertData.triggers, isLoadingAlert: false});
            } else this.setState({isLoadingAlert: false});
        } catch (error) {
            console.error(error);
            this.setState({isLoadingAlert: false});
        }
    }

    updateKey(key, value) {
        this.setState({[key]: value});
    }

    componentDidMount() {
        console.log(`Modal melimetric mounted. Metric ID: ${this.props.modalConfiguration.metricId}`);
        if (this.props.modalConfiguration.metricId) {
            this.updateAlertConfiguration(this.props.modalConfiguration.metricId);
        }
    }

    componentDidUpdate(oldProps) {
        console.log(`Modal melimetric updated. Metric ID: ${this.props.modalConfiguration.metricId}`);
        if (this.props.modalConfiguration.metricId&&(oldProps.modalConfiguration.metricId!=this.props.modalConfiguration.metricId||!oldProps.modalConfiguration.metricId)) {
            console.log('Modal melimetric props changed!');
            this.updateAlertConfiguration(this.props.modalConfiguration.metricId);
        }
    }

    async getAlarmDefinition(metricId, token) {
        try {
            const {data} = await axios.get(`/api/alerts?metric_id=${metricId}`, {headers: {'X-DSH-Token': token}});
            return data.foundAlerts ? data.foundAlerts[0] : undefined
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    removeTrigger(id) {
        const newTriggers = this.state.triggers.filter((x,ind) => {
            return ind!=id;
        });
        this.setState({triggers: newTriggers});
    }

    buildConfiguredAlert() {
        if (!this.state.triggers.length) return <div className="help-message">This metric does not have alerts configured yet</div>;
        return this.state.triggers.map((tr,ind) => {
            let mensaje = (data => {
                const {site_id, comparison, comparison_period, comparison_unit, comparison_amount} = data;
                let site = site_id=='all_sites' ? 'all sites' : site_id;
                let _cp = (cp => {
                    switch (cp) {
                        case 'ly':
                            return 'MTD vs MTD LY';
                        case 'cv':
                            return 'MTD';
                        case 'ld':
                            return 'D-1 vs D-1 LY';
                            
                    }
                })(comparison_period);
                let _amount = comparison_unit == 'percentage' ? `${comparison_amount}%` : comparison_amount;
                return `When the ${_cp} ${comparison_unit} for ${site} is ${comparison} ${_amount}`;
            })(tr);
            return (
                <div className="list">
                    <p>
                        Trigger: <span>{mensaje}</span>
                    </p>
                    <Image src={deleted} size='20px' color="#fdb814" onClick={() => this.removeTrigger(ind)} />
                </div>
            )
        });
    }

    async createAlert() {
        try {
            await axios.put('/api/alerts', {configAlert: {metric_id: this.props.modalConfiguration.metricId, triggers: this.state.triggers}}, {headers: {'X-DSH-Token': this.props.token}});
            this.updateAlertConfiguration(this.props.modalConfiguration.metricId);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAlert() {
        try {
            await axios.delete(`/api/alerts?metric_id=${this.props.modalConfiguration.metricId}`, {headers: {'X-DSH-Token': this.props.token}});
            this.setState({
                triggers: []
            });
        } catch (error) {
            console.log(error);
        }
    }

    onSiteChange(ev, site) {
        this.setState({selectedSite: site});
    }

    addTrigger() {
        const {site_id, comparison, comparison_amount, comparison_period, comparison_unit} = this.state;
        const hasT = this.state.triggers.some(p => {
            return p.site_id==site_id&&p.comparison==comparison&&p.comparison_amount==comparison_amount&&p.comparison_period==comparison_period&&p.comparison_unit==comparison_unit;
        });
        if (!hasT) {
            let conf = this.state.triggers;
            conf.push({site_id, comparison, comparison_amount, comparison_period, comparison_unit});
            this.setState({triggers: conf});
        }
    }

    closeModal() {
        this.setState({triggers: []});
        this.props.onClose(); 
    }

    render() {
        const props = this.props;
        let mapSides;
        const alertConfiguration = props.alertConfiguration || []
        let mapAlertConfig ;
        const configuredAlert = this.buildConfiguredAlert();
        return (
            <React.Fragment>
                <Spinner size="small" label="Loading saved alerts..." show={this.state.isLoadingAlert} modifier="fullscreen"/>
                <Modal
                closable={false}
                visible={props.modalConfiguration.show}
                type="loose"
                title={
                    <div className="wrapper_modal__title">
                        <h4>Set alarm</h4>
                        <p>The alert will be sent to your email</p>
                        <Image src={warning} size='20px' color="#fdb814" />
                    </div>
                }
                onClose={this.closeModal}
                className="modal-config-alert"
                actions={{
                    buttonFilled:
                        <Button modifier="outline" onClick={this.closeModal}>Cancel</Button>,
                    buttonTransparent:
                        <Button onClick={this.createAlert}>Save alarm</Button>
                }}>
                <div className="wrapper_modal">
                    <div className="wrapper_modal__configuration-by-alert">
                        <div className="title">
                            <p>Configuration for: <span> {props.modalConfiguration.metricName} </span> </p>
                        </div>
                        {configuredAlert}
                    </div>
                    <div className="wrapper_modal__option">
                        <p>Add new trigger</p>
                        <div>
                            <Dropdown value={this.state.comparison_period} type="form" label="Period" size="compact"
                                onChange={(ev, v) => {
                                    this.updateKey('comparison_period', v);
                                }}>
                                {[
                                    {display: 'MTD vs MTD LY', value: 'ly'},
                                    {display: 'MTD', value: 'cv'},
                                    {display: 'D-1 vs D-1 LY', value: 'ld'},
                                    {display: 'D-1 vs D-1 LW', value: 'lw'},
                                    {display: 'WTD vs WTD LW', value: 'wtd'},
                                    {display: 'EOW vs EOW LW', value: 'eow'}].map(x => {
                                    return <DropdownItem primary={x.display} value={x.value}/>
                                })}
                            </Dropdown>
                            <Dropdown
                                className="side_id"
                                size="compact"
                                label="Site"
                                type="form"
                                onChange={(ev, v) => {
                                    this.updateKey('site_id', v);
                                }}>
                                <DropdownItem key="all_sites" value="all_sites" primary="All sites"/>
                                {mapSides = props.modalConfiguration.availableSites.map((x, i) => {
                                    return <DropdownItem key={i} value={x} primary={x} />
                                })}
                            </Dropdown>
                            <Dropdown value={this.state.comparison_period} type="form" label="Type" size="compact"
                            onChange={(ev, v) => {
                                this.updateKey('comparison_unit',v);
                            }}>
                                {[{display: 'Percentage', value: 'percentage'}, {display: 'Absolute', value: 'absolute'}].map(x => {
                                    return <DropdownItem primary={x.display} value={x.value}/>
                                })}
                            </Dropdown>
                            <Dropdown value={this.state.comparison_period} type="form" label="Comparison" size="compact"
                            onChange={(ev, v) => {
                                this.updateKey('comparison',v);
                            }}>
                                {[{display: 'Above', value: 'above'}, {display: 'Below', value: 'below'}].map(x => {
                                    return <DropdownItem primary={x.display} value={x.value}/>
                                })}
                            </Dropdown>
                            {(this.state.comparison_unit === 'percentage')?
                             <TextField type="number" prefix="%" onChange={(ev, texto) => {
                                 this.updateKey('comparison_amount', ev.target.value);
                             }} witd={100} label="Write percentage" />
                             : <TextField type="number" onChange={(ev) => {
                                 this.updateKey('comparison_amount', ev.target.value)
                             }} witd={100} label="Absolute value" /> }
                        </div>
                    </div>
                    <div className="wrapper_modal__option">
                        <div>
                            <Button size="small" onClick={this.addTrigger}>Add trigger</Button>
                            <Button className="boton-warning" size="small" onClick={this.deleteAlert}>Delete alarm</Button>
                        </div>
                    </div>
                </div>
            </Modal>
            </React.Fragment>
        )
    }

}

ModalMelimetric.propTypes = {
    children: PropTypes.element,
};

ModalMelimetric.defaultProps = {
    children: null,
};


export default connect(mapStateToProps, mapDispatchToProps)(ModalMelimetric);