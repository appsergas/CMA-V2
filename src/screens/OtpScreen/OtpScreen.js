import Mainstyles from '../../styles/globalStyles'
import styles from './OtpScreenStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextInputControl from '../../controls/TextInput'
import PropTypes from 'prop-types'
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextInput from '../../controls/TextInput'
import Toast from '../../controls/Toast'
import OtpInputs from 'react-native-otp-inputs';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import DeviceInfo from 'react-native-device-info';
import { postLoginDeviceLog } from '../../utils/uaePassService';
import { LogoIcon, OTPIcon, XIcon } from '../../../assets/icons'

class OtpScreen extends Component {
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
      resendOtpCounter: 0,
      otp: '',
      showToast: false,
      toastMessage: "",
      mobileNumber: "",
      timer: 45,
      resendCount: 0,
      LoginDeviceLog: '',
      enableResend: false
    }
    this.scrollView = React.createRef()
  }

  componentDidMount() {
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
    this.setState({
      mobileNumber: this.props.route.params.mobileNumber
    })
    this.detonateTimer()
    this.startResendTimer();
  }

  async componentWillReceiveProps(nextProps) {
    const { validateOtpResult, resendOtpResult } = nextProps;
    if (validateOtpResult && validateOtpResult.content && (validateOtpResult.content.STATUS == "SUCCESS")) {
      await AsyncStorage.setItem("sergas_customer_login_flag", "true")
      if (this.props.route.params.scanEid) {
        this.props.navigation.navigate("OcrTest", { fromOtp: true })
      } else {

        await postLoginDeviceLog(this.state.LoginDeviceLog);
        this.props.navigation.navigate("HomeBase")
      }
    } else if (validateOtpResult && validateOtpResult.content && (validateOtpResult.content.STATUS == "FAILURE")) {
      await AsyncStorage.setItem("sergas_customer_login_flag", "false")
      this.toastIt("OTP is Incorrect")
    }

    if (resendOtpResult && resendOtpResult.content && (resendOtpResult.content.STATUS == "SUCCESS")) {
      this.toastIt("OTP sent successfully")
    } else if (resendOtpResult && resendOtpResult.content) {
      this.toastIt("Technical Error")
    }
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    if (this.resendInterval) clearInterval(this.resendInterval);
  }

  startResendTimer = () => {
    if (this.resendInterval) clearInterval(this.resendInterval);

    this.resendInterval = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState(prevState => ({ timer: prevState.timer - 1 }));
      } else {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  };

  handleResend = () => {
    const addedTime = 15;
    const newCount = this.state.resendCount + 1;
    const newTime = this.state.timer + (addedTime * newCount);

    this.setState({
      resendCount: newCount,
      timer: newTime,
    }, () => {
      this.startResendTimer();
      this.props.resendOtp({ mobileNumber: this.state.mobileNumber });
    });
  };

  detonateTimer = () => {
    this.setState({
      enableResend: false
    })
    var refreshIntervalId = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState({
          timer: this.state.timer - 1
        })
      } else {
        clearInterval(refreshIntervalId);
        this.setState({
          enableResend: true
        })
      }
    }, 1000)
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

  handleResendOtp = () => {
    if (this.state.resendOtpCounter >= 3) {
      this.setState({
        resendOtpCounter: 0
      })
      this.props.navigation.navigate("EmailLogin")
    } else {
      this.setState({
        resendOtpCounter: this.state.resendOtpCounter + 1
      })
    }
  }

  handleSubmit = async () => {
    if (this.state.otp.trim() !== '') {
      // this.setState({
      //   apiCallFlags: {...this.state.apiCallFlags,...{getAllContractsCalled: true}}
      // })
      this.props.validateOtp({
        otp: this.state.otp,
        mobileNumber: this.state.mobileNumber
      })
      this.setState({
        LoginDeviceLog: {
          user_id: await AsyncStorage.getItem("sergas_customer_user_id"),
          device_id: await DeviceInfo.getUniqueId(),
          phone: this.state.mobileNumber,
          device_ip: await DeviceInfo.getIpAddress(),
          device_type: await DeviceInfo.getDeviceType(),
          device_virtual: await DeviceInfo.isEmulator(),
          device_model: DeviceInfo.getModel(),
          device_name: await DeviceInfo.getDeviceName(),
          device_manufacturer: await DeviceInfo.getManufacturer(),
          device_platform: DeviceInfo.getSystemName(),
          os_version: DeviceInfo.getSystemVersion(),
          browser: 'OTP',
          login_type: 'MOB_NUMBER',
          uuid: '',
          status: '1',
          remark: 'LOGIN',

        }
      }, () => {

      });
    } else {
      this.setState({
        showToast: true,
        toastMessage: "Please enter OTP",
      });
      setTimeout(() => {
        this.setState({ showToast: false, toastMessage: "" });
      }, 5000);
    }
    // this.props.navigation.navigate("HomeBase")
  }

  handleOtpField = (value) => {
    this.setState({
      otp: value
    })
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

      //     <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Dimensions.HP_90, }}>
      <SafeAreaView style={{ backgroundColor: '#F7FAFC', height: "100%", flex: 1 }} >
        <View style={{ ...styles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
          <View style={{ flexDirection: "row", }}>
            <View style={styles.headerCol1}>
              <TouchableOpacity style={{ marginRight: 5 }} onPress={() => {
                if (this.state.step > 1) {
                  this.setState({ step: this.state.step - 1 })
                } else {
                  this.props.navigation.goBack()
                }
              }}>
                {/* <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image> */}
                <XIcon />
              </TouchableOpacity>
              {/* <Text style={styles.welcomeLabel} >
                      New Connection request
                  </Text> */}
            </View>
          </View>
          <View style={{ ...Mainstyles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

          </View>
        </View>

        {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}> */}
        <View style={{
          height: "100%", overflow: 'hidden',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          width: '100%'
        }} >
          <KeyboardAwareScrollView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
            style={{ paddingTop: Dimensions.HP_4, flex: 1 }}
            enabled
          >
            <ScrollView
              ref={(ref) => (this.scrollView = ref)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}>
              <View style={styles.imageView}>
                {/* <Image
                source={require("../../../assets/images/otp_lock.png")}
                style={styles.goodieeLogoImage} /> */}
                <OTPIcon />
              </View>

              <View style={styles.cardView} >
                <View style={{ ...styles.cardHeader, marginVertical: 0 }}>
                  <Text style={styles.cardHeaderText}>Almost there!</Text>
                </View>
                <View style={{ ...styles.cardHeader, marginTop: 0 }}>
                  <Text style={styles.inputLabelStyle}>Check your messages inbox and input
                    the verification code to verify your account.</Text>
                </View>
                {/* <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>{t("login.enterOtp")}</Text>
              </View> */}
                <View style={styles.inputGroupStyle}>
                  {/* <View>
                  <Text style={styles.inputLabelStyle}>{t("login.mobileNumber")}</Text>
                </View> */}
                  <View>
                    <OtpInputs handleChange={(code) => { this.setState({ otp: code }) }} numberOfInputs={4} otp={true}
                      inputContainerStyles={{ borderRadius: 4, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "#828E92", fontFamily: "Tajawal-Regular", fontSize: 10, textAlign: "right", height: 40, width: 40, justifyContent: 'center', alignItems: 'center', display: 'flex', }}
                      inputStyles={{ fontFamily: "Tajawal-Regular", fontSize: 28, borderRadius: 10, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "black", fontFamily: "Tajawal-Bold", fontSize: 20, height: 40, width: 40, textAlign: 'center', alignItems: "center", justifyContent: 'center', alignContent: 'center', textAlignVertical: "center", padding: 0 }}
                    />
                  </View>

                </View>
                <View style={styles.buttonView}>
                  <TouchableOpacity
                    onPress={this.handleSubmit}
                    disabled={this.state.otp.length < 4}
                    style={[
                      styles.buttonStyle,
                      this.state.otp.length < 4 && { backgroundColor: '#ccc' }
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonLabelStyle,
                        this.state.otp.length < 4 && { color: '#888' }
                      ]}
                    >
                      Continue
                    </Text>
                  </TouchableOpacity>

                </View>

                {this.state.timer === 0 && (
                  <View style={styles.buttonViewR}>
                    <TouchableOpacity
                      style={styles.buttonStyleR}
                      onPress={this.handleResend}
                    >
                      <Text
                        style={[
                          styles.buttonLabelStyleR,
                          { color: "#102D4F" }
                        ]}
                      >
                        Resend
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}


              </View>
              <View style={styles.registerButtonStyle}>
                <View style={styles.registerHereView}>
                  <Text style={styles.notCustomerText}>Resend code after: </Text>
                </View>
                <View style={styles.notCustomerView}>
                  <Text style={styles.registerHereText}>
                    {
                      this.state.timer >= 10
                        ? `00:${this.state.timer} Sec`
                        : `00:0${this.state.timer} Sec`
                    }
                  </Text>
                </View>
              </View>


            </ScrollView>

            {this.state.showToast ? (
              <Toast message={this.state.toastMessage} isImageShow={false} />
            ) : null}
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    )
  }

}

export default withApiConnector(OtpScreen, {
  methods: {
    validateOtp: {
      type: 'get',
      moduleName: 'api',
      url: 'validateOtp',
      authenticate: false,
    },
    resendOtp: {
      type: 'get',
      moduleName: 'api',
      url: 'resendOtp',
      authenticate: false,
    },
  }
})


