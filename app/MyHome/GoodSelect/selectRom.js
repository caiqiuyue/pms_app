import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    Alert,
    View,
    Image,
    TextInput,
    ScrollView, Platform,FlatList

} from 'react-native';

import {Picker,Checkbox} from 'antd-mobile';


import {Toast} from 'antd-mobile';
const AgreeItem = Checkbox.AgreeItem;
import axios from '../../axios'
import Dimensions from 'Dimensions'
import {ifIphoneX} from "react-native-iphone-x-helper/index";
//import moment from "moment/moment";
let a = Dimensions.get("window").height/Dimensions.get("window").width
const CustomChildren = props => {
    return (
        <TouchableHighlight underlayColor="transparent" onPress={props.onClick}>

            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                <View style={{minWidth:100}}><Text>租期：</Text></View>
                <View style={{minWidth:110}}><Text style={{color:"grey"}}>{props.extra}></Text></View>
            </View>
        </TouchableHighlight>
    )
};


export default class Clean extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            datas:[],
            allData:[],
            room: {},
            message:null,
            value:['一年'],
            month:"12",
            Allflag:false,
            name:[],
            price:'',
            roomNo:"",
            room_no:"",
            priceid:"",
            district:[
                {
                    label:'3个月',
                    value: '3个月'
                },
                {
                    label:'半年',
                    value: '半年'
                },
                {
                    label:'一年',
                    value: '一年'
                }
            ]
        };
    }





    componentWillMount() {
        this.props.navigation.getParam = (name) => {
            let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
            if(name) {
                return params[name];
            }
            return params;
        }
        const {getParam} = this.props.navigation;
        const data = getParam("user");

        axios.post(`/tenant/getRoomState`, {
            hotelNo:data.hotel_no,
        })
            .then((response) => {
                console.log(response);

                if(response.data.code==0){
                    let name = response.data.name.split(',');

                    let bulidName = name.map((__item)=>{
                        let a = {name: __item.trim(),flag: false};
                        return a
                    });


                    let data = response.data && response.data.data ? response.data.data.map(item => {
                        if(item.enable_state == 1 && item.occupy_state == 0 && item.repair_state == 1) {
                            item.status = 2;
                        } else {
                            item.status = 1;
                        }
                        return item;
                    }) : [];

                    this.setState({
                        data: data,
                        datas:data,
                        allData:data,
                        name:bulidName
                    })
                }else if(response.data.code==1){
                    Toast.info(response.data.message,1)
                }



            })
            .catch(function (error) {
                console.log(error);
            });
    }


    submitBtn = ()=> {
        const {getParam} = this.props.navigation;
        const data = getParam("user");

        axios.post(`/tenant/getRoomState`, {
            hotelNo:data.hotel_no,
        })
            .then((response) => {
                console.log(response);
                let name = response.data.name;
                let data = response.data && response.data.data ? response.data.data.map(item => {
                    if(item.enable_state == 1 && item.occupy_state == 0 && item.repair_state == 1) {
                        item.status = 2;
                    } else {
                        item.status = 1;
                    }
                    return item;
                }) : [];

                this.setState({
                    data: data,
                    name:name.split(',')
                })

            })
            .catch(function (error) {
                console.log(error);
            });

    };

    //选择全部房间
    allRoom = ()=>{

        let {allData,name} = this.state;

        let bulidName = name.map((__item)=>{
            __item.flag = false;

            return __item
        });

        this.setState({
            data:allData,
            name:bulidName,
            Allflag:false,
        })
    };


    //确定
    determineRoom = () => {

        let {price,roomNo,priceid,room_no,value,month} = this.state;
        console.log(value,'qwee');
        if(value==null){
            Toast.info('请选择租期',1);
            return
        }

        if(this.state.message==0){
            console.log(this.state.value);
            //读取
            storage.load({
                key: 'roomData',
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: false
            }).then(ret => {
                ret.amount = price;
                ret.roomNo = roomNo;
                ret.room_no = room_no;
                ret.policyId = priceid;
                ret.lease = month;
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

            const { navigate } = this.props.navigation;
            navigate('determineRoom',{ user:this.state.dataSource });
        }else if(this.state.message==null){
            Toast.info('请选择房间',1)
        }else{
            Toast.info('对不起，当前房间管理员暂未定价，暂不支持预定',1)
        }



    };

    //选择租期
    selectRoomType = (data) => {
        this.setState({
            value:data
        })

        if(data=='3个月'){
            this.setState({
                month:'3'
            })
        }else if(data=='半年'){
            this.setState({
                month:'6'
            })
        }else{
            this.setState({
                month:'12'
            })
        }
    };


    //选择房间
    handelSetRoom = (item) => {

        let { data ,month} = this.state;


        let flag = false;
        let dataArr = data.map(_item => {
            if(_item.room_no == item.room_no && _item.enable_state == 1 && _item.occupy_state == 0 && _item.repair_state == 1) {
                _item.status = 3;
                flag = true;
            } else if(_item.enable_state == 1 && _item.occupy_state == 0 && _item.repair_state == 1){
                _item.status = 2;
            } else {
                _item.status = 1;


            }
            return _item;
        });

        if(flag) {
            axios.post(`/tenant/getPriceByNo`, {
                hotelNo: item.hotel_no,
                roomNo: item.room_no,
                lease: month
            })
                .then((response) => {
                    console.log(response);
                    console.log(response.data.code);

                    this.setState({
                        data: dataArr,
                        room: {
                            direction: item.room_direction,
                            price: response.data.data[0] && response.data.data[0].price ?response.data.data[0].price:'--',

                        },
                        roomNo:item.room_no,
                        room_no:`${item.building_name}-${item.room_no}`,
                        price:response.data.data[0] && response.data.data[0].price ?response.data.data[0].price:'--',
                        priceid:response.data.data[0] && response.data.data[0].policyId ?response.data.data[0].policyId:'--',
                        message:response.data.code
                    });

                    if(response.data.code==1){

                        Toast.info('对不起，当前房间管理员暂未定价，暂不支持预定',1)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };


    //选择楼栋
    bulidingName =(item)=>{

        let {datas,name} = this.state;

        let bulidName = name.map((__item)=>{
            if(item.name==__item.name){
                __item.flag = true
            }else {
                __item.flag = false
            }

            return __item
        });


        let itemData = datas.filter((_item)=>{
            return _item.building_name == item.name
        });

        
        this.setState({
            data:itemData,
            name:bulidName,
            Allflag:true
        })

    };


    render() {

        let {data, room,value,Allflag} = this.state;

        return (

            <View style={styles.userItem}>

                <View style={{borderBottomColor:"grey",borderBottomWidth:1,top:0,padding:5,position:"absolute",zIndex:999,backgroundColor:"#fff",width: Dimensions.get('window').width}}>

                    <TouchableHighlight onPress={this.determineRoom} underlayColor="#fff"
                                        style={{backgroundColor:"#f8bd49",
                                            alignItems:"center",
                                            padding:4,
                                            position:'absolute',
                                            zIndex:9999,
                                            right:5,
                                            top:2
                                        }}
                    >
                        <Text style={{color:"#fff"}}>确定</Text>
                    </TouchableHighlight>

                    <View style={{flexDirection:"row",flexWrap:"wrap", width: 260, marginBottom:2}}>
                        <View style={{width: '12%'}}>
                            <TouchableHighlight underlayColor='transparent' onPress={this.allRoom} >
                                <Text  style={{color:!Allflag ? "#000":"grey"}}>全部</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{flexDirection:"row",flexWrap:"wrap",width: '88%'}}>
                            {
                                this.state.name.map((item,index)=>{
                                    return <TouchableHighlight  onPress={()=>{this.bulidingName(item)}} key={index} underlayColor='transparent' style={{marginLeft:10}}>
                                        <Text style={{color:item.flag ? "#000":"grey"}}>{item.name}</Text>
                                    </TouchableHighlight>
                                })
                            }
                        </View>
                    </View>

                    <View style={{flexDirection:"row",justifyContent:"flex-start",marginTop:5,marginBottom:2}}>
                        <View  style={{flexDirection:"row", minWidth: 100}}><Text style={{color:"grey"}}>价格：</Text><Text style={{color:"red"}}>{room.price || '--'}</Text></View>
                        <View  style={{flexDirection:"row", minWidth: 100}}><Text style={{color:"grey"}}>面积：</Text><Text style={{color:"#000"}}>--</Text></View>
                        <View  style={{flexDirection:"row", minWidth: 100}}><Text style={{color:"grey"}}>朝向：</Text><Text style={{color:"#000"}}>{room.direction || '--'}</Text></View>
                    </View>

                    <View style={{marginTop:5,marginBottom:2}}>
                        <Picker
                            data={this.state.district}
                            cols={1}
                            value={value}
                            extra='一年'
                            onChange={data => {
                                this.setState({value: data})
                            }}
                            onOk={(data)=>{this.selectRoomType(data)}}
                            className="forss">
                            <CustomChildren></CustomChildren>
                        </Picker>
                    </View>


                    <View style={{flexDirection:"row",marginTop:5}}>
                        <Text>不可选：</Text>
                        <Text style={{height:16,width:30,backgroundColor:"grey"}}></Text>
                        <Text style={{marginLeft:10}}>可选：</Text>
                        <Text style={{height:16,width:30,backgroundColor:"#54c6cc"}}></Text>

                    </View>

                </View>

                <ScrollView  showsVerticalScrollIndicator={false}>
                    <View style={{marginTop:100}}>

                        <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                            {data.map((item,index)=>
                                <TouchableHighlight underlayColor='transparent'
                                                    style={{width:"18%",alignItems:"center",padding:5,marginRight:5,
                                                        backgroundColor:(item.status==1) ? "grey": (item.status==2) ? "#54c6cc" : '#f1853b',
                                                        borderColor:(item.status==1) ? "#fff": (item.status==2) ? "#fff" : '#fff',
                                                        borderWidth:1,marginTop:10}} key={index} onPress={() => this.handelSetRoom(item)}>


                                    <Text style={{color:"#000"}}>{item.room_no}</Text>
                                </TouchableHighlight>
                            )}

                        </View>
                    </View>
                </ScrollView>


            </View>
        );
    }

}

const styles = StyleSheet.create({

    userItem:{
        padding:10,backgroundColor:"#fff",


        ...Platform.select({
            ios: {
                height: Dimensions.get('window').height-65
            },
            android: {
                height: Dimensions.get('window').height- (a>1.9?100:85)
            },
        }),
        ...ifIphoneX({
            height: Dimensions.get('window').height-95,
        }, {

        })

    }


});