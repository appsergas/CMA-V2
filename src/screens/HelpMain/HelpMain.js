import Mainstyles from '../../styles/globalStyles'
import styles from './HelpMainStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, LayoutAnimation, ActivityIndicator, ImageBackground, UIManager } from 'react-native'
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
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles'; 
import { ArrowIcon } from '../../../assets/icons'

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}


class HelpMain extends Component {
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
            },

            expandedIndex: null,

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
    handleToggle = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState((prevState) => ({
            expandedIndex: prevState.expandedIndex === index ? null : index,
        }));
    };



    // renderAccordionItem = (item, index) => {
    //     const isExpanded = this.state.expandedIndex === index;
    //     return (
    //         <View key={index} style={styles.accordionItem}>
    //         <TouchableOpacity onPress={() => this.handleToggle(index)} style={styles.accordionHeader}>
    //             <Text style={styles.accordionTitle}>{item.title}</Text>
    //             <ArrowIcon direction={isExpanded ? "up" : "down"} size={20} color="#102D4F" />
    //         </TouchableOpacity>

    //         {isExpanded && (
    //             <View style={styles.accordionContent}>
    //                 {item.content.length > 0 ? (
    //                     item.content.map((line, i) => (
    //                         <Text key={i} style={styles.accordionText}>
    //                             {`${i + 1}. ${line}`}
    //                         </Text>
    //                     ))
    //                 ) : (
    //                     <Text style={styles.accordionText}>Coming soon...</Text>
    //                 )}
    //                 <TouchableOpacity style={styles.watchVideoButton} onPress={() => this.handleWatchVideo(item.title)}>
    //                     <Text style={styles.watchVideoButtonText}>Watch Video</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         )}
    //     </View>
    //     );
    // };


    renderAccordionItem = (data, index) => {
        const isExpanded = this.state.expandedIndex === index;
        return (
            <View key={index} style={styles.accordionItem}>
                <TouchableOpacity onPress={() => this.handleToggle(index)} style={styles.accordionHeader}>
                    <Text style={styles.accordionTitle}>{data.QUESTION}</Text>
                    <ArrowIcon direction={isExpanded ? "up" : "down"} size={20} color="#102D4F" />
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.accordionContent}>
                        {/* {data.ANSWER ? (
                            <Text style={styles.accordionText}>
                                {data.ANSWER}
                            </Text>
                        ) : (
                            <Text style={styles.accordionText}>Coming soon...</Text>
                        )} */}

                        <TouchableOpacity
                            style={styles.watchVideoButton}
                            onPress={() => this.props.navigation.navigate("HelpAnswer", { "helpData": data })}
                        >
                            <View>
                                <Text style={styles.watchVideoButtonText}>Watch Video</Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };


    render() {

        return (
            <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
                    <View style={{ ...Mainstyles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                        <View style={Mainstyles.headerLeft}>
                            <TouchableOpacity
                                style={Mainstyles.backbutton}
                                onPress={() => this.props.navigation.goBack()} >
                                <ArrowIcon direction={"left"} size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <View style={Mainstyles.textContainer}>
                                <View style={Mainstyles.nameRow}>
                                    <Text style={Mainstyles.welcomeLabel} >
                                        Safety Tips
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                            Stay safe with our essential gas safety tips and guidelines.
                        </Text>
                    </View>
                     <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
                        <KeyboardAwareScrollView
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                            // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
                            style={{ flex: 1 }}
                            enabled
                            showsVerticalScrollIndicator={false}
                        >
                            {/* <ScrollView
                                ref={(ref) => (this.scrollView = ref)}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollView}> */}



                            {/* Tabs */}
                            <View style={styles.tabContainer}>



                            </View>
                            {/* Tab Content */}

                            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                                {/* {this.state.howTo.map(this.renderAccordionItem)} */}
                                {this.state.howTo.map(this.renderAccordionItem)}
                            </ScrollView>


                            {/* </ScrollView> */}
                        </KeyboardAwareScrollView>
                    </InfoContainer>
                </SafeAreaView>
            </LinearGradient>
        )
    }


}

export default withApiConnector(HelpMain, {
    methods: {
        getHelpDocs: {
            type: 'get',
            moduleName: 'api',
            url: 'getHelpDocs',
            authenticate: true,
        }
    }
})



