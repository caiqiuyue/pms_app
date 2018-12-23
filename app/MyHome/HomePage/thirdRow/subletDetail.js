import React,{Component} from 'react';
import {View} from 'react-native';





import RefundRentDetail from './refundRentDetail'



export default class GoodSelect extends React.Component {
    constructor(props) {
        super(props);


    }





    render(){



        return (
            <View>

                <RefundRentDetail type={3}  navigation={this.props.navigation}>

                </RefundRentDetail>


            </View>
        )

    }
}

