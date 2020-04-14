/* eslint-disable */
import React from 'react';
import Form from '@andes/form';
import { Col } from 'react-flexbox-grid';
import TextField from '@andes/textfield';
import Dropdown from '@andes/dropdown';

const { DropdownItem } = Dropdown;


const InputConfigDash = (props) => {
  return (
    <Col md={props.col} className="dash-config__input">
        <Form>
            <TextField label={props.labelName}  />
        </Form>
    </Col>
  );
}

export default InputConfigDash
