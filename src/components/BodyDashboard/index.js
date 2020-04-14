import React from 'react';
import PropTypes from 'prop-types';

import './Body.scss';

const BodyDashboard = ({ children }) => {
  return (
    <div className="body">
      {children}
    </div>
  );
};


BodyDashboard.propTypes = {
  children: PropTypes.element,
};

BodyDashboard.defaultProps = {
  children: null,
};


export default BodyDashboard