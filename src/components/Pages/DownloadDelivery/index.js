/* eslint-disable */
import React, { Fragment, Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import axios from 'axios';
import { resolve } from 'path';
import downloadIcon from '../../../assets/image/download.svg';
import PagesTitle from '../Component/pagesTitle';
import Calendar from 'react-calendar';
import Button from '@andes/button'
import Spinner from '@andes/spinner';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import '../Pages.scss';
import './DownloadDelivery.scss';
import {withRouter} from 'react-router';

library.add(faExclamationCircle);
class DownloadPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            delivery: undefined,
            year: undefined,
            month: undefined,
            date: undefined,
            currentView: 'reset',
            downloadUrl: undefined,
            isGeneratingUrl: false,
            delivery_id: undefined,
            selectedDate: undefined,
            isLoadingData: true,
        };
    }

    componentWillMount() {
        axios.get(`/api/business_units/${this.props.match.params.buId}/deliveries`).then((data) => {
            this.setState({ data: data.data, isLoadingData:false });
        });
    }

    componentDidMount() {
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'trackPageview',
                'businessUnit': this.props.buName,
                'section': 'Options',
                'title': 'Download Delivery'
              });
        }
    }

    componentDidUpdate() {
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'trackPageview',
                'businessUnit': this.props.buName,
                'section': 'Options',
                'title': 'Download Delivery'
              });
        }
    }

    cambiarContexto = (action) => {
        switch (action.tipo) {
            case 'reset':
                this.setState({ currentView: action.tipo, delivery: undefined, year: undefined, month: undefined, date: undefined, delivery_id: undefined });
                break;
            case 'delivery':
                this.setState({ currentView: action.tipo, delivery: action.delivery || this.state.delivery, year: undefined, month: undefined, date: undefined, delivery_id: undefined });
                break;
            case 'date':
                this.setState({ currentView: action.tipo, date: action.date || this.state.date });
                break;
            case 'selected_delivery':
                this.setState({ isGeneratingUrl: true, downloadUrl: undefined, currentView: action.tipo, delivery_id: action.delivery_id });
                axios.get(`/api/business_units/${this.props.buId}/deliveries/${action.delivery_id}`)
                    .then((resul) => {
                        this.setState({ downloadUrl: resul.data.url_download, isGeneratingUrl: false });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                break;
        }
    }
    
    onChange = (ev) => {
        this.setState({selectedDate: moment(ev), currentView: 'date'});
    }

    calculatePath() {
        let keys = ['delivery', 'date', 'selected_delivery'];
        let path = [];
        for (var i = 0; i < keys.length; i++) {
            if (this.state[keys[i]]) {
                if (keys[i] == 'delivery') path.push(<h3 className="pages-delivery__delivery-title">{this.state[keys[i]]}</h3>);
                else path.push(<h3>{this.state[keys[i]].substring(1)}</h3>);
            }
        }
        return path;
    }

    resolveDisplay = () => {
        const { cambiarContexto } = this;
        const { 
            data,
            currentView, 
            delivery,
            isGeneratingUrl,
            selectedDate,
            downloadUrl } = this.state
        switch (currentView) {
            case 'reset':
            return (
                <Fragment>
                     <p className="pages-delivery__title">Select Daily</p>
                        <ul className="pages-delivery__result-delivery">
                            {Object.keys(data).map((x , index) =>
                            <li key={index} onClick={() => cambiarContexto({ tipo: 'delivery', delivery: x })}>{x}
                             </li>
                            )}
                        </ul>
                    </Fragment>
                )
            case 'delivery':
                return (
                    <Fragment>
                        <p className="pages-delivery__title">Select date</p>
                        <div   className="pages-delivery__container-calendar">
                            <Calendar className="pages-delivery__calendar"
                                onChange={this.onChange}
                                value={this.state.date}
                            />
                            </div>
                        <Button  modifier="outline" onClick={() => cambiarContexto({ tipo: 'reset' })}>Volver</Button> 
                    </Fragment>
                )
            case 'date':
            let dateArr = [];
            if (data[delivery]["y"+selectedDate.year()]["m"+(selectedDate.month()+1)]["d"+selectedDate.date()]) {
             dateArr = Object.keys(data[delivery]["y"+selectedDate.year()]["m"+(selectedDate.month()+1)]["d"+selectedDate.date()]);
            }
                return (
                    <Fragment>
                           <p className="pages-delivery__title">Select Daily</p>
                        <ul className="pages-delivery__result-delivery">{dateArr.map((x, index) => {
                            return (<li key={index} onClick={() => cambiarContexto({ tipo: 'selected_delivery', delivery_id:data[delivery]["y"+selectedDate.year()]["m"+(selectedDate.month()+1)]["d"+selectedDate.date()][x] })}>{x}</li> )})}
                        </ul>
                        <Button onClick={() => cambiarContexto({ tipo: 'delivery' })}>Volver</Button> 
                    </Fragment>
                )
            case 'selected_delivery':
                return (
                    <Fragment>
                        <div className="pages-delivery__result-download">
                        {isGeneratingUrl ? 'Generando URL de descarga...' :
                        <div>
                            <Button modifier="outline" onClick={() => cambiarContexto({ tipo: 'delivery' })}>Volver</Button>
                            <Button href={downloadUrl}> Download delivery </Button>
                        </div> }
                        </div>
                  </Fragment>
                )
            default:
                return <p> </p>
        }
    }

    render() {
        const pageTitleConfig = {
            title: "Deliveries",
            icon: downloadIcon,
            showSearchInput: false,
            role: this.props.role
        }
        let display = this.resolveDisplay();
        return (
            <Fragment>
                <PagesTitle {...pageTitleConfig} />
                <Grid className="pages-delivery">
                    <Row center="md" >
                        <Col md={8} className="pages-delivery__result">
                             {this.calculatePath()}
                             {Object.keys(this.state.data).length ==  0 && this.state.isLoadingData == false ? 
                             <div className="pages-delivery-message">
                                 <FontAwesomeIcon icon={faExclamationCircle} />
                                 <h3> Don't have dailys </h3>  
                             </div>: 
                             <div> {display} </div>}
                        </Col>
                    </Row>
                </Grid>
                <Spinner modifier="block" label="Loading necessary information" show={this.state.isLoadingData} />
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        buId: state.buId,
        token: state.token,
        buName: state.buName
    }
}

export default withRouter(connect(mapStateToProps)(DownloadPage));

