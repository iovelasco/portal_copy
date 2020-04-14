import React from 'react';
import PropTypes from 'prop-types';

import Button from '@andes/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './FloatingButtons.scss';

const FloatingButtons = props => (
  <Button
    onClick={props.onClick}
    className="button-circle"
    style={{
      background: props.bgColor,
      width: props.heightWidth,
      height: props.heightWidth,
      color: props.iconColor,
    }}
    modifier={props.modifier}
  >
    <FontAwesomeIcon icon={props.icon} />
  </Button>
);

export default FloatingButtons;

