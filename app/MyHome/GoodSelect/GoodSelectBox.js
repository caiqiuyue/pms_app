import React,{Component} from 'react';
import {View, Text, Image, Platform, StyleSheet,ScrollView,TouchableHighlight} from 'react-native';


import s1 from "./style/234.png";
import s2 from "./style/s2.jpg";
import youxuan from "./style/youxuan_weizhi.png";
import Dimensions from 'Dimensions';
import axios from "../../axios";
import {Picker,List} from 'antd-mobile'
import {ifIphoneX} from "react-native-iphone-x-helper";

const CustomChildren = props => {
    return (
        <TouchableHighlight style={{margin:5}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{flexDirection:"row",marginLeft:5,marginBottom:5,width:"30%",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden'}}>
                <View style={{flex:3,padding:8}}><Text>{props.extra}</Text></View>
                <View style={{flex:1,padding:8,backgroundColor:'#f7f7f7',alignItems:"center",justifyContent:"center",}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};

export default class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state={
            district:[
                {
                    value:'蔬菜类',
                    flag:false,
                    a:[
                        {value:'蔬菜1'},
                        {value:'蔬菜1'},
                        {value:'蔬菜1'},
                        {value:'蔬菜1'},
                        {value:'蔬菜1'},
                        {value:'蔬菜1'},
                        {value:'蔬菜1'},
                        {value:'蔬菜1'},
                    ]
                },
                {
                    value:'水果类',
                    flag:true,
                    a:[
                        {value:'水果1'},
                        {value:'水果1'},
                        {value:'水果'},
                        {value:'水果'},
                        {value:'水果'},
                        {value:'水果'},
                        {value:'水果'},
                        {value:'水果'},
                    ]
                },
            ]
        };

    }

    componentWillMount(){

    }

    aaa = (item)=>{
        let {district} = this.state
        district.map((i)=>{
            if(i.value==item.value){
                i.flag = !i.flag;
            }
        })

        this.setState({
            district
        })
    }

    bbb = (item,_item)=>{
        let {district} = this.state
        district.map((i)=>{
            i.a.map((_i)=>{
                if(_i.value==_item.value){
                    _i.flag = true;
                }else {
                    _i.flag = false;
                }
            })
        })

        this.setState({
            district
        })
    }

    render()
    {

        let {district} = this.state
        return (
            <View style={styles.select}>

                <View style={{alignItems:"center",backgroundColor:"#f17e3a",height:60,justifyContent:"center"}}>
                    <View style={{alignItems:"center",marginTop:8,}}>
                        <Text style={{color:"#fff",fontSize:16,}}>优选</Text>
                    </View>
                </View>

                <View style={{
                    ...Platform.select({
                        ios: {
                            // height: Dimensions.get("window").height - 160,
                            height: Dimensions.get("window").height - 110,
                        },
                        android: {
                            height: Dimensions.get("window").height - 140,
                        },
                    }),
                    ...ifIphoneX({
                        height: Dimensions.get("window").height - 120,
                    }, {

                    }),
                }}>
                    <View style={{flexDirection:"row"}}>
                        <View  style={{flex:1}}>
                            <ScrollView>
                                {
                                    district.map((item,index)=>
                                        <View key={index} style={{backgroundColor:"#f5f5f5",borderColor:"#f5f5f5",borderWidth:1,}}>
                                            <TouchableHighlight underlayColor="transparent" style={styles.ss} onPress={()=>{this.aaa(item)}}><Text style={{color:item.flag?"#000":"grey"}}>{item.value}</Text></TouchableHighlight>
                                            {
                                                item.flag&&item.a.map((_item,_index)=>
                                                    <TouchableHighlight underlayColor="transparent" onPress={()=>{this.bbb(item,_item)}}   style={[styles.ss,{backgroundColor:"#fff"}]} key={_index}><Text style={{color:_item.flag?"#ff611a":"#333"}}>{_item.value}</Text></TouchableHighlight>
                                                )

                                            }
                                        </View>


                                    )
                                }
                            </ScrollView>
                        </View>
                        <View  style={{flex:3}}>
                            <ScrollView>

                            </ScrollView>
                        </View>


                    </View>
                </View>

            </View>
        )

    }
}

const styles = StyleSheet.create({
    select:{
        backgroundColor:"#fff",
    },

    ss:{
        padding:10,alignItems:"center",justifyContent:"center"
    }


});