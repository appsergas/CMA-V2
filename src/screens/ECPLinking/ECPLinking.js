
import styles from './ECPLinkingStyles'

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
import { UAEPass } from 'react-native-uaepass';
import  { UAEPassConfig }  from '../../utils/permissions';
import { postLoginDeviceLog } from '../../utils/uaePassService';

var qs = require('qs');




class ECPLinking extends Component {
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
        loginCalled: false,
        registerCalled: false,
        checkTermsCalled: false,
        updateTermsCalled: false
      },
      mobileNumber: this.props.route.params.LoginDeviceLog.phone.replace('971', ''),
      showToast: false,
      toastMessage: "",
      showTermsModal: false,
      scanEid: false,
      LoginDeviceLog: "",
    }
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

  componentWillReceiveProps(nextProps) {
    const { getAllContractsResult, registerResult, loginResult, checkTermsResult, updateTermsResult } = nextProps

    if (this.state.apiCallFlags.getAllContractsCalled) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: false } }
      }, async () => {
        if (getAllContractsResult && getAllContractsResult.content && getAllContractsResult.content.STATUS == "SUCCESS") {
          await AsyncStorage.setItem("sergas_customer_user_id", getAllContractsResult.content.ERRORCODE)
          let registerRequest = {
            Email: "971" + this.state.mobileNumber + "@mobapp.com",
            Password: "Test@123",
            ConfirmPassword: "Test@123"
          }
          if (getAllContractsResult.content.MSG == "CONTRACTS SAVED AGAINST MOBILE USER") {

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
            JSON.stringify(getAllContractsResult.content.DETAIL)
          )
          this.props.updateContracts(getAllContractsResult.content.DETAIL)
          // await AsyncStorage.setItem(
          //   'sergas_customer_mobile_number',
          //   "971" + this.state.mobileNumber
          // )

        } else if (getAllContractsResult && getAllContractsResult.content && getAllContractsResult.content.STATUS == "FAILURE" && getAllContractsResult.content.MSG == "NO USER FOUND") {
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
            )
            const { LoginDeviceLog } = this.props.route.params;
            LoginDeviceLog.user_id = await AsyncStorage.getItem("sergas_customer_user_id");
            LoginDeviceLog.browser = 'UAEPASS';
            LoginDeviceLog.login_type = 'LINKING';
            LoginDeviceLog.phone = await AsyncStorage.getItem("sergas_customer_mobile_number");
            await postLoginDeviceLog(LoginDeviceLog);

            //this.props.navigation.navigate("Otp", { LoginDeviceLog:this.props.route.params ,mobileNumber: "971"+this.state.mobileNumber, scanEid: this.state.scanEid});
            this.props.navigation.navigate("Otp", { mobileNumber: "971" + this.state.mobileNumber, scanEid: this.state.scanEid })
          } else {
            this.setState({ showTermsModal: true })
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
      })
    }

    if (this.state.apiCallFlags.updateTermsCalled) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ updateTermsCalled: false } }
      }, async () => {
        if (updateTermsResult && updateTermsResult.content && updateTermsResult.content.STATUS == "SUCCESS") {
          await AsyncStorage.setItem(
            'sergas_customer_mobile_number',
            "971" + this.state.mobileNumber
          )

          this.props.navigation.navigate("Otp", { mobileNumber: "971" + this.state.mobileNumber, scanEid: this.state.scanEid })
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

    if (this.state.apiCallFlags.loginCalled) {

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
  login = async () => {
    try {
      const configData = await UAEPassConfig();
      const response = await UAEPass.login(configData);
      if (response && response.accessCode) {
        setData(response);
        console.log('error', response);
      }
    } catch (e) {
      this.setState({
        showToast: true,
        toastMessage: "Error " + e,
      });
      setTimeout(() => {
        this.setState({ showToast: false, toastMessage: "" });
      }, 5000);
      console.log('error', e);
    }
  };

  logout = async () => {
    try {
      const response = await UAEPass.logout();
      setData(null);
    } catch (e) {
      console.log('error', e);
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
      <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >

        <ImageBackground source={Images.TransparentBackground} style={{ height: Dimensions.HP_100, width: Dimensions.WP_100 }} resizeMode={'cover'}>
          <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Dimensions.HP_90, }}>
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
                  <Image
                    source={require("../../../assets/images/sergas_logo.png")}
                    style={styles.goodieeLogoImage} />
                </View>
                <View style={styles.cardView} >
                  <View style={{ ...styles.cardHeader, marginVertical: 0 }}>
                    <Text style={styles.cardHeaderText}>UAE PASS - SERGAS Customer Profile Linking</Text>
                  </View>
                  <View style={{ ...styles.cardHeader, marginTop: 0 }}>
                    <Text style={styles.cardPerText}>( Login with your SERGAS Customer credentials )</Text>
                  </View>
                  <View style={styles.inputGroupStyle}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{
                        color: "#828E92",
                        fontFamily: "Tajawal-Regular",
                        fontSize: 20,
                        marginBottom: 15,
                        marginRight: 10
                      }}>+971</Text>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          style={{ width: "100%" }}
                          placeholder={"5XX XXX XXX"}
                          keyboardType={"numeric"}
                          value={this.state.mobileNumber}
                          onChangeText={val => this.handleMobileNumberField(val)}
                          editable={true} 
                        />
                      </View>

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
                            style={styles.buttonLabelStyle}>Link above account with UAE PASS</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.registerButtonStyle}>

                  <View style={styles.registerHereView}>
                    <Text
                      style={styles.notCustomerText}>{t("login.notCustomer")}</Text>
                  </View>
                  <View style={styles.notCustomerView}>
                    <TouchableOpacity
                      style={styles.payBillView}
                      onPress={() => this.props.navigation.navigate("RegisterUser")}

                    >
                      <Text style={styles.registerHereText}>
                        {t("login.registerHere")}!
                      </Text>

                    </TouchableOpacity>
                  </View>

                </View>
                <View style={styles.noteContainer}>
                  <View style={styles.bulletPointView}>
                    <Text style={styles.bulletPointText}>Note: This is a one time process, your future login's through UAE PASS will be seamless</Text>
                  </View>
                </View>


              </ScrollView>


            </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(ECPLinking, {
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



