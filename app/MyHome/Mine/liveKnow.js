import React,{Component} from 'react';
import {View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, CameraRoll,Alert} from 'react-native';
import Dimensions from 'Dimensions';
import {Toast} from 'antd-mobile';

import axios from "../../axios";

import RNFS from 'react-native-fs';
import moment from "moment/moment";

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            img:[]

        }

    }

    getMyContract = ()=>{
        axios.post(`/tenant/getCheckinNotes`, {

        })
            .then((response) =>{
                console.log(response);
                if(response.data.code==0){
                    this.setState({
                        img:response.data.data
                    })
                }else {
                    Toast.info(response.data.message)
                }

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
                    console.log(err,'err');

                    reject(new Error(err))
                });
            } catch (e) {

                console.log(e,"e");


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


    render(){



        return (

            <ScrollView style={{backgroundColor:"#fff",}}

                        maximumZoomScale={3}    // 子组件(图片)放大倍数
                        minimumZoomScale={1.0}  // 子组件(图片)缩小倍数
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        centerContent={false} // 子组件(图片)一直处于父组件中心位置,不会因缩放向其他方向偏离
                        ref="testScroll"
            >

                {
                    this.state.img.length>0?this.state.img.map((item,index)=>

                        <View key={index}>
                            <TouchableHighlight style={{marginBottom:10,paddingBottom:5,borderBottomColor:"#f0f0f0",borderBottomWidth:1}} underlayColor="transparent" onLongPress={()=>this.saveImg(item.img)}>
                                <View>
                                    <Image style={{flex:1,resizeMode:"stretch",width: Dimensions.get('window').width,
                                        height: Dimensions.get('window').height}}
                                           source={{uri:item.img,cache: 'force-cache'}}/>
                                </View>

                            </TouchableHighlight>
                        </View>
                    ):<View/>
                }






            </ScrollView>







        )

    }
}



