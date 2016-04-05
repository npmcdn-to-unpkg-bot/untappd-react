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

import Moment from 'moment';

import API from './../controller/api';

let nyfrbURL ='https://api.untappd.com/v4/beer/checkins/867402';
let nyfgaURL ='https://api.untappd.com/v4/beer/checkins/1297475';
let secrets = 'client_id=D61A064777B99988FC78379C3DD54B4DC6D06156&client_secret=DD849EE330F363C397616097FF4487CBE7DFFCCA';
let _arrOfNextPaginationURLs = [nyfrbURL+'?'+secrets, nyfgaURL+'?'+secrets];

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

const blockedStyles = {

    opacity: .6

}

const nextButtonStyle = {
  margin: 12,
};

class UntappdApp extends React.Component {

    constructor(props) {

        super(props);

        //AppActions.addItem({checkin_comment: "testing"});

        this.state = {
            allItems: getAppState().allItems,
            selectedIndex: 1, 
            dropdown: 2, 
            nextPaginationURL:"",
            previouslyBlockedItems: {}
        };

        //this._onChange = this._onChange.bind(this);

    }

    componentWillUnmount() {

        AppStore.removeChangeListener(this._onChange);

    }

    _onChange(e) {

        //console.log(e);
        console.log('_onChange');
        this.setState({
            allItems: getAppState().allItems
        });

    }

    componentDidMount() {

        let _this = this;

        AppStore.addChangeListener(this._onChange.bind(this));

        //Get previously saved json items to know what has been blocked
        var getJSONPromise = new Promise(function(resolve, reject) {

            $.ajax({
                url: './db/get_blocked_items.php',
                type: 'GET',
                dataType: 'json',
                success: function(data)
                {
                    //console.log(data);
                    _this.setState({
                        previouslyBlockedItems : data
                    })
                    return resolve(data);
                },
                error: function(err)
                {
                    return reject(err);
                }
            });

        }).then(function(){
            _this.grabItemsFromAPI();
        });

    }

    grabItemsFromAPI(){

        //console.log("componentDidMount");
        
        var _beerNamesArr = [];

        var _apiObj = "checkins";

        let _this = this;

        // Use it!
        API.getURL(_arrOfNextPaginationURLs[0]).then(function(result) {

            
            //console.log("Success!", result);
            parseResultsAndStore(result);
            /*_arrOfNextPaginationURLs.shift();*/
            
        }, function(error) {
            console.error("Failed!", error);

        }).then(API.getURL(_arrOfNextPaginationURLs[1]).then(function(result) {

            parseResultsAndStore(result);
            /*_arrOfNextPaginationURLs.shift();*/
            
            
        }, function(error) {
            console.error("Failed!", error);
        }).then(function(){

            //Check the previously blocked items and tell the server to block them (if they exist in the new feed);

            AppActions.addBulkBlocked(_this.state.previouslyBlockedItems);

        }));

        function parseResultsAndStore(res){

            let result = JSON.parse(res);
            let bulkItemObj = {};
            let _beerObjArr = [];
            //console.log(result);

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
                        user_avatar: result.response[_apiObj].items[i].user.user_avatar,
                        user_name: result.response[_apiObj].items[i].user.user_name,
                        venue: result.response[_apiObj].items[i].venue,
                    }

                    _beerObjArr.push(_beerObj);

                    /*removing this because of performance, using "setBulk" instead.*/
                    //AppActions.addItem(_beerObj);

                    _beerNamesArr.push(result.response[_apiObj].items[i].checkin_comment);

                }

            }

            //console.log(bulkItemObj2);

            AppActions.addBulk(_beerObjArr);

            _arrOfNextPaginationURLs.push(result.response.pagination.next_url+'&'+secrets);
            _arrOfNextPaginationURLs.shift();

            //console.log("Success!", result);
            

        }

        this.setState({
            allItems: getAppState().allItems,
            nextPaginationURL: _arrOfNextPaginationURLs
        });
        //document.getElementById('main-list').scrollTop=0;

    }

    handleClick() {

        //AppActions.selectItem(this);
         console.log("handleClick");

    }

    handleToggle(e){

        //Update the model through this action to tell it that this item has been blocked
        AppActions.toggleItem(this);//checin_id

        //NEXT: form a new object to send to this php method to save only the item id that has been blocked
        let _allItems = getAppState().allItems;
        let _blockedItems = {};

        for (var key in getAppState().allItems){

            if(_allItems[key]['blocked'] == true){
                _blockedItems[key] = 'blocked';
            }

        }

        $.ajax({
            url: './db/blocked_items.php',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                console.log("successfully sent json to be saved to file by php. ")
            },
            data: {
                data: JSON.stringify(_blockedItems)
            }
        });

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

    handleNextButton(){
        console.log("clicked next button");
        console.log(this.state.nextPaginationURL);

        this.grabItemsFromAPI();
    }

    render() {

        var allItems =  this.state.allItems;
        var items = [];

        for (var key in allItems) {
            //console.log(allItems[key]);
            let _itemContent = allItems[key]['payload'];

            let d = Moment(new Date(_itemContent.created_at));

            var date = d.format("MMM D YYYY h:mm a");

            let _listItem = 
                            <div key={_itemContent.checkin_id}>    
                            <ListItem style={{background: (this.state.allItems[key]['blocked'] == true) ? '#f1f1f1' : ''}}
                                className="list-item"                                
                                leftAvatar={<Avatar style={{opacity: (this.state.allItems[key]['blocked'] == true) ? blockedStyles.opacity : 1}} src={(_itemContent.media.length > 0) ? _itemContent.user_avatar : "./images/default_avatar.jpg"} />}
                                primaryText={<span style={{fontStyle: "italic", opacity: (this.state.allItems[key]['blocked'] == true) ? blockedStyles.opacity : 1}}>{'"'+_itemContent.checkin_comment+'"'}</span>}
                                secondaryText={
                                    <p style={{opacity: (this.state.allItems[key]['blocked'] == true) ? blockedStyles.opacity : 1}} ><span style={{color:Colors.red400}}>Rating: {_itemContent.rating_score}</span><br/>
                                    <span>{"Posted: "+date}</span>
                                      <span style={{float:"right"}}>{"- " + _itemContent.user_first_name + " " + _itemContent.user_last_name}</span>
                                    </p>
                                }
                                secondaryTextLines={2}
                            
                                rightToggle={
                                    <Toggle 
                                      label=""
                                      labelPosition="left"
                                      style={styles.toggle}
                                      onToggle={this.handleToggle.bind(_itemContent.checkin_id)}
                                      defaultToggled={(this.state.allItems[key]['blocked'] == true) ? false : true}
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

            items.push(_listItem);
        }
        return (
                
                <div id="main-container">
                    <DropDownMenu value={this.state.dropdown} onChange={this.handleDropdownChange.bind(this)}>
                        <MenuItem value={1} primaryText="Not Your Fathers Rootbeer"/>
                        <MenuItem value={2} primaryText="Not Your Fathers Ginger Ale"/>
                    </DropDownMenu>
                    <div className="allow-title"><h3>Allow?</h3><Divider /></div>
                    <List className="list" id="main-list">
                        {items}
                    </List>
                    <RaisedButton 
                        label="Load More" 
                        style={nextButtonStyle} 
                        onMouseDown={this.handleNextButton.bind(this)}/>
                </div>
                
        );
    }
}

export default UntappdApp;