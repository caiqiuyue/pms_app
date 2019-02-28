import React,{Component} from 'react';
import {View, Text, Image, Platform, StyleSheet,FlatList,TouchableHighlight} from 'react-native';


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
            refreshing: false,
            dataSource: [],
            datas: [],
            value:null,
            district:[
                {
                    label:'全部',
                    value: '全部'
                }
            ]
        };

    }

    componentWillMount(){

        axios.post(`/tenant/getAllHotel`, {
        })
            .then((response) =>{
                console.log(response);
                let datas = response.data.data;

                let a = [];
                let c = [];

                datas.map((item)=>{

                    if(item.city_name){

                        if(item.city_name.split('|')[1] =='市辖区'){

                            c.push(item.city_name.split('|')[0]);

                            item.city_name = item.city_name.split('|')[0]


                        }else {

                            c.push(item.city_name.split('|')[1]);
                            item.city_name = item.city_name.split('|')[1]
                        }

                    }

                });


                Array.from(new Set(c)).map((item)=>{
                    let b = {
                        value:item,
                        label: item
                    };
                    a.push(b)
                });



                this.setState({
                    dataSource:datas,
                    datas,
                    district:[...this.state.district,...a]
                })
                
            })
            .catch(function (error) {
                console.log(error);
            })


    }


    //下拉刷新
    onRefresh = () => {


        this.setState({
            refreshing: true
        });

        axios.post(`/tenant/getAllHotel`, {
        })
            .then((response) =>{
                console.log(response);
                let datas = response.data.data;

                let a = [];
                let c = [];

                datas.map((item)=>{

                    if(item.city_name){

                        if(item.city_name.split('|')[1] =='市辖区'){

                            c.push(item.city_name.split('|')[0]);

                            item.city_name = item.city_name.split('|')[0]


                        }else {

                            c.push(item.city_name.split('|')[1]);
                            item.city_name = item.city_name.split('|')[1]
                        }

                    }

                });


                Array.from(new Set(c)).map((item)=>{
                    let b = {
                        value:item,
                        label: item
                    };
                    a.push(b)
                });
                
                
                //延时模拟加载效果
                this.setState({
                    refreshing: false,
                    dataSource:datas,
                    datas,
                    district:[...this.state.district,...a]
                })


            })
            .catch(function (error) {
                console.log(error);
                this.setState({
                    refreshing: false
                })
            });

    };

    //查看公寓详情
    selectItem = (item) => {

        storage.clearMapForKey({
            key: 'roomData'
        });

        const { navigate } = this.props.navigation;
        navigate('SelectItem',{ user:item });

    };


    //城市筛选
    setCity = (data) => {
        
        console.log(data[0],'data[0]');

        if(data[0]=='全部'){
            this.setState({
                dataSource:this.state.datas
            })
        }else{
            
            let a = this.state.datas.filter((item)=>{
                return item.city_name==data[0]
            })
            
            this.setState({
                dataSource:a
            })
        }

        this.setState({value:data})
    };


    render()
    {

        let {dataSource, refreshing,district, value} = this.state;

        return (
            <View style={styles.select}>

                <View style={{alignItems:"center",backgroundColor:"#f17e3a",height:60,justifyContent:"center"}}>
                    <View style={{alignItems:"center",marginTop:8,}}>
                        {/*<View>*/}
                            {/*<Image style={{height:16,width:16}} source={left}/>*/}
                        {/*</View>*/}
                        <Text style={{color:"#fff",fontSize:16,}}>优选</Text>
                        {/*<View>*/}
                            {/*<Image style={{height:16,width:16}} source={rightWhite}/>*/}
                        {/*</View>*/}
                    </View>
                </View>


                {/*<View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"#fff",padding:5}}>*/}
                    {/*<Image style={{height:20,width:20}}  source={tiaoma}/>*/}
                    {/*<Image style={{height:20,width:147}}  source={tiaomaText}/>*/}
                {/*</View>*/}

                <View>
                    <Picker
                        data={district}
                        cols={1}
                        value={value}
                        extra="全部"
                        // onChange={data => {this.setState({value:data})}}
                        onChange={(data) => {this.setCity(data)}}
                        onOk={data => {this.setState({value:data})}}
                        className="forss">
                        <CustomChildren></CustomChildren>
                    </Picker>
                </View>

                <View style={{
                    ...ifIphoneX({
                        height: Dimensions.get("window").height - 170,
                    }, {

                    }),
                    ...Platform.select({
                        ios: {
                            height: Dimensions.get("window").height - 160,
                        },
                        android: {
                            height: Dimensions.get("window").height - 190,
                        },
                    }),
                }}>
                    <FlatList
                        data={dataSource}  //列表的渲染数据源
                        ListEmptyComponent={() => <Text>暂无数据</Text>} //列表没有数据时展示，箭头函数中可以写一个react组件
                        getItemLayout={(data, index) => ( {length: 220, offset: 220 * index, index} )}
                        initialNumToRender={4}  //首次渲染的条数
                        onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                        onRefresh={this.onRefresh} //下拉刷新
                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                        keyExtractor={(item,index)=>`${index}`}

                        renderItem={({item}) => (  //渲染列表的方式

                            <TouchableHighlight  style={{paddingTop:5,paddingLeft:10,paddingRight:10}} underlayColor="#fff" onPress={()=>this.selectItem(item)}>
                                <View>
                                    <View style={{height:180,overflow:"hidden",borderWidth:1,borderColor:"#fff",borderRadius:5}}>
                                        <Image source={item.img=='' ? s2 : {uri:item.img.split(',')[0],cache: 'force-cache'}}
                                            style={{height:180, width: '100%', resizeMode:"stretch"}}
                                               />
                                    </View>
                                    <View style={{padding:5,
                                        position:"absolute",
                                        width:'100%',
                                        zIndex:999,
                                        bottom:0}}>
                                        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                            <Text style={{color:"#fff",fontWeight:'bold'}}>
                                                {item.hotel_name}
                                            </Text>
                                            <Text style={{color:"#ec833a",fontWeight:'bold'}}>
                                                ¥{item.price}元<Text style={{color:"#fff"}}>起</Text>
                                            </Text>

                                        </View>
                                        <View style={{flexDirection:"row",paddingTop:8,paddingBottom:3}}>
                                            <View><Image style={{width:12,height:14}} source={youxuan}/></View>
                                            <Text style={{color:"#81aef3",marginRight:10,fontWeight:'bold'}}>
                                                {item.address}
                                            </Text>
                                        </View>
                                    </View>



                                </View>
                            </TouchableHighlight>


                        )}
                    />
                </View>

            </View>
        )

    }
}

const styles = StyleSheet.create({
    select:{
        backgroundColor:"#fff",


    }


});