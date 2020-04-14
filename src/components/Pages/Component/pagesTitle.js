import React from 'react';
import TextField from '@andes/textfield';
import FloatingButtons from '../../FloatingButtons';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'

const PagesTitle = (props) => {
  return (
    <div className="pages-header">
      <div className="pages-header--title">
        <span > <img src={props.icon} /> </span>
        <h3 >{props.title} </h3>
      </div>
      {props.showSearchInput ?
        <div className="pages-header__input-search">
          <TextField 
            textbox
            id={props.inputId}
            onChange={props.handleInput}
            value={props.value}
            onKeyPress={props.onKeyPress}
            placeholder={props.placeholder}
          />
          <FloatingButtons
            heightWidth={40}
            icon={faSearch}
            modifier={"filled"}
            bgColor="transparent"
            iconColor="#009ee3"
            onClick={props.makeSearch}
          />
        </div>
        : ''}
      <div className="pages-header--action">
        {props.role&&props.role[props.requiredRole] ?
          <div onClick={() => props.handleModal()}>
            <label>  {props.headerAction} </label>
            <FloatingButtons
              heightWidth={40}
              icon={faPlus}
              modifier={"filled"}
              bgColor="#fff"
            />
          </div> : ''}
      </div>
      {props.accountantSearch >= 1 ?
        <div className="pages-header__accountan">
          <p>Result</p>
          <p>{props.accountantSearch}</p>
        </div>
        : ''}
    </div>
  );
};

export default PagesTitle;

