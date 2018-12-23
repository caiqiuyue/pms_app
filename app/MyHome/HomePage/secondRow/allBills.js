import React, { Component } from 'react';
import {
    View
} from 'react-native';
import Rent from './rent';

export default class Electricity extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View>
                <Rent type={3} navigation={this.props.navigation} />
            </View>);
    }


}

