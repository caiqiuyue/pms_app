import React, { Component } from 'react';
import {
    WebView,
    View, DeviceEventEmitter,


} from 'react-native';

import Dimensions from 'Dimensions';
import axios from "../../axios";





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
        // DeviceEventEmitter.emit('yiPay','addBankCard');
    }


    a = (event)=>{


        const { navigate } = this.props.navigation;
        if(event.url.indexOf("mobileSignContractSave")!=-1&&event.title=="签署结果"){
            DeviceEventEmitter.emit('signature','signature');
            setTimeout(() => {
                console.log(event,"event")
                navigate('Mine',{ user: '' });
            }, 3000);

        }


    }



    render() {

        let {data}= this.state


        return (

            <View style={{backgroundColor:"#fff",
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                paddingBottom:80
            }}>
                <WebView
                    style={{
                        // height: Dimensions.get('window').height,
                        // width: Dimensions.get('window').width,
                    }}
                    source={{html: data}}
                    onNavigationStateChange={(event)=>{this.a(event)}}

                />
            </View>


        )



    }


}





