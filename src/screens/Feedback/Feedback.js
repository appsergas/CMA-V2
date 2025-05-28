/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import Mainstyles from '../../styles/globalStyles'
import styles from './FeedbackStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import { setI18nConfig, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextInput from '../../controls/TextInput'
import Toast from '../../controls/Toast'
import Modal from '../../controls/Modal'
import InfoContainer from '../../components/molecules/InfoContainer';
import Dimensions from '../../utils/Dimensions';
import { updateContracts } from '../../stores/actions/contracts.action';
import { updateUserDetails } from '../../stores/actions/user.action';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles';
import { ArrowIcon } from '../../../assets/icons';


class Feedback extends Component {
    constructor(props) {
        super(props)
        AsyncStorage.getItem('language', (_err, res) => {
            if (res != null) {
                if (res == 'ar') {
                    setI18nConfig(res, true);
                    this.forceUpdate();
                } else {
                    setI18nConfig(res, false);
                    this.forceUpdate();
                }
            } else {
                setI18nConfig('en', false);
                this.forceUpdate();
            }
        })
        this.state = {
            contractList: [],
            activeItemIndex: 0,
            suggestion: '',
            rating: 4,
            showToast: false,
            toastMessage: '',
            showModal: false,
            readingResult: '',
            apiCallFlags: {
                postFeedbackApiCalled: false
            }
        }
        this.scrollView = React.createRef()
    }

    async componentWillMount() {
        let contracts = await AsyncStorage.getItem('contract_list')
        this.setState({ contractList: [...JSON.parse(contracts)] })
    }

    componentDidMount() {
        RNLocalize.addEventListener('change', this.handleLocalizationChange);
    }

    componentWillReceiveProps(nextProps) {
        const { postFeedbackResult } = nextProps
        if (this.state.apiCallFlags.postFeedbackApiCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ postFeedbackApiCalled: false } }
            }, () => {
                if (postFeedbackResult && postFeedbackResult.content && (postFeedbackResult.content.MSG == 'Feedback inserted successfully')) {
                    this.toastIt('Feedback posted sucessfully')
                    this.setState({
                    })
                } else {
                    this.toastIt('Something went wrong, please try again later')
                }
            })
        }
    }

    componentWillUnmount() {
        RNLocalize.removeEventListener('change', this.handleLocalizationChange);
    }

    handleLocalizationChange = () => {
        AsyncStorage.getItem('language', (_err, res) => {
            if (res != null) {
                if (res == 'ar') {
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
        this.props.navigation.navigate('Otp')
    }

    carouselCurrentItem = (currentItemIndex) => {
        this.setState({ activeItemIndex: currentItemIndex })
    }

    handleSubmit = () => {
        // if (this.state.suggestion.trim() != "") {
        let reqBody = {
            'USER_ID': this.props.userDetails.USER_ID,
            'RATING': this.state.rating,
            'COMMENTS': this.state.suggestion
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
            readingResult: message
        });
        setTimeout(() => {
            this.setState({ showToast: false, toastMessage: '' });
        }, 5000);
    }

    render() {
        const { apiCallFlags } = this.state
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
                                        Feedback
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                            Share your feedback to help us improve our services and serve you better.
                        </Text>
                    </View>
                    <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
                        <KeyboardAwareScrollView
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                            // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_11 }}
                            style={{ flex: 1 }}
                            enabled
                            showsVerticalScrollIndicator={false}
                        >
                            <ScrollView
                                ref={(ref) => (this.scrollView = ref)}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollView}>


                                <View style={styles.bodyview}>
                                    <View style={styles.inputGroupStyle}>
                                        <View style={styles.emojiContainer}>
                                            {[
                                                { label: 'Love it!', emoji: '😍', value: 5 },
                                                { label: 'Good', emoji: '😀', value: 4 },
                                                { label: 'Maybe', emoji: '🤨', value: 3 },
                                                { label: 'Bad', emoji: '👎', value: 2 },
                                            ].map((option) => (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    onPress={() => this.setState({ rating: option.value })}
                                                    style={styles.emojiWrapper}
                                                >
                                                    <View
                                                        style={[
                                                            styles.emojiCircle,
                                                            this.state.rating === option.value
                                                                ? styles.emojiSelected
                                                                : styles.emojiUnselected,
                                                        ]}
                                                    >
                                                        <Text style={styles.emoji}>{option.emoji}</Text>
                                                    </View>
                                                    <Text style={styles.label}>{option.label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={styles.inputLabelStyle}>{t('support.feedbackAndSuggestions')}</Text>
                                    </View>

                                    <View>
                                        <TextInput
                                            Placeholder="Waiting to hear from you"
                                            // Style={{ height: 89, width: '100%', fontSize: 14, textAlignVertical: 'top', fontFamily: 'Tajawal-Medium', paddingTop: 10 }}
                                            Style={{ ...Mainstyles.textAreaBox, marginTop: 10 }}
                                            value={this.state.suggestion}
                                            onChangeText={val => this.setState({ suggestion: val })}
                                            multiline={true}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.buttonStyle}
                                    onPress={this.handleSubmit}
                                    disabled={apiCallFlags.postFeedbackApiCalled}
                                >
                                    {
                                        (apiCallFlags.postFeedbackApiCalled) ?
                                            <ActivityIndicator size="small" color="white" /> :
                                            <Text
                                                style={styles.buttonLabelStyle}>{t('support.submit')}</Text>
                                    }
                                </TouchableOpacity>


                            </ScrollView>
                            {
                                this.state.showModal ?
                                    <Modal
                                        onClose={() => this.setState({ showModal: false })}
                                        visible={this.state.showModal}


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
                                            button1Text: 'Close',
                                            button2Text: 'Pay',
                                            uri: this.state.helpImageUrl,
                                            view: <View style={{ alignItems: 'center', width: '100%' }}>
                                                <Image style={{ resizeMode: 'stretch', marginBottom: 20 }}
                                                    source={this.state.readingResult == 'Feedback posted sucessfully' ? require('../../../assets/images/Done.gif') : require('../../../assets/images/InternetError.gif')}
                                                // source={this.state.readingResult == "Feedback posted sucessfully" ? require("../../../assets/images/Done.gif") : require("../../../assets/images/InternetError.gif")}
                                                // source={this.state.readingResult == "" ? require("../../../assets/images/Done.gif") : require("../../../assets/images/InternetError.gif") }
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStylee}>{this.state.readingResult == 'Feedback posted sucessfully' ? 'Thank you for your feedback!' : 'Technical Error'} </Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={styles.modalMessageText}>{this.state.readingResult == 'Feedback posted sucessfully' ? 'We take this seriously and are on it' : ' '}</Text>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                <TouchableOpacity
                                                    style={{ ...Mainstyles.buttonStyle }}
                                                    onPress={() => {
                                                        this.setState({
                                                            showModal: false
                                                        })
                                                        this.state.readingResult !== 'Feedback posted sucessfully' ? null : this.props.navigation.goBack()
                                                    }}
                                                >
                                                    <Text
                                                        style={Mainstyles.buttonLabelStyle}>{this.state.readingResult !== 'Feedback posted sucessfully' ? 'Try Again' : 'Go to home page'}</Text>
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

                        {/* </InfoContainer> */}
                    </InfoContainer>
                </SafeAreaView>
            </LinearGradient>
        )
    }

}

const mapStateToProps = ({ contractsReducer, userReducer }) => {
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
            authenticate: true
        }
    }
}))



