import React,{Component} from 'react';
import {View, Text} from 'react-native';
import MessageContent from './GoodSelectBox'
import Dimensions from 'Dimensions';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from "../../../components/active/reducer";


class Message extends Component {
    constructor(props) {
        super(props);
    }


    render(){
        const navRoot = this.props.reduxData.navRoot;
        return (
            <View style={{height: Dimensions.get("window").height,backgroundColor:"#fff"}}>
                {
                    navRoot === '5' ? (
                        <MessageContent key="1232" navigation={this.props.navigation} />
                    ) : (
                        <MessageContent key="2222"  navigation={this.props.navigation}/>
                    )
                }
            </View>
        )
    }
}

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData},dispath)
)(Message)


