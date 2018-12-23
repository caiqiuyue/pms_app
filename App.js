import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    Image,
    TouchableOpacity,
    PixelRatio
} from 'react-native';


class FixedHeaderListView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: []
        }
    }


    componentDidMount() {
      console.log(this.props.data);
      this.setState({
          dataSource: this.props.data
      })
    }


    render() {
        return (
            <View>
                {/*头部*/}
                <View style={styles.headerViewStyle}>
                    <Text style={{color: 'white', fontSize: 25}}>汽车品牌</Text>
                </View>
                <SectionList
                    sections={this.state.dataSource}
                    renderItem={this.renderRow}
                    renderSectionHeader={this.renderSectionHeader}
                    stickySectionHeadersEnabled={true}
                />
            </View>
        );
    }

    // 每一行的数据
    renderRow = ({item, index, section}) => {
        console.log(item, index, section);
        return (
            <TouchableOpacity activeOpacity={0.5}>
                <View style={styles.rowStyle}>
                    <Image source={{uri: item.icon}} style={styles.rowImageStyle}/>
                    <Text style={{marginLeft: 5}}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    // 每一组中的数据
    renderSectionHeader = ({ section: { title } }) => {
        return (
            <View style={styles.sectionHeaderViewStyle}>
                <Text style={{marginLeft: 5, color: 'white'}}>{title}</Text>
            </View>
        );
    }

}

// 设置样式
const styles = StyleSheet.create({
    outerViewStyle: {
        //占满窗口
        flex: 1
    },

    headerViewStyle: {
        height: 64,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center'
    },

    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1 / PixelRatio.get()
    },

    rowImageStyle: {
        width: 70,
        height: 70,
    },

    sectionHeaderViewStyle: {
        backgroundColor: 'red',
        height: 50,
        justifyContent: 'center'
    }
});

module.exports = FixedHeaderListView;