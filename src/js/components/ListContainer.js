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
import ActionInfo from 'material-ui/lib/svg-icons/action/info';

import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

import RaisedButton from 'material-ui/lib/raised-button';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

import MapsPlace from 'material-ui/lib/svg-icons/maps/place';

import ListElement from './ListElement';

//let SelectableList = SelectableContainerEnhance(List);

/**
 * Retrieve the current TODO data from the TodoStore
 */

const Colors = {
  grey400:'#bdbdbd',
  lightBlack: 'rgba(0, 0, 0, 0.54)',
  darkBlack: 'rgba(0, 0, 0, 0.87)',
  red400: '#ef5350'
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

class ListContainer extends React.Component {

    constructor(props) {

        super(props);

        //AppActions.addItem({checkin_comment: "testing"});

        this.state = {
            selectedIndex: 1, 
            dropdown: 2
        };

        //this._onChange = this._onChange.bind(this);

    }

    componentWillUnmount() {

        //AppStore.removeChangeListener(this._onChange);

    }

    _onChange() {

        //this.setState(getAppState());
        //console.log('_onChange');

    }

    componentDidMount() {

        //AppStore.addChangeListener(this._onChange);

       

    }

    handleClick() {

        //AppActions.selectItem(this);
         console.log("handleClick");

    }

    handleToggle(e){

        //console.log(e.target.parentElement.parentElement);
        console.log(this);

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
        var allItems = this.props.allItems;
        var items = [];

        for (var key in allItems) {
            //console.log(allItems[key])
            let _itemContent = allItems[key].payload.action.item;

            let _listItem = 
                            <div key={_itemContent.checkin_id}>    
                            <ListItem 
                                className="list-item"                                
                                leftAvatar={<Avatar src={(_itemContent.media.length > 0) ? _itemContent.user_avatar : "./images/default_avatar.jpg"} />}
                                primaryText={<span style={{fontStyle: "italic"}}>{'"'+_itemContent.checkin_comment+'"'}</span>}
                                secondaryText={
                                    <p><span style={{color:Colors.red400}}>Rating: {_itemContent.rating_score}</span><br/>
                                      <span style={{float:"right"}}>{"- " + _itemContent.user_first_name + " " + _itemContent.user_last_name}</span>
                                    </p>
                                }
                                secondaryTextLines={2}
                            
                                rightToggle={
                                    <Toggle
                                      label=""
                                      labelPosition="left"
                                      style={styles.toggle}
                                      onToggle={this.handleToggle.bind(this)}
                                      defaultToggled={true}
                                    />
                                }

                                rightAvatar={
                                    <span>
                                    {(_itemContent.venue.length == 0) ? "" : <IconMenu style={{"marginTop": 20}}
                                        iconButtonElement={<IconButton><MapsPlace /></IconButton>}
                                        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                        maxHeight={350}
                                        width={120}
                                    >

                                    <div style={{padding:30}}>

                                    <p style={{textAlign:"center", float:"left", fontSize:12, width:100}}><span style={{}}>{(_itemContent.venue.length === 0) ? "" : '"'+ _itemContent.venue.venue_name +'"'}</span><br />
                                        <span style={{fontStyle:"italic"}}>{(_itemContent.venue.length === 0) ?"" : _itemContent.venue.location.venue_state} </span><br/>
                                        <span style={{fontStyle:"italic"}}>{(_itemContent.venue.length === 0) ?"" : _itemContent.venue.location.venue_country} </span><br/>
                                    </p>

                                    <a target="_blank" href={(_itemContent.media.length > 0) ? _itemContent.media[0].photo.photo_img_lg : "#"}><img style={{marginLeft:3}} src={(_itemContent.media.length > 0) ? _itemContent.media[0].photo.photo_img_sm : "./images/no-img.jpg"} width="100" height="100"/></a>
                                    </div>

                                  </IconMenu>}
                                    
                                  </span>
                                  
                                  
                                }
                                >
                                
                                    
                            </ListItem>
                            <Divider inset={true} />
                            </div>;
            /*let _cardItem = <Card>
                                <CardHeader
                                  title={<span style={{fontStyle: "italic"}}>{'"'+_itemContent.checkin_comment+'"'}</span>}
                                  subtitle={
                                    <p><span style={{color:Colors.red400}}>Rating: {_itemContent.rating_score}</span><br/>
                                      <span>{"- " + _itemContent.user_first_name + " " + _itemContent.user_last_name + " ("+_itemContent.user_name+")"}</span>
                                    </p>
                                }
                                  actAsExpander={true}
                                  showExpandableButton={true}
                                  avatar={<Avatar src={(_itemContent.media.length > 0) ? _itemContent.user_avatar : "./images/default_avatar.jpg"} />}
                                />
                                <CardText expandable={true}>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                  Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                                  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                                  Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                                </CardText>
                                <CardActions expandable={true}>
                                  <FlatButton label="Action1"/>
                                  <FlatButton label="Action2"/>
                                </CardActions>
                            </Card>*/

            items.push(_listItem);
        }

        console.log("here");
        return (

                    <List className="list" >
                      <ListElement allItems={this.props.allItems} />
                    </List>
                
        );
    }
}

export default ListContainer;