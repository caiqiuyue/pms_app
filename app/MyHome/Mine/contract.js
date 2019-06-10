import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, CameraRoll, Alert,
    DeviceEventEmitter
} from 'react-native';

import Dimensions from 'Dimensions';
import {Toast} from 'antd-mobile';

import axios from "../../axios";

import RNFS from 'react-native-fs';
import moment from "moment/moment";
import Signature from "./signature";
import JPushModule from "jpush-react-native/index";

export default class Mine extends Component {
    constructor(props) {
        super(props);
        this.state={
            status:2,
            checkinNo:"",
            imglist:[],
            flag:false,
            aa:false,
            message:""

        }

    }

    getMyContract = ()=>{
        axios.post(`/contract/getMyContract`, {

        })
            .then((response) =>{
                console.log(response);


                this.setState({
                    aa:true,
                    message: response.data.message,
                },()=> {
                    if (response.data.data) {

                        //读取
                        storage.load({
                            key: 'username',
                            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                            autoSync: false
                        }).then(ret => {
                            ret.checkinNo=response.data.data.checkinNo;
                            return ret
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

                        this.setState({
                            status: response.data.data.status,
                            checkinNo: response.data.data.checkinNo,
                            imglist: response.data.data.imgList,


                        })
                    }

                })




            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillMount(){

        this.getMyContract()


    }


    // 保存图片
    download=(uri)=> {
        if (!uri) return null;
        return new Promise((resolve, reject) => {
            let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
            const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.jpg`;
            const url = uri;
            const options = {
                fromUrl: url,
                toFile: downloadDest,
                background: true,
                begin: (res) => {
                    console.log('begin', res);
                    console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log('success', res);
                    console.log('file://' + downloadDest);
                    let promise = CameraRoll.saveToCameraRoll(downloadDest);
                    promise.then(function(result) {
                        //alert('保存成功');
                        Toast.info('保存成功',1)

                    }).catch(function(error) {
                        Toast.info('保存失败',1)
                    });
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err))
                });
            } catch (e) {
                reject(new Error(e))
            }

        })

    }


    comfirmSelected=(item)=>{

        this.download(item)
    };

    cancelSelected=()=>{

    };


    saveImg=(item)=>{
        
        console.log(item);

        Alert.alert('保存','确认保存吗？',
            [
                {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:()=>this.comfirmSelected(item)}
            ],
            { cancelable: false }
        );

    };

    acceptBtn=()=>{

        const { navigate } = this.props.navigation;
        axios.post(`/contract/commitContract`, {
            checkinNo:this.state.checkinNo,
            status:1
        })
            .then((response) =>{
                console.log(response);


                if(response.data.code==0){
                    // this.setState({
                    //     flag:true
                    // });


                    navigate('Signature',{ user: response.data.data });
                    // Toast.info("签约成功",1)
                }else if(response.data.code==1){
                    Toast.info(response.data.message,1)
                }



            })
            .catch(function (error) {
                console.log(error);
            });




    };

    refuseBtn=()=>{
        axios.post(`/contract/commiitContract`, {
            checkinNo:this.state.checkinNo,
            status:0
        })
            .then((response) =>{
                console.log(response);

            })
            .catch(function (error) {
                console.log(error);
            });
    };




    render(){

        let {flag,imglist,message} = this.state;

        return (

            <View style={{backgroundColor:"#fff",}}>

                <ScrollView
                    maximumZoomScale={3}    // 子组件(图片)放大倍数
                    minimumZoomScale={1.0}  // 子组件(图片)缩小倍数
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    centerContent={false} // 子组件(图片)一直处于父组件中心位置,不会因缩放向其他方向偏离
                    style={{backgroundColor:"#fff",
                        height:this.state.status!=2?Dimensions.get('window').height-140:Dimensions.get('window').height

                    }}>

                    {
                        imglist.length>0?

                            <View>


                                {
                                    this.state.imglist.map((item,index)=>

                                        <TouchableHighlight key={index} style={{marginBottom:10,paddingBottom:5,borderBottomColor:"#f0f0f0",borderBottomWidth:1}} underlayColor="transparent"
                                                            onLongPress={()=>this.saveImg(item)}
                                        >
                                            <Image style={{flex:1,resizeMode:"stretch",width: Dimensions.get('window').width,
                                                height: Dimensions.get('window').height}}
                                                   source={{uri:item,cache: 'force-cache'}}/>
                                        </TouchableHighlight>
                                    )
                                }


                            </View>:
                            <View style={{alignItems:"center",marginTop:30}}>
                                <Text>
                                    {this.state.aa?message:'查询合同中'}
                                </Text>
                            </View>

                    }
                </ScrollView>

                {
                    this.state.status!=2? (
                        <View style={{marginTop:20,alignItems:"center",paddingBottom:20}}>

                            <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                borderWidth:1,width:100,borderColor:flag ? "#000" : "#fff",backgroundColor:flag ? "#fff" : "#54c6cc",
                                borderRadius:10}} onPress={this.acceptBtn }>
                                <Text

                                    style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                    确认签约
                                </Text>
                            </TouchableHighlight>


                        </View>
                    ) : (<Text>{}</Text>)
                }

            </View>







        )

    }
}



