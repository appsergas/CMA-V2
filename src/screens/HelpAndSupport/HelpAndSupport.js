
import styles from './HelpAndSupportStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import TextInputControl from '../../controls/TextInput'
import PropTypes from 'prop-types'
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextInput from '../../controls/TextInput'
import HomeMainCard from '../../components/HomeMainCard';
import Toast from '../../controls/Toast'
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';



class HelpAndSupport extends Component {
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
                // {
                //     QUESTION: "What to do if there is Gas smell in your flat?",
                //     ANSWER: "GasSmellInFlat.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "What to do if Gas System is Not Working?",
                //     ANSWER: "GasSystemNotWorking.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "What to do if Gas Supply Stops Suddenly?",
                //     ANSWER: "GasSupplyStopsSuddenly.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "What to do if Gas Detector Alarm Rings?",
                //     ANSWER: "GasDetectorAlarmRings.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "What to do if there is Noise From Solenoid Valve?",
                //     ANSWER: "NoiseFromSolenoidValve.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "What to do if there is Fire In Your Cooker?",
                //     ANSWER: "FireInYourCooker.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "Keep your Gas Meter Cabinet Empty - Safe Usage of Central Gas System",
                //     ANSWER: "KeepYourGasMeterCabinetEmpty.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "Keep Your Garbage Bin Away from Detector - Safe Usage of Central Gas System",
                //     ANSWER: "KeepYourGarbageBinAway.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "Do Not Spray Near Detector - Safe Usage of Central Gas System",
                //     ANSWER: "DoNotSprayNearTheGasDetector.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "Do not Obstruct Gas Detector - Safe Usage of Central Gas System",
                //     ANSWER: "DoNotObstructGasDetector.mp4",
                //     vidLink: "Flat No. 1"
                // },
                // {
                //     QUESTION: "Avoid Damage to the Hose Pipe - Safe Usage of Central Gas System",
                //     ANSWER: "AvoidDamageToTheHosePipe.mp4",
                //     vidLink: "Flat No. 1"
                // }
            ],
            showToast: false,
            toastMessage: "",
            apiCallFlags: {
                getHelpDocsCalled: true
            }
        }
        this.scrollView = React.createRef()
    }

    componentWillMount() {
        this.props.getHelpDocs()
    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillReceiveProps(nextProps) {
        const { getHelpDocsResult } = nextProps;
        if (this.state.apiCallFlags.getHelpDocsCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ getHelpDocsCalled: false } }
            }, () => {
                if (getHelpDocsResult.content[0]) {
                    this.setState({
                        howTo: [...this.state.howTo, ...getHelpDocsResult.content]
                    })
                } else {
                    this.toastIt("Something went wrong. Please try again later.")
                }
            })
        }
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

    toastIt = (message) => {
        this.setState({
            showToast: true,
            toastMessage: message,
        });
        setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
        }, 5000);
    }

    render() {
        return (


            <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
                <View style={{ ...styles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_20 : Dimensions.HP_10 }}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={styles.headerCol1}>
                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                    <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image>
                                </TouchableOpacity>
                                <Text style={styles.welcomeLabel} >
                                    Help and Support
                                </Text>
                        </View>
                    </View>
                    <View style={{ ...styles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                    </View>
                </View>

                <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}>
                    <KeyboardAwareScrollView
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
                        style={{ flex: 1 }}
                        enabled
                        showsVerticalScrollIndicator={false}
                    >
                        <ScrollView
                            ref={(ref) => (this.scrollView = ref)}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollView}>

                            {/* <View style={{ ...styles.accountsLabelView }}>
                <Text style={styles.accountsLabel} >
                    My Account
                </Text>
            </View> */}
                            <View style={{ ...styles.cardView, marginTop: 60 }}>

                                            <TouchableOpacity
                                                style={{ height: 50, flexDirection: 'row', width: "90%" }}
                                                onPress={() => this.props.navigation.navigate("raiseComplaint")}
                                            >
                                                {/* <View style={styles.optionIconViewCol2}>
                                        <Text style={styles.accountNumberText}>{data.QUESTIONSTION}</Text>
                                    </View> */}
                                                <View style={styles.optionIconViewCol1}>
                                                    <Text style={styles.accountNumberText}>Customer Care</Text>
                                                </View>
                                                <View style={styles.optionIconViewCol2}>
                                                    <Image
                                                        source={require('../../../assets/images/ClickNew.png')}
                                                        style={styles.clickImage}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                                <View style={{ width: "90%", height: 0, borderTopWidth: 0.4, borderStyle: "solid", borderColor: "#ABB2AC", alignSelf: 'center' }} />
                                                <TouchableOpacity
                                                style={{ height: 50, flexDirection: 'row', width: "90%" }}
                                                onPress={() => this.props.navigation.navigate("feedback")}
                                            >
                                                {/* <View style={styles.optionIconViewCol2}>
                                        <Text style={styles.accountNumberText}>{data.QUESTIONSTION}</Text>
                                    </View> */}
                                                <View style={styles.optionIconViewCol1}>
                                                    <Text style={styles.accountNumberText}>Feedback</Text>
                                                </View>
                                                <View style={styles.optionIconViewCol2}>
                                                    <Image
                                                        source={require('../../../assets/images/ClickNew.png')}
                                                        style={styles.clickImage}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{ width: "90%", height: 0, borderTopWidth: 0.4, borderStyle: "solid", borderColor: "#ABB2AC", alignSelf: 'center' }} />
                                                <TouchableOpacity
                                                style={{ height: 50, flexDirection: 'row', width: "90%" }}
                                                onPress={() => this.props.navigation.navigate("HelpMain")}
                                            >
                                                {/* <View style={styles.optionIconViewCol2}>
                                        <Text style={styles.accountNumberText}>{data.QUESTIONSTION}</Text>
                                    </View> */}
                                                <View style={styles.optionIconViewCol1}>
                                                    <Text style={styles.accountNumberText}>Safety Tips</Text>
                                                </View>
                                                <View style={styles.optionIconViewCol2}>
                                                    <Image
                                                        source={require('../../../assets/images/ClickNew.png')}
                                                        style={styles.clickImage}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                                

                            </View>


                        </ScrollView>
                    </KeyboardAwareScrollView>
                </InfoContainer>
            </SafeAreaView>
        )
    }

}

export default withApiConnector(HelpAndSupport, {
    methods: {
        getHelpDocs: {
            type: 'get',
            moduleName: 'api',
            url: 'getHelpDocs',
            authenticate: true,
        }
    }
})



