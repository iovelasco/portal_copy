import React, {useEffect, useState} from 'react';
import Tag from '@andes/tag';
import './styles.scss';
import axios from 'axios';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const resolveClass = (status) => {
  switch (status) {
    case 'ON TIME':
      return 'on-time-status';
    case 'DELAYED':
      return 'delayed-status';
    case 'UPDATED':
      return 'on-time-status';
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token
  }
}

export default withRouter(connect(mapStateToProps)(function SubscriptionItem(props) {

  const [status, setStatus] = useState('GETTING INFO...');
  
  useEffect(() => {
    async function getStatus(id) {
      const {buId} = props.match.params;
      const {data} = await axios.get(`/api/business_units/${buId}/dashboards/${id}/dependencies`, {headers: {'X-DSH-Token': props.token}});
      setStatus(data.status);
    }
    getStatus(props.id)
  }, [])

  return (
    <div className='subscription-item-container'>
      <p>{props.title}</p>
      <Tag className={resolveClass(status)} label={status}/>
    </div>
  )
}));