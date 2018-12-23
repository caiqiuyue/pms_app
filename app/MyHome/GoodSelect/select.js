import React,{Component} from 'react';
import {View, Text, Image, Platform, StyleSheet, TouchableHighlight, ScrollView, Linking} from 'react-native';
import {WhiteSpace,Carousel,Picker} from 'antd-mobile'

import tiaoma from '../../MyHome/HomePage/style/tiaoma.jpg';
import tiaomaText from '../../MyHome/HomePage/style/tiaomaText.png';
import screening from "../../MyHome/Mine/style/screening.jpg";
import s1 from "./style/234.png";
import aggf from "./style/aggf.png";
import edr from "./style/edr.png";
import fg from "./style/fg.png";
import gdd from "./style/gdd.png";
import gft from "./style/gft.png";
import ggr from "./style/ggr.png";
import hhrs from "./style/hhrs.png";
import jjh from "./style/jjh.png";
import rjt from "./style/rjt.png";
import rtet from "./style/rtet.png";
import rth from "./style/rth.png";
import scas from "./style/scas.png";
import trd from "./style/trd.png";
import phone from "./style/60.png";
import kongbai from "./style/kongbai.png";
import Dimensions from 'Dimensions';
import {ifIphoneX} from "react-native-iphone-x-helper/index";
import {Toast} from "antd-mobile/lib/index";
let a = Dimensions.get("window").height/Dimensions.get("window").width

