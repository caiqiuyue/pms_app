import React,{Component} from 'react';
import {View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, CameraRoll,Alert} from 'react-native';
import Dimensions from 'Dimensions';

import axios from "../../axios";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            totalPrice:0,

            rows:[]
        }

    }

    componentWillMount(){

        axios.post(`/my/getMyBalance`, {
        })
            .then( (response)=> {
                console.log(response);
                let totalPrice = response.data.totalPrice;
                let rows = response.data.rows;
                this.setState({
                    totalPrice,
                    rows
                })

            })
            .catch(function (error) {
                console.log(error);
            });

    }




    render(){


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",padding:10}}>

                    <ScrollView>
                        <View style={{backgroundColor:'#f0f0f0',paddingLeft:10}}>
                            <Text style={{marginTop:10}}>账户余额(元)</Text>
                            <Text style={{fontSize:26,paddingTop:20,paddingBottom:20,color:"#ec833a"}}>{this.state.totalPrice.toFixed(2)}</Text>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text>余额明细:</Text>

                            <View style={{flexDirection:"row",flexWrap:"wrap",marginTop:5,alignItems:'center',justifyContent:'space-between'}}>

                                {
                                    this.state.rows.map((item,index)=>

                                        <View key={index} style={{paddingTop:10,paddingBottom:10,alignItems:'center',width:'48%',marginBottom:20,backgroundColor:"#f0f0f0"}}>
                                            <View style={{marginBottom:10}}><Text style={{fontSize:20}}>{item.feeName}</Text></View>
                                            <Text style={{fontSize:20,color:"#ec833a"}}>{item.rentPrice.toFixed(2)}</Text>
                                            <Text style={{marginTop:10}}>{item.feeCode == '200001' ||item.feeCode=='200002'? '以退房结算为准':""}</Text>
                                        </View>

                                    )
                                }



                            </View>

                        </View>
                    </ScrollView>
                </View>



        )

    }
}



