import React,{Component} from 'react';
import {View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, CameraRoll,Alert} from 'react-native';
import Dimensions from 'Dimensions';

import axios from "../../axios";
import moment from "moment";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:[]
        }

    }

    componentWillMount(){

        axios.post(`/tenant/getAppointmentHistory`, {
            type:""
        })
            .then( (response)=> {
                console.log(response);
                let data = response.data.data;

                this.setState({
                    data
                })


            })
            .catch(function (error) {
                console.log(error);
            });

    }




    render(){


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff"}}>

                    <ScrollView>

                        {this.state.data.length>0?

                            <View style={{paddingBottom:80}}>


                            {
                                this.state.data.map((item,index)=>


                                    <View key={index} style={{borderBottomWidth:2,borderBottomColor:"#f0f0f0",padding:10}}>

                                        <View style={{flexDirection:"row",paddingTop:10,paddingBottom:10}}>

                                            <View style={{flex:1,justifyContent:'center'}}>
                                                <Text style={{fontSize:18}}>{item.type=='0'?'维修':'保洁'}</Text>
                                                <Text  style={{marginTop:5,color:"grey",}}>{moment(item.creatTime).format("MM月DD日")}</Text>
                                            </View>

                                            <View style={{flex:2,alignItems:'center',justifyContent:'center'}}>
                                                <Text>{item.content}</Text>
                                                <Text style={{marginTop:5}}>比较紧急</Text>
                                            </View>

                                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>

                                                {item.star=='null'?<Text></Text>:<Text style={{marginTop:5}}>{item.star}星</Text>}
                                                {item.evaluate?<Text style={{marginTop:5,color:"red"}}>评价内容:{item.evaluate}</Text>:null}
                                                {item.butlerMsg?<Text style={{marginTop:5,color:"blue"}}>管家留言:{item.butlerMsg}</Text>:null}



                                            </View>

                                            <View  style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                <Text>已{item.status==0?'申请':item.status==1?'确认':item.status==2?'撤销':item.status==3?'完成':'评价'}</Text>
                                            </View>


                                        </View>

                                    </View>


                                )}


                        </View>:
                            <View style={{alignItems:"center",marginTop:30}}>
                                <Text>
                                    暂无生活服务记录
                                </Text>
                            </View>}


                    </ScrollView>
                </View>



        )

    }
}



