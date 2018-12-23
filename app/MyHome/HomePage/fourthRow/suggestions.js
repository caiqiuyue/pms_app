import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    Alert,
    Picker,
    View,
    Image,
    TextInput,

} from 'react-native';




import {WhiteSpace,DatePicker,List,Toast} from 'antd-mobile';

import axios from '../../../axios'
import Dimensions from 'Dimensions'

export default class Clean extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content:"",
            text:"",
            flag:false
        };
    }





    componentWillMount() {

    }


    submitBtn = ()=> {
        let {content,text} = this.state;

        if(content.trim()==''){
            Toast.info('请输入投诉内容');
        }else {

            if(this.state.flag){
                Toast.info('已提交投诉建议，不可重复提交',1)
            }else{
                axios.post(`/self/omplaintProposal`, {
                    content:content
                })
                    .then((response) =>{
                        console.log(response);
                        this.setState({
                            flag:true
                        });
                        Toast.info('投诉建议已受理',1)

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }



        }

    };

    render() {

        let {flag} = this.state;

        return (


            <View style={{padding:10,height: Dimensions.get('window').height,backgroundColor:"#fff"}}>

                <View style={{flexDirection:"row",marginTop:30}}>
                    <View><Text>投诉内容:</Text></View>
                    <View style={{flex:1,paddingLeft:10}}>
                        <TextInput
                            multiline={true}
                            underlineColorAndroid="transparent"
                            style={{height: 100,
                                borderColor:"grey",borderWidth:1,padding:0,
                                borderRadius:5}}

                            placeholder="请填写投诉内容"
                            onChangeText={(content) => this.setState({content})}
                        />

                    </View>
                </View>

                <View style={{flexDirection:"row",marginTop:30,marginBottom:80}}>
                    <View><Text>联系电话:</Text></View>
                    <View style={{flex:1,paddingLeft:10}}>
                        <TextInput
                            multiline={false}
                            underlineColorAndroid="transparent"
                            maxLength={11}
                            keyboardType="numeric"
                            style={{borderColor:"grey",borderWidth:1,height:30,padding:0,
                                borderRadius:5}}
                            placeholder="请填写手机号"
                            onChangeText={(text) => this.setState({text})}
                        />

                    </View>
                </View>



                <View style={{alignItems:"center"}}>


                    <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                        borderWidth:1,width:100,borderColor:flag ? "#f0f0f0" : "#fff",backgroundColor:flag ? "#fff" : "#f17e3a",
                        borderRadius:10}} onPress={this.submitBtn }>
                        <Text

                            style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                            提交
                        </Text>
                    </TouchableHighlight>

                </View>

            </View>


        );
    }

}

