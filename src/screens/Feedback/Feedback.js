
import styles from './FeedbackStyles'

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
import Modal from '../../controls/Modal'
import { Rating, AirbnbRating } from 'react-native-ratings';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { updateContracts } from '../../stores/actions/contracts.action';
import { updateUserDetails } from '../../stores/actions/user.action';
import { connect } from 'react-redux';


class Feedback extends Component {
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
            contractList: [],
            activeItemIndex: 0,
            suggestion: "",
            rating: 5,
            showToast: false,
            toastMessage: "",
            showModal: false,
            readingResult: "",
            apiCallFlags: {
                postFeedbackApiCalled: false
            },
        }
        this.scrollView = React.createRef()
    }

    async componentWillMount() {
        let contracts = await AsyncStorage.getItem("contract_list")
        this.setState({ contractList: [...JSON.parse(contracts)] })
    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillReceiveProps(nextProps) {
        const { postFeedbackResult } = nextProps
        if (this.state.apiCallFlags.postFeedbackApiCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ postFeedbackApiCalled: false } }
            }, () => {
                if (postFeedbackResult && postFeedbackResult.content && (postFeedbackResult.content.MSG == "Feedback inserted successfully")) {
                    // this.toastIt("Feedback posted sucessfully")
                    // this.setState({
                    //     showToast: true,
                    //     toastMessage: "Feedback posted sucessfully",
                    // });
                    this.toastIt("Feedback posted sucessfully")
                    // setTimeout(() => {
                    //     this.setState({ showToast: false, toastMessage: "" });
                    //     this.props.navigation.goBack()
                    // }, 5000);
                    this.setState({

                    })
                } else {
                    this.toastIt("Something went wrong, please try again later")
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

    carouselCurrentItem = (currentItemIndex) => {
        this.setState({ activeItemIndex: currentItemIndex })
    }

    handleSubmit = () => {
        // if (this.state.suggestion.trim() != "") {
        let reqBody = {
            "USER_ID": this.props.userDetails.USER_ID,
            "RATING": this.state.rating,
            "COMMENTS": this.state.suggestion
        }
        this.setState({
            apiCallFlags: { ...this.state.apiCallFlags, ...{ postFeedbackApiCalled: true } }
        }, () => this.props.postFeedback(reqBody))
        // } else {
        //     this.toastIt("Enter complaint description")
        // }
    }

    toastIt = (message) => {
        this.setState({
            showModal: true,
            readingResult: message,
        });
        setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
        }, 5000);
    }

    render() {
        const { apiCallFlags } = this.state
        return (
            <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
                <View style={{ ...styles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={styles.headerCol1}>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image>
                            </TouchableOpacity>
                            <Text style={styles.welcomeLabel} >
                                Feedback
                            </Text>
                        </View>
                    </View>
                    <View style={{ ...styles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                    </View>
                </View>

                {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}> */}
                <View style={{
                    height: Platform.OS == 'ios' ? "90%" : "100%", backgroundColor: "#FFFFFF", overflow: 'hidden',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    width: '100%'
                }} >
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

                            {/* <HomeMainCard
                            contracts={this.state.contractList}
                            from="raiseComplaint"
                            usageCharges={1234}
                            userName="User NameX"
                            accountNumber="YYYY XXXX YYYY XXXX"
                            currentIndex={this.carouselCurrentItem}
                        /> */}

                            <Image source={require("../../../assets/images/feedbackLogo.png")}
                                style={{
                                    height: 88,
                                    width: 88,
                                    resizeMode: 'stretch',
                                    marginVertical: 30
                                }}
                            />

                            <View style={{ width: "95%", alignItems: 'center' }}>
                                <Text style={styles.inputLabelStyle}>{t("support.rateService")}</Text>
                            </View>
                                <View style={styles.inputGroupStyle}>
                                    <Rating
                                        startingValue={this.state.rating}
                                        onFinishRating={(e) => { this.setState({ rating: e }) }}
                                        style={{ paddingVertical: 10 }}
                                    />
                                </View>

                            <View style={{ width: "95%", alignItems: 'center' }}>
                                <Text style={styles.inputLabelStyle}>{t("support.feedbackAndSuggestions")}</Text>
                            </View>
                            {/* <View style={styles.cardView}> */}
                            <View style={styles.inputGroupStyle}>
                                <TextInput
                                Placeholder="Waiting to hear from you"
                                    Style={{ height: 150, width: "100%",fontSize: 14, textAlignVertical: 'top', fontFamily: "Tajawal-Medium"}}  
                                    value={this.state.suggestion}
                                    onChangeText={val => this.setState({ suggestion: val })}
                                    multiline={true}
                                >

                                </TextInput>
                            </View>
                            {/* <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                <Text style={styles.accountNumberText}>{t("support.attachImages")}</Text>
                                <View style={styles.addImageView}>
                                    <View style={styles.addImageViewCol}>
                                        <TouchableOpacity>
                                            <Image style={styles.addImage} source={require("../../../assets/images/add.png")} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.addImageViewCol}>
                                        <TouchableOpacity>
                                            <Image style={styles.addImage} source={require("../../../assets/images/add.png")} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.addImageViewCol}>
                                        <TouchableOpacity>
                                            <Image style={styles.addImage} source={require("../../../assets/images/add.png")} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View> */}
                            {/* </View> */}

                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={this.handleSubmit}
                                disabled={apiCallFlags.postFeedbackApiCalled}
                            >
                                {
                                    (apiCallFlags.postFeedbackApiCalled) ?
                                        <ActivityIndicator size='small' color='white' /> :
                                        <Text
                                            style={styles.buttonLabelStyle}>{t("support.submit")}</Text>
                                }
                            </TouchableOpacity>

                        </ScrollView>
                        {
                            this.state.showModal ?
                                <Modal
                                    onClose={() => this.setState({ showModal: false })}
                                    visible={this.state.showModal}
                                    // button1={true}
                                    // button2={true}
                                    onButton1={() => {
                                        this.setState({ showPaidModal: false })
                                    }}
                                    onButton2={() => {
                                        this.setState({ showPaidModal: false })
                                        this.makePayment()
                                    }}
                                    data={{
                                        // title: "Immediate Disconnection",
                                        // message: "Test",
                                        button1Text: "Close",
                                        button2Text: "Pay",
                                        uri: this.state.helpImageUrl,
                                        view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                    <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                    source={this.state.readingResult == "Feedback posted sucessfully" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png")}
                                                    // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png") }
                                                    />

                                                    <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.inputLabelStyle}>{this.state.readingResult == "Feedback posted sucessfully" ? "Thank You" : "Technical Error"} </Text>
                                                    </View>

                                                    <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                        <Text style={styles.modalMessageText}>{this.state.readingResult}</Text>
                                                    </View>
                                                    {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                    <TouchableOpacity
                                                        style={{ ...styles.buttonStyle, width: "100%" }}
                                                        onPress={() => {
                                                            this.setState({
                                                                showModal: false
                                                            })
                                                            this.state.readingResult !== "Feedback posted sucessfully" ? null : this.props.navigation.goBack()
                                                        }}
                                                    >
                                                        <Text
                                                            style={styles.buttonLabelStyle}>{this.state.readingResult !== "Feedback posted sucessfully" ? "Try Again" : "Done"}</Text>
                                                    </TouchableOpacity>

                                            {/* </View> */}

                                        </View>
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                /> :
                                null
                        }
                        {this.state.showToast ? (
                            <Toast message={this.state.toastMessage} isImageShow={false} />
                        ) : null}
                    </KeyboardAwareScrollView>
                    </View>
                {/* </InfoContainer> */}
            </SafeAreaView>
        )
    }

}

const mapStateToProps = ({ contractsReducer,userReducer }) => {
    return {
        contracts: contractsReducer.contracts,
        userDetails: userReducer.userDetails
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateContracts: (data) => dispatch(updateContracts(data)),
        updateUserDetails: (data) => dispatch(updateUserDetails(data))
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(Feedback, {
    methods: {
        postFeedback: {
            type: 'post',
            moduleName: 'api',
            url: 'postFeedback',
            authenticate: true,
        }
    }
}))



