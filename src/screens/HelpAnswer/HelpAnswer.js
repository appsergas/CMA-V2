import Mainstyles from '../../styles/globalStyles'
import styles from './HelpAnswerStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Dimensions as Dim } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import VideoPlayer from 'react-native-video-player';
import { API_PATH } from '../../services/api/data/data/api-utils';
import Video from 'react-native-video'
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


class HelpAnswer extends Component {
    constructor(props) {
        super(props)
        AsyncStorage.getItem('language', (err, res) => {
            if (res != null) {
                if (res == "ar") {
                    setI18nConfig(res, true);
                    this.forceUpdate();
                } else {
                    setI18nConfig(res, false);
                    this.forceUpdate();
                }
            } else {
                setI18nConfig("en", false);
                this.forceUpdate();
            }
        })
        const isPortrait = () => {
            const dim = Dim.get('screen');
            return dim.height >= dim.width;
          };
        this.state = {
            orientation: isPortrait() ? 'portrait' : 'landscape'
        }
        this.scrollView = React.createRef()
        this.player = React.createRef()



        Dim.addEventListener('change', () => {
            this.setState({
              orientation: isPortrait() ? 'portrait' : 'landscape'
            });
            
          });

        
    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }

    handleLocalizationChange = () => {
        AsyncStorage.getItem('language', (err, res) => {
            if (res != null) {
                if (res == "ar") {
                    setI18nConfig(res, true);
                } else {
                    setI18nConfig(res, false);
                }
            } else {
                setI18nConfig('en', false);
            }
        })
        this.forceUpdate();
    }

    handleSendOtp = () => {
        this.props.navigation.navigate("Otp")
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
                <View style={{ ...styles.headerView, height: Dimensions.HP_10 }}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={styles.headerCol1}>
                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                    <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image>
                                </TouchableOpacity>
                                <View style={{flexDirection: 'column'}}>
                                <Text style={styles.welcomeLabel} >
                                    Safety Tips
                                </Text>
                                <Text style={styles.accountNumberText}>{this.props.route.params.helpData.QUESTION}</Text>
                                </View>
                        </View>
                    </View>
                    <View style={{ ...Mainstyles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                    </View>
                </View>

                {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}> */}
                <View style={{
                    height: "100%", backgroundColor: "#102D4F", overflow: 'hidden',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    width: '100%'
                }} >
                    {/* <KeyboardAwareScrollView
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
                        style={{ flex: 1, paddingBottom: 60 }}
                        enabled
                        showsVerticalScrollIndicator={false}
                    > */}
                        {/* <ScrollView
                            ref={(ref) => (this.scrollView = ref)}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollView}> */}

                        {/* <View
                            style={{ ...styles.cardView, ...{ minHeight: "auto" } }}
                        > */}
                        <View style={{flex:1, marginBottom: 160, backgroundColor: "#102D4F"}}>
                            {/* <View style={styles.optionIconViewCol2}>
                                <Text style={styles.accountNumberText}>{this.props.route.params.helpData.QUESTION}</Text>
                            </View> */}
                            {/* <View style={styles.optionIconViewCol2}> */}
                                <VideoPlayer
                                    video={{ uri: API_PATH + "/Documents/HelpVideos/" + this.props.route.params.helpData.ANSWER }}
                                    // videoWidth={Dimensions.get("window").width}
                                    // videoHeight={200}
                                    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                                    // customStyles={{ height: 600 }}
                                    // disableControlsAutoHide
                                    onStart={() => {
                                        
                                    }}
                                    style={{
                                        width: "100%",
                                        // backgroundColor: "red"
                                        borderRadius: 4,
                                        // flex:1,
                                        // alignSelf:'stretch',alignItems:'center',justifyContent:'center',
                                        height: "100%"
                                    }}
                                    // fullscreen={true}
                                    // fullScreenOnLongPress={true}
                                    resizeMode='stretch'
                                />

                            {/* </View> */}
                        </View>

                    {/* </ScrollView> */}
                {/* </KeyboardAwareScrollView> */}
                </View>
                {/* </InfoContainer> */}
                </SafeAreaView>
        )
    }

}

export default withApiConnector(HelpAnswer, {
    methods: {

    }
})



