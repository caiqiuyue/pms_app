import React, { Component } from 'react';
import {

    View,

} from 'react-native';

import Dimensions from 'Dimensions'

import Pay1 from "./pay1";
import Pay2 from "./pay2";






export default class Clean extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navRoot:null
        };

    }



    componentWillMount() {


        storage.load({
            key: 'username',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            console.log(ret,'ret');
            this.setState({navRoot:ret.isPayNew})

        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    break;
                case 'ExpiredError':
                    break;
            }
        });




    }



    componentDidMount() {

    }



    render() {

       let {navRoot} = this.state

        return (

            <View style={{height: Dimensions.get("window").height,backgroundColor:"#fff"}}>
                {
                    (navRoot) ? (
                        <Pay2 key="1232" navigation={this.props.navigation} />
                    ) : (
                        <Pay1 key="2222"  navigation={this.props.navigation}/>
                    )
                }
            </View>
        );
    }

}


