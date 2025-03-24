
import styles from './AboutUsStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, Dimensions, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';



class AboutUs extends Component {
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
        this.state = {
            howTo: [
                {
                    que: "How to shbah sbhb kqjs swgsw kjsiahswh sijsk wjsj?",
                    ans: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis convallis convallis tellus id interdum velit. Tellus rutrum tellus pellentesque eu. Fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean. Duis ultricies lacus sed turpis tincidunt. Sed euismod nisi porta lorem mollis aliquam ut porttitor. Et malesuada fames ac turpis egestas sed tempus. Aenean pharetra magna ac placerat vestibulum lectus. Malesuada fames ac turpis egestas. Senectus et netus et malesuada fames. Eu non diam phasellus vestibulum. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Rhoncus urna neque viverra justo nec ultrices. Luctus venenatis lectus magna fringilla urna porttitor rhoncus dolor purus.",
                    vidLink: "Flat No. 1"
                },
                {
                    que: "How to shbah sbhb kqjs swgsw kjsiahswh sijsk wjsj?",
                    ans: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis convallis convallis tellus id interdum velit. Tellus rutrum tellus pellentesque eu. Fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean. Duis ultricies lacus sed turpis tincidunt. Sed euismod nisi porta lorem mollis aliquam ut porttitor. Et malesuada fames ac turpis egestas sed tempus. Aenean pharetra magna ac placerat vestibulum lectus. Malesuada fames ac turpis egestas. Senectus et netus et malesuada fames. Eu non diam phasellus vestibulum. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Rhoncus urna neque viverra justo nec ultrices. Luctus venenatis lectus magna fringilla urna porttitor rhoncus dolor purus.",
                    vidLink: "Flat No. 1"
                },
                {
                    que: "How to shbah sbhb kqjs swgsw kjsiahswh sijsk wjsj?",
                    ans: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis convallis convallis tellus id interdum velit. Tellus rutrum tellus pellentesque eu. Fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean. Duis ultricies lacus sed turpis tincidunt. Sed euismod nisi porta lorem mollis aliquam ut porttitor. Et malesuada fames ac turpis egestas sed tempus. Aenean pharetra magna ac placerat vestibulum lectus. Malesuada fames ac turpis egestas. Senectus et netus et malesuada fames. Eu non diam phasellus vestibulum. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Rhoncus urna neque viverra justo nec ultrices. Luctus venenatis lectus magna fringilla urna porttitor rhoncus dolor purus.",
                    vidLink: "Flat No. 1"
                },
                {
                    que: "How to shbah sbhb kqjs swgsw kjsiahswh sijsk wjsj?",
                    ans: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis convallis convallis tellus id interdum velit. Tellus rutrum tellus pellentesque eu. Fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean. Duis ultricies lacus sed turpis tincidunt. Sed euismod nisi porta lorem mollis aliquam ut porttitor. Et malesuada fames ac turpis egestas sed tempus. Aenean pharetra magna ac placerat vestibulum lectus. Malesuada fames ac turpis egestas. Senectus et netus et malesuada fames. Eu non diam phasellus vestibulum. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Rhoncus urna neque viverra justo nec ultrices. Luctus venenatis lectus magna fringilla urna porttitor rhoncus dolor purus.",
                    vidLink: "Flat No. 1"
                }
            ]
        }
        this.scrollView = React.createRef()
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
            <SafeAreaView style={{
                backgroundColor: '#FFFFFF',
                flex: 1,
            }} >
                <Image
                    style={Platform.OS == 'ios' ? {
                        width: "100%",
                        zIndex: 1,
                        backgroundColor: "transparent",
                        position: 'absolute',
                        height: 120
                    } :
                    {
                        width: "100%",
                        zIndex: 1,
                        backgroundColor: "transparent",
                        position: 'absolute'
                    }}
                    source={require("../../../assets/images/miniHeader.png")}
                />
                    <View style={styles.headerView}>
                        <View style={{ flexDirection: "row", }}>
                            <View style={styles.headerCol1}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ flexDirection: 'row', alignItems: "center" }}>
                                        <Image style={{
                                            height: 12.26,
                                            width: 6.44, resizeMode: 'stretch', marginRight: 5
                                        }}
                                            source={require("../../../assets/images/back.png")}
                                        />
                                        <Text style={{
                                            fontFamily: "Tajawal-Medium",
                                            fontSize: 13,
                                            color: "#FFFFFF"
                                        }}>{t("home.back")}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.pageHeader}>{t("pages.aboutUs")}</Text>
                            </View>
                            <View style={styles.headerCol2}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('My Links', { screen: 'myAccounts' })}>
                                    <Image
                                        source={require("../../../assets/images/profile.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    <KeyboardAvoidingView
                                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                                        style={{
                                            flex: 1,
                                            backgroundColor: "rgba(255,255,255,0)",
                                            // alignItems: 'center'
                                        }}
                                        enabled
                                    >
                    <ScrollView
                        ref={(ref) => (this.scrollView = ref)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollView}>

                        {/* <View
                            style={{ ...styles.cardView, ...{ minHeight: "auto" } }}
                        > */}
                        <View style={styles.imageView}>
                            <View style={{ width: "50%", borderLeftWidth: 3, borderLeftColor: "#577ABD", marginLeft: "2.5%", borderTopLeftRadius: 2, borderBottomLeftRadius: 2, paddingLeft: 5 }}>
                                <Text style={styles.whoWeAreText}>{t("support.whoWeAre")}</Text>
                            </View>
                            <View style={{ width: "50%", alignItems: 'flex-end', paddingRight: "2.5%", justifyContent: 'center' }}>
                                <Image
                                    source={require("../../../assets/images/sergas_logo.png")}
                                    style={styles.goodieeLogoImage} />
                            </View>
                        </View>
                        <View style={{...styles.optionIconViewCol2,flexDirection: 'row', marginBottom: 20, justifyContent: 'center'}}>
                            <Text style={{...styles.pageHeader,color: "#2D395A"}}>
                            <Image source={require("../../../assets/images/openQuote.png")} style={{height: 30,width: 30}}/>
                            Pioneers of world class gas system solutions across the G.C.C.
                            <Image source={require("../../../assets/images/closeQuote.png")} style={{height: 30,width: 30, resizeMode: 'stretch'}}/>
                            </Text>
                        </View>
                        <View style={styles.optionIconViewCol2}>
                            <Text style={styles.answerText}>        Established in 1988 in the young and budding economy the U.A.E., SERGAS Group began its journey in the gas industry to empower lives and offer a safe and secure gas system solution. 
                            We at SERGAS Group provide customized solutions in LPG, SNG, NG and Medical Gas to a wide range of Industrial, Commercial and Residential Clients. A true visionary leader and CEO of SERGAS Group, 
                            Mr. Mohamed Damak has driven it forward to its present stature and has earned the trust and confidence of many over the past 30 years achieving the title of ‘Leaders in Gas Systems’.
                                “Safety and quality is our priority” with this mission, the highly experienced and competent team at SERGAS Group work around the clock to provide world class gas system solutions supported by the highest level of customer service.
                                Today SERGAS Group has its presence in the UAE, Oman & KSA and has executed over 2000 projects across GCC with a supply of more than 60 million liters of LPG annually.
                                Our team looks forward to serving your needs and ensuring the best customer experience.</Text>
                        </View>
                        {/* </View> */}

                        {/* <View style={styles.cardView}> */}
                        <Text style={styles.findUs}>
                            {t("support.findUs")}
                        </Text>
                        <View
                            style={{ flexDirection: "row", width: "95%" }}
                        >
                            <View style={{ alignItems: 'center', marginRight: 20 }}>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL('https://www.facebook.com/sergasgroupuae')}
                                >
                                    {/* <Text style={styles.notCustomerText}>Whatsapp</Text> */}
                                    <Image source={require("../../../assets/images/facebook.png")} style={
                                        {
                                            width: 31.92, height: 31.92,
                                        }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', marginRight: 20 }}>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL('https://www.instagram.com/sergas_group/')}
                                >
                                    {/* <Text style={styles.notCustomerText}>Whatsapp</Text> */}
                                    <Image source={require("../../../assets/images/twitter.png")} style={
                                        {
                                            width: 31.92, height: 31.92,
                                        }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', marginRight: 20 }}>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL('https://www.linkedin.com/company/sergas-group/')}
                                >
                                    {/* <Text style={styles.notCustomerText}>Whatsapp</Text> */}
                                    <Image source={require("../../../assets/images/linkedIn.png")} style={
                                        {
                                            width: 31.92, height: 31.92,
                                        }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', marginRight: 20 }}>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL('https://www.youtube.com/channel/UCq9xZjgtU9O5TsGk5Tn4d-A')}
                                >
                                    {/* <Text style={styles.notCustomerText}>Whatsapp</Text> */}
                                    <Image source={require("../../../assets/images/youtube.png")} style={
                                        {
                                            width: 31.92, height: 31.92,
                                        }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* </View> */}



                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }

}

export default withApiConnector(AboutUs, {
    methods: {

    }
})



