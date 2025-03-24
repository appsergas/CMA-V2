
import styles from './ProfileEditStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, Dimensions, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import RNTextDetector from "rn-text-detector";
// import MlkitOcr from 'react-native-mlkit-ocr';
import Toast from '../../controls/Toast'
import Modal from '../../controls/Modal'
import Picker from "../../controls/Picker";
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
// import TesseractOcr, { LANG_ENGLISH, LEVEL_WORD, LANG_CUSTOM } from 'react-native-tesseract-ocr';



class ProfileEdit extends Component {
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
      emiratesIdNumber: "",
      emiratesIdFront: null,
      tenancyContractFront: null,
      fullName: "",
      plotNo: "",
      tenancyContractNo: "",
      flatNo: "",
      emirate: "",
      apiCallFlags: {
        requestConnectionApiCalled: false,
        getAllContractsCalled: false
      },
      showToast: false,
      toastMessage: "",
      showImageModal: false,
      currentImageUri: null,
      currentImageType: "",
      showPickerModal: false,
      showHelpModal: false,
      helpImageUrl: "",
      selectedEmirate: "",
      pickerEmirateData: [
        { "id": "1", "label": "Abu Dhabi", "value": "Abu Dhabi" },
        { "id": "2", "label": "Dubai", "value": "Dubai" },
        { "id": "3", "label": "Fujairah", "value": "Fujairah" }
      ]
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
    const { requestNewConnectionResult, getAllContractsResult } = nextProps
    if (this.state.apiCallFlags.requestConnectionApiCalled) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ requestConnectionApiCalled: false } }
      }, () => {
        if (requestNewConnectionResult && requestNewConnectionResult.content && (requestNewConnectionResult.content.MSG == "1|SUCESS")) {
          this.toastIt("Username updated successfully")
          this.setState({
            apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: true } }
          }, () => {
            this.props.getAllContracts({
              MobileNumber: this.props.contracts[this.state.activeItemIndex].MOBILE
            })
          })
        } else {
          this.toastIt("Something went wrong, please try again later")
        }
      })
    }

    if (this.state.apiCallFlags.getAllContractsCalled) {
      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: false } }
      }, async () => {
        if (getAllContractsResult && getAllContractsResult.content && getAllContractsResult.content.STATUS == "SUCCESS") {

          await AsyncStorage.setItem(
            'contract_list',
            JSON.stringify(getAllContractsResult.content.DETAIL)
          )
          this.props.updateContracts(getAllContractsResult.content.DETAIL)

          //   setTimeout(() => {
          //     this.forceUpdate();
          //   }, 5000)
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


  handleSubmit = () => {
    const { activeItemIndex, fullName } = this.state
    if (fullName.trim() == "") {
      this.toastIt("Enter all the fields")
    } else {
      let reqBody = {
        "CONTRACT_NO": this.props.contracts[activeItemIndex].CONTRACT_NO,
        "COMPANY": this.props.contracts[activeItemIndex].COMPANY,
        "PARTY_NAME": fullName
      }

      this.setState({
        apiCallFlags: { ...this.state.apiCallFlags, ...{ requestConnectionApiCalled: true } }
      }, () => this.props.requestNewConnection(reqBody))
    }
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

  carouselCurrentItem = (currentItemIndex) => {
    this.setState({ activeItemIndex: currentItemIndex })
  }

  render() {
    return (
      <SafeAreaView style={{
        backgroundColor: '#FFFFFF',
        flex: 1,
      }} >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0)",
            // alignItems: 'center'
          }}
          enabled
        >
          <Image
            style={{
              width: "100%",
              zIndex: 1,
              backgroundColor: "transparent",
              position: 'absolute'
            }}
            source={require("../../../assets/images/miniHeader.png")}
          />
          <View style={styles.headerView}>
            <View style={{ flexDirection: "row", }}>
              <View style={styles.headerCol1}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ flexDirection: 'row', alignItems: "center" }}>
                    <Image style={{
                      height: 12.26,
                      width: 6.44, resizeMode: 'stretch', marginRight: 5
                    }}
                      source={require("../../../assets/images/back.png")}
                    />
                    <Text style={{
                      fontFamily: "Tajawal-Medium",
                      fontSize: 13,
                      color: "#FFFFFF"
                    }}>{t("home.back")}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.pageHeader}>{t("pages.editProfile")}</Text>
              </View>
              <View style={styles.headerCol2}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('My Links', { screen: 'myAccounts' })}>
                  <Image
                    source={require("../../../assets/images/profile.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>

            <HomeMainCard
              contracts={this.props.contracts}
              from="raiseComplaint"
              usageCharges={1234}
              userName="User NameX"
              accountNumber="YYYY XXXX YYYY XXXX"
              currentIndex={this.carouselCurrentItem}
            />

            <View style={styles.cardView} >
              <View style={styles.inputGroupStyle}>
                <View>
                  <Text style={styles.inputLabelStyle}>{t("home.fullName")}</Text>
                </View>
                <View>
                  <TextInput
                    Value={this.state.fullName}
                    OnChange={(value) => {
                      this.setState({ fullName: value })
                    }}
                    Style={{ borderColor: "#848484" }}
                  />
                </View>
              </View>




            </View>

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.handleSubmit}
            >
              <Text
                style={styles.buttonLabelStyle}>{t("home.submit")}</Text>
            </TouchableOpacity>

          </ScrollView>
          {this.state.showToast ? (
            <Toast message={this.state.toastMessage} isImageShow={false} />
          ) : null}
        </KeyboardAvoidingView>
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(ProfileEdit, {
  methods: {
    requestNewConnection: {
      type: 'post',
      moduleName: 'api',
      url: 'updateUserName',
      authenticate: true,
    },
    getAllContracts: {
      type: 'get',
      moduleName: 'api',// 'goodiee-cataloguecore',
      url: 'getContractsByMobile',
      authenticate: false,
    },
  }
})
)



