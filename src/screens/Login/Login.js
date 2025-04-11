
import styles from './LoginStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, BackHandler, ActivityIndicator, ImageBackground, Linking, Alert } from 'react-native'
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
import axios from 'axios';
import { API_PATH } from '../../services/api/data/data/api-utils';
import QueryString from 'qs';
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import Modal from '../../controls/Modal'
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { TermsAndConditions } from './TermsAndConditions';
import { UAEPass } from 'react-native-uaepass';
import { UAEPassConfig } from '../../utils/permissions';
import { encode } from 'base-64';
import { login, logout, register, getUserDetails, getAccessToken, postLoginDeviceLog, CheckUserbyuuid, CheckUAEPASS } from '../../utils/uaePassService';
import DeviceInfo from 'react-native-device-info';

import AppTextInput from '../../controls/AppTextInput';
import { commonGradient } from '../../components/molecules/gradientStyles'; 
import { LogoIcon, XIcon} from '../../../assets/icons'
import LinearGradient from 'react-native-linear-gradient';

var qs = require('qs');


class Login extends Component {
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
      apiCallFlags: {
        getAllContractsCalled: false,
        getUserDetailsCalled: false,
        loginCalled: false,
        registerCalled: false,
        checkTermsCalled: false,
        updateTermsCalled: false
      },
      extuserdetails: '',
      extuuid: '',
      newuuid: '',
      mobileNumber: '',
      uaepassmobileNumber: '',
      UAEPASSSupported: false,
      showToast: false,
      toastMessage: "",
      showTermsModal: false,
      showUAEPASSCancelModal: false,
      scanEid: false,
      LoginDeviceLog: "",
      loginThroughUaePass: false
    }
    this.UAEPASSVisible();
    this.scrollView = React.createRef()
  }

  componentDidMount() {
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
    BackHandler.addEventListener('hardwareBackPress', () => {
      // return true
      Alert.alert(
        'Exit App',
        'Exiting the application?', [{
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel'
        }, {
          text: 'OK',
          onPress: () => BackHandler.exitApp()
        },], {
        cancelable: false
      }
      )
      return true;
    });
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
  componentWillReceiveProps(nextProps) {
    const { getAllContractsResult, getAllContractsWithoutOtpResult, registerResult, loginResult, checkTermsResult, updateTermsResult, getUserDetailsResult } = nextProps

    if (this.state.apiCallFlags.getAllContractsCalled) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: false } }
      }, async () => {
        let cotractsResult = getAllContractsResult && getAllContractsResult.content ? getAllContractsResult : getAllContractsWithoutOtpResult && getAllContractsWithoutOtpResult.content ? getAllContractsWithoutOtpResult : null
        if ((cotractsResult && cotractsResult.content && cotractsResult.content.STATUS == "SUCCESS")) {
          await AsyncStorage.setItem("sergas_customer_user_id", cotractsResult.content.ERRORCODE)
          let registerRequest = {
            Email: "971" + this.state.mobileNumber + "@mobapp.com",
            Password: "Test@123",
            ConfirmPassword: "Test@123"
          }


          if (cotractsResult.content.MSG == "CONTRACTS SAVED AGAINST MOBILE USER") {

            this.setState({
              apiCallFlags: { ...this.state.apiCallFlags, ...{ registerCalled: true } }
            })
            this.props.register(registerRequest)
          } else {
            this.setState({
              apiCallFlags: { ...this.state.apiCallFlags, ...{ loginCalled: true } }
            }, () => this.getAuthenticationToken(this.state.mobileNumber))

          }

          await AsyncStorage.setItem(
            'contract_list',
            JSON.stringify(cotractsResult.content.DETAIL)
          )
          this.props.updateContracts(cotractsResult.content.DETAIL)
          // await AsyncStorage.setItem(
          //   'sergas_customer_mobile_number',
          //   "971" + this.state.mobileNumber
          // )

        } else if (cotractsResult && cotractsResult.content && cotractsResult.content.STATUS == "FAILURE" && cotractsResult.content.MSG == "NO USER FOUND") {
          this.setState({
            showToast: true,
            toastMessage: "Your mobile number is not registered with us",
          });
          setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
          }, 5000);
        } else {
          this.setState({
            showToast: true,
            toastMessage: "Something went wrong",
          });
          setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
          }, 5000);
        }
      })

    }
    if (this.state.getUserDetailsCalled && getUserDetailsResult) {
      this.setState({
        getUserDetailsCalled: false
      }, () => {
        if (getUserDetailsResult && getUserDetailsResult.content && getUserDetailsResult.content.USER_ID) {
          //console.log('pass  ', getUserDetailsResult);
          this.setState({
            extuserdetails: {
              mobile: getUserDetailsResult.content.ID,
              extuuid: getUserDetailsResult.content.uuid,
            }
          }, async () => {
            // Use updated state here
            // console.log('extuserdetails  ', this.state.extuserdetails);
            // console.log('newuuid  ', this.state.newuuid);
            // console.log('extuuid  ', this.state.extuserdetails.extuuid);
            // console.log('uaepassmobileNumber  ', this.state.uaepassmobileNumber);
            // console.log('mobile  ', this.state.extuserdetails.mobile);
            // console.log('devicelog   ', this.state.LoginDeviceLog);
            if (this.state.uaepassmobileNumber === this.state.extuserdetails.mobile && this.state.newuuid === this.state.extuserdetails.extuuid) {
              // Direct login process here
              await postLoginDeviceLog(this.state.LoginDeviceLog);
              await AsyncStorage.setItem("sergas_customer_login_flag", "true");
              this.setState({
                mobileNumber: ''
              })
              //console.log('B',this.state.LoginDeviceLog)
              console.log('A')

              this.props.navigation.navigate("HomeBase");
            } else {
              const { LoginDeviceLog } = this.state;
              //console.log('A',this.state.LoginDeviceLog)
              console.log('B')

              this.props.navigation.navigate("ECPLOption", { LoginDeviceLog });
            }
          });
        } else {
          // Handle the case where getUserDetailsResult does not have the expected content
        }
      });
    }

    if (this.state.apiCallFlags.registerCalled) {
      if (registerResult && registerResult.content == "SUCESS") {
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ registerCalled: false, loginCalled: true } },
          scanEid: true
        }, () => this.getAuthenticationToken(this.state.mobileNumber));

      } else {

        let registerRequest = {
          Email: "971" + this.state.mobileNumber + "@mobapp.com",
          Password: "Test@123",
          ConfirmPassword: "Test@123"
        }
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ registerCalled: true } }
        })
        this.props.register(registerRequest)
      }
    }

    if (this.state.apiCallFlags.checkTermsCalled) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ checkTermsCalled: false } }
      }, async () => {
        if (checkTermsResult && checkTermsResult.content && checkTermsResult.content.STATUS == "User Found") {
          if (checkTermsResult.content.MSG == "true") {
            await AsyncStorage.setItem(
              'sergas_customer_mobile_number',
              "971" + this.state.mobileNumber
            );

            if (this.state.mobileNumber == "507867747" || this.state.mobileNumber == "506327735") {

              await AsyncStorage.setItem("sergas_customer_login_flag", "true");
              if (this.state.scanEid) {
                this.props.navigation.navigate("OcrTest", { fromOtp: true });
              } else {
                this.props.navigation.navigate("HomeBase");
              }
            } else if (this.state.loginThroughUaePass) {
              this.handleUaePassLoginSuccess();
            } else {
              this.props.navigation.navigate("Otp", { mobileNumber: "971" + this.state.mobileNumber, scanEid: this.state.scanEid });
            }

          } else {
            this.setState({ showTermsModal: true });
          }
        } else {
          this.setState({
            showToast: true,
            toastMessage: "Something went wrong",
          });
          setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
          }, 5000);
        }
      });
    }


    if (this.state.apiCallFlags.updateTermsCalled) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ updateTermsCalled: false } }
      }, async () => {
        if (updateTermsResult && updateTermsResult.content && updateTermsResult.content.STATUS == "SUCCESS") {

          await AsyncStorage.setItem(
            'sergas_customer_mobile_number',
            "971" + this.state.mobileNumber
          );

          if (this.state.mobileNumber == "507867747" || this.state.mobileNumber == "506327735") {
            await AsyncStorage.setItem("sergas_customer_login_flag", "true");
            if (this.state.scanEid) {
              this.props.navigation.navigate("OcrTest", { fromOtp: true });
            } else {
              this.props.navigation.navigate("HomeBase");
            }
          } else if (this.state.loginThroughUaePass) {
            this.handleUaePassLoginSuccess();
          } else {
            this.props.navigation.navigate("Otp", { mobileNumber: "971" + this.state.mobileNumber, scanEid: this.state.scanEid });
          }

        } else {
          this.setState({
            showToast: true,
            toastMessage: "Something went wrong",
          });
          setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
          }, 5000);
        }
      });
    }


    if (this.state.apiCallFlags.loginCalled) {

    }

  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleUaePassLoginSuccess = async () => {
    // do the code here
    //this.postLoginDeviceLog(this.state.LoginDeviceLog);
    this.setState({
      getUserDetailsCalled: true,
      mobileNumber: await AsyncStorage.getItem("sergas_customer_mobile_number")
    }, () => {
      this.props.getUserDetails({ "mobile": this.state.uaepassmobileNumber })
    })
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

  uaepasslogin = async () => {
    try {
      const configData = await UAEPassConfig();
      const response = await UAEPass.login(configData);
      if (response && response.accessCode) {
        const userDetails = await getAccessToken(response.accessCode);

        await AsyncStorage.setItem('sergas_customer_uuid', userDetails.uuid)
        const userDetails2 = await CheckUserbyuuid(userDetails.uuid);

        // Check if userDetails2 and its ID property exist, otherwise fallback to userDetails.mobile
        const mobileNumber = userDetails2 && userDetails2.ID ? userDetails2.ID : userDetails.mobile;

        this.setState({
          uaepassmobileNumber: mobileNumber,
          newuuid: userDetails.uuid
        });

        this.setState({
          mobileNumber: mobileNumber.replace('971', ''),
          loginThroughUaePass: true,
          apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: true } }
        })
        this.props.getAllContractsWithoutOtp({
          MobileNumber: mobileNumber
        })
        //if (isMobileInDatabase) {

        this.setState({
          LoginDeviceLog: {
            user_id: await AsyncStorage.getItem("sergas_customer_user_id"),
            phone: this.state.uaepassmobileNumber,
            device_id: await DeviceInfo.getUniqueId(),
            device_ip: await DeviceInfo.getIpAddress(),
            device_type: userDetails.userType,
            device_virtual: await DeviceInfo.isEmulator(),
            device_model: DeviceInfo.getModel(),
            device_name: await DeviceInfo.getDeviceName(),
            device_manufacturer: await DeviceInfo.getManufacturer(),
            device_platform: DeviceInfo.getSystemName(),
            os_version: DeviceInfo.getSystemVersion(),
            browser: 'UAEPASS',
            login_type: 'DIRECT',
            uuid: userDetails.uuid,
            status: '1',
            remark: 'LOGIN',

          }
        }, () => {

        });

      }
    } catch (e) {
      console.error('Error during login:', e);
      this.setState({ showUAEPASSCancelModal: true })
    }
  };

  handleSendOtp = () => {
    if (this.state.mobileNumber.trim() !== '') {
      if (this.state.mobileNumber.trim().split("").length != 9) {
        this.setState({
          showToast: true,
          toastMessage: "Please enter valid mobile number",
        });
        setTimeout(() => {
          this.setState({ showToast: false, toastMessage: "" });
        }, 5000);
      } else {
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: true } }
        })
        this.props.getAllContracts({
          MobileNumber: "971" + this.state.mobileNumber
        })
      }
    } else {
      this.setState({
        showToast: true,
        toastMessage: "Please enter Mobile Number",
      });
      setTimeout(() => {
        this.setState({ showToast: false, toastMessage: "" });
      }, 5000);
    }
  }

  handleMobileNumberField = (value) => {
    this.setState({
      mobileNumber: value
    })
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
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ loginCalled: false } }
        })
        return res.json()
      }).then(async resData => {
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ loginCalled: false } }
        })
        if (resData && resData.access_token) {
          await AsyncStorage.setItem(
            'sergas_customer_access_token',
            resData.access_token,
            /**
             * TODO - Change to Otp for Production
             */
            // () => this.props.navigation.navigate("Otp", {mobileNumber: this.state.mobileNumber})
            () => {
              this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ checkTermsCalled: true } }
              })
              this.props.checkTerms({ MobileNumber: "971" + mobileNumber })
              // this.props.navigation.navigate("HomeBase", {mobileNumber: this.state.mobileNumber})
            }
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
      .catch(err => {
        this.setState({
          apiCallFlags: { ...this.state.apiCallFlags, ...{ loginCalled: false } }
        })
        this.setState({
          showToast: true,
          toastMessage: "Something went wrong, Please try again later",
        });
        setTimeout(() => {
          this.setState({ showToast: false, toastMessage: "" });
        }, 5000);
      })
  }

  render() {
    const { getAllContractsCalled, checkTermsCalled, registerCalled, updateTermsCalled, loginCalled } = this.state.apiCallFlags
    // return (
    //   <WebView source={{uri: "https://stg-id.uaepass.ae/idshub/authorize?acr_values=urn%3Adigitalid%3Aauthentication%3Aflow%3Amobileondevice&client_id=sandbox_stage&redirect_uri=https%3A%2F%2Fstg-selfcare.uaepass.ae&response_type=code&scope=urn%3Auae%3Adigitalid%3Aprofile%3Ageneral&state=ShNP22hyl1jUU2RGjTRkpg%3D%3D"}}
    //   // <WebView source={{uri: "uaepassstg://digitalid-users-ids/signatures/HPR17nOsAZissZm02WIm?successurl=sergas_customer:///resume_authn?url=https%3A%2F%2Fstg-ids.uaepass.ae%2Fauthenticationendpoint%2FmobileWaiting.jsp%3Fstatus%3Dsuccess%26sessionDataKey%3D75f9ca05-1459-465e-a623-18075fb0af02%26relyingParty%3Dsandbox_stage&failureurl=sergas_customer:///resume_authn?url=https%3A%2F%2Fstg-ids.uaepass.ae%2Fauthenticationendpoint%2FmobileWaiting.jsp%3Fstatus%3Dfailure%26sessionDataKey%3D75f9ca05-1459-465e-a623-18075fb0af02%26relyingParty%3Dsandbox_stage"}}
    //   onMessage={msg => {}}
    //   onNavigationStateChange={test => {
    //     // Linking.openURL(test.url)
    //   originWhitelist={["https://*","uaepass://*"]}
    //   allowFileAccess={true}
    // domStorageEnabled={true}
    // javaScriptEnabled={true}
    // geolocationEnabled={true}
    // saveFormDataDisabled={true}
    // allowFileAccessFromFileURLS={true}
    // allowUniversalAccessFromFileURLs={true}
    // setSupportMultipleWindows={true}
    // bounces={false}
    //   style={{flex: 1}} />
    // )
    return (
      <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >
      <SafeAreaView style={{ height: "100%", flex: 1 }} >

      <View style={{ flexDirection: "row", }}>
              <View style={styles.headerCol1}>
                  <TouchableOpacity style={{ margin: 20 }} onPress={() => {
                      if (this.state.step > 1) {
                          this.setState({ step: this.state.step - 1 })
                      } else {
                          this.props.navigation.goBack()
                      }
                  }}>
                       <XIcon color={"#FFFFFF"}/>
                  </TouchableOpacity>
                 
              </View>
          </View>

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
              contentContainerStyle={styles.scrollView}
            >
              <View style={styles.imageView}>
                {/* <Image
                  source={require("../../../assets/images/sergas_logo.png")}
                  style={styles.goodieeLogoImage} /> */}
                  <LogoIcon />
              </View>
              <View style={styles.cardView} >
                <View style={{ ...styles.cardHeader, marginVertical: 0 }}>
                  {/* <Text style={styles.cardHeaderText}>{t("login.loginUsing")}</Text> */}
                  <Text style={styles.cardHeaderText}>Welcome</Text>
                </View>
                <View style={{ ...styles.cardHeader, marginTop: 0 }}>
                  <Text style={styles.cardHeaderText}>{t("login.loginToYourAccount")}</Text>
                </View>

                {/* <View style={styles.inputGroupStyle}>

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
                        style={{
                          width: "100%",
                          fontSize: 18,
                          color: 'white',
                          paddingBottom: Platform.OS === 'ios' ? 10 : 4,
                        }}
                        placeholder={"5XX XXX XXX"}
                        placeholderTextColor="#828E92"
                        keyboardType={"numeric"}
                        value={this.state.mobileNumber}
                        onChangeText={this.handleMobileNumberField}
                      />
                    </View>
                  </View>
                </View> */}


                <View style={styles.inputGroupStyle}>
                  <View style={styles.inputRow}>
                    <Image
                      source={require("../../../assets/images/ae.png")}
                      style={styles.flagIcon}
                    />
                    
                    <Text style={styles.countryCode}>+971</Text>
                    {/* <TextInput
                      style={styles.textInput}
                      placeholder={"50 1234567"}
                      placeholderTextColor="#828E92"
                      keyboardType={"numeric"}
                      value={this.state.mobileNumber}
                      onChangeText={this.handleMobileNumberField}
                      underlineColorAndroid="transparent" // ⬅️ This line is critical on Android
                    /> */}

                    <AppTextInput
                      Placeholder="50 1234567"
                      Value={this.state.mobileNumber}
                      OnChange={this.handleMobileNumberField}
                      Type="numeric"
                      Editable={true}
                      Style={{
                        // backgroundColor: 'rgba(255,255,255,0.06)', // ✅ to match screenshot
                        color: '#FFFFFF',
                        fontSize: 15,
                        fontWeight: "700",
                        marginTop:4
                        // paddingVertical: Platform.OS === 'ios' ? 10 : 10,
                      }}
                    />



                  </View>
                </View>


                <View style={styles.buttonView}>
                  <TouchableOpacity
                    disabled={getAllContractsCalled || registerCalled || checkTermsCalled || updateTermsCalled || loginCalled}
                    onPress={this.handleSendOtp}
                    style={styles.buttonStyle}
                  >
                    {
                      (getAllContractsCalled || registerCalled || checkTermsCalled || updateTermsCalled || loginCalled) ?
                        <ActivityIndicator size='small' color='white' /> :
                        <Text
                          style={styles.buttonLabelStyle}>{t("login.sendOtp")}</Text>
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.registerButtonStyle}>
                <View style={styles.registerHereView}>
                  <Text style={styles.inlineRegisterText}>
                    Don’t have an account? <Text style={styles.registerLinkText}>REGISTER</Text>
                  </Text>
                </View>
              </View>

              {
                this.state.UAEPASSSupported ?
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>

                    {/* <Text style={styles.uaepassorText}>OR</Text> */}
                    <View style={styles.dividerContainer}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>Or Login with</Text>
                      <View style={styles.dividerLine} />
                    </View>
                    <TouchableOpacity
                      disabled={getAllContractsCalled || registerCalled || checkTermsCalled || updateTermsCalled || loginCalled}
                      onPress={this.uaepasslogin}
                    >
                      {
                        (getAllContractsCalled || registerCalled || checkTermsCalled || updateTermsCalled || loginCalled) ?
                          <ActivityIndicator size='small' color='white' /> :

                          <View style={styles.imageView}>
                            <Image
                              source={require('../../../assets/images/UAEPASS_Login_Btn.png')}
                              style={styles.buttonuaepassStyle} />
                          </View>
                      }
                    </TouchableOpacity>



                  </View>
                  : null
              }
            </ScrollView>
            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis convallis convallis tellus id interdum velit. Tellus rutrum tellus pellentesQUESTION eu. Fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean. Duis ultricies lacus sed turpis tincidunt. Sed euismod nisi porta lorem mollis aliquam ut porttitor. Et malesuada fames ac turpis egestas sed tempus. Aenean pharetra magna ac placerat vestibulum lectus. Malesuada fames ac turpis egestas. Senectus et netus et malesuada fames. Eu non diam phasellus vestibulum. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Rhoncus urna neQUESTION viverra justo nec ultrices. Luctus venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. */}
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
          </KeyboardAwareScrollView>
          {/* </InfoContainer> */}
        {/* </ImageBackground> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(Login, {
  methods: {
    register: {
      type: 'post',
      moduleName: 'api/Account',
      url: 'Register',
      authentication: false
    },
    LoginDevice: {
      type: 'post',
      moduleName: 'api',
      url: 'PostInsertLoginDevice',
      authentication: true
    },
    getAllContracts: {
      type: 'get',
      moduleName: 'api',// 'goodiee-cataloguecore',
      url: 'initialLogin',
      authenticate: false,
    },
    getAllContractsWithoutOtp: {
      type: 'get',
      moduleName: 'api',
      url: 'getContractsByMobile',
      authenticate: false,
    },
    getUserDetails: {
      type: 'get',
      moduleName: 'api',
      url: 'getMobileUserDetails',
      authenticate: true,
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
}))