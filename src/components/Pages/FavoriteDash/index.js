/* eslint-disable */
import React, { Fragment, Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import './FavoriteDash.scss';
import '../Pages.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus} from '@fortawesome/free-solid-svg-icons'
import iconFavorite from '../../../assets/image/favorite.svg'
import { loadFavorite , deleteFavorite} from '../redux/pagesAction'
import PagesTitle from '../Component/pagesTitle';
import searchDash from '../../../assets/image/search-dash.svg'
import {updateCurrentDashboard} from '../../Drawer/redux/drawerActions';
library.add(faPlus)

class FavoriteDash extends Component {
  constructor(props){
    super(props);
    this.state = {
      favourites: [],
    }
    this.mapFavoriteList = this.mapFavoriteList.bind(this);
  }
  componentWillMount() {  
    this.mapFavoriteList();
  }
  handleDelete = id => {
    this.props.deleteFavorite(id)
  }

  handleDeleteFavorite(){
    this.props.actions.deleteFavorite(this.state.favourites)
  }

  componentDidMount() {
    if (window.dataLayer&&this.props.buName) {
      window.dataLayer.push({
          'event': 'trackPageview',
          'businessUnit': this.props.buName,
          'section': 'Options',
          'title': 'Favourites'
        });
  }
  }

  componentDidUpdate(op) {
    if (op.dashboards!=this.props.dashboards) {
      this.mapFavoriteList();
    }
    if (op.buName!=this.props.buName&&this.props.buName)
    if (window.dataLayer) {
      window.dataLayer.push({
          'event': 'trackPageview',
          'businessUnit': this.props.buName,
          'section': 'Options',
          'title': 'Favourites'
        });
  }
  }

  mapFavoriteList(){
    const favourites = []
    const sections = this.props.sections
    for (var dash in this.props.dashboards) {
      const existe = this.props.favourites.filter((p) => p.dashboard_id == dash);
      if (existe.length > 0) {
        let newDash = this.props.dashboards[dash];
        favourites.push(newDash);
      };
    }
    this.setState({favourites: favourites})
  }

  render(){
      const favouriteList = (this.state.favourites).map((dashboard, dashboard_id) => {
        return (
          <li key={dashboard_id} className="pages-favorite__list-item" onClick={() => this.props.history.push(`/business_unit/${this.props.match.params.buId}/dashboards/${dashboard.id}`)}>
              <div className="pages-favorite__item-title">
                <img src={searchDash} />
                <div>
                  <p>{dashboard.title}</p>
                </div>
              </div>
              <div className="pages-favourite-chips">
              <p>Dashboard's metric</p>
                <ul>
                {dashboard.metrics.map((metrics, index) => {
                  return <li key={index}>{metrics.name}</li>
                })
              }
            </ul>
          </div>
      </li>
        );
      })
      return (
        <Fragment>
          <PagesTitle 
              title="Favorites"
              icon={iconFavorite} 
          />
        <Grid className="pages-favorite">
          <Row >
            <ul className="pages-favorite__list">
              {favouriteList}
            </ul>
          </Row>
        </Grid>
      </Fragment>
     )
    }
  }

const mapStateToProps = (store, props) => {
  return {
    favourites: store.favourites,
    token: store.token,
    sections: store.sections, 
    dashboards: store.dashboards,
    buName: store.buName,
    ...props
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeCurrentDashboard: (section, dashid) => {
      dispatch(updateCurrentDashboard(section, dashid));
    },
  }
};


const connectFavoriteDash = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connectFavoriteDash(FavoriteDash));
