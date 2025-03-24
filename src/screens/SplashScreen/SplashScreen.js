
import styles from './SplashScreenStyles'

import React, { Component } from 'react'
import { View, Text, Image, Platform, PermissionsAndroid,ImageBackground, ActivityIndicator } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextInputControl from '../../controls/TextInput'
import PropTypes from 'prop-types'
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { API_PATH } from '../../services/api/data/data/api-utils';
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import { updateUserDetails } from '../../stores/actions/user.action';
import { CheckLoginByMobile } from '../../utils/uaePassService';

class SplashScreen extends Component {
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
        getAllContractsCalledSplash: false
      },
      getUserDetailsCalled: false
    }
  }

  async componentDidMount() {
    // RNLocalize.addEventListener("change", this.handleLocalizationChange);

    if (Platform.OS == "android") {
      if (!await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "SERGAS Customer App Camera Permission",
            message:
              "SERGAS Customer App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
      }
    }


    let access_token = await AsyncStorage.getItem("sergas_customer_mobile_number")
    let loginCheck = await AsyncStorage.getItem("sergas_customer_login_flag")
    await AsyncStorage.setItem("sergas_customer_active_contract_index", "0") 
    if (((access_token != null) || (access_token != undefined)) && ((loginCheck != null) && (loginCheck != undefined)  && (loginCheck == "true"))) {
      
      this.setState({
        getUserDetailsCalled: true,
        apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalledSplash: true } }
      }, async () => {
        this.props.getAllContracts({
          MobileNumber: await AsyncStorage.getItem('sergas_customer_mobile_number')
        })
        this.props.getUserDetails({ "mobile": await AsyncStorage.getItem('sergas_customer_mobile_number') })
      })
      setTimeout(async () => {
        const mobileNumber = await AsyncStorage.getItem('sergas_customer_mobile_number');
        const userLog = await CheckLoginByMobile(mobileNumber);
        if (!userLog || !userLog.device_id) {
          await AsyncStorage.clear();
          this.props.navigation.navigate('Login');
        } else {
          this.props.navigation.navigate('HomeBase');
        }

      }, 4000)
    } else {
      setTimeout(() => {
        this.props.navigation.navigate('Login')
      }, 4000)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { getAllContractsResult, getUserDetailsResult } = nextProps
    if (this.state.apiCallFlags.getAllContractsCalledSplash && (getAllContractsResult && getAllContractsResult.content )) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalledSplash: false } }
      }, async () => {
        if (getAllContractsResult && getAllContractsResult.content && getAllContractsResult.content.STATUS == "SUCCESS") {

          await AsyncStorage.setItem(
            'contract_list',
            JSON.stringify(getAllContractsResult.content.DETAIL)
          )
          this.props.updateContracts(getAllContractsResult.content.DETAIL)

          this.getAuthenticationToken(await AsyncStorage.getItem('sergas_customer_mobile_number'))

          const mobileNumber = await AsyncStorage.getItem('sergas_customer_mobile_number');
        const userLog = await CheckLoginByMobile(mobileNumber);
        if (!userLog || !userLog.device_id) {
          AsyncStorage.multiRemove([
            'sergas_customer_mobile_number',
            'contract_list',
            'sergas_customer_access_token',
            'sergas_customer_login_flag',
            'sergas_customer_user_id'
            ,'extuuid'
            ,'loginThroughUaePass'
        ], () => {
            // Update the contracts and navigate to Login screen
            this.props.updateContracts([]);
            this.props.navigation.navigate('Login');
        });
        } else {
          this.props.navigation.navigate('HomeBase');
        }

          // setTimeout(() => {
            
          // }, 4000)
        }
      })

    }

    if (this.state.getUserDetailsCalled && (getUserDetailsResult && getUserDetailsResult.content )) {
      this.setState({
          getUserDetailsCalled: false
      }, () => {
          if (getUserDetailsResult && getUserDetailsResult.content && getUserDetailsResult.content.USER_ID) {
              this.props.updateUserDetails(getUserDetailsResult.content)
          } else {

          }
      })
  }
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  getAuthenticationToken = (mobileNumber) => {

    var details = {
      'userName': mobileNumber + "@mobapp.com",
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
      await AsyncStorage.setItem(
        'sergas_customer_access_token',
        resData.access_token,)
    } else {
      // this.setState({
      //   showToast: true,
      //   toastMessage: "Something went wrong, Please try again later",
      // });
      // setTimeout(() => {
      //   this.setState({ showToast: false, toastMessage: "" });
      // }, 5000);
    }
  })
  .catch(err => {})
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

  render() {
    // return (
    //   <View
    //     style={styles.viewView}>
    //       <Image
    //                 source={require('../../../assets/images/splashHeader.png')}
    //                 style={{
    //                   // height: 192.35,
    //                   width: "75%",
    //                   position: 'absolute',
    //                   alignSelf: 'flex-start',
    //                   top: 0,
    //                   zIndex: -1,
    //                   resizeMode: 'stretch'
    //                 }}
    //                 />
    //     <Image
    //       source={require("../../../assets/images/sergas_logo.png")}
    //       style={styles.goodieeLogoImage} />
    //       <ImageBackground
    //                     source={require("../../../assets/images/loading.gif")}
    //                     style={{ width: 60, height: 60, position: 'absolute',
    //                     alignSelf: 'flex-end',
    //                     bottom: 0,
    //                     zIndex: -1,
    //                     resizeMode: 'stretch',paddingRight: 20}}
    //                   />
    //     <Image
    //                 source={require('../../../assets/images/splashFooter.png')}
    //                 style={{
    //                   // height: 192.35,
    //                   width: "100%",
    //                   position: 'absolute',
    //                   alignSelf: 'flex-end',
    //                   bottom: 0,
    //                   zIndex: -1,
    //                   resizeMode: 'stretch'
    //                 }}
    //                 />
                    
    //   </View>
    // )

    return (
      <>
          <Image
                    source={require('../../../assets/images/gifgit.gif')}
                    style={{...{
                      height: "100%",
                      width: "100%",
                      position: 'absolute',
                      alignSelf: 'flex-start',
                      top: 0,
                      zIndex: -1,
                      resizeMode: 'stretch'
                    },...styles.viewView}}
                    />
                    {/* <Image
                    source={require('../../../assets/images/loading.gif')}
                    style={{bottom: 20, position: "absolute", height: 40, resizeMode: "center", alignSelf: "center"}}
                    /> */}
                    <ActivityIndicator size="small" color="#FFFFFF"
                    style={{bottom: 20, position: "absolute", height: 40, resizeMode: "center", alignSelf: "center"}}
                    />
                    </>
                    )
  }

}

const mapStateToProps = ({contractsReducer, userReducer}) => {
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

export default connect(mapStateToProps,mapDispatchToProps) (withApiConnector(SplashScreen, {
  methods: {
    getAllContracts: {
      type: 'get',
      moduleName: 'api',// 'goodiee-cataloguecore',
      url: 'getContractsByMobile',
      authenticate: false,
    },
    getUserDetails: {
        type: 'get',
        moduleName: 'api',
        url: 'getMobileUserDetails',
        authenticate: true,
    },
  }
}))



