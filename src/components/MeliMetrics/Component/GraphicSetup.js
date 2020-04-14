/* eslint-disable */
import React, { Fragment } from 'react';
import { faCalendarAlt, faTimesCircle, faBell, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import FloatingButtons from '../../FloatingButtons';
import Dropdown from '@andes/dropdown';
import Calendar from 'react-calendar';
import {alarm} from '../../../assets/image/icons';
import Colors from './Colors';
import Switch from "react-switch";
import moment from 'moment';
import Image from '../../Image';
import '../MeliMetrics.scss';
import ld from 'lodash';
import {FaRegWindowClose} from 'react-icons/fa'

const { DropdownItem } = Dropdown;

const GraphicSetup = (props) => {

  const {metricId, metricName} = props;

  const graphics = ["Line","Bar",];
  const unit = ["Thousands","Million"]

  let mapGraphics;
  let mapPlan;
  let mapColor;
  let mapSites;
  const minTimestamp = ld.isPlainObject(props.rangeFilter) ? props.rangeFilter.start : props.minTimestamp;
  const maxTimestamp = ld.isPlainObject(props.rangeFilter) ? props.rangeFilter.end : props.maxTimestamp;
  const timestampsSourced = ld.isPlainObject(props.rangeFilter);
  const mappedSites = [];
  if (!props.isCalculation) mappedSites.push(<DropdownItem key='all' value='all' primary='All sites'/>);
  props.availableSites.map((x, i) => {
    mappedSites.push(<DropdownItem key={i} value={x} primary={x}/>);
  });
  return (
    <div className="meli-metric__header-graphic">
        <div style={{width:'10%'}} className="meli-metric__title">
          <p>{metricName}</p>
        </div>
        <div style={{width:'40%'}} className="meli-metric__operation-data">
          {props.availableSites.length&&
        <Dropdown
          width="20"
          size="compact"
          label={props.selectedSite}
          placeholder="Site"
          value={ props.selectedSite||'MLA' }
          onChange={(ev, site) => {
            props.onConfigChange('site_id', props.metricId, site)
          }}>
          
          {mappedSites}
          
        </Dropdown>}
        <div className="meli-metric__header-calendar">
            <Dropdown size="compact" label="Timespan" onChange={props.onTimestampChange}>
              {[{value: '60days', display:'60 Days'}, {value: '12months', display: '12 Months'}].map(d => {
                return <DropdownItem value={d.value} primary={d.display}/>
              })}
            </Dropdown>
        </div>
        </div>
        <div style={{width:'40%'}} className="meli-metric__operation-graphic">

          <Dropdown
            size="compact"
            width="30"
            label="Select Graphic"
            value={ props.selectGraphic }
            onChange={(ev, graphicType) => {
              props.onConfigChange('graphic_type', props.metric_id, graphicType)
            }}
            >
            {mapGraphics = graphics.map((x, i) => {
              return <DropdownItem key={i} value={x} primary={x} />
            })}
          </Dropdown>
          <Dropdown
            size="compact"
            width="30"
            type="form"
            label="CY Color"
            value={ props.selectBgColor }
            onChange={(ev, selectBgColor) => {
              props.onConfigChange('cy', props.metric_id, {"color": selectBgColor})
            }}
            >
            { mapColor = Object.keys(Colors).map((x, i) => {
              return <DropdownItem key={i} value={x} primary={x} />
            })}
          </Dropdown>
          <Dropdown
            size="compact"
            width="30"
            type="form"
            label="LY Color"
            value={ props.selectLineColor }
            onChange={(ev, selectLineColor) => {
              props.onConfigChange('ly', props.metric_id, {"color": selectLineColor})
            }}
            >
            { mapColor = Object.keys(Colors).map((x, i) => {
              return <DropdownItem key={i} value={x} primary={x} />
            })}
          </Dropdown>
        <p style={switchLabel}>Grid</p>
        <Switch onChange={props.hangleGrid} checked={props.gridOn} onColor="#009ee3" offColor="#cecece" activeBoxShadow="0 0 2px 3px #3bf" height={20} width={40}/>
        </div>
        <div style={{width:'10%'}} className="meli-metric__close-graphic">
          <Image src={alarm} 
                size='20px'
                color="#fdb814"
                onClick={()=>props.onAlertConfig(props.metric_id, props.availableSites)}
                />
        <FloatingButtons  
          heightWidth={35}
          bgColor="#fff"
          iconColor="#cecece"
          icon={faTimesCircle}
          onClick={()=>props.onRemoveMetric(props.metric_id)}
          /> 
        </div>
    </div>
  )
}

const switchLabel = {
  paddingRight:'4px',
  paddingLeft:'8px',
};


export default GraphicSetup;



