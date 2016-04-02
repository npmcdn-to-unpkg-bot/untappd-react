"use strict";

import React from 'react';
import AppActions from './../actions/AppActions';
import AppStore from './../stores/AppStore';
//import ListItem from './ListItem';
import ListItem from 'material-ui/lib/lists/list-item'
import styles from 'material-ui/lib/styles';
import FontIcon from 'material-ui/lib/font-icon';
import Avatar from 'material-ui/lib/avatar';
import Toggle from 'material-ui/lib/toggle';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Colors from 'material-ui/lib/styles/colors';
import MenuItem from 'material-ui/lib/menus/menu-item';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
import List from 'material-ui/lib/lists/list';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon  color="#999" className="vertIcon" />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

function wrapState(ComposedComponent) {
  const StateWrapper = React.createClass({
    getInitialState() {
      return {selectedIndex: 1};
    },
    handleUpdateSelectedIndex(e, index) {
      this.setState({
        selectedIndex: index,
      });
    },
    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.state}
          valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}}
        />
      );
    },
  });
  return StateWrapper;
}

SelectableList = wrapState(SelectableList);

class List extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            selectedIndex: 1
        };

    }

    componentDidMount() {

        

    }

    handleUpdateSelectedIndex(){

        console.log("handleUpdateSelectedIndex");

    }

    render() {
        

        console.log(this.props.items);
        var allItems = this.props.items;
        var items = [];

        for (var key in allItems) {
            console.log(allItems[key])
            let _itemContent = allItems[key].payload.action.item;
            items.push(<ListItem 
                                className="list-item"
                                key={key} 
                                item={allItems[key]} 
                                value={allItems[key]} 
                                leftAvatar={
                                    <Avatar size="40" src={(_itemContent.media.length > 0) ? _itemContent.user_avatar : "./images/no-img.jpg"} />
                                }

                                rightToggle={<Toggle />}
                                >

                          <p>{_itemContent.checkin_comment}</p>
                          <div>
                            <img src={(_itemContent.media.length > 0) ? _itemContent.media[0].photo.photo_img_sm : "./images/no-img.jpg"}/>
                          </div>
                          <div className="username-signature">
                            <p>{"- " + _itemContent.user_first_name + " " + _itemContent.user_last_name}</p>
                          </div>
                        </ListItem>);
        }

        //console.log(items);
        return (
                <SelectableContainerEnhance>{items}</SelectableContainerEnhance>
        );
    }
};

export default List;
