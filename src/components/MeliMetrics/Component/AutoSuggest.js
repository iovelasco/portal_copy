/* eslint-disable */
import React, { Component, Fragment } from 'react';
import Autosuggest from 'react-autosuggest';
import '../MeliMetrics.scss';

class AutoSuggest extends Component {

  constructor(props) {
    
    super(props);

    this.state = {
      inputChart: undefined,
      metricConfig: [],
      selectedMetric: [],
      suggestions: [],
      search: '',
      value: '',
      localMetric:undefined,
      helpMessage:'',
      showMesagge:false,
    };
    
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);

  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const suggestions = this.props.availableMetrics.filter(m => {
      return m.display_name.toLowerCase().indexOf(inputValue)!=-1;
    });
    return suggestions.map(s => s.display_name);
  };

  getSuggestionValue = suggestion => suggestion;
  
  renderSuggestion = suggestion => (
    <div>
      {suggestion}
    </div>
  );

  onChange(event, { newValue, method }) {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected(event, { suggestion }) {
    const metricId = this.props.availableMetrics.filter(p => {
      return p.display_name==suggestion
    })[0].id;
    this.props.onMetricAdded(metricId);
  }


  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search Metric',
      value,
      onChange: this.onChange
    };
    return (
      <Fragment>
      <Autosuggest
      suggestions={suggestions}
      onSuggestionSelected={this.onSuggestionSelected}
      onSuggestionsClearRequested={this.onSuggestionsClearRequested}
      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
      getSuggestionValue={this.getSuggestionValue}
      renderSuggestion={this.renderSuggestion}
      inputProps={inputProps}
      />
      </Fragment>
    );
  }
};

export default AutoSuggest;


