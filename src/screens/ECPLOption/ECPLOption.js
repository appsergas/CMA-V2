import Mainstyles from '../../styles/globalStyles'
import styles from './ECPLOptionStyles'

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
import { UAEPassConfig } from '../../utils/permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import { login, logout, register, getUserDetails, getAccessToken, postLoginDeviceLog } from '../../utils/uaePassService';
import DeviceInfo from 'react-native-device-info';
import { commonGradient } from '../../components/molecules/gradientStyles';
import { LogoIcon, XIcon } from '../../../assets/icons'
import LinearGradient from 'react-native-linear-gradient';
var qs = require('qs');


class ECPLOption extends React.Component {
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
      mobileNumber: '',
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

  onclickNO = async () => {
    try {
      const { LoginDeviceLog } = this.props.route.params;

      LoginDeviceLog.user_id = await AsyncStorage.getItem("sergas_customer_user_id");
      LoginDeviceLog.browser = 'UAEPASS';
      LoginDeviceLog.login_type = 'SIGNUP';
      //console.log( 'New Page',LoginDeviceLog)
      await postLoginDeviceLog(LoginDeviceLog);
      await AsyncStorage.setItem("sergas_customer_login_flag", "true");
      this.props.navigation.navigate("HomeBase");

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

  onclickYES = async () => {
    try {
      this.setState({
        LoginDeviceLog: {
          user_id: await AsyncStorage.getItem("sergas_customer_user_id"),
          browser: 'UAEPASS',
          login_type: 'LINKING',
          status: '1',
          remark: 'LOGIN',

        }
      }, () => {

      });
      const { LoginDeviceLog } = this.props.route.params;
      //console.log('ECPL 1',LoginDeviceLog)
      //await postLoginDeviceLog(LoginDeviceLog);
      this.props.navigation.navigate("ECPLinking", { LoginDeviceLog });
      //await AsyncStorage.setItem("sergas_customer_login_flag", "true");
      //this.props.navigation.navigate("ECPLinking");

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
                {/* <XIcon color={"#FFFFFF"} /> */}
              </TouchableOpacity>

            </View>
          </View>

          {/* <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
        <ImageBackground source={Images.TransparentBackground} style={{ height: Dimensions.HP_100, width: Dimensions.WP_100 }} resizeMode={'cover'}>
          <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Dimensions.HP_90, }}>
          */}
          <KeyboardAwareScrollView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
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
                  <Text style={styles.cardHeaderText}>UAE PASS - SERGAS Customer Profile Linking</Text>
                </View>
                <View style={{ ...styles.cardHeader, marginTop: 0 }}>
                  <Text style={styles.cardPerText}>Do you have an online account with SERGAS Customer ?</Text>
                </View>

                <View style={styles.buttonView}>
                  <TouchableOpacity
                    disabled={getAllContractsCalled || registerCalled || checkTermsCalled || updateTermsCalled || loginCalled}
                    onPress={this.onclickYES}
                    style={styles.buttonStyle}
                  >
                    {
                      (getAllContractsCalled || registerCalled || checkTermsCalled || updateTermsCalled || loginCalled) ?
                        <ActivityIndicator size='small' color='white' /> :

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {/* <Icon name="checkmark-circle" style={styles.TitleIconT} /> */}
                          <Text style={styles.buttonLabelStyle}>Yes *</Text>
                        </View>
                    }
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={getAllContractsCalled || registerCalled || checkTermsCalled || updateTermsCalled || loginCalled}
                    onPress={this.onclickNO}
                    style={styles.buttonStyle}
                  >
                    {
                      (getAllContractsCalled || registerCalled || checkTermsCalled || updateTermsCalled || loginCalled) ?
                        <ActivityIndicator size='small' color='white' /> :

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {/* <Icon name="close-circle" style={styles.TitleIconF} /> */}
                          <Text style={styles.buttonLabelStyle}>No **</Text>
                        </View>
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.container}>

                <View style={styles.instructionsContainer}>

                  <View style={styles.bulletPointView}>
                    <Text style={styles.bulletPointText}>* Your UAE PASS account will be linked to your existing SERGAS Customer Profile</Text>
                    <Text style={styles.bulletPointText}>** Your SERGAS Customer Profile will be established based on the UAE PASS account</Text>
                  </View>
                </View>

                <View style={styles.noteContainer}>
                  <View style={styles.bulletPointView}>
                    <Text style={styles.bulletPointText}>Note: This is a one time process, your future login's through UAE PASS will be seamless</Text>
                  </View>
                </View>

              </View>

            </ScrollView>

          </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(ECPLOption, {
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
    getAllContracts: {
      type: 'get',
      moduleName: 'api',// 'goodiee-cataloguecore',
      url: 'initialLogin',
      authenticate: false,
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



