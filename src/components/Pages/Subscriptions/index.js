import React from 'react';
import PagesTitle from '../Component/pagesTitle';
import SubItem from './components/SubscriptionItem';
import { connect } from 'react-redux';
import './styles.scss';

const mapStateToProps = (state) => {
  return {
    subscriptions: state.subscriptions
  }
}

export default  connect(mapStateToProps)(function SubsPage(props) {
  return (
    <div className='subs-container'>
      <PagesTitle title="Dashboard Update Subscriptions"/>
      <div className='subs-container-items'>
        {props.subscriptions&&props.subscriptions.map(x => {
          return <SubItem title={x.title} id={x.dashboard_id}/>
        })}
      </div>
    </div>
  )
})