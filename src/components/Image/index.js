import React from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import { css } from 'glamor';
import styled from 'styled-components';
import './Image.scss'


const Image = ({ src, onClick, size, imgStyle, color, ...props }) => {
  const Div = styled.div`
    width: ${size};
  }
  `;

  const styles = css({
    ' svg': {
      height: size,
      width: size
    },
    ' path': {
      fill: color
    },
    ' circle':{
      fill: color
    },
    ' rect':{
      fill: color
    },
  })
  return (
    <Div>
    <ReactSVG  
      src={src} 
      { ...styles } 
      onClick={onClick}
      beforeInjection={svg => {
      svg.classList.add('image-component');
      }}/>
    </Div>
  )
};

export default Image;

Image.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

Image.defaultProps = {
  m: 0
};
