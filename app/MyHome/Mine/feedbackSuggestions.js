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

        axios.post(`/my/getMyProposal`, {

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


                                    <View
                                        key={index}
                                          style={{borderBottomWidth:2,borderBottomColor:"#f0f0f0",padding:10}}>

                                        <View style={{paddingTop:10,paddingBottom:10}}>

                                            <View>
                                                <Text>建议内容:{item.content}</Text>
                                                <Text style={{marginTop:5}}>回复:{item.reply?item.reply:'--'}</Text>
                                            </View>






                                        </View>

                                    </View>


                                )
                            }


                        </View>:
                            <View style={{alignItems:"center",marginTop:30}}>
                                <Text>
                                    暂无建议记录
                                </Text>
                            </View>}


                    </ScrollView>
                </View>



        )

    }
}



