
import styles from './RegisterStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, ImageBackground } from 'react-native'
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
import { API_PATH } from '../../services/api/data/data/api-utils';
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import Modal from '../../controls/Modal'
import { TermsAndConditions } from '../Login/TermsAndConditions';
import { UAEPass } from 'react-native-uaepass';
import { UAEPassConfig } from '../../utils/permissions';
import { encode } from 'base-64';
import { login, logout, register, getUserDetails, getAccessToken, postLoginDeviceLog, CheckUAEPASS } from '../../utils/uaePassService';
import DeviceInfo from 'react-native-device-info';

class Register extends Component {
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
      fullName: "",
      mobileNumber: "",
      email: "",
      eid: "",
      showToast: false,
      toastMessage: "",
      apiCallFlags: {
        registerApiCalled: false,
        registerCalled: false,
        checkTermsCalled: false,
        updateTermsCalled: false
      },
      UAEPASSSupported: false,
      showTermsModal: false,
      RegisterThroughUaePass: false,
      extuserdetails: '',
      extuuid: '',
      newuuid: '',
      mobileNumber: '',
      uaepassmobileNumber: '',
    }
    this.UAEPASSVisible();
    this.scrollView = React.createRef()
  }

  async componentWillReceiveProps(nextProps) {
    const { registerNewUserResult, registerResult, updateTermsResult } = nextProps
    if (this.state.apiCallFlags.registerApiCalled) {

      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ registerApiCalled: false } }
      })
      console.log(registerNewUserResult)
      if (registerNewUserResult && registerNewUserResult.content && (registerNewUserResult.content.STATUS == "SUCCESS")) {

        await AsyncStorage.setItem("sergas_customer_user_id", registerNewUserResult.content.ERRORCODE)
        let registerRequest = {
          Email: "971" + this.state.mobileNumber + "@mobapp.com",
          Password: "Test@123",
          ConfirmPassword: "Test@123"
        }
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ registerCalled: true, registerApiCalled: false } }
        }, () => this.props.register(registerRequest))
      }
      else if (registerNewUserResult && registerNewUserResult.content && (registerNewUserResult.content.MSG == "User already exists for the given Mobile/Email/EID")) {

        await UAEPass.logout();
        this.toastIt("User already exist for the given Mobile/Email/EID")
      } else {
        this.setState({
          mobileNumber: ''
        })
        await UAEPass.logout();
        this.toastIt("Something went wrong, please try again later")
      }
    }

    if (this.state.apiCallFlags.registerCalled) {

      if (registerResult && registerResult.content == "SUCESS") {

        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ registerCalled: false } }
        }, () => this.getAuthenticationToken(this.state.mobileNumber));

      } else {
        let registerRequest = {
          Email: "971" + this.state.mobileNumber + "@mobapp.com",
          Password: "Test@123",
          ConfirmPassword: "Test@123"
        }

        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, registerCalled: true }
        })
        this.props.register(registerRequest)
      }
    }

    if (this.state.apiCallFlags.updateTermsCalled) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ updateTermsCalled: false } }
      }, async () => {
        if (updateTermsResult && updateTermsResult.content && updateTermsResult.content.STATUS == "SUCCESS" && this.state.RegisterThroughUaePass) {
          await AsyncStorage.setItem(
            'sergas_customer_mobile_number',
            "971" + this.state.mobileNumber
          )
          this.props.navigation.navigate("HomeBase");

        }
        else if (updateTermsResult && updateTermsResult.content && updateTermsResult.content.STATUS == "SUCCESS" && !this.state.RegisterThroughUaePass) {
          await AsyncStorage.setItem(
            'sergas_customer_mobile_number',
            "971" + this.state.mobileNumber
          )
          this.props.navigation.navigate("Otp", { mobileNumber: "971" + this.state.mobileNumber, scanEid: true })
        } else {

          await AsyncStorage.setItem(
            'sergas_customer_mobile_number',
            "971" + this.state.mobileNumber
          )
          if (!this.state.RegisterThroughUaePass) {
            this.props.navigation.navigate("Otp", { mobileNumber: "971" + this.state.mobileNumber, scanEid: true })
          }
        }
      })
    }

  }
  async UAEPASSVisible() {
    try {
      const data = await CheckUAEPASS();
      console.log('A', data)
      const platformPayType = Platform.OS === 'ios' ? 'UAEPASS_IOS' : 'UAEPASS_ANDROID';
      const UAEPASSVisible = data.some(paymentType =>
        paymentType.PayType === platformPayType && paymentType.Is_Active
      );

      this.setState({
        UAEPASSSupported: UAEPASSVisible
      });
    } catch (error) {
      console.error("Error fetching or processing data:", error);
    }
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

  getAuthenticationToken = (mobileNumber) => {
    var details = {
      'userName': "971" + mobileNumber + "@mobapp.com",
      'Password': 'Test@123',
      'grant_type': 'password'
    }

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(API_PATH + "/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    })
      .then(res => {
        return res.json()
      }).then(async resData => {
        if (resData && resData.access_token) {
          this.props.updateContracts([])
          await AsyncStorage.setItem('sergas_customer_mobile_number', "971" + mobileNumber);
          await AsyncStorage.setItem('contract_list', "[]");
          await AsyncStorage.setItem(
            'sergas_customer_access_token',
            resData.access_token,
            /**
             * TODO - Change to Otp for Production
             */
            () => this.setState({ showTermsModal: true })
            // this.props.navigation.navigate("Otp", {mobileNumber: "971"+this.state.mobileNumber, scanEid: true})
            // () => this.props.navigation.navigate("HomeBase", { mobileNumber: this.state.mobileNumber })
          )
        } else {
          this.setState({
            showToast: true,
            toastMessage: "Something went wrong, Please try again later",
          });
          setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
          }, 5000);
        }
      })
      .catch(err => { })
  }
  uaepasslogin = async () => {
    try {

      const configData = await UAEPassConfig();
      const response = await UAEPass.login(configData);
      if (response && response.accessCode) {
        const userDetails = await getAccessToken(response.accessCode);
        const mobileNumber = userDetails.mobile;
        await AsyncStorage.setItem('sergas_customer_uuid', userDetails.uuid)
        //console.log('User Details ', userDetails);
        this.setState({
          uaepassmobileNumber: userDetails.mobile,
          newuuid: userDetails.uuid

        })
        this.setState({
          mobileNumber: mobileNumber.replace('971', ''),
          RegisterThroughUaePass: true
        })
        let reqBody = {
          MOBILE: userDetails.mobile,
          EMAIL: "",
          partyName: "",
          EID: "",
          DOCTYPE: "",
          UUID: userDetails.uuid
        }
        //console.log('A ' ,reqBody);
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ registerApiCalled: true } }
        }, async () => {
          this.props.registerNewUser(reqBody)
        })
      }
    } catch (e) {
      //console.error('Error during login:', e);
      this.setState({ showUAEPASSCancelModal: true })
    }
  };
  handleSendOtp = () => {
    const { fullName, mobileNumber, email, eid } = this.state
    // if ((fullName.trim() == "") || (mobileNumber.trim() == "") || (email.trim() == "") || (eid.trim() == "")) {
    if (mobileNumber.trim() == "") {
      this.toastIt("Enter all the fields")
    } else {
      if (this.state.mobileNumber.trim().split("").length != 9) {
        this.toastIt("Please enter valid mobile number")
      } else {
        let reqBody = {
          MOBILE: "971" + mobileNumber,
          EMAIL: "",
          partyName: "",
          DOCTYPE: "",
          UUID: ""
        }
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ registerApiCalled: true } }
        }, async () => {
          this.props.registerNewUser(reqBody)
        })
      }
    }
  }

  handleField = (fieldName, value) => {
    this.setState({
      [fieldName]: value
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
      <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
        {/* <ButtonLogoView
                hideBackButton={true}
                    onPress={() => {
                        this.props.navigation.goBack()
                    }}
                    yourRequests={true}
                    navigation={this.props.navigation}
                ></ButtonLogoView> */}
        <ImageBackground source={Images.TransparentBackground} style={{ height: Dimensions.HP_100, width: Dimensions.WP_100 }} resizeMode={'cover'}>
          {/* <CustomText style={{ color: Colors.DarkBlue, fontFamily: Fonts.Medium, marginTop: 20,marginRight: 30, alignSelf: 'flex-end' }} onPress={() => {
                                this.props.navigation.navigate("SpotlightList")
                            }}>Go to your requests</CustomText> */}

          <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Dimensions.HP_90, }}>
            <KeyboardAvoidingView
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
                  <Image
                    source={require("../../../assets/images/sergas_logo.png")}
                    style={styles.goodieeLogoImage} />
                </View>
                <View style={styles.cardView} >
                  <View style={{ ...styles.cardHeader, marginVertical: 0 }}>
                    <Text style={styles.cardHeaderText}>Welcome</Text>
                  </View>
                  <View style={{ ...styles.cardHeader, marginTop: 0 }}>
                    <Text style={styles.cardHeaderText}>Create your Account</Text>
                  </View>
                  {/* <View style={styles.inputGroupStyle}>
                <View>
                  <Text style={styles.inputLabelStyle}>{t("login.fullName")}</Text>
                </View>
                <View>
                  <TextInput
                    value={this.state.fullName}
                    onChangeText={val => this.handleField('fullName', val)}
                  />
                </View>
              </View> */}
                  <View style={styles.inputGroupStyle}>
                    {/* <View>
                  <Text style={styles.inputLabelStyle}>{t("login.mobileNumber")}</Text>
                </View> */}
                    {/* <View>
                  <TextInput
                    value={this.state.mobileNumber}
                    onChangeText={val => this.handleField('mobileNumber', val)}
                    keyboardType={"numeric"}
                  />
                </View> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderColor: 'white'
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/ae.png")}
                        style={{ width: 30, height: 25, marginRight: 0, marginBottom: 15 }}
                      />
                      <Text
                        style={{
                          color: "#828E92",
                          fontFamily: "Tajawal-Regular",
                          fontSize: 17, fontWeight: 'bold',
                          marginRight: 5,
                          marginBottom: 12,
                        }}
                      >
                        +971
                      </Text>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          Style={{ width: "100%" }}
                          Placeholder={"5XX XXX XXX"}
                          keyboardType={"numeric"}
                          value={this.state.mobileNumber}
                          onChangeText={val => this.handleField('mobileNumber', val)}
                        />
                      </View>
                    </View>
                  </View>
                  {/* <View style={styles.inputGroupStyle}>
                <View>
                  <Text style={styles.inputLabelStyle}>{t("login.email")}</Text>
                </View>
                <View>
                  <TextInput
                    value={this.state.email}
                    onChangeText={val => this.handleField('email', val)}
                  />
                </View>
              </View>
              <View style={styles.inputGroupStyle}>
                <View>
                  <Text style={styles.inputLabelStyle}>{t("home.eIdNumber")}</Text>
                </View>
                <View>
                  <TextInput
                    value={this.state.eid}
                    onChangeText={val => this.handleField('eid', val)}
                    keyboardType={"numeric"}
                  />
                </View>
              </View> */}
                  <View style={styles.buttonView}>
                    <TouchableOpacity
                      onPress={this.handleSendOtp}
                      style={styles.buttonStyle}
                    >
                      {
                        this.state.apiCallFlags.registerCalled || this.state.apiCallFlags.registerApiCalled ?
                          <ActivityIndicator color={"black"} size="small" /> :
                          <Text
                            style={styles.buttonLabelStyle}>Register</Text>
                      }

                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.registerButtonStyle}>
                  {/* <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("RegisterUser")}
                  style={styles.registerButtonStyle}
                > */}

                  <View style={styles.registerHereView}>
                    <Text
                      style={styles.notCustomerText}>I have an account. </Text>
                  </View>
                  <View style={styles.notCustomerView}>
                    <TouchableOpacity
                      style={styles.payBillView}
                      onPress={() => this.props.navigation.navigate("Login")}
                    // onPress={() => this.setState({showTermsModal: !this.state.showTermsModal})}
                    >
                      <Text style={styles.registerHereText}>
                        Login!
                      </Text>
                      {/* <Image
                    source={require('../../../assets/images/click.png')}
                    style={styles.clickImage}
                  /> */}
                    </TouchableOpacity>
                  </View>


                  {/* </TouchableOpacity> */}
                </View>
                {
                  this.state.UAEPASSSupported ?
                    <View style={{
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>

                      <Text style={styles.uaepassorText}>OR</Text>
                      <TouchableOpacity
                        onPress={this.uaepasslogin}>
                        {
                          null ?
                            <ActivityIndicator size='small' color='white' /> :

                            <View style={styles.imageView}>
                              <Image
                                source={require('../../../assets/images/UAEPASS_Sign_up_Btn.png')}
                                style={styles.buttonuaepassStyle} />
                            </View>
                        }
                      </TouchableOpacity>



                    </View>
                    : null
                }
              </ScrollView>
              {this.state.showToast ? (
                <Toast message={this.state.toastMessage} isImageShow={false} />
              ) : null}
              {this.state.showTermsModal ? (
                <Modal
                  onClose={() => this.setState({ showTermsModal: false })}
                  visible={this.state.showTermsModal}
                  button1={true}
                  button2={true}
                  onButton1={() => {
                    this.setState({ showTermsModal: false })
                  }}
                  onButton2={() => {
                    this.setState({ showTermsModal: false })
                    this.setState({
                      apiCallFlags: { ...this.state.apiCallFlags, ...{ updateTermsCalled: true } }
                    }, () => {
                      this.props.updateTerms({ "MobileNumber": "971" + this.state.mobileNumber })
                    })
                  }}
                  data={{
                    title: "Accept terms & conditions",
                    // message: "Test",
                    message: TermsAndConditions,
                    button1Text: "Close",
                    button2Text: "Accept",
                    uri: this.state.helpImageUrl
                  }}
                  titleText={{ alignItems: 'center' }}
                />
              ) : null}
              {this.state.showUAEPASSCancelModal ? (
                <Modal
                  onClose={() => this.setState({ showUAEPASSCancelModal: false })}
                  close={false}
                  visible={this.state.showUAEPASSCancelModal}
                  button2={true}
                  onButton2={() => {
                    this.setState({ showUAEPASSCancelModal: false })
                  }}

                  data={{

                    message: 'User cancelled the login',
                    button2Text: "Ok",
                    uri: this.state.helpImageUrl,
                  }}
                  titleText={{ alignItems: 'center' }}
                />
              ) : null}
              {/* <Image
                    source={require('../../../assets/images/footerBg.png')}
                    style={{
                      height: 192.35,
                      width: 216.28,
                      position: 'absolute',
                      alignSelf: 'flex-end',
                      bottom: 0,
                      zIndex: -1
                    }}
                    /> */}
            </KeyboardAvoidingView>
          </InfoContainer>
        </ImageBackground>
      </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(Register, {
  methods: {
    registerNewUser: {
      type: 'post',
      moduleName: 'api',// 'goodiee-cataloguecore',
      url: 'registerNewUser',
      authenticate: false,
    },
    register: {
      type: 'post',
      moduleName: 'api/Account',
      url: 'Register',
      authentication: false
    },
    checkTerms: {
      type: 'get',
      moduleName: 'api',// 'goodiee-cataloguecore',
      url: 'checkTerms',
      authenticate: false,
    },
    updateTerms: {
      type: 'get',
      moduleName: 'api',// 'goodiee-cataloguecore',
      url: 'updateTerms',
      authenticate: false,
    },
  }
})
)



