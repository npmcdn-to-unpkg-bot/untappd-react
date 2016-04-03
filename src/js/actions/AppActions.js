import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

var AppActions = {
    addItem: function(item) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.ADD_ITEM,
            item: item
        })
    },
    selectItem: function(item) {

    	AppDispatcher.handleViewAction({
            actionType: AppConstants.SELECT_ITEM,
            item: item
        })

    }, 
    toggleItem: function(item) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TOGGLE_ITEM,
            item: item
        })

    }
}

module.exports = AppActions
