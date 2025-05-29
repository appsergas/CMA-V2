import Mainstyles from '../../styles/globalStyles'
import styles from './RaiseComplaintStyles'

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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import Modal from '../../controls/Modal'
import Picker from "../../controls/Picker";
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles';
import { ArrowIcon, CircleRadioIcon, CameraIcon } from '../../../assets/icons'

class RaiseComplaint extends Component {
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
            complaintDescription: "",
            showToast: false,
            toastMessage: "",
            apiCallFlags: {
                postComplaintApiCalled: false
            },
            image1: null,
            image2: null,
            image3: null,
            showImageModal: false,
            currentImageUri: null,
            currentImageType: "",
            showPickerModal: false,
            showModal: false,
            readingResult: ""
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
        const { postComplaintResult } = nextProps
        if (this.state.apiCallFlags.postComplaintApiCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ postComplaintApiCalled: false } }
            }, () => {
                if (postComplaintResult && postComplaintResult.content && (postComplaintResult.content.MSG == "Complaint posted successfully")) {
                    // this.toastIt("Complaint posted sucessfully")
                    this.toastIt("We will get back to you shortly.")
                    // this.setState({
                    //     showToast: true,
                    //     toastMessage: "We got you. Our Customer service agent will get in touch with you shortly.",
                    // });
                    // setTimeout(() => {
                    //     this.setState({ showToast: false, toastMessage: "" });
                    //         this.props.navigation.goBack()
                    // }, 5000);
                    this.setState({

                    })
                } else {
                    console.log("postComplaintResult", postComplaintResult)
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

    carouselCurrentItem = (currentItemIndex) => {
        this.setState({ activeItemIndex: currentItemIndex })
    }

    handleSubmit = async () => {
        const { image1, image2, image3 } = this.state
        let attachments = []
        if (this.state.complaintDescription.trim() != "") {
            if (this.state.image1 != null) {
                let extension = image1.assets[0].fileName.replace(/^.*\./, '');
                attachments.push({ name: image1.assets[0].fileName, type: image1.assets[0].type, extension: extension, size: image1.assets[0].fileSize, value: image1.assets[0].base64 });
            }
            if (this.state.image2 != null) {
                let extension = image2.assets[0].fileName.replace(/^.*\./, '');
                attachments.push({ name: image2.assets[0].fileName, type: image2.assets[0].type, extension: extension, size: image2.assets[0].fileSize, value: image2.assets[0].base64 });
            }
            if (this.state.image3 != null) {
                let extension = image3.assets[0].fileName.replace(/^.*\./, '');
                attachments.push({ name: image3.assets[0].fileName, type: image3.assets[0].type, extension: extension, size: image3.assets[0].fileSize, value: image3.assets[0].base64 });
            }
            // let reqBody = {
            //     "USER_ID": AsyncStorage.getItem("sergas_customer_user_id"),
            //     "CONTRACT_NO": this.props.contracts[this.state.activeItemIndex].CONTRACT_NO || "0000",
            //     "COMPANY": this.props.contracts[this.state.activeItemIndex].COMPANY,
            //     "COMMENTS": this.state.complaintDescription,
            //     "FILE_ATTACHMENTS": attachments
            // }; 
            let contracts = this.props.contracts[this.state.activeItemIndex] || {};

            let reqBody = {
                "USER_ID": await AsyncStorage.getItem("sergas_customer_user_id"),
                "CONTRACT_NO": contracts.CONTRACT_NO && contracts.CONTRACT_NO.trim() !== "" ? contracts.CONTRACT_NO : "",
                "COMPANY": contracts.COMPANY && contracts.COMPANY.trim() !== "" ? contracts.COMPANY : "",
                "COMMENTS": this.state.complaintDescription,
                "FILE_ATTACHMENTS": attachments
            }
            console.log("reqBody", reqBody)
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ postComplaintApiCalled: true } }
            }, () => this.props.postComplaint(reqBody))
        } else {
            this.toastIt("Enter complaint description")
        }
    }

    handleAttachImages = (type, document) => {
        this.setState({ ...this.state, loading: true });
        type === "capture"
            ?
            launchCamera({ mediaType: "image", maxHeight: 100, includeBase64: true, quality: 0.1 },
                (media) => {
                    if (!!media && media.assets) {
                        this.setState({ [document]: media })
                    }
                }
            ) :
            launchImageLibrary({ mediaType: "image", maxHeight: 100, includeBase64: true, quality: 0.1 },
                (media) => {
                    if (!!media && media.assets) {
                        this.setState({ [document]: media })
                    }
                }
            )
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
            <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
                    <View style={{ ...Mainstyles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                        <View style={Mainstyles.headerLeft}>
                            <TouchableOpacity
                                style={Mainstyles.backbutton}
                                onPress={() => this.props.navigation.goBack()} >
                                {/* <ArrowIcon direction={"left"} size={20} color="#FFFFFF" /> */}
                                <ArrowIcon direction={"left"} size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <View style={Mainstyles.textContainer}>
                                <View style={Mainstyles.nameRow}>
                                    <Text style={Mainstyles.welcomeLabel} >
                                        Customer Care
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                            We’re here to help! Contact us for any questions or support you need.
                        </Text>
                    </View>

                    {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}> */}
                    <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
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
                                contentContainerStyle={Mainstyles.containerView}>

                                <View style={styles.noticeContainer}>
                                    <Text style={styles.noticeText}>
                                        IF YOUR INQUIRY IS RELATED TO GAS EMERGENCIES,{"\n"}
                                        PLEASE CALL “<Text style={styles.phone}>600565657</Text>” IMMEDIATELY.
                                    </Text>
                                </View>

                                <View style={{ ...Mainstyles.accountsLabelView, marginTop: 15 }}>
                                    <Text style={Mainstyles.accountsLabel} >
                                        {t("home.selectAccount")}
                                    </Text>
                                </View>
                                <HomeMainCard
                                    contracts={this.props.contracts}
                                    from="raiseComplaint"
                                    usageCharges={1234}
                                    userName="User NameX"
                                    accountNumber="YYYY XXXX YYYY XXXX"
                                    currentIndex={this.carouselCurrentItem}
                                />

                                {/* <View style={styles.cardView}> */}
                                <View style={{ ...Mainstyles.accountsLabelView }}>
                                    <Text style={Mainstyles.accountsLabel} >
                                        Submit Your Inquiry
                                    </Text>
                                </View>

                                <View>
                                    <TextInput
                                        Placeholder="Write more details..."
                                        Style={ Mainstyles.textAreaBox }
                                        value={this.state.complaintDescription}
                                        onChangeText={val => this.setState({ complaintDescription: val })}
                                        multiline={true}
                                    >

                                    </TextInput>
                                </View>
                                <View style={{ ...Mainstyles.accountsLabelView, marginTop: 0 }}>
                                    <Text style={Mainstyles.accountsLabel}>{t("support.attachImages")}</Text>
                                </View>

                                {/* <View style={{ ...styles.cardView, minHeight: 60, marginBottom: 40 }}>

                                    <View style={{ ...styles.paymentDueRow1, alignItems: 'center' }}>
                                        <View style={styles.addImageView}>
                                            <View style={{ ...styles.addImageViewCol, flexDirection: "row" }}>
                                          
                                                <TouchableOpacity onPress={() => {
                                                    if (this.state.image1 == null) {
                                                        this.setState({
                                                            showPickerModal: true,
                                                            currentImageType: "image1"
                                                        })
                                                    } else {
                                                        this.setState({
                                                            showImageModal: true,
                                                            currentImageUri: this.state.image1.assets[0].uri,
                                                            currentImageType: "image1"
                                                        })
                                                    }
                                                }}>
                                                    {this.state.image1 != null ?
                                                        <Image style={styles.addImage} source={{ uri: this.state.image1.assets[0].uri }} />
                                                        : <Image style={{ ...styles.addImage, resizeMode: "contain" }} source={require("../../../assets/images/camera2.png")} />
                                                    }

                                                    {
                                                        this.state.image1 == null ?
                                                            <View style={{ ...styles.addImageView, ...{ width: "75%", marginTop: 0 } }}>
                                                                <Text style={styles.imageClearText}>Upload your images</Text>
                                                            </View> : null
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                            {
                                                this.state.image1 ?
                                                    <View style={styles.addImageViewCol}>
                                                       
                                                        <TouchableOpacity onPress={() => {
                                                            if (this.state.image2 == null) {
                                                                this.setState({
                                                                    showPickerModal: true,
                                                                    currentImageType: "image2"
                                                                })
                                                            } else {
                                                                this.setState({
                                                                    showImageModal: true,
                                                                    currentImageUri: this.state.image2.assets[0].uri,
                                                                    currentImageType: "image2"
                                                                })
                                                            }
                                                        }}>
                                                            {this.state.image2 != null ?
                                                                <Image style={styles.addImage} source={{ uri: this.state.image2.assets[0].uri }} />
                                                                : <Image style={{ ...styles.addImage, resizeMode: "contain" }} source={require("../../../assets/images/attachment.png")} />
                                                            }
                                                        </TouchableOpacity>
                                                    </View> : null
                                            }
                                            {
                                                this.state.image2 ?
                                                    <View style={styles.addImageViewCol}>
                                                       
                                                        <TouchableOpacity onPress={() => {
                                                            if (this.state.image3 == null) {
                                                                this.setState({
                                                                    showPickerModal: true,
                                                                    currentImageType: "image3"
                                                                })
                                                            } else {
                                                                this.setState({
                                                                    showImageModal: true,
                                                                    currentImageUri: this.state.image3.assets[0].uri,
                                                                    currentImageType: "image3"
                                                                })
                                                            }
                                                        }}>
                                                            {this.state.image3 != null ?
                                                                <Image style={styles.addImage} source={{ uri: this.state.image3.assets[0].uri }} />
                                                                : <Image style={{ ...styles.addImage, resizeMode: "contain" }} source={require("../../../assets/images/attachment.png")} />
                                                            }
                                                        </TouchableOpacity>
                                                    </View> : null
                                            }
                                        </View>
                                    </View>
                                   
                                </View> */}

                                <View style={{ ...styles.cardView, minHeight: 60, marginBottom: 20 }}>
                                    <TouchableOpacity
                                        style={{ ...styles.paymentDueRow1, alignItems: 'center' }}
                                        activeOpacity={1}
                                    >
                                        
                                                <TouchableOpacity onPress={() => {
                                                    if (this.state.image1 == null) {
                                                        this.setState({
                                                            showPickerModal: true,
                                                            currentImageType: "image1"
                                                        })
                                                    } else {
                                                        this.setState({
                                                            showImageModal: true,
                                                            currentImageUri: this.state.image1.assets[0].uri,
                                                            currentImageType: "image1"
                                                        })
                                                    }
                                                }}>
                                                    <View style={styles.addImageView}>
                                                    <View style={{ ...styles.addImageViewCol, flexDirection: "row" }}>
                                                    {this.state.image1 != null ?
                                                        <Image style={styles.addImage} source={{ uri: this.state.image1.assets[0].uri }} />
                                                        :
                                                        // <Image
                                                        //     style={{ ...styles.addImage, resizeMode: "contain" }}
                                                        //     source={require("../../../assets/images/camera2.png")}
                                                        // />
                                                        <CameraIcon width={45} height={35} color="#102C4E" />
                                                    }


                                                    {this.state.image1 == null && (
                                                        <View style={{ ...styles.addImageView, width: "75%" }}>
                                                            <Text style={styles.imageClearText}>Upload your images</Text>
                                                        </View>
                                                    )}
                                                    </View>
                                                    </View>
                                                </TouchableOpacity>
                                            
                                        {this.state.image1 && (
                                            <View style={styles.addImageView}>
                                                <View style={styles.addImageViewCol}>
                                                    <TouchableOpacity onPress={() => {
                                                        if (this.state.image2 == null) {
                                                            this.setState({
                                                                showPickerModal: true,
                                                                currentImageType: "image2"
                                                            })
                                                        } else {
                                                            this.setState({
                                                                showImageModal: true,
                                                                currentImageUri: this.state.image2.assets[0].uri,
                                                                currentImageType: "image2"
                                                            })
                                                        }
                                                    }}>
                                                        {this.state.image2 != null ?
                                                            <Image style={styles.addImage} source={{ uri: this.state.image2.assets[0].uri }} />
                                                            :
                                                            <Image
                                                                style={{ ...styles.addImage, resizeMode: "contain" }}
                                                                source={require("../../../assets/images/attachment.png")}
                                                            />
                                                        }
                                                    </TouchableOpacity>
                                                </View>

                                                {this.state.image2 && (
                                                    <View style={styles.addImageViewCol}>
                                                        <TouchableOpacity onPress={() => {
                                                            if (this.state.image3 == null) {
                                                                this.setState({
                                                                    showPickerModal: true,
                                                                    currentImageType: "image3"
                                                                })
                                                            } else {
                                                                this.setState({
                                                                    showImageModal: true,
                                                                    currentImageUri: this.state.image3.assets[0].uri,
                                                                    currentImageType: "image3"
                                                                })
                                                            }
                                                        }}>
                                                            {this.state.image3 != null ?
                                                                <Image style={styles.addImage} source={{ uri: this.state.image3.assets[0].uri }} />
                                                                :
                                                                <Image
                                                                    style={{ ...styles.addImage, resizeMode: "contain" }}
                                                                    source={require("../../../assets/images/attachment.png")}
                                                                />
                                                            }
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={Mainstyles.buttonStyle}
                                    onPress={this.handleSubmit}
                                    disabled={apiCallFlags.postComplaintApiCalled}
                                >
                                    {
                                        (apiCallFlags.postComplaintApiCalled) ?
                                            <ActivityIndicator size='small' color='white' /> :
                                            <Text
                                                style={Mainstyles.buttonLabelStyle}>{t("support.submit")}</Text>
                                    }
                                </TouchableOpacity>

                            </ScrollView>
                            {this.state.showToast ? (
                                <Toast message={this.state.toastMessage} isImageShow={false} />
                            ) : null}

                            {this.state.showPickerModal ? (
                                <Modal
                                    onClose={() => this.setState({ showPickerModal: false })}
                                    visible={this.state.showPickerModal}
                                    button1={true}
                                    onButton1={() => {
                                        this.setState({ showPickerModal: false })
                                        setTimeout(() => {
                                            this.handleAttachImages("capture", this.state.currentImageType)
                                        }, 1000)
                                    }}
                                    button2={true}
                                    onButton2={() => {
                                        this.setState({ showPickerModal: false })
                                        setTimeout(() => {
                                            this.handleAttachImages("", this.state.currentImageType)
                                        }, 1000)
                                    }}
                                    data={{
                                        title: "Test",
                                        message: "Test",
                                        button1Text: "Camera",
                                        button2Text: "Gallery",
                                        uri: null
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                />
                            ) : null}
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
                                                <Image style={{ resizeMode: "stretch", marginBottom: 30 }}
                                                    source={this.state.readingResult == "We will get back to you shortly." ? require("../../../assets/images/Done.gif") : require("../../../assets/images/InternetError.gif")}
                                                // source={this.state.readingResult == "" ? require("../../../assets/images/Done.gif") : require("../../../assets/images/InternetError.gif") }
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStyle}>{this.state.readingResult == "We will get back to you shortly." ? "Thank You" : "Technical Error"} </Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={styles.accountNumberText}>{this.state.readingResult}</Text>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                <TouchableOpacity
                                                    style={{ ...Mainstyles.buttonStyle, width: "100%" }}
                                                    onPress={() => {
                                                        this.setState({
                                                            showModal: false
                                                        })
                                                        this.state.readingResult !== "We will get back to you shortly." ? null : this.props.navigation.goBack()
                                                    }}
                                                >
                                                    <Text
                                                        style={Mainstyles.buttonLabelStyle}>{this.state.readingResult !== "We will get back to you shortly." ? "Try Again" : "Done"}</Text>
                                                </TouchableOpacity>

                                                {/* </View> */}

                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {this.state.showImageModal ? (
                                <Modal
                                    onClose={() => this.setState({ showImageModal: false })}
                                    visible={this.state.showImageModal}
                                    button1={true}
                                    onButton1={() => {
                                        this.setState({
                                            showPickerModal: true,
                                            currentImageType: this.state.currentImageType
                                        })
                                        this.setState({ showImageModal: false })
                                    }}
                                    button2={true}
                                    onButton2={() => this.setState({ showImageModal: false })}
                                    data={{
                                        title: "Test",
                                        message: "Test",
                                        button1Text: "Retake",
                                        button2Text: "Cancel",
                                        uri: { uri: this.state.currentImageUri }
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                />
                            ) : null}
                        </KeyboardAwareScrollView>
                    </InfoContainer>
                    {/* </InfoContainer> */}
                </SafeAreaView>
            </LinearGradient>
        )
    }

}

const mapStateToProps = ({ contractsReducer }) => {
    return {
        contracts: contractsReducer.contracts
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateContracts: (data) => dispatch(updateContracts(data))
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(RaiseComplaint, {
    methods: {
        postComplaint: {
            type: 'post',
            moduleName: 'api',
            url: 'postComplaint',
            authenticate: true,
        }
    }
}))



