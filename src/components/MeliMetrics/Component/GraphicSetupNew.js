/* eslint-disable */
import React from 'react';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import FloatingButtons from '../../FloatingButtons';
import Dropdown from '@andes/dropdown';
import {alarm} from '../../../assets/image/icons';
import Colors from './Colors';
import Image from '../../Image';
import '../MeliMetrics.scss';

const { DropdownItem } = Dropdown;

const GraphicSetup = (props) => {

  const graphics = ["Line","Bar",];
  
  const mappedSites = [];

  mappedSites.push(<DropdownItem key='all' value='all' primary='All sites'/>);
  
  props.sites.map((x, i) => {
    mappedSites.push(<DropdownItem key={i} value={x} primary={x}/>);
  });
  
  return (
    <div className="meli-metric__header-graphic">
        <div style={{width:'10%'}} className="meli-metric__title">
          <p>{props.metricName}</p>
        </div>
        <div style={{width:'40%'}} className="meli-metric__operation-data">
          {props.sites.length&&
        <Dropdown
          width="20"
          size="compact"
          label={props.selectedSite}
          placeholder="Site"
          value={ props.selectedSite||'MLA' }
          onChange={(ev, site) => {
            props.onSiteChanged(site)
          }}>
          {mappedSites}
        </Dropdown>}
        <div className="meli-metric__header-calendar">
            <Dropdown size="compact" label="Timespan" onChange={props.onTimespanChange}>
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
            value={props.graphicType}
            onChange={(ev, graphicType) => props.onGraphicTypeChange(graphicType)}
            >
            {graphics.map((x, i) => {
              return <DropdownItem key={i} value={x} primary={x} />
            })}
          </Dropdown>
          <Dropdown
            size="compact"
            width="30"
            type="form"
            label="CY Color"
            value={ props.selectBgColor }
            onChange={(ev, selectBgColor) => props.onCyColorChange(selectBgColor)}
            >
            {Object.keys(Colors).map((x, i) => {
              return <DropdownItem key={i} value={x} primary={x} />
            })}
          </Dropdown>
          <Dropdown
            size="compact"
            width="30"
            type="form"
            label="LY Color"
            value={props.ly&&props.ly.color}
            onChange={(ev, selectLineColor) => props.onLyColorChange(selectLineColor)}
            >
            {Object.keys(Colors).map((x, i) => {
              return <DropdownItem key={i} value={x} primary={x} />
            })}
          </Dropdown>
        </div>
        <div style={{width:'10%'}} className="meli-metric__close-graphic">
          <Image src={alarm} 
                size='20px'
                color="#fdb814"
                onClick={()=>props.onOpenModalAlert(props.metricId, props.sites)}
                />
        <FloatingButtons  
          heightWidth={35}
          bgColor="#fff"
          iconColor="#cecece"
          icon={faTimesCircle}
          onClick={props.onRemove}
          /> 
        </div>
    </div>
  )
}

export default GraphicSetup;



