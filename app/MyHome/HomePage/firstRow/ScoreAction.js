import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import score from '../style/star.jpg';
import scoreAction from '../style/star2.jpg';


export default class ScoreAction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scoreCode: 0,
        };
        this.scoreArr = [0, 1, 2, 3, 4]
    }

    //组件加载时调用
    componentWillMount() {
        const {scoreCode} = this.props;
        this.setState({
            scoreCode: scoreCode || 0
        })
    }

    //点击设置评分
    handleSetScore = (item) => {
        this.setState({
            scoreCode: (item + 1)
        }, () => this.props.handleGetScore(item + 1))
    };

    render() {
        const {scoreCode} = this.state;
        const {disabled} = this.props;
        return (
            <View style={{flexDirection: "row"}}>
                {
                    this.scoreArr.map(item => {
                        if(item < scoreCode) {
                            return disabled ? (
                                <Image key={'score' + item} source={scoreAction} style={styles.starIcon}/>
                            ) : (
                                <TouchableHighlight underlayColor="transparent" key={'score' + item} onPress={() => this.handleSetScore(item)}>
                                    <Image key={'score' + item} source={scoreAction} style={styles.starIcon}/>
                                </TouchableHighlight>
                            )
                        } else {
                            return disabled ? (
                                <Image key={'score' + item} source={score} style={styles.starIcon}/>
                            ) : (
                                <TouchableHighlight underlayColor="transparent" key={'score' + item} onPress={() => this.handleSetScore(item)}>
                                    <Image key={'score' + item} source={score} style={styles.starIcon}/>
                                </TouchableHighlight>
                            )
                        }
                    })
                }
                <Text style={{color:"grey", paddingTop: 10,paddingLeft:5, fontSize:14}}>请点亮星星进行评价</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    starIcon:{
        width:30,
        height:30
    }
});