const CustomChildren = props => {
    return (
        <TouchableHighlight underlayColor="transparent" onPress={props.onClick}>

            <View style={{flexDirection:"row",marginLeft:5,marginBottom:5,width:"40%",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden'}}>
                <View style={{flex:3,padding:8}}><Text>{props.extra}</Text></View>
                <View style={{flex:1,padding:8,backgroundColor:'#f7f7f7',alignItems:"center",justifyContent:"center",}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};

export default class GoodSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: [],
            img:s1,
            price:3000,
            traffic:"地铁十号线出口",
            introduce:"交通便利，有健身房，咖啡厅，台球厅，可以组织party",
            Carousel:[],
            roomTypeList:[],
            rooomTypeImg:[],
            district:[],
            extra:"",
            value:null,
            dataArr:[
                {name:"空调",img:rjt},
                {name:"冰箱",img:edr},
                {name:"洗衣机",img:jjh},
                {name:"油烟机",img:scas},
                {name:"床",img:gft},
                {name:"沙发",img:hhrs},
                {name:"淋浴",img:rtet},
                {name:"衣柜书桌",img:trd},
                {name:"电视",img:aggf},
                {name:"马桶",img:rth}
            ]
        };

    }

    componentWillMount(){
        this.props.navigation.getParam = (name) => {
            let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
            if(name) {
                return params[name];
            }
            return params;
        }
        const {getParam} = this.props.navigation;
        const param = getParam("user");


        let roomData = {
            hotelName:param.hotel_name,
            hotelNo:param.hotel_no,

        };

        //设置storage
        storage.save({
            key: 'roomData',  // 注意:请不要在key中使用_下划线符号!
            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
            data:roomData,
            // 如果不指定过期时间，则会使用defaultExpires参数
            // 如果设为null，则永不过期
            expires: null
        });

        if(param.img!=''){
            let data = param.img.split(',');
            this.setState({
                Carousel:data,
            })
        }

        
        let roomTypeList = param.roomTypeList?param.roomTypeList:[];

        let dataimg = param.roomTypeList?param.roomTypeList[0].roomtype_img:'';
        let rooomTypeImg = [];

        if(dataimg!=''){
            rooomTypeImg = dataimg.split(',');
        }


        let district = roomTypeList.map(item => {
            let _item = {
                label: item.roomtype_name,
                value: item.roomtype_name
            }
            return _item;
        });


        
        this.setState({
            dataSource:param,
            roomTypeList,
            district,
            rooomTypeImg
        })

    }


    //预约看房
    seeRoom = () => {
        const { navigate } = this.props.navigation;
        navigate('SeeRoom',{ user:this.state.dataSource });
    };

    //预定房间
    selectRom = () => {

        const { navigate } = this.props.navigation;
        navigate('selectRom',{ user:this.state.dataSource });
    };


    //选择房型
    selectRoomType = (data) => {

        let {roomTypeList} = this.state;

        let datas = roomTypeList.filter((item)=>{
            return item.roomtype_name == data
        });

        let dataimg = datas[0].roomtype_img;
        let rooomTypeImg = [];

        if(dataimg!=''){
            rooomTypeImg = dataimg.split(',');
        }

        console.log(rooomTypeImg);
        this.setState({
            value:data,
            rooomTypeImg
        })
    };


    //客服咨询
    oncall=()=>{


        if(this.state.dataSource.hotel_tel==''){
            Toast.info("暂无管家电话",1)

        }else {
            Linking.openURL(`tel:${this.state.dataSource.hotel_tel}`);
        }


    };



    render(){

    let {dataSource, district, extra, value} = this.state;

    return (
        <View style={styles.select}>


            <View style={{flexDirection: "row",position:"absolute",zIndex:999,
                ...Platform.select({
                    ios: {
                        bottom:64,
                    },
                    android: {
                        bottom:a>1.9?95:80,
                    },
                }),
                ...ifIphoneX({
                    bottom:110,
                }, {

                })

            }}>
                <TouchableHighlight underlayColor="#f0f0f0" onPress={this.oncall} style={{flex: 3, borderTopWidth: 1, backgroundColor: "#fff"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <View style={{marginLeft: 20}}>
                            <Image style={{height: 20, width: 20}} source={phone}/>
                        </View>
                        <Text style={{padding: 10, color: "grey"}}>客服咨询</Text>
                    </View>

                </TouchableHighlight>

                <TouchableHighlight underlayColor="transparent" onPress={this.seeRoom} style={{
                    flex: 2,
                    alignItems: "center",
                    backgroundColor: "#f8bd49"
                }}><Text style={{padding: 10, color: "#fff"}}>预约看房</Text></TouchableHighlight>
                <TouchableHighlight underlayColor="transparent" onPress={this.selectRom}
                                    style={{flex: 2, alignItems: "center", backgroundColor: "#666"}}><Text
                    style={{padding: 10, color: "#d3d049"}}>预定房间</Text></TouchableHighlight>
            </View>


            <View style={{

                ...Platform.select({
                    ios: {
                        height: Dimensions.get("window").height,
                        paddingBottom:110,
                    },
                    android:{
                        height: Dimensions.get("window").height,
                        paddingBottom:130,
                    }


                })
                }}>
                <ScrollView style={{paddingLeft:10,paddingRight:10}}>


                    <View>
                        <View>
                            <View>

                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    padding: 5,
                                    position:"absolute",
                                    width:'100%',
                                    zIndex:999,
                                    bottom:0
                                }}>

                                    <View style={{flex: 1, marginTop: 2}}>
                                        <Text style={{color: "#fff",fontWeight:'bold'}}>
                                            {dataSource.hotel_name}
                                        </Text>
                                    </View>
                                    <View style={{marginRight: 5}}>
                                        <Text style={{fontSize: 16, color: "#ec833a",fontWeight:'bold'}}>
                                            ¥{dataSource.price}元起
                                        </Text>
                                    </View>
                                </View>

                                {
                                    this.state.Carousel.length>0?

                                        (

                                <Carousel
                                    autoplay={true}
                                    infinite
                                    style={{marginTop:5}}
                                >
                                    {this.state.Carousel.length>0&&this.state.Carousel.map((val,index) => (
                                        <View key={index} style={{height: 150,
                                            borderWidth:1,borderColor:"#fff",
                                            borderRadius:5,overflow:"hidden"}}>


                                            <Image
                                                source={val==''?kongbai:{uri:val,cache: 'force-cache'}}
                                                style={{
                                                    height: 150,
                                                    width: '100%',
                                                    resizeMode: "stretch"
                                                }}
                                                alt=""
                                                // onLoad={() => {
                                                //     // fire window resize event to change height
                                                //     window.dispatchEvent(new Event('resize'));
                                                //     this.setState({ imgHeight: 'auto' });
                                                // }}
                                            />
                                        </View>
                                    ))}
                                </Carousel>
                                        )
                                        :<View style={{height: 150,
                                            borderWidth:1,borderColor:"#fff",
                                            borderRadius:5,overflow:"hidden"}}>

                                            <Image
                                                source={kongbai}
                                                style={{
                                                    height: 150,
                                                    width: '100%',
                                                    marginTop:5,
                                                    resizeMode: "stretch"
                                                }}
                                                alt=""
                                                // onLoad={() => {
                                                //     // fire window resize event to change height
                                                //     window.dispatchEvent(new Event('resize'));
                                                //     this.setState({ imgHeight: 'auto' });
                                                // }}
                                            />
                                        </View>
                                }

                            </View>


                            <View>

                                <View style={{flexDirection: "row",paddingBottom:10,paddingTop:10,borderBottomWidth:2,borderBottomColor:"#f0f0f0",}}>
                                    <View><Image style={{width: 12, height: 14, marginTop: 2, marginRight: 5}}
                                                 source={ggr}/></View>
                                    <Text>{dataSource.address}</Text>
                                </View>


                               <View style={{flexDirection: "row",paddingBottom:10,paddingTop:10,borderBottomWidth:2,borderBottomColor:"#f0f0f0",}}>
                                    <View><Image style={{width: 14, height: 14, marginTop: 2, marginRight: 5}}
                                                 source={gdd}/></View>
                                    <Text style={{fontSize: 12}}>{dataSource.keyword}</Text>
                                </View>



                            </View>



                            <View>
                                <View style={{flexDirection: "row",paddingBottom:10,paddingTop:10, width: "95%"}}>
                                    <View><Image style={{width: 12, height: 14, marginTop: 2, marginRight: 5}} source={fg}/></View>
                                    <Text>{dataSource.hotel_present}</Text>
                                </View>
                                <View style={{flexDirection: "row", flexWrap: "wrap", justifyContent:"space-between"}}>
                                    {this.state.dataArr.length>0&&this.state.dataArr.map((item,index)=>

                                        <View key={index} style={{marginTop: 5, alignItems: "center", width: "19%"}}>
                                            <Image style={{
                                                width: 20,
                                                height: 20,
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                                marginBottom: 3
                                            }} source={item.img}/>
                                            <Text style={{fontSize:12}}>{item.name}</Text>
                                        </View>

                                    )}
                                </View>

                            </View>
                            <WhiteSpace size="xs"/>
                            <View style={{height: 3, backgroundColor: "#f0f0f0"}}></View>
                            <WhiteSpace size="xs"/>


                            <View style={{}}>
                                <View>
                                    <Picker
                                        data={district}
                                        cols={1}
                                        value={value}
                                        extra='请选择房型'
                                        onChange={data => {
                                            this.setState({value: data})
                                        }}
                                        onOk={(data)=>{this.selectRoomType(data)}}
                                        className="forss">
                                        <CustomChildren></CustomChildren>
                                    </Picker>
                                </View>


                                <View>

                                    {
                                        this.state.rooomTypeImg.length>0?
                                            (<Carousel
                                                autoplay={true}
                                                infinite
                                            >
                                                {this.state.rooomTypeImg.map((val,index) => (
                                                    <View key={index}>
                                                        <Image
                                                            source={val==''?kongbai:{uri:val,cache: 'force-cache'}}
                                                            style={{height:140, width: Dimensions.get('window').width, resizeMode:"stretch"}}
                                                            alt=""
                                                            // onLoad={() => {
                                                            //     // fire window resize event to change height
                                                            //     window.dispatchEvent(new Event('resize'));
                                                            //     this.setState({ imgHeight: 'auto' });
                                                            // }}
                                                        />
                                                    </View>
                                                ))}
                                            </Carousel>)

                                            :(<View
                                                // style={{height: 140,
                                                //     borderWidth:1,borderColor:"#fff",
                                                //     borderRadius:5,overflow:"hidden"}}
                                            >
                                                <Image
                                                    source={kongbai}
                                                    style={{height:140, width: '100%', resizeMode:"stretch"}}
                                                    alt=""
                                                    // onLoad={() => {
                                                    //     // fire window resize event to change height
                                                    //     window.dispatchEvent(new Event('resize'));
                                                    //     this.setState({ imgHeight: 'auto' });
                                                    // }}
                                                />
                                            </View>)
                                    }




                                </View>

                            </View>





                        </View>
                    </View>
                </ScrollView>
            </View>






        </View>
    )

}
}



const styles = StyleSheet.create({
    select:{
        backgroundColor:"#fff",
        height:Dimensions.get("window").height,




    },

    texts:{
        alignItems:"center"
    },

    tex:{
        width:58,
        height:1,
        backgroundColor:"#000",
        marginTop:2
    },
    tex2:{
        width:58,
        height:2,
        backgroundColor:"#000",
        marginTop:2
    }



});