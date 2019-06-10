const setData  = (data) => {
    let goodsNames = [
        {
            goodsCata: '1',
            value: '食品类',
            flag: false,
            a: []
        },
        {
            goodsCata: '2',
            value: '特产类',
            flag: false,
            a: []
        },
        {
            goodsCata: '3',
            value: '烟酒类',
            flag: false,
            a: []
        },
        {
            goodsCata: '4',
            value: '门票类',
            flag: false,
            a: []
        },
        {
            goodsCata: '5',
            value: '消耗品类',
            flag: false,
            a: []
        },
        {
            goodsCata: '6',
            value: '生鲜类',
            flag: false,
            a: []
        },
        {
            goodsCata: '7',
            value: '水果类',
            flag: false,
            a: []
        }
    ];
    goodsNames.map(item => {
        data.map(_item => {
            if(item.goodsCata == _item.goodsCata) {
                _item.num = 0
                item.a.push(_item);
            }
        });

    });
    return goodsNames.filter(item => item.a.length > 0);
};

import React,{Component} from 'react';
import {View, Text, Image, Platform, StyleSheet,ScrollView,TouchableHighlight} from 'react-native';



import Dimensions from 'Dimensions';


export default class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state={
            district:[]
        };

    }

    componentWillMount(){
        let a = [{"goodsId":"61c7dd37136e4c2994f06e7764281099","goodsNo":"L04140001","goodsCata":"1","goodsPrice":60,"goodsName":"雅娜蝴蝶酥396礼盒装","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地：西班牙\r\n","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":43,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"566cd8de2556429999bfaf2092d43d18","goodsNo":"L04140002","goodsCata":"1","goodsPrice":45,"goodsName":"延中盐汽水600ml","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地：中国，每箱20瓶。","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":30,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"f89d09cda58942449502dfb7b0a39a21","goodsNo":"L04140003","goodsCata":"1","goodsPrice":40,"goodsName":"旺仔牛奶125ml*20礼盒","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地：中国。","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":30,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"9392d2d03248443fab9cdf08997f77bd","goodsNo":"L04140004","goodsCata":"1","goodsPrice":7,"goodsName":"爱时乐威化卷心酥50g*3盒","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地:泰国。","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":5,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"9ae34a7af79943b2bb33b6695825a209","goodsNo":"L04140005","goodsCata":"1","goodsPrice":5,"goodsName":"百草味紫薯花生128g","goodsUnit":"袋","goodsImg":null,"goodsDesc":"产地：中国","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":3,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"c01775cfe1c24b43ae41afb577f2dff6","goodsNo":"L04140006","goodsCata":"1","goodsPrice":80,"goodsName":"钙芝奶酪味威化饼干","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地：泰国，一盒24包。","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":60,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"def9114189fe46a784234adf078ebe64","goodsNo":"L04140007","goodsCata":"1","goodsPrice":10,"goodsName":"巧贝特夹心饼干6*13g","goodsUnit":"个","goodsImg":null,"goodsDesc":"","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":8,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"a1840c01a44d42d48136cec1cf1155ec","goodsNo":"L04140008","goodsCata":"1","goodsPrice":3,"goodsName":"早餐黑豆浆250ml","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地：中国","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":2.5,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"16d542fbd8214da0969b6bee326ac9ac","goodsNo":"L04140009","goodsCata":"1","goodsPrice":5,"goodsName":"小老板海苔酱油味32g","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地：泰国","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":4,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"1b083a37ae0c4d24a2f46d5691c4d46f","goodsNo":"L04140010","goodsCata":"1","goodsPrice":10,"goodsName":"河马莉蛋酥130g","goodsUnit":"个","goodsImg":null,"goodsDesc":"","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":7.6,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"7544476d6635434fb14d645ace5940ac","goodsNo":"L04140011","goodsCata":"1","goodsPrice":13,"goodsName":"托马斯鱼肠105g","goodsUnit":"个","goodsImg":null,"goodsDesc":"","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":10,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"6fb253909d914165b61c9348b6620e10","goodsNo":"L04140012","goodsCata":"1","goodsPrice":16,"goodsName":"托马斯益生菌泡芙60g","goodsUnit":"瓶","goodsImg":null,"goodsDesc":"","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":13,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"b36928a3438342aba462aafe0350fcce","goodsNo":"L04140013","goodsCata":"1","goodsPrice":5,"goodsName":"虾条（ 原味 芝士 酸辣）75g","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地：中国","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":3.7,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null},{"goodsId":"2c14d5e1baef46fd8c0c522e9cccba0c","goodsNo":"L04140014","goodsCata":"1","goodsPrice":3,"goodsName":"挥手牌鱼丝","goodsUnit":"个","goodsImg":null,"goodsDesc":"产地：泰国","goodsNum":null,"createTime":null,"delFlag":null,"hotelNo":null,"initstockNum":null,"stockNum":100,"goodsSpec":null,"costPrice":2,"userId":null,"tradeDate":null,"hotelNos":null,"otherPrice":null,"total":null,"rows":null,"dkey":null,"dvalue":null,"seId":null,"selName":null,"imgList":null}]

        let district = setData(a)
        district[0].flag = true

        this.setState({
            district:district
        })
    }

    aaa = (item)=>{
        let {district} = this.state
        district.map((i)=>{
            if(i.goodsNo==item.goodsNo){
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
                if(_i.goodsNo==_item.goodsNo){
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


    addGoods = (_item)=>{
        let {district} = this.state
        district.map((i)=>{
            i.a.map((_i)=>{
                if(_i.goodsNo==_item.goodsNo){
                    _i.num ++;
                }
            })
        })

        this.setState({
            district
        })
    }


    subGoods = (_item)=>{
        let {district} = this.state
        district.map((i)=>{
            i.a.map((_i)=>{
                if(_i.goodsNo==_item.goodsNo){
                    _i.num --;
                    if(_i.num<0){
                        _i.num =0
                    }
                }
            })
        })

        this.setState({
            district
        })
    }

    clickToScroll = () => {
        //先用measure测量出位置
        this.refs.totop.measure((fx, fy, width, height, px, py) => {
            console.log('Component width is: ' + width)
            console.log('Component height is: ' + height)
            console.log('X offset to frame: ' + fx)
            console.log('Y offset to frame: ' + fy)
            console.log('X offset to page: ' + px)
            console.log('Y offset to page: ' + py)
            //然后用scrollTo跳转到对应位置
            //x是水平方向
            //y是垂直方向
            this.myScrollView.scrollTo({ x: px, y: py, animated: true });
        });
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
                    // ...ifIphoneX({
                    //     height: Dimensions.get("window").height - 120,
                    // }, {
                    //
                    // }),
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
                                                    <TouchableHighlight underlayColor="transparent" onPress={()=>{this.bbb(item,_item)}}   style={[styles.ss,{backgroundColor:"#fff"}]} key={_index}><Text style={{color:_item.flag?"#ff611a":"#333"}}>{_item.goodsName}</Text></TouchableHighlight>
                                                )

                                            }
                                        </View>


                                    )
                                }
                            </ScrollView>
                        </View>
                        <View  style={{flex:3}}>
                            <ScrollView

                                // ref={(view) => { this.myScrollView = view; }}
                            >
                                {
                                    district.map((_item,index)=>

                                        _item.a.map((item,index)=>

                                            <View key={index} style={{flexDirection:"row"}}>
                                                <View>
                                                    <Image source={item.goodsImg} style={{width:80,height:80}}/>
                                                </View>
                                                <View style={{padding:10,flex:1,borderBottomColor:"#f0f0f0",borderBottomWidth:1}}>
                                                    <Text style={{fontWeight:"bold"}}>{item.goodsName}</Text>
                                                    <Text style={{marginTop:10,color:"#f17e3a",fontSize:16,fontWeight:"bold"}}>¥{item.goodsPrice}元</Text>
                                                    <Text style={{marginTop:10,color:"grey"}}>{item.goodsDesc}</Text>
                                                    <View style={{marginTop:10,flexDirection:"row-reverse"}}>
                                                        <View style={{flexDirection:"row"}}>
                                                            {item.num&&<TouchableHighlight underlayColor="transparent" onPress={()=>{this.subGoods(item)}} style={{width:20,height:20,borderRadius:10,borderColor:"grey",borderWidth:1,alignItems:"center",justifyContent:"center"}}><Text style={{fontWeight:"bold"}}>-</Text></TouchableHighlight>}
                                                            {item.num&&<View style={{marginLeft:10,marginRight:10}}><Text>{item.num}</Text></View>}
                                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.addGoods(item)}} style={{width:20,height:20,borderRadius:10,borderColor:"red",borderWidth:1,alignItems:"center",justifyContent:"center"}}><Text style={{fontWeight:"bold"}}>+</Text></TouchableHighlight>
                                                        </View>

                                                    </View>
                                                </View>
                                            </View>
                                        )




                                    )
                                }

                                {/*<View ref={view => this.totop = view}></View>*/}

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



