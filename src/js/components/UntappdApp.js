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

import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';

import RaisedButton from 'material-ui/lib/raised-button';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

import MapsPlace from 'material-ui/lib/svg-icons/maps/place';

import Moment from 'moment';

import API from './../controller/api';

var nyfrbURL = 'https://api.untappd.com/v4/beer/checkins/867402';
var nyfgaURL = 'https://api.untappd.com/v4/beer/checkins/1297475';
var secrets = 'client_id=D61A064777B99988FC78379C3DD54B4DC6D06156&client_secret=DD849EE330F363C397616097FF4487CBE7DFFCCA';
var _arrOfNextPaginationURLs = [nyfrbURL + '?' + secrets, nyfgaURL + '?' + secrets];

var _productOneName = "Not Your Father's Root Beer (5.9%)";
var _productTwoName = "Not Your Father's Ginger Ale";

//let SelectableList = SelectableContainerEnhance(List);

function getAppState() {
    return {
        allItems: AppStore.getAll()
    };
}

const Colors = {
    grey400: '#bdbdbd',
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

        this.state = {
            allItems: getAppState().allItems,
            selectedIndex: 1,
            dropdown: 1,
            nextPaginationURL: "",
            previouslyBlockedItems: {}
        };

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

        /**
         * Get previously saved json items to know what has been blocked with a promise.
         * Then trigger the method to grab Untappd items from the API
         */
        var getJSONPromise = new Promise(function(resolve, reject) {

            $.ajax({
                url: './db/get_blocked_items.php',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    //console.log(data);
                    _this.setState({
                        previouslyBlockedItems: data
                    })
                    return resolve(data);
                },
                error: function(err) {
                    return reject(err);
                }
            });

        }).then(function() {
            _this.grabItemsFromAPI();
        });

    }

    grabItemsFromAPI() {

        var _beerNamesArr = [];

        var _apiObj = "checkins";

        let _this = this;

        /**
         * Using a simple XmlHtmlRequest to grab data from Untappd API with promise.
         * Grab frist URL stored in the ARR and then when complete grab data from 
         * socond URL in API. Push and shift the ARR with new Pagination URL's in 
         * parseResultsAndStore method. 
         */
        API.getURL(_arrOfNextPaginationURLs[0]).then(function(result) {

            //console.log(result);
            parseResultsAndStore(result);

        }, function(error) {

            console.error("Failed!", error);

        }).then(API.getURL(_arrOfNextPaginationURLs[1]).then(function(result) {

            parseResultsAndStore(result);

        }, function(error) {

            console.error("Failed!", error);

        }).then(function() {

            /**
             * After both links have been loaded and parsed, dispatched previously blocked items
             * up to the store to mark any newly added items as blocked if needed. 
             */
            AppActions.addBulkBlocked(_this.state.previouslyBlockedItems);

        }));

        /**
         * Parses the returned data from the API and dispatches
         * an array of the newly parsed data to be added to the store via
         * AppActions.addBulk().
         */
        function parseResultsAndStore(res) {

            let result = JSON.parse(res);
            let bulkItemObj = {};
            let _beerObjArr = [];

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

                    _beerNamesArr.push(result.response[_apiObj].items[i].checkin_comment);

                }

            }

            AppActions.addBulk(_beerObjArr);

            _arrOfNextPaginationURLs.push(result.response.pagination.next_url + '&' + secrets);
            _arrOfNextPaginationURLs.shift();

        }

        /**
         * Populate the state of the Untappd APP with both the new items stored
         * in the Store and also the newly firmed arr of NEXT pagination URL's
         */
        this.setState({
            allItems: getAppState().allItems,
            nextPaginationURL: _arrOfNextPaginationURLs
        });

    }

    /**
     * NOT USED
     */
    handleClick() {

        //console.log("handleClick");

    }

    /**
     * When clicking a toggle on an item dispatch an event to tell the store
     * and then if the item toggle is to block the item send an ajax call
     * to the php function to write out all blocked items to a json file
     * @param  {SyntheticEvent} - Material UI Event
     * @return {bool}
     */
    /**
    
        TODO:
        - Post only newly selected blocked items to a php function 
        that determines whether or not to add or remove checkin_id from 
        the saved .json file. 
    
     */
    handleToggle(e) {

        AppActions.toggleItem(this); //checin_id

        /**
         * Forming a brand new object specifically from the json output to the 
         * php function. 
         */
        /**
        
            TODO:
            - Send only checkin_id's
        
         */

        let _allItems = getAppState().allItems;
        let _blockedItems = {};

        for (var key in getAppState().allItems) {

            if (_allItems[key]['blocked'] == true) {
                _blockedItems[key] = 'blocked';
            }

        }

        $.ajax({
            url: './db/blocked_items.php',
            type: 'post',
            dataType: 'json',
            success: function(data) {
                console.log("successfully sent json to be saved to file by php. ")
            },
            data: {
                data: JSON.stringify(_blockedItems)
            }
        });

        return true;

    }

    /**
     * Triggered when a dropdown menu item has been selected
     */
    handleDropdownChange(event, index, value) {
        this.setState({ dropdown: value });
    }

    /**
     * Next button handler. Simply triggers the grabItemsFromAPI that was 
     * triggered at the start of the app after the blocked json file was retrieved.
     */
    handleNextButton() {
        console.log("clicked next button");
        console.log(this.state.nextPaginationURL);

        this.grabItemsFromAPI();
    }

    /**
     * Main view portion of the APP. Using a lot of ternary conditionals
     * to seet the view according to the state of each item from the Store.
     */
    /**
    
        TODO:
        - Move state logic out of the JSX renderer.
    
     */

    render() {

        var allItems = this.state.allItems;
        var items = [];

        for (var key in allItems) {
            //console.log(allItems[key]);
            //
            /**
             * If the particular item from the store exists but does not have 
             * a payload attribute it must only have a blocked attribute which 
             * means it wasn't returned from the API call and should not be 
             * rendered (& cannot be rendered)
             */
            if (!allItems[key]['payload']) {
                continue;
            }

            let _itemContent = allItems[key]['payload'];

            /**
             * Simple switch to determine the state of the dropdown
             * menu. Sorts list accordingle. 
             */
            /**
            
              TODO:
              - Put all product names / other constants into the Constants
              Object.
            
             */
            switch (this.state.dropdown){

              case 1:
              break;
              case 2:
              if(_itemContent.beer_name != _productOneName){
                continue;
              }
              break;
              case 3:
              if(_itemContent.beer_name != _productTwoName){
                continue;
              }
              break;

            }

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
                        <MenuItem value={1} primaryText="All Products"/>
                        <MenuItem value={2} primaryText="Not Your Fathers Rootbeer"/>
                        <MenuItem value={3} primaryText="Not Your Fathers Ginger Ale"/>
                    </DropDownMenu>
                    <div className="allow-title"><h3>Allow?</h3><Divider /></div>
                    <List className="list" id="main-list">
                        {items}
                    </List>
                    <FlatButton label="Secondary" primary={true} 
                      label="Load More" 
                      style={nextButtonStyle} 
                      onMouseDown={this.handleNextButton.bind(this)}/>
                </div>

        );
    }
}

export default UntappdApp;
