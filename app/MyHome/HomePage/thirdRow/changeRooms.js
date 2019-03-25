import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    Alert,
    Picker,
    View,
    Image,
    ScrollView,

} from 'react-native';




import {WhiteSpace,DatePicker,List,Toast,Flex,Checkbox} from 'antd-mobile';
const AgreeItem = Checkbox.AgreeItem;
import axios from '../../../axios'
import Dimensions from 'Dimensions'
//import {Checkbox} from "antd-mobile/lib/index";
import moment from "moment";

export default class ChangeRooms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            agreeChecked: false,
            data:{},
            date:"",
            name:[],
            allData:[],
            status:"",
            newRoomNo:"",
            flag:false,
            Allflag:false,
            room:{},
            datas:[],
            dataRoom:[]

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

        console.log(data,'data');


        let names = data.name ? data.name.split(',') : "";

        let bulidName = []

        console.log(data);
        console.log(data.status,'data.status');
        this.setState({
            status:data.status === "0" ? 0 : data.status == 1 ? 1
                : data.status == 3 ? 3:data.status == 4 ? 4 : 11,
            dataRoom:data.roomState&&data.roomState,
            datas:data.roomState&&data.roomState,
            allData:data.roomState&&data.roomState,
            data,
            name:bulidName
        })



    }


    submitBtn = ()=> {

        let{date,newRoomNo,agreeChecked,flag} = this.state;

        if(date==''){
            Toast.info('请选择换房日期',1);
            return
        }

        if(newRoomNo=="" && !agreeChecked){
            Toast.info('请选择房间',1);
        }else{

            if(flag){
                Toast.info('已提交申请，不可重复申请',1)
            }else{
                axios.post(`/self/submitRequisition`, {
                    type: "3",
                    newRoomNo:newRoomNo,
                    aboutDate:moment(date).format("YYYY-MM-DD")
                })
                    .then((response)=> {
                        console.log(response);
                        this.setState({
                            flag:true
                        });


                        Toast.info('申请成功，等待生成账单',1);

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }


        }



    };


    //选择房间
    chooseRoom = (item)=> {
        let {dataRoom,agreeChecked,data} = this.state;
        if(!agreeChecked){

            axios.post(`/tenant/getPriceByNo`, {
                hotelNo: item.hotel_no,
                roomNo: item.room_no,
                lease: data.lease
            })
                .then((response) => {
                    console.log(response);


                    this.setState({
                        room: {
                            direction: item.room_direction,
                            price: response.data.data[0].price,
                        }

                    });

                })
                .catch(function (error) {
                    console.log(error);
                });

            let room = dataRoom.map((_item,index)=>{
                if(item.room_id==_item.room_id){
                    _item.flag = true
                }else {
                    _item.flag = false
                }

                return _item
            });

            this.setState({
                dataRoom:room,
                newRoomNo:item.room_no
            })
        }else{
            Toast.info("管家选房，不可选房间",1);

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
            dataRoom:itemData,
            name:bulidName,
            Allflag:true
        })

    };


    //选择全部房间
    allRoom = ()=>{
        let {allData,name} = this.state;

        let bulidName = name.map((__item)=>{
            __item.flag = false;

            return __item
        });

        this.setState({
            dataRoom:allData,
            Allflag:false,
            name:bulidName
        })
    };


    //管家选房
    agree = (e)=>{
        let checked = e.target.checked;
        this.setState({
            agreeChecked: checked
        })

        if(checked){
            Toast.info("管家选房，不可选房间",1);
            let room = this.state.dataRoom.map((_item,index)=>{
                _item.flag = false;
                return _item
            });

            this.setState({
                dataRoom:room,
                newRoomNo:""
            })
        }
    };

    render() {

        //选择日期
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        let minDate = new Date(nowTimeStamp);
        const maxDate = new Date(nowTimeStamp + 1e7);
        if (minDate.getDate() !== maxDate.getDate()) {
            minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        }

        function formatDate(date) {
            const pad = n => n < 10 ? `0${n}` : n;
            const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
            return `${dateStr}>`;
        }


        let {status,data,flag,room,Allflag} = this.state;

        return (


            <View>
                {/*//status        状态（申请0、已确认1、生成账单2、已完成3、已拒绝4）*/}
                {
                    status==0 ?
                        (<View style={{alignItems:"center",marginTop:30}}>
                            <Text>
                                已提交申请，正在等待管家确认
                            </Text>
                        </View>) :
                        status==1 ?
                            (<View style={{alignItems:"center",marginTop:30}}>
                                <Text>
                                    已确认申请，正在等待生成账单
                                </Text>
                            </View>):
                            // status==3 ?
                            //     (<View style={{alignItems:"center",marginTop:30}}>
                            //         <Text>
                            //             已完成
                            //         </Text>
                            //     </View>):
                                // status==4 ?
                                //     (<View style={{alignItems:"center",marginTop:30}}>
                                //         <Text>
                                //             已拒绝
                                //         </Text>
                                //     </View>):
                                    <View style={{padding:10,backgroundColor:"#fff",height: Dimensions.get('window').height}}>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View style={{paddingBottom:100}}>
                                                <View>

                                                    <View style={{marginLeft:15}}>
                                                        <Text style={{color:"#000"}}>换房政策：</Text>
                                                        <WhiteSpace size="xs"/>
                                                        <Text style={{color:"grey"}}>1.换房需要提前1天申请，管家上门检查</Text>
                                                        <WhiteSpace size="lg"/>
                                                        <Text style={{color:"grey"}}>2.换房成功后，需补交差额押金和差额房费</Text>
                                                        <WhiteSpace size="lg"/>
                                                        <View style={{flexDirection:"row"}}>
                                                            <View><Text style={{color:"#000"}}>当前房间:</Text></View>
                                                            <View><Text style={{color:"#000"}}>{data.roomNo}</Text></View>
                                                            <View><Text style={{marginLeft:30,color:"#000"}}>{data.rent_price}元/月</Text></View>
                                                        </View>
                                                    </View>

                                                    {this.state.dataRoom?
                                                        (<View>


                                                            <WhiteSpace size="lg"/>
                                                            <View>
                                                                <DatePicker
                                                                    extra="请选择换房日期>"
                                                                    format={val => formatDate(val)}
                                                                    value={this.state.date}
                                                                    mode="date"
                                                                    minDate={minDate}
                                                                    onChange={date => this.setState({date})}
                                                                >
                                                                    <List.Item><Text style={{fontSize:16}}>入住日期:</Text></List.Item>
                                                                </DatePicker>
                                                            </View>
                                                            <WhiteSpace size="lg"/>
                                                            <View style={{flexDirection:"row"}}>

                                                                <View  style={{marginLeft:15}}>
                                                                    <Text>可换房间：</Text>
                                                                </View>

                                                                <View  style={{flexDirection:"row"}}>
                                                                    <View>
                                                                        <TouchableHighlight underlayColor='transparent' onPress={this.allRoom} >
                                                                            <Text  style={{color:!Allflag ? "#000":"grey"}}>全部</Text>
                                                                        </TouchableHighlight>
                                                                    </View>
                                                                    {
                                                                        this.state.name.map((item,index)=>{
                                                                            return <TouchableHighlight  onPress={()=>{this.bulidingName(item)}} key={index} underlayColor='transparent' style={{marginLeft:10}}>
                                                                                <Text style={{color:item.flag ? "#000":"grey"}}>{item.name}</Text>
                                                                            </TouchableHighlight>
                                                                        })
                                                                    }

                                                                </View>

                                                            </View>

                                                            {/*<View>*/}
                                                            {/*<Flex>*/}
                                                            {/*<Flex.Item>*/}
                                                            {/*<AgreeItem data-seed="logId" onChange={this.agree} checked={this.state.agreeChecked}>*/}
                                                            {/*<Text style={{color:"grey"}}>房间由管家分配</Text>*/}
                                                            {/*</AgreeItem>*/}
                                                            {/*</Flex.Item>*/}
                                                            {/*</Flex>*/}
                                                            {/*</View>*/}

                                                            <WhiteSpace size="lg"/>

                                                            <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:15,marginRight:15}}>
                                                                <View  style={{flexDirection:"row"}}><Text style={{color:"grey"}}>价格：</Text><Text style={{color:"red"}}>¥{room.price?room.price:'--'}</Text></View>
                                                                <View  style={{flexDirection:"row"}}><Text style={{color:"grey"}}>面积：</Text><Text style={{color:"#000"}}>--</Text></View>
                                                                <View  style={{flexDirection:"row"}}><Text style={{color:"grey"}}>朝向：</Text><Text style={{color:"#000"}}>{room.room_direction?room.room_direction:'--'}</Text></View>
                                                            </View>

                                                            <WhiteSpace size="lg"/>


                                                            <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                                                                {
                                                                    this.state.dataRoom&&this.state.dataRoom.map((item,index)=>
                                                                        <TouchableHighlight onPress={()=>this.chooseRoom(item)} underlayColor="transparent"
                                                                                            style={{width:"23%",alignItems:"center",padding:5,marginRight:5,
                                                                                                backgroundColor:item.flag ? "#f17e3a" : "#f0f0f0",marginTop:10}} key={index}>

                                                                            <Text style={{color:item.flag ? "#fff" : "#000"}}>{item.room_no}</Text>

                                                                        </TouchableHighlight>
                                                                    )}
                                                                <View style={{width:"24%"}}>

                                                                </View>
                                                            </View>
                                                            <WhiteSpace size="lg"/>

                                                            <View style={{alignItems:"center"}}>
                                                                <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                                                    borderWidth:1,borderColor:flag ? "#000" : "#fff",width:100,backgroundColor:flag ? "#fff" : "#f17e3a",
                                                                    borderRadius:10}} onPress={this.submitBtn }>
                                                                    <Text

                                                                        style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                                                        申请换房
                                                                    </Text>
                                                                </TouchableHighlight>
                                                            </View>

                                                        </View>):
                                                        (
                                                            <View style={{marginTop:10,alignItems:"center"}}>
                                                                <Text style={{color:"red",fontSize:20}}>暂无可换房间</Text>
                                                            </View>
                                                        )}



                                                </View>
                                            </View>
                                        </ScrollView>
                                    </View>
                }



            </View>


        );
    }

}

