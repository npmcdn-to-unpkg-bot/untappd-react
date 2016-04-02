"use strict";

import React from 'react';
import AppActions from './../actions/AppActions';
import AppStore from './../stores/AppStore';
/*import List from './List';*/
import config from './../../../config.json';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
/*import Colors from 'material-ui/lib/styles/colors';*/
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Toggle from 'material-ui/lib/toggle';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

import RaisedButton from 'material-ui/lib/raised-button';
//let SelectableList = SelectableContainerEnhance(List);

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getAppState() {
    return {
        allItems: AppStore.getAll()
    };
}

const Colors = {
  grey400:'#bdbdbd',
  lightBlack: 'rgba(0, 0, 0, 0.54)',
  darkBlack: 'rgba(0, 0, 0, 0.87)'
}

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={Colors.grey400} />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

const styles = {
  block: {
    maxWidth: 250,
  },
  toggle: {
    marginBottom: 16,
  },
};

const buttonStyle = {
  margin: 12,
};

class UntappdApp extends React.Component {

    constructor(props) {

        super(props);

        //AppActions.addItem({checkin_comment: "testing"});

        this.state = {
            allItems: getAppState().allItems,
            selectedIndex: 1, 
            dropdown: 2
        };

        //this._onChange = this._onChange.bind(this);

    }

    componentWillUnmount() {

        AppStore.removeChangeListener(this._onChange);

    }

    _onChange() {

        //this.setState(getAppState());
        //console.log('_onChange');

    }

    componentDidMount() {

        AppStore.addChangeListener(this._onChange);

        //console.log("componentDidMount");

        this.serverRequest = $.get(this.props.source, function(result) {

            var _beerObjArr = [];
            var _beerNamesArr = [];

            var _apiObj = "checkins";

            console.log(result);

            for (var i = 0; i < result.response[_apiObj].items.length; i++) {

                if (result.response[_apiObj].items[i].checkin_comment != "") {

                    var _beerObj = {
                        checkin_id: result.response[_apiObj].items[i].checkin_id,
                        created_at: result.response[_apiObj].items[i].created_at,
                        checkin_comment: result.response[_apiObj].items[i].checkin_comment,
                        rating_score: result.response[_apiObj].items[i].rating_score,
                        rawBeerObj: result.response[_apiObj].items[i],
                        beer_name: result.response[_apiObj].items[i].beer.beer_name,
                        beer_label: result.response[_apiObj].items[i].beer.beer_label,
                        beer_description: result.response[_apiObj].items[i].beer.beer_description,
                        bid: result.response[_apiObj].items[i].beer.bid,
                        brewery_name: result.response[_apiObj].items[i].brewery.brewery_name,
                        brewery_label: result.response[_apiObj].items[i].brewery.brewery_label,
                        brewery_id: result.response[_apiObj].items[i].brewery.brewery_id,
                        media: result.response[_apiObj].items[i].media.items,
                        user_first_name: result.response[_apiObj].items[i].user.first_name,
                        user_last_name: result.response[_apiObj].items[i].user.last_name,
                        user_avatar: result.response[_apiObj].items[i].user.user_avatar
                    }

                    _beerObjArr.push(_beerObj);

                    AppActions.addItem(_beerObj);

                    //console.log(result.response[_apiObj].items[i].media.items)

                    _beerNamesArr.push(result.response[_apiObj].items[i].checkin_comment);

                }

            }

            this.setState({
                allItems: getAppState().allItems
            });

        }.bind(this));

    }

    handleClick() {

        //AppActions.selectItem(this);
         console.log("handleClick");

    }

    handleToggle(){

        console.log("handleToggle");

    }

    handleUpdateSelectedIndex(){

        console.log("handleUpdateSelectedIndex");

    }

    handleUpdateSelectedIndex(e,index) {
        console.log(e);
        this.setState({
            selectedIndex: index,
        })
    }

    handleDropdownChange(event, index, value){
        this.setState({dropdown:value});
    }

    render() {

        

        //console.log(this.state.allItems);
        var allItems = this.state.allItems;
        var items = [];

        for (var key in allItems) {
            //console.log(allItems[key])
            let _itemContent = allItems[key].payload.action.item;
            let _listItem =  <ListItem 
                                className="list-item"
                                key={_itemContent.checkin_id}
                                leftAvatar={<Avatar src={(_itemContent.media.length > 0) ? _itemContent.user_avatar : "./images/default_avatar.jpg"} />}
                                primaryText={<span style={{fontStyle: "italic"}}>{_itemContent.checkin_comment}</span>}
                                secondaryText={
                                    <p>
                                      {"- " + _itemContent.user_first_name + " " + _itemContent.user_last_name}
                                    </p>
                                }
                                secondaryTextLines={2}
                            
                                rightToggle={
                                    <Toggle
                                      label=""
                                      labelPosition="left"
                                      style={styles.toggle}
                                      onToggle={this.handleToggle}
                                    />
                                }
                                >
                            </ListItem>;
                            

            items.push(_listItem);
        }

        //console.log(items);
        return (
                
                <div id="main-container">
                    <DropDownMenu value={this.state.dropdown} onChange={this.handleDropdownChange.bind(this)}>
                        <MenuItem value={1} primaryText="Not Your Fathers Rootbeer"/>
                        <MenuItem value={2} primaryText="Not Your Fathers Ginger Ale"/>
                    </DropDownMenu>
                    <List className="list">
                        {items}
                    </List>
                    <RaisedButton label="Block" style={buttonStyle} />
                </div>
                
        );
    }
}

export default UntappdApp;
