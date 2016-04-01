import React from 'react';

import AppActions from './../actions/AppActions';
import AppStore from './../stores/AppStore';

import ListItem from './ListItem';

class List extends React.Component {

    constructor(props) {

        super(props);

    }

    componentDidMount() {



    }

    render() {

        //console.log(this.props.items);

        // This section should be hidden by default
        // and shown when there are todos.
        if (Object.keys(this.props.items).length < 1) {
            return null;
        }

        var allItems = this.props.items;
        var items = [];

        for (var key in allItems) {
            items.push(<ListItem key={key} item={allItems[key]} />);
        }

        //console.log(items);
        return (
            <ul name='list'>     
              
              {items}
              
            </ul>
        );
    }
};

module.exports = List;
