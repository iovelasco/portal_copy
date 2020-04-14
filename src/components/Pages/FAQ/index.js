
/* eslint-disable */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import '../Pages.scss';
import './faq.scss'
import faqIcon from '../../../assets/image/faq.svg';
import ModalFAQ from '../../Modals/ModalAddFAQ';
import FloatingButtons from '../../FloatingButtons';
import { deletedFAQ } from '../redux/pagesAction';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import PagesTitle from '../Component/pagesTitle';
import { updateBus } from '../../DashboardConfig/redux/DashboardConfigActions';

library.add(faPlus)


class FAQ extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidUpdate() {
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'trackPageview',
                'businessUnit': this.props.buName,
                'section': 'Options',
                'title': 'FAQs'
              });
        }
    }

    componentDidMount() {
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'trackPageview',
                'businessUnit': this.props.buName,
                'section': 'Options',
                'title': 'FAQs'
              });
        }
    }
    

    render() {
        const showDelete = () => {
            return this.props.role&&this.props.role.can_create_faqs
        }
      const pageTitleConfig = {
            title:"FAQS",
            icon:faqIcon, 
            makeSearch: ()=> this.handleSearch(),
            headerAction:"Add Faqs",
            showSearchInput: false,
            handleModal:this.props.showModalFAQ,
            role:this.props.role,
            requiredRole: 'can_create_faqs'
          }
        const {role, faqs, handlerDeleteFaq, buId } = this.props

        return (
            <Fragment>
            <PagesTitle {...pageTitleConfig}/>
            <div className="pages-faq">
                {
                    faqs.map((faq, index) => {
                        console.log(faq);
                        return (
                        <div key={index} className="pages-faq--question">
                            <div>
                                <h2>{faq.question}</h2>
                                <p>{faq.answer}</p>
                            </div>
                            <div>
                            {showDelete() ?
                            <FloatingButtons
                                heightWidth={40}
                                icon={faTrashAlt}
                                modifier={"outline"}
                                bgColor=" #fff"
                                iconColor="#3483fa"
                                onClick={() => handlerDeleteFaq(buId, faq.id)}
                            /> : undefined}
                            </div> 
                        </div>
                        )
                    })
                }
            </div>
            <ModalFAQ/>
         </Fragment>
        )
    }

}

const mapStateToProps = (store, props) => ({
    faqs: store.faqs,
    role: store.role,
    buId: store.buId,
    buName: store.buName,
    ...props,
  });
  
  const mapDispatchToProps = (dispatch) => ({
    showModalFAQ: () => {
      dispatch({type: 'SHOW_MODAL_FAQ'});
    },
    handlerDeleteFaq: function (bu_id, id_faq) {
        dispatch(deletedFAQ(bu_id, id_faq))
    }
  });


const connectedFAQ= connect(mapStateToProps, mapDispatchToProps);
export default connectedFAQ(FAQ);