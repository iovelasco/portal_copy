
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import {connect} from 'react-redux';
import Button from '@andes/button';
import '../Pages.scss';
import introIcon from '../../../assets/image/intro.svg';
import ModalIntroduction from '../../Modals/ModalIntroduction';
import FloatingButtons from '../../FloatingButtons';
import './Introduction.scss';
import PagesTitle from '../Component/pagesTitle';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus} from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)


class Introduction extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fragment>
                <PagesTitle 
                    title="Introducción"
                    icon={introIcon} 
                    makeSearch={this.makeSearch}
                    handleSearch={this.handleSearch}
                    role={this.props.role}
                    inputId="metric_search"
                    headerAction="Modificar Introducción"
                    showSearchInput={false}
                    handleModal={this.props.handleModal}
                />
                <div className="pages--introduction">
                    <p>{this.props.description}</p>
                </div>
                <ModalIntroduction/>
            </Fragment>
        )
    }
}


const mapStateToProps = (store, props) => {
    return {
        title: store.introduction.title,
        description: store.introduction.description,
        isWorking: store.isModifyingIntroduction,
        showModal: store.modalIntroduction,
        role: store.role
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleModal: () => {
            dispatch({type: 'SHOW_MODAL_INTRODUCTION'});
        }
    }
}


const connectIntroduction = connect(mapStateToProps, mapDispatchToProps);
export default connectIntroduction(Introduction)


