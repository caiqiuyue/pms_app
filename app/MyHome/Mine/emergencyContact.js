import React,{Component} from 'react';
import {View,CameraRoll, TextInput,Text, TouchableHighlight, Image, ScrollView, StyleSheet,Platform} from 'react-native';

import axios from "../../axios";
import Dimensions from "Dimensions";
import {Picker,InputItem,Toast} from "antd-mobile";
import MyTextInput from "../textInput";



export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            flag:false,
            username:"",
            phone:"",
            relation:"",
        }

    }


    componentWillMount(){

        // let {username, cardNumber,cardType} = this.state;

        axios.post(`/my/getMyAuthent`, {

        })
            .then( (response)=> {
                console.log(response,'身份证审核');

                if(response.data.code==0){
                    let emergencyJson=response.data.emergencyJson;
                    if(emergencyJson){
                        emergencyJson=JSON.parse(emergencyJson);
                        this.setState({
                            username:emergencyJson.name,
                            phone:emergencyJson.phone,
                            relation:emergencyJson.contact,
                        })
                    }
                }



            })
            .catch(function (error) {
                console.log(error);
            });

    }


    submitBtn=()=>{

        let {username,phone,relation} = this.state

        if(!username){
            Toast.info('请输入紧急联系人姓名',1)
            return
        }

        if(!phone){
            Toast.info('请输入紧急联系人手机号',1)
            return
        }

        if(!relation){
            Toast.info('请输入和本人关系',1)
            return
        }


        axios.post(`/my/emergencyContact`, {
            name:username,
            phone:phone,
            contact:relation,

        })
            .then( (response)=> {
                Toast.info(response.data.code==0?'成功提交':response.data.message,1);
                console.log(response,'紧急联系人');
                this.setState({
                    flag:response.data.code==0?true:false
                })
            })
            .catch(function (error) {
                console.log(error);
            });

    };









    render(){

        let{flag,phone ,relation} = this.state;
        return (

            <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",}}>
                <ScrollView>
                    <View style={{flex:1,
                        ...Platform.select({
                            android:{
                                paddingBottom:80,
                            },
                            ios:{
                                paddingBottom:30,
                            }
                        }),
                        }}>


                        <View style={{padding:20}}>

                            <View style={styles.userMessage}>
                                <View>
                                    <Text>姓名:</Text>
                                </View>
                                <View style={styles.userItem}>
                                    <MyTextInput
                                        style={{padding: 0,}}
                                        placeholderTextColor={this.state.username?"#000":'#ccc'}
                                        placeholder={this.state.username?this.state.username:"请输入紧急联系人姓名"}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(username) => this.setState({username})}>

                                    </MyTextInput>
                                </View>
                            </View>



                            <View style={styles.userMessage}>
                                <View>
                                    <Text>手机号:</Text>
                                </View>
                                <View style={styles.userItem}>
                                    <TextInput
                                        style={{padding: 0,}}
                                        placeholder={'请输入紧急联系人手机号'}
                                        keyboardType='numeric'
                                        value={phone?phone+'':''}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(phone) => this.setState({phone})}>

                                    </TextInput>
                                </View>
                            </View>

                            <View style={styles.userMessage}>
                                <View>
                                    <Text>和本人关系:</Text>
                                </View>
                                <View style={styles.userItem}>
                                    <TextInput
                                        style={{padding: 0,}}
                                        placeholder={relation?relation:'请填写和本人关系'}
                                        underlineColorAndroid="transparent"
                                        placeholderTextColor={this.state.relation?"#000":'#ccc'}
                                        onChangeText={(relation) => this.setState({relation})}>
                                        
                                    </TextInput>
                                </View>
                            </View>




                            <View style={{alignItems:"center",marginBottom:30}}>

                                <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                    borderWidth:1,borderColor:flag ? "#000" : "#fff",width:'100%',backgroundColor:flag ? "#fff" : "#ef813a",
                                    borderRadius:10}} onPress={this.submitBtn }>
                                    <Text

                                        style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                        确定
                                    </Text>
                                </TouchableHighlight>

                            </View>


                        </View>
                    </View>
                </ScrollView>
            </View>

        )

    }
}
const styles = StyleSheet.create({
    userMessage:{
        flexDirection:"row",
        alignItems:"center",
        padding:5,
        paddingLeft:16,
        borderBottomWidth:2,
        borderBottomColor:"#f0f0f0",
        marginBottom:5
    },
    userItem:{
        flex:1,
        marginLeft:20

    }


});

