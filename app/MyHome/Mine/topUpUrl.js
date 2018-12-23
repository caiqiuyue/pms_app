import React, { Component } from 'react';
import {
    WebView,
    View, DeviceEventEmitter,


} from 'react-native';


import Dimensions from 'Dimensions';




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
        DeviceEventEmitter.emit('yiPay','topUp');
    }






    render() {

        let {data }= this.state;


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
                    source={{uri: data.redirectUrl}}

                />
            </View>


        )



    }


}





