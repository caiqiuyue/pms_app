import React, { Component } from 'react';
import {
    WebView,
    View, DeviceEventEmitter,


} from 'react-native';

import {WhiteSpace,List,DatePicker,Button} from 'antd-mobile';
import axios from "../../app/axios";

import close from "../MyHome/Mine/style/close.jpg";
import Dimensions from 'Dimensions';
import moment from 'moment'





export default class myBill extends Component {

    constructor(props) {
        super(props);

        this.state={
            data:null
        }

    }


    componentWillMount(){
        const {getParam} = this.props.navigation;
        let data = getParam("user");
        console.log(data);
        this.setState({
            data
        })
    }

    componentWillUnmount(){
        
        console.log('DeviceEventEmitter.emit(\'yiPay\',\'yiPay\');');
        
        DeviceEventEmitter.emit('yiPay','yiPay');
    }



    render() {

        let {data }= this.state


        return (

            <View style={{backgroundColor:"#fff",
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                paddingBottom:100
            }}>
                <WebView
                    style={{
                        // height: Dimensions.get('window').height,
                        // width: Dimensions.get('window').width,
                    }}
                    source={{uri: data.redirectUrl}}

                />
            </View>


        )



    }


}





