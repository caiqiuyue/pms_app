import React, { Component } from 'react';
import {
    WebView,
    View,



} from 'react-native';

import {WhiteSpace,List,DatePicker,Button} from 'antd-mobile';
import axios from "../../axios";

import close from "../Mine/style/close.jpg";
import Dimensions from 'Dimensions';
import moment from 'moment'





export default class myBill extends Component {

    constructor(props) {
        super(props);


    }




    render() {


        return (

            <View style={{backgroundColor:"#fff",
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                paddingBottom:50
            }}>
                <WebView
                    style={{marginTop: 30,
                        // height: Dimensions.get('window').height,
                        // width: Dimensions.get('window').width,
                    }}
                    source={{uri: 'https://www.baidu.com'}}

                />
            </View>


        )



    }


}





