var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

import AppConstants from '../constants/AppConstants';

var _items = {};

function create(action) {

    // Hand waving here -- not showing how this interacts with XHR or persistent
    // server-side storage.
    // Using the current timestamp + random number in place of a real id.
    //console.log("In create function of - AppStore adding Item");
    //var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    //var id = action.action.item.props.item.id;
    //console.log(action.action.item.checkin_id);
    var id = action.action.item.checkin_id;
    //console.log('AppStore', id);

    if(_items[id]){
        console.log("item already exists in Store", _items[id]);
        return;
    }

    _items[id] = {
        id: id,
        payload: action.action.item,
        blocked: false,
        date: action.action.item.created_at
    };
    //console.log('AppStore', _items);
    //console.log(_items);

}

function createBulk(action) {

    console.log("createBulk", action);

    let item = action.action.item

    for(var i = 0; i < item.length; i++){

        let id = item[i]['checkin_id'];

        if(item[i][id]){
            console.log(item[i]['checkin_id']);
            return;
        }

        _items[id] = {
            id: item[i]['checkin_id'],
            payload: item[i],
            blocked: false,
            date: item[i]['created_at']
        };

    }

}

function addBulkBlocked(action){

    console.log("addBulkBlocked", action);

    let item = action.action.item

    for (var key in item){
        
        _items[key]['blocked'] = true;
        console.log("blocking", _items[key]);

    }

}

function select(action) {

  //console.log("AppStore", action.action.item.props.item.id);

  var id = action.action.item.props.item.id;

  (_items[id]['selected'] === false ) ? _items[id]['selected'] = true : _items[id]['selected'] = false;

  return true;

}

function deselect(action) {

  

}

function setBlocked(action){

    var id = action.action.item;

    if(!_items[id]){
        //console.log("Notice: item doesnt exist in Store to pre toggle");
        return;
    }

    //console.log("TOGGLING ITEM TO BE BLOCKED", _items[id]);

    _items[id]['blocked'] = true;

}


function toggle(action) {

    var id = action.action.item;

    if(!_items[id]){
        //console.log("Notice: item doesnt exist in Store to pre toggle");
        return;
    }
    //console.log("TOGGLING ITEM TO BE BLOCKED", _items[id]);

    (_items[id]['blocked'] === false) ? _items[id]['blocked'] = true : _items[id]['blocked'] = false;
    
    //console.log(_items[id]);

}
/**
 * Delete a TODO item.
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
