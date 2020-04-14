/* eslint-disable */
import React from 'react';
import Tag from '@andes/tag';
import '../MeliMetrics.scss';
import '../MeliMetrics.scss';

const TagList = ({ renderList, title, onRemoveMetric}) => {
  let list
  return (
    <div className="meli-metric__search-list">
      <p> {title} </p>
      {
        <ul >
          {list = renderList.map(( element, i) => {
            return <Tag key={i} label={element.display_name } onClose={() => {
              onRemoveMetric(element.metric_id)()
            }} />;
          })}
        </ul>
      }
    </div >
  )
};

export default TagList;

