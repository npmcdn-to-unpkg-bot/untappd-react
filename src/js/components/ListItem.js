import React from 'react';
import AppActions from './../actions/AppActions';

class ListItem extends React.Component {

    constructor(props){

      super(props);

    }

    componentDidMount() {



    }

    handleClick(){

      AppActions.selectItem(this);

    }

    render() {

       console.log("here");

        console.log(this.props.item.payload.action);
        var _thisItemContent = this.props.item.payload.action.item;

        return (

            <li name='list-item' onClick={this.handleClick.bind(this)}>

              <p>{_thisItemContent.checkin_comment}</p>
              <div>
                <img src={(_thisItemContent.media.length > 0) ? _thisItemContent.media[0].photo.photo_img_sm : "./images/no-img.jpg"}/>
              </div>
              <div className="username-signature">
                <p>{"- " + _thisItemContent.user_first_name + " " + _thisItemContent.user_last_name}</p>
              </div>
              
            </li>

        );
    }

};

module.exports = ListItem;
