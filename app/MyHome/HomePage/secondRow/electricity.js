import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import Rent from './rent';




export default class Electricity extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }}


    componentWillMount(){

    }

    render() {
        return (
            <View>
                <Rent type={1} navigation={this.props.navigation} />
            </View>
        );
    }







}
