/* eslint-disable */
import React from 'react';
import {
  Line,
  HorizontalBar,
  Bar
} from 'react-chartjs-2';
import { relative } from 'path';



const Graphic = (props) => {

  const { graphicType, data, displayType , maxValue} = props;
  console.log(props);

  const options = {
    tooltips: {
      mode: 'index',
      intersect: true,
      callbacks: {
        title: function(d) {
          const vmd = d[0].value;
          const vly = d[1].value;
          const lb = d[0].label;
          return `[${lb}] YoY: ${vly > 0 ? Math.round((vmd/vly)*100)-100 : 0}% ${displayType=='percentage' ? '. '+Math.round(vmd*100-vly*100)+' p.p' : ''}`;
        },
        label: function(item, data) {
          const label = data.datasets[item.datasetIndex].label;
          const value = displayType == 'absolute' ? item.yLabel : `${Math.round(item.yLabel*100)}%`;
          return `${label}: ${value}`;
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    elements: {
      line: {
        fill: false
      }
    },
    scales: {
      xAxes: [{
        offset: true,
        type: 'time',
        distribution: 'linear',
        gridLines: {
          drawOnChartArea: false
        },
        ticks: {
          source: 'auto'
          }
      }],
      yAxes: [{
        min: 0,
        max: maxValue,
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          drawOnChartArea: false
        },
        ticks: {
          beginAtZero: true,
          callback: function (label, index, labels) {
            if (displayType=='percentage') return label*100+'%';
            if (maxValue<10000) return label;
            if (maxValue<1000000) return label/1000+"K";
            else return label/1000000+"MM";
          }
        },
        scaleLabel: {
          display: false,
          labelString: '1k = 1000'
        }
      },
      {
        min: 0,
        max: maxValue,
        type: 'linear',
        display: false,
        position: 'right',
        id: 'y-axis-2',
        ticks: {
          beginAtZero: true
        }
      }
      ]
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    }
  }

  const chartStyle = {
    height: 230,
    width: 400,
    position: relative,
  }


  switch (graphicType) {
    case "Line":
      return <Line style={chartStyle} options={options} data={data} />
    case "bar":
      return <Bar style={chartStyle} options={options} data={data} />
    case "horizontalBar":
      return <HorizontalBar style={chartStyle} options={options} data={data} />
    default:
      return <Bar style={chartStyle} options={options} data={data} />
  }
}

export default Graphic