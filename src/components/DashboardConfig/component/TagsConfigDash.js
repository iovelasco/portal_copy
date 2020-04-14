import React from 'react';
import Tag from '@andes/tag'
import { Col } from 'react-flexbox-grid';

const TagsConfigDash = (props) => {
  return (
    <Col md={props.col} className="dash-config--section-tag">
      {props.tags ? props.tags.map((x) => <Tag label={x.label}/>) : ''}
    </Col>
  );
};
export default TagsConfigDash
