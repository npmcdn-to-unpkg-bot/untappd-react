var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

import AppConstants from '../constants/AppConstants';

/**
 * The main object that stores all checkin items retrieved by the API calls
 * @type {Object}
 */
var _items = {};

/**
 * Adds a single item to the _items store. 
 * If the item already exists and has an attribute of 
 * blocked, make a new object and carry that value over
 * to the new objext. This is extremely important for preserving
 * the blocked functionality.
 * @param  {AppAction}
 * @return {bool}
 */
function create(action) {

    var id = action.action.item.checkin_id;

    _items[id] = {
        id: id,
        payload: action.action.item,
        blocked: (_items[id]) ? _items[id]['blocked'] : false,
        date: action.action.item.created_at
    };
    
    return true;

}

/**
 * Adds a bulk amount of items to the _items store 
 * to cut down on event dispatches. For the blocked
 * attribute, check to see if that already exists in
 * the item, and don't overwrite it - but copy it over to
 * the new object.
 * @param  {AppAction}
 * @return {bool}
 */
function createBulk(action) {

    console.log("createBulk", action);

    let item = action.action.item

    for(var i = 0; i < item.length; i++){

        let id = item[i]['checkin_id'];

        _items[id] = {
            id: item[i]['checkin_id'],
            payload: item[i],
            blocked: (_items[id]) ? _items[id]['blocked'] : false,
            date: item[i]['created_at']
        };

    }

    return true;

}

/**
 * After retrieving the blocked checkin id's json 
 * go through all the items and either create a new item
 * with its' blocked attribute marked true or update
 * the existing items attribute. 
 * @param {AppAction}
 * @return {bool}
 */
function addBulkBlocked(action){

    console.log("addBulkBlocked", action);
    
    let item = action.action.item

    for (var key in item){

        if(_items[key]){
            _items[key]['blocked'] = true;
        } else {
            _items[key] = {
                blocked : true
            }
        }
        console.log("blocking", key);
        
    }

    return true;

}

/**
 * Block individual items. Same as above. If 
 * the item doesn't exist in the Stored _items, create it
 * with the single blocked attribute - otherwise just
 * update the exists value. 
 * @param {AppAction}
 * @return {bool}
 */
function setBlocked(action){

    var id = action.action.item;

    if(_items[id]){
        _items[id]['blocked'] = true;
    } else {
        _items[id] = {
            blocked : true
        }
    }
    console.log("blocking", _items[id]);

    return true;

}

/**
 * When toggling an item on or off, update 
 * the stored _items[id] with it's new blocked state.
 * @param  {AppAction}
 * @return {bool}
 */
function toggle(action) {

    var id = action.action.item;

    /**
     * Not really an importnat conditional as
     * there really won't ever be a false trigger of 
     * toggle from an item that doesn't exist. Despite this
     * I will keep it anyway.
     */
    if(!_items[id]){
        return;
    }

    (_items[id]['blocked'] === false) ? _items[id]['blocked'] = true : _items[id]['blocked'] = false;

}

/**
 * Delete an item.
 * @param  {string} id
 */
function destroy(id) {
  delete _items[id];
}

var AppStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    /**
     * Get the entire collection of Items.
     * @return {object}
     */
    getAll: function() {

        return _items;

    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

/**
 * The Untappd Store API 
 * @param  {AppAction}
 * @return {bool}
 */
AppDispatcher.register(function(action) {
    //console.log(action.action);

    switch (action.action.actionType) {
        case AppConstants.ADD_ITEM:
            //if (1 == 1) {
            //console.log("AppConstants.ADD_ITEM");
            create(action);
            AppStore.emitChange();
            //}
            break;
        case AppConstants.SELECT_ITEM:
            //create(action);
            select(action);
            AppStore.emitChange();
            break;
        case AppConstants.TOGGLE_ITEM:
            //create(action);
            toggle(action);
            AppStore.emitChange();
            break;
        case AppConstants.SET_BLOCKED:
            //create(action);
            setBlocked(action);
            AppStore.emitChange();
            break;
        case AppConstants.ADD_BULK_BLOCKED:
            //create(action);
            addBulkBlocked(action);
            AppStore.emitChange();
            break;
        case AppConstants.ADD_BULK:
            //create(action);
            createBulk(action);
            AppStore.emitChange();
            break;
    }

    return true;
});

module.exports = AppStore;