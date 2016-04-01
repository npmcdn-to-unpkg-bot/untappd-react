import React from 'react';
import AppActions from './../actions/AppActions';

class ListItem extends React.Component {

    constructor(props) {

        super(props);

        this.state = { selected: false };
        
    }

    componentDidMount() {



    }

    handleClick() {

        //AppActions.selectItem(this);
        this.setState({ selected: !this.state.selected });
        

    }

    componentWillReceiveProps(nextProps) {

        console.log("nextProps", nextPRops);

    }

    componentWillMount() {


    }

    render() {

        //console.log("here");

        //console.log(this.props.item.payload.action);
        var _thisItemContent = this.props.item.payload.action.item;

        console.log("ListItem Selected", this.state.selected);

        var selected = this.state.selected ? 'checked' : '';

        return (

            <li name='list-item' onClick={this.handleClick.bind(this)}>
              <input type="checkbox" id="cbox1" value="first_checkbox" defaultChecked={selected} />

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

export default ListItem;
