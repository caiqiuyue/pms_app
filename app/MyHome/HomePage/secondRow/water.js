import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import Rent from './rent';


export default class Water extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View>
                <Rent type={2} navigation={this.props.navigation} />
            </View>
        );
    }







}

