/* eslint-disable */
import React, { Fragment } from 'react';
import List from '@andes/list';
import { connect } from 'react-redux'
import keyUserIcon from '../../../assets/image/keyUser.svg';
import './KeyUser.scss';
import '../Pages.scss';
import FloatingButtons from '../../FloatingButtons';
import Button from '@andes/button';
import Card from '@andes/card';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ModalKU from '../../Modals/ModalAddKU';
import ModalEditKU from '../../Modals/ModalEditKU';
import PagesTitle from '../Component/pagesTitle';
import mexicoFlag from '../../../assets/image/flag/mexico.svg';
import venezuelaFlag from '../../../assets/image/flag/venezuela.svg';
import uruaguayFlag from '../../../assets/image/flag/uruguay.svg';
import argentinaFlag from '../../../assets/image/flag/argentina.svg';
import chileFlag from '../../../assets/image/flag/chile.svg';
import peruFlag from '../../../assets/image/flag/peru.svg';
import colombiaFlag from '../../../assets/image/flag/colombia.svg';
import brasilFlag from '../../../assets/image/flag/brasil.svg';
import corpFlag from '../../../assets/image/flag/corp.svg';
import keyUserListIcon from '../../../assets/image/key-user.svg'
import { sort } from 'semver';
import { runInThisContext } from 'vm';

const { ListItem, ListGroup } = List;
library.add(faPlus)



class KeyUser extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyUserSelection = this.handleKeyUserSelection.bind(this);
        this.state = {
            modalEditKu: false,
            name: undefined,
            ku_id: undefined,
            country: undefined,
            email: undefined,
            specialties: undefined,
            pic: undefined
        };
        this.finishedEditing = this.finishedEditing.bind(this);
    }

    componentDidMount() {
        if (window.dataLayer) {
            if (this.props.buName) {
                window.dataLayer.push({
                    'event': 'trackPageview',
                    'businessUnit': this.props.buName,
                    'section': 'Options',
                    'title': 'Key Users'
                  });
            }
        }
    }

    componentDidUpdate(oldProps) {
        if (oldProps.buName!=this.props.buName&&this.props.buName) {
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'trackPageview',
                    'businessUnit': this.props.buName,
                    'section': 'Options',
                    'title': 'Key Users'
                  });
            }
        }
    }

    handleKeyUserSelection(id, name, country, email, specialties, pic) {
        if (this.props.role&&this.props.role.can_add_key_users) {
            this.setState({
                ku_id: id,
                name,
                country,
                email,
                specialties,
                pic,
                modalEditKu: true
            });
        }
    }

    finishedEditing() {
        this.setState({
            modalEditKu: false,
            name: undefined,
            ku_id: undefined,
            country: undefined,
            email: undefined,
            specialties: undefined,
            pic: undefined
        });
    }

    resolveflag(country) {
        let countryFlag
        switch (country) {
            case 'Mexico':
                countryFlag = <img src={mexicoFlag} />
                break;
            case 'Venezuela':
                countryFlag = <img src={venezuelaFlag} />
                break;
            case 'Uruguay':
                countryFlag = <img src={uruaguayFlag} />
                break;
            case 'Brasil':
                countryFlag = <img src={brasilFlag} />
                break;
            case 'Argentina':
                countryFlag = <img src={argentinaFlag} />
                break;
            case 'Chile':
                countryFlag = <img src={chileFlag} />
                break;
            case 'Peru':
                countryFlag = <img src={peruFlag} />
                break;
            case 'Colombia':
                countryFlag = <img src={colombiaFlag} />
                break;
            case 'Corp':
                countryFlag = <img className="corp" src={corpFlag} />
                break;
            default:
                break;
        }
        return countryFlag
    }
    render() {

        const pageTitleConfig = {
            title: "Key User",
            icon: keyUserIcon,
            role: this.props.role,
            handleInput: this.handleInput,
            value: this.state.search,
            onKeyPress: this.handleKeyPress,
            inputId: "dashboard_search",
            showSearchInput: false,
            handleModal: this.props.showModalKu,
            headerAction: "Add KU",
            requiredRole: 'can_add_key_users'
        }
        const configModal = {
            onFinish:this.finishedEditing,
            showModal:this.state.modalEditKu,
            ku_id:this.state.ku_id,
            name:this.state.name,
            specialties:this.state.specialties,
            country:this.state.country,
            email:this.state.email 
        }
        const {modalEditKu} = this.state
        const { key_users, isAdmin, role} = this.props
        const kuData = Object.keys(key_users).sort()
    
        return (
            <Fragment>
                <PagesTitle {...pageTitleConfig} />
                <div className="pages-key-user">
                    {kuData.map((country, key) => {
                        return (
                            <div key={key} className="pages-key-user--list">
                                <div className="pages-key-user--header">
                                    {this.resolveflag(country)} <h3>{country}</h3>
                                </div>
                                {key_users[country].map((user, key) => {
                                    return (
                                        <li key={key} style={(role&&role.can_add_key_users) ? { cursor: "pointer" } : { cursor: "auto" }} className="pages-key-user--list-item" onClick={() => this.handleKeyUserSelection(user.ku_id, user.name, user.country, user.email, user.specialties, user.pic)}>
                                            <p>{user.pic}</p>
                                            <span className="img">
                                             <img src={keyUserListIcon} />
                                            </span>
                                            <div className="first-item">
                                                <p className="name">{user.name}</p>
                                            </div>
                                            <div>
                                                <p className="email">{user.email}</p>
                                                <p className="specialization"><span>Specialization:</span> {user.specialties}</p>
                                            </div>
                                        </li>
                                )})}
                            </div>
                        )
                    })}
                </div>
                <ModalKU />
                {modalEditKu ? <ModalEditKU {...configModal} /> : ''}
            </Fragment>
        )
    }
}


const mapStateToProps = (store, props) => ({
    key_users: store.key_users,
    sections: store.sections,
    isAdmin: store.isAdmin,
    role: store.role,
    buName: store.buName,
    ...props,
})


const mapDispatchToProps = (dispatch, props) => ({
    showModalKu: () => {
        dispatch({ type: 'SHOW_MODAL_KU' });
    }
});

const connectKeyUser = connect(mapStateToProps, mapDispatchToProps);
export default connectKeyUser(KeyUser)