import React from 'react';
import AppActions from './../actions/AppActions';
import AppStore from './../stores/AppStore';
import List from './List';
import config from './../../../config.json';

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getAppState() {
    return {
        allItems: AppStore.getAll()
    };
}

class UntappdApp extends React.Component {

    constructor(props) {

        super(props);

        //AppActions.addItem({checkin_comment: "testing"});

        this.state = {
            allItems: getAppState().allItems
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
                        user_last_name: result.response[_apiObj].items[i].user.last_name
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

        AppActions.selectItem(this);

    }

    render() {
        //console.log("render");
        return (
            <div className="filter-list">
	          <List items={this.state.allItems}/>
	        </div>
        )
    }
}

export default UntappdApp;
