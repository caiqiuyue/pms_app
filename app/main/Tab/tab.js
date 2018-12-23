import React,{Component} from 'react';
import {DeviceEventEmitter, Image,Text ,View,Platform} from 'react-native';
import { createBottomTabNavigator, TabBarBottom} from 'react-navigation';
import TabHome from '../../MyHome/HomePage/homePage';
// import TabHome from '../../MyHome/HomePage/secondRow/rent';
// import TabHome from '../../MyHome/Mine/coupons';
import TabBarItem from './TabBarItem';
import TabBarLabel from './TabBarLabel';
import Message from '../../MyHome/Message/message';
import GoodSelect from '../../MyHome/GoodSelect/GoodSelect';
import Mine from '../../MyHome/Mine/MineBox';
import CodePush from "react-native-code-push";
// import Mine from '../../MyHome/Mine/setup';

const Tab = createBottomTabNavigator(
    {
        TabHome:{
            screen:TabHome,
            badgeText:"122",
            navigationOptions:({navigation}) => {
                
                console.log(navigation.isFocused(),'navigation.isFocused()  TabHome');

                if(navigation.isFocused()){

                    CodePush.sync();

                    CodePush.allowRestart();//在加载完了可以允许重启

                    DeviceEventEmitter.emit('tab','TabHome');
                }


                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'1'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'首页'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'1'}
                            tintColor={tintColor}
                            focused={focused}
                            normalImage={require('./homeInit.png')}
                            selectedImage={require('./homeIcon.png')}
                        />


                    ),

                })
            },
        },

        Message:{
            screen:Message,
            navigationOptions:({navigation}) => {

                if(navigation.isFocused()){

                    CodePush.sync();

                    CodePush.allowRestart();//在加载完了可以允许重启

                }

                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'2'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'消息'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'2'}
                            tintColor={tintColor}
                            type={true}
                            focused={focused}
                            normalImage={require('./messageInit.png')}
                            selectedImage={require('./messageIcon.png')}
                        />

                    )
                })
            },
        },
        GoodSelect:{
            screen:GoodSelect,
            navigationOptions:({navigation}) => {

                if(navigation.isFocused()){

                    CodePush.sync();

                    CodePush.allowRestart();//在加载完了可以允许重启

                }

                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'3'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'优选'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'3'}
                            tintColor={tintColor}
                            focused={focused}
                            normalImage={require('./goodSelectInit.png')}
                            selectedImage={require('./goodSelectIcon.png')}

                        />
                    )
                })
            },
        },
        Mine:{
            screen:Mine,

            navigationOptions:({navigation}) => {

                if(navigation.isFocused()){

                    CodePush.sync();

                    CodePush.allowRestart();//在加载完了可以允许重启

                }

                return ({
                    tabBarLabel:({focused,tintColor}) => (
                        <TabBarLabel
                            navigation={navigation}
                            nameKey={'4'}
                            tintColor={tintColor}
                            focused={focused}
                            lableName={'我的'}
                        />),
                    tabBarIcon:({focused,tintColor}) => (
                        <TabBarItem
                            navigation={navigation}
                            nameKey={'4'}
                            tintColor={tintColor}
                            focused={focused}
                            normalImage={require('./mineInit.png')}
                            selectedImage={require('./mineIcon.png')}
                        />
                    ),
                })
            },
        },
    },

    {
        initialRouteName: 'TabHome',
        // tabBarComponent:TabBarBottom,
        // tabBarPosition:'bottom',
        swipeEnabled:true,
        animationEnabled:false,
        lazy:true,
        tabBarOptions:{
            //tabBarComponent:TabBarBottom,
            activeTintColor:'#f17e3a',
            inactiveTintColor:'grey',
            style:{backgroundColor:'#fff',padding:3},
            labelStyle: {
                fontSize: 8,
                color: '#333'
            },
        }

    },


);

export default Tab;


