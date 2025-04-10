import Mainstyles from '../../styles/globalStyles'
import styles from './RequestNewConnectionStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Switch, Linking, ImageBackground } from 'react-native'
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
import DatePicker from 'react-native-date-picker'
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
// import TesseractOcr, { LANG_ENGLISH, LEVEL_WORD, LANG_CUSTOM } from 'react-native-tesseract-ocr';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import CheckBox from 'react-native-check-box';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles';
import { ArrowIcon } from '../../../assets/icons'

import {
    paymentGatewayTokenApiUrl,
    abudhabiTestOutletReference,
    abudhabiOutletReference,
    dubaiTestOutletReference,
    dubaiOutletReference,
    fujairahTestOutletReference,
    fujairahOutletReference,
    paymentGatewayCreateOrderUrl,
    paymentApiKeyTest,
    paymentGatewayTokenApiUrlTest,
    paymentGatewayCreateOrderUrlTest,
    paymentApiKeyAUH,
    paymentApiKeyDXB,
    alainOutletReference,
    paymentApiKeyALN
} from '../../services/api/data/data/constants';
import {
    initiateCardPayment,
    initiateSamsungPay,
    initiateApplePay,
    isApplePaySupported,
    isSamsungPaySupported,

} from '@network-international/react-native-ngenius';
import axios from 'axios'
import { API_PATH } from '../../services/api/data/data/api-utils';
// import DeviceInfo from 'react-native-device-info';

var validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;


class RequestNewConnection extends Component {
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
            mobileNumber: "",
            existingDetails: null,
            contractList: [],
            activeItemIndex: 0,
            emiratesIdNumber: "",
            emiratesIdFront: null,
            tenancyContractFront: null,
            email: "",
            fullName: "",
            meterNo: "",
            meterBrand: "",
            plotNo: "",
            tenancyContractNo: "",
            flatNo: "",
            buildingCode: "",
            apartmentCode: "",
            noQR: false,
            noMeterNo: false,
            emirate: "",
            apiCallFlags: {
                requestConnectionApiCalled: false
            },
            getUserDetailsCalled: false,
            getQrDetailsCalled: false,
            getAvailableDatabaseCalled: false,
            getFeeDetailsCalled: false,
            makepaymentcalled: false,
            getMeterDetailsCalled: false,
            getAllContractsCalled: false,
            getBuildingFromPlotNoCalled: false,
            getVacantApartmentsCalled: false,
            showToast: false,
            toastMessage: "",
            showImageModal: false,
            currentImageUri: null,
            currentImageType: "",
            showPickerModal: false,
            showHelpModal: false,
            helpImageUrl: "",
            openQrScanner: false,
            selectedEmirate: "",
            pickerEmirateData: [
                { "id": "1", "label": "Abu Dhabi", "value": "ABU_DHABI" },
                { "id": "2", "label": "Dubai", "value": "DUBAI" },
                { "id": "3", "label": "Fujairah", "value": "FUJAIRAH" }
            ],
            pickerCompanyData: [],
            pickerBuildingData: [],
            pickerApartmentData: [],
            pickerBrandData: [],
            companyCode: 0,
            step: 1,
            paidConnection: true,
            showPaidModal: false,
            date: new Date().getHours() > 10 ? new Date(new Date().getTime() + (1 * 86400000)) : new Date(),
            feeDetails: {
                // "company": null,
                // "contractNo": null,
                // "email": "",
                // "mobileNumber": "",
                // "buildingCode": "B552",
                // "apartmentCode": "502",
                // "insuranceAmt": "0.000",
                // "depositAmt": "550.000",
                // "connectionAmt": "450.000",
                // "maintainanceAmt": "200",
                // "disconnectionAmt": "0.000",
                // "registrationAmt": "",
                // "unitPrice": "16.500",
                // "monthlyFee": "30.000",
                // "other1Amt": "100",
                // "other2Amt": "100",
                // "other3Amt": "",
                // "insuranceTaxPerc": "0.000",
                // "depositTaxPerc": "0.000",
                // "connectionTaxPerc": "5.000",
                // "maintainanceTaxPerc": "5.000",
                // "disconnectionTaxPerc": "5.000",
                // "registrationTaxPerc": "5.000",
                // "monthlyTaxPerc": "5.000",
                // "other1TaxPerc": "5.000",
                // "other2TaxPerc": "5.000",
                // "other3TaxPerc": "5.000"
            },
            terms: false,
            showModal: false,
            readingResult: "",
            updateEmiratesId: false,
            buildingTerms: "",
            showTermsModal: false,
            showMeterBrandList: false,
            getBnoAnoCalled: false,
            excludedConnectionModal: false,
            showPayModal: false,
            applePaySupported: false,
            samsungPaySupported: false,
            payMode: "",
            showBuildingSearch: false,
            showApartmentSearch: false
        }
        this.PaymentVisible()
        this.scrollView = React.createRef()
    }

    async componentWillMount() {
        console.log("inside willmount")
        let contracts = await AsyncStorage.getItem("contract_list")
        this.setState({
            contractList: [...JSON.parse(contracts)],
            getUserDetailsCalled: true,
            mobileNumber: await AsyncStorage.getItem("sergas_customer_mobile_number")
        }, () => {
            console.log("getUserDetails called")
            this.props.getUserDetails({ "mobile": this.state.mobileNumber })
        })
        if (Platform.OS == 'ios') {
            this.setState({
                applePaySupported: await isApplePaySupported(),
            })
        } else {
            this.setState({
                samsungPaySupported: await isSamsungPaySupported()
            })
        }
    }

    componentDidMount() {
        // Alert.alert(
        //     'OCR Data',
        //     "alertMsg"
        //     , [{
        //         text: 'Cancel',
        //         onPress: () => {},
        //         style: 'cancel'
        //     }, {
        //         text: 'OK',
        //         onPress: () => { }
        //     },], {
        //     cancelable: false
        // }
        // )
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        this.setState({
            getAvailableDatabaseCalled: true
        }, () => {
            this.props.getAvailableDatabase({})
        })
        this.navFocusListener = this.props.navigation.addListener('focus', async () => {
            this.setState({
                getUserDetailsCalled: true,
                mobileNumber: await AsyncStorage.getItem("sergas_customer_mobile_number")
            }, () => {
                console.log("getUserDetails didmount >>>>>>>>>>>>>")
                this.props.getUserDetails({ "mobile": this.state.mobileNumber })
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        const { requestNewConnectionResult, getQrDetailsResult, getAvailableDatabaseResult, getFeeDetailsResult, getUserDetailsResult, getMeterDetailsResult, getAllContractsResult, getBuildingFromPlotNoResult, getVacantApartmentsResult, getBnoAnoResult, updatePaymentLogResult } = nextProps

        if (this.state.getUserDetailsCalled && getUserDetailsResult) {
            this.setState({
                getUserDetailsCalled: false
            }, () => {
                if (getUserDetailsResult && getUserDetailsResult.content && getUserDetailsResult.content.USER_ID) {
                    this.setState({
                        existingDetails: getUserDetailsResult.content,
                        updateEmiratesId: ((getUserDetailsResult.content.EID == "") || (getUserDetailsResult.content.EID_IMAGE_URL == "") || (getUserDetailsResult.content.EID_IMAGE_URL == null) || (getUserDetailsResult.content.EID_IMAGE_URL.split(',')[0] == getUserDetailsResult.content.EID_IMAGE_URL.split(',')[1])) ? true : false
                    })
                } else {

                }
            })
        }

        if (this.state.getAvailableDatabaseCalled && getAvailableDatabaseResult) {
            this.setState({
                getAvailableDatabaseCalled: false
            }, () => {
                if (getAvailableDatabaseResult && getAvailableDatabaseResult.content && (getAvailableDatabaseResult.content.RESULT.length >= 1)) {
                    let company = []
                    getAvailableDatabaseResult.content.RESULT.map((res, index) => {
                        let temp = { "id": res.COMPANY, "label": res.EMIRATE.split("_")[0], "value": res.EMIRATE.split("_")[0], "code": res.REMARKS }
                        company.push(temp)
                    })
                    this.setState({
                        pickerCompanyData: company
                    })
                }
            })
        }

        if (this.state.getFeeDetailsCalled) {
            this.setState({
                getFeeDetailsCalled: false
            }, () => {
                if (getFeeDetailsResult && getFeeDetailsResult.content && getFeeDetailsResult.content.apartmentCode && (getFeeDetailsResult.content.apartmentCode == this.state.apartmentCode)) {
                    const feeResult = getFeeDetailsResult.content
                    this.setState({
                        paidConnection: !feeResult.excludedPrefferedConnection,
                        buildingTerms: feeResult.buildingTerms,
                        excludedConnectionModal: feeResult.excludedConnection,
                        step: !feeResult.excludedConnection ? 2 : this.state.step,
                        feeDetails: {
                            ...getFeeDetailsResult.content,
                            connectionAmtTotal: this.calculateFee(feeResult.connectionAmt, feeResult.connectionTaxPerc),
                            depositAmtTotal: this.calculateFee(feeResult.depositAmt, feeResult.depositTaxPerc),
                            disconnectionAmtTotal: this.calculateFee(feeResult.disconnectionAmt, feeResult.disconnectionTaxPerc),
                            insuranceAmtTotal: this.calculateFee(feeResult.insuranceAmt, feeResult.insuranceTaxPerc),
                            maintainanceAmtTotal: this.calculateFee(feeResult.maintainanceAmt, feeResult.maintainanceTaxPerc),
                            other1AmtTotal: this.calculateFee(feeResult.other1Amt, feeResult.other1TaxPerc),
                            other2AmtTotal: this.calculateFee(feeResult.other2Amt, feeResult.other2TaxPerc),
                            other3AmtTotal: this.calculateFee(feeResult.other3Amt, feeResult.other3TaxPerc),
                            registrationAmtTotal: this.calculateFee(feeResult.registrationAmt, feeResult.registrationTaxPerc),
                        },
                    }, () => {
                        const finalFee = this.state.feeDetails
                        this.setState({
                            feeDetails: {
                                ...this.state.feeDetails,
                                totalAmt: finalFee.connectionAmtTotal + finalFee.depositAmtTotal + finalFee.disconnectionAmtTotal + finalFee.insuranceAmtTotal + finalFee.maintainanceAmtTotal + finalFee.other1AmtTotal + finalFee.other2AmtTotal + finalFee.other3AmtTotal + finalFee.registrationAmtTotal
                            }
                        })
                    })
                } else {
                    if (getFeeDetailsResult.content.apartmentCode == "Selected Apartment is occupied") {

                        this.toastIt("Selected apartment is not vacant", false)
                    } else {

                        this.toastIt("Check Building code and Apartment code", false)
                    }
                }
            })
        }

        if (this.state.getQrDetailsCalled) {
            this.setState({
                getQrDetailsCalled: false
            }, () => {
                if (getQrDetailsResult && getQrDetailsResult.content && (getQrDetailsResult.content.BUILDING_CODE !== "QR not found")) {
                    if (this.state.pickerCompanyData[this.state.companyCode].id == getQrDetailsResult.content.COMPANY) {
                        this.toastIt("QR code scanned successfully", false)
                        console.log("getQrDetailsResult >>> ", getQrDetailsResult)
                        if (getQrDetailsResult.content.BUILDING_CODE == "") {
                            this.setState({
                                qrScanned: true,
                                openQrScanner: false
                            })
                        } else {
                            this.setState({
                                buildingCode: getQrDetailsResult.content.BUILDING_CODE,
                                apartmentCode: getQrDetailsResult.content.APARTMENT_CODE,
                                lastCompanyCode: getQrDetailsResult.content.COMPANY
                            }, () => {

                            })
                        }
                    } else {
                        this.toastIt("QR Details not found for selected Emirate", false)
                    }

                } else {
                    // this.toastIt("Something went wrong, Try again later.", false)
                }
            })
        }

        if (this.state.getMeterDetailsCalled) {
            this.setState({
                getMeterDetailsCalled: false
            }, () => {
                if (getMeterDetailsResult && getMeterDetailsResult.content && getMeterDetailsResult.content.APARTMENT_CODE && (getMeterDetailsResult.content.APARTMENT_CODE != "No data")) {
                    this.setState({
                        buildingCode: getMeterDetailsResult.content.BUILDING_CODE,
                        apartmentCode: getMeterDetailsResult.content.APARTMENT_CODE
                    })
                } else {
                    this.setState({
                        buildingCode: "",
                        apartmentCode: ""
                    })
                    this.toastIt("No data found for entered Serial No.", false)
                }
            })
        }

        if (this.state.getBuildingFromPlotNoCalled) {
            this.setState({
                getBuildingFromPlotNoCalled: false
            }, () => {
                console.log("getBuildingFromPlotNoResult >>> ", getBuildingFromPlotNoResult)
                if (getBuildingFromPlotNoResult && getBuildingFromPlotNoResult.content && getBuildingFromPlotNoResult.content.length && (getBuildingFromPlotNoResult.content[0].BUILDING_CODE != "No data")) {
                    let buildingList = []
                    getBuildingFromPlotNoResult.content.map((res, index) => {
                        let temp = { "id": index, "name": res.REMARKS + " - " + res.BUILDING_CODE, "value": res.BUILDING_CODE }
                        buildingList.push(temp)
                    })
                    this.setState({
                        // buildingCode: getBuildingFromPlotNoResult.content.BUILDING_CODE,
                        pickerBuildingData: buildingList,
                        apartmentCode: ""
                    }, () => {
                        this.setState({ showBuildingSearch: true })
                    })
                } else {
                    this.toastIt("No data found for entered Plot No.", false)
                }
            })
        }

        if (this.state.apiCallFlags.requestConnectionApiCalled && requestNewConnectionResult && requestNewConnectionResult.content) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ requestConnectionApiCalled: false } }
            }, () => {
                if (requestNewConnectionResult && requestNewConnectionResult.content && requestNewConnectionResult.content.MSG && (requestNewConnectionResult.content.STATUS == "1|SUCESS")) {
                    // this.toastIt("Payment successful, New Contract", true)

                    this.setState({
                        showModal: true,
                        readingResult: "Payment successful, Account created successfully - " + requestNewConnectionResult.content.MSG,
                        getAllContractsCalled: true
                    }, () => this.props.getAllContracts({
                        MobileNumber: this.state.mobileNumber
                    }))
                } else {
                    this.toastIt("Something went wrong, please try again later", false)
                }
            })
        }

        if (this.state.getAllContractsCalled) {
            this.setState({
                getAllContractsCalled: false
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

        if (this.state.getBnoAnoCalled) {
            this.setState({
                getBnoAnoCalled: false
            }, () => {
                if (getBnoAnoResult && getBnoAnoResult.content && getBnoAnoResult.content.RESULT && (getBnoAnoResult.content.RESULT.length >= 1)) {


                    let company = []
                    getBnoAnoResult.content.RESULT.map((res, index) => {
                        let temp = { "id": index, "label": res.COMPANY, "value": res.COMPANY }
                        company.push(temp)
                    })
                    this.setState({
                        pickerBrandData: company
                    })
                }
            })
        }

        // if (this.state.getVacantApartmentsCalled) {
        //     this.setState({
        //       getVacantApartmentsCalled: false
        //     }, () => {
        if (getVacantApartmentsResult && getVacantApartmentsResult.content && getVacantApartmentsResult.content.RESULT && (getVacantApartmentsResult.content.RESULT.length >= 1)) {
            this.setState({
                getVacantApartmentsCalled: false
            })
            let apartment = []
            getVacantApartmentsResult.content.RESULT.map((res, index) => {
                let temp = { "id": index, "name": res.APARTMENT_CODE, "value": res.APARTMENT_CODE }
                apartment.push(temp)
            })
            this.setState({
                pickerApartmentData: apartment
            })
        } else if (getVacantApartmentsResult && getVacantApartmentsResult.content && getVacantApartmentsResult.content.RESULT && (getVacantApartmentsResult.content.RESULT.length == 0)) {
            this.setState({
                getVacantApartmentsCalled: false
            })
        }
        //     })
        //   }
    }

    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }

    calculateFee = (fee, tax) => {
        return fee == "" ? 0 : parseFloat(fee) + (parseFloat(fee) * (parseFloat(tax) / 100))
    }

    async PaymentVisible() {
        try {
            const response = await fetch(API_PATH + '/api/PayMode');
            const data = await response.json();

            let cardPayVisible = false;
            let applePayVisible = false;
            let samsungPayVisible = false;

            for (const paymentType of data) {
                if (paymentType.PayType === 'NetworkPay' && paymentType.Is_Active) {
                    cardPayVisible = true;
                }
                if (paymentType.PayType === 'ApplePay' && paymentType.Is_Active && Platform.OS === 'ios') {
                    applePayVisible = true;
                }

                if (paymentType.PayType === 'SamsungPay' && paymentType.Is_Active && Platform.OS === 'android') {
                    try {
                        if (Platform.OS == 'android') {
                            // const manufacturer = await DeviceInfo.getManufacturer();

                            // if (manufacturer === 'samsung') {
                            //     samsungPayVisible = true;
                            // }
                        }
                    } catch (error) {
                        console.error("Error fetching manufacturer:", error);
                    }
                }
            }


            this.setState({
                cardPaySupported: cardPayVisible,
                applePaySupported: applePayVisible,
                samsungPaySupported: samsungPayVisible
            });

        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
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

    handleAttachImages = (type, document) => {
        this.setState({ ...this.state, loading: true });
        type === "capture"
            ? document === "emiratesId" ?
                launchCamera({ mediaType: "image", maxHeight: 100, includeBase64: true, quality: 0.1 }, this.onEmiratedIdSelect) :
                launchCamera({ mediaType: "image", maxHeight: 100, includeBase64: true, quality: 0.1 }, this.onTenancyContractSelect) :
            document === "emiratesId" ?
                launchImageLibrary({ mediaType: "image", maxHeight: 100, includeBase64: true, quality: 0.1 }, this.onEmiratedIdSelect) :
                launchImageLibrary({ mediaType: "image", maxHeight: 100, includeBase64: true, quality: 0.1 }, this.onTenancyContractSelect)
    }

    onEmiratedIdSelect = async (media) => {
        // if (!media) {
        //     this.setState({ loading: false });
        //     return;
        // }
        // const file = media.assets[0].uri;
        // this.setState({
        //     emiratesIdFront: media
        // })

        // const textRecognition = await RNTextDetector.detectFromUri(file);
        // const EID = "784-";
        // const NAME = "Name";
        // const idNumberIndex = textRecognition.findIndex((item) => item.text.match(EID));
        // const nameIndex = textRecognition.findIndex((item) => item.text.match(NAME));
        // let alertMsg = idNumberIndex.toString() + "\n aaa" + nameIndex.toString() + "bbb"
        // if ((idNumberIndex > -1) && (nameIndex > -1)) {
        //     this.toastIt("Emirates ID scanned successfully", false)
        // } else {
        //     this.toastIt("Emirates ID scanning failure. Try again or try scanning by landscape position", false)
        //     this.setState({
        //         emiratesIdNumber: "",
        //         fullName: ""
        //     })

        // }

        // // textRecognition.map(data => alertMsg = alertMsg + "\n" + data.text)
        // // Alert.alert(
        // //     'OCR Data',
        // //     alertMsg
        // //     , [{
        // //         text: 'Cancel',
        // //         onPress: () => {},
        // //         style: 'cancel'
        // //     }, {
        // //         text: 'OK',
        // //         onPress: () => {
        // //             Alert.alert(
        // //                 'OCR Data',
        // //                 textRecognition[idNumberIndex].text + "\n" + textRecognition[nameIndex].text
        // //                 , [{
        // //                     text: 'Cancel',
        // //                     onPress: () => {},
        // //                     style: 'cancel'
        // //                 }, {
        // //                     text: 'OK',
        // //                     onPress: () => {
        // //                         Alert.alert(
        // //                             'OCR Data',
        // //                             textRecognition[idNumberIndex].text.slice(textRecognition[idNumberIndex].text.indexOf("784-")).toString().replace(/-/g, "") + "\n" + textRecognition[nameIndex].text.toString().replace(/Name/g, "").replace(/: /g, "").replace(/:/g, "")
        // //                             , [{
        // //                                 text: 'Cancel',
        // //                                 onPress: () => {},
        // //                                 style: 'cancel'
        // //                             }, {
        // //                                 text: 'OK',
        // //                                 onPress: () => {
        // //                                 }
        // //                             },], {
        // //                             cancelable: false
        // //                         }
        // //                         )
        // //                     }
        // //                 },], {
        // //                 cancelable: false
        // //             }
        // //             )
        // //         }
        // //     },], {
        // //     cancelable: false
        // // }
        // // )
        // if (idNumberIndex > -1) {
        //     this.setState({
        //         emiratesIdNumber: textRecognition[idNumberIndex].text.slice(textRecognition[idNumberIndex].text.indexOf("784-")).toString().replace(/-/g, ""),
        //     })
        // }
        // if (nameIndex > -1) {
        //     this.setState({
        //         fullName: textRecognition[nameIndex].text.toString().replace(/Name/g, "").replace(/: /g, "").replace(/:/g, ""),
        //     })
        // }
        // this.setState({
        //     textRecognition: textRecognition,
        //     image: file,
        //     loading: false,
        // }, () => {
        // });
    }

    onTenancyContractSelect = async (media) => {
        if (!media) {
            this.setState({ loading: false });
            return;
        }
        const file = media.assets[0].uri;
        this.setState({
            tenancyContractFront: media
        })
        // const textRecognition = await MlkitOcr.detectFromUri(file)
    }

    handleSubmit = async () => {
        const { emiratesIdFront, tenancyContractFront, fullName, emiratesIdNumber, meterNo, emirate, tenancyContractNo, flatNo, buildingCode, apartmentCode } = this.state
        if (
            (emiratesIdFront == null) ||
            (tenancyContractFront == null) ||
            (fullName.trim() == "") ||
            (emiratesIdNumber.trim() == "") ||
            (meterNo.trim() == "") ||
            (emirate.trim() == "") ||
            (tenancyContractNo.trim() == "")
            // (flatNo.trim() == "") ||
            // (buildingCode.trim() == "") ||
            // (apartmentCode.trim() == "")
        ) {
            if ((emiratesIdFront == null) ||
                (tenancyContractFront == null)) {
                this.toastIt("Attach all images", false)
            } else {
                this.toastIt("Enter all the fields", false)
            }
        } else {
            let attachments = []
            if (this.state.emiratesIdFront != null) {
                let extension = emiratesIdFront.assets[0].fileName.replace(/^.*\./, '');
                attachments.push({ name: emiratesIdFront.assets[0].fileName, type: emiratesIdFront.assets[0].type, extension: extension, size: emiratesIdFront.assets[0].fileSize, value: emiratesIdFront.assets[0].base64 });
            }
            if (this.state.tenancyContractFront != null) {
                let extension = tenancyContractFront.assets[0].fileName.replace(/^.*\./, '');
                attachments.push({ name: tenancyContractFront.assets[0].fileName, type: tenancyContractFront.assets[0].type, extension: extension, size: tenancyContractFront.assets[0].fileSize, value: tenancyContractFront.assets[0].base64 });
            }
            let currentDate = new Date()
            let reqBody = {
                "company": this.state.pickerCompanyData[this.state.companyCode].id,
                "partyName": this.state.existingDetails.PARTY_NAME,
                "yearCode": currentDate.getFullYear(),
                "docDate": new Date(new Date().getTime()),
                "bCode": this.state.buildingCode,
                "aCode": this.state.apartmentCode,
                "address1": this.state.emirate,
                "address2": this.state.emirate,
                "address3": this.state.emirate,
                "mobile": this.state.mobileNumber,
                "email": this.state.existingDetails.EMAIL,
                "emiratesId": this.state.existingDetails.EID,
                "emirate": this.state.emirate,
                "telCode": "",
                "userId": await AsyncStorage.getItem("sergas_customer_user_id"),
                "deviceId": "test123",
                "paid": true,
                "txnNo": "123xxx123"
            }
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ requestConnectionApiCalled: true } }
            }, () => this.props.requestNewConnection(reqBody))
        }
    }
    getTraceId = async () => {
        var pattern = "xxxx-yxxx-4xxx-xxxxxxxxxxxx"
        var date = new Date().getTime();

        var uuid = pattern.replace(/[xy]/g, function (c) {
            var r = (date + Math.random() * 16) % 16 | 0;
            date = Math.floor(date / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid.toString()
    }
    makePayment = async (type) => {
        let outLetReference = "", apiKey = "", tokenApiUrl = "", orderApiUrl = ""

        if (this.state.pickerCompanyData[this.state.companyCode].id == "97") {
            outLetReference = abudhabiTestOutletReference
            apiKey = paymentApiKeyTest
            tokenApiUrl = paymentGatewayTokenApiUrlTest
            orderApiUrl = paymentGatewayCreateOrderUrlTest
        } else if (this.state.pickerCompanyData[this.state.companyCode].id == "91") {
            outLetReference = dubaiTestOutletReference
            apiKey = paymentApiKeyTest
            tokenApiUrl = paymentGatewayTokenApiUrlTest
            orderApiUrl = paymentGatewayCreateOrderUrlTest
        } else if (this.state.pickerCompanyData[this.state.companyCode].id == "92") {
            outLetReference = fujairahTestOutletReference
            apiKey = paymentApiKeyTest
            tokenApiUrl = paymentGatewayTokenApiUrlTest
            orderApiUrl = paymentGatewayCreateOrderUrlTest
        } else if (this.state.pickerCompanyData[this.state.companyCode].id == "01") {
            outLetReference = abudhabiOutletReference
            apiKey = paymentApiKeyAUH
            tokenApiUrl = paymentGatewayTokenApiUrl
            orderApiUrl = paymentGatewayCreateOrderUrl
        } else if (this.state.pickerCompanyData[this.state.companyCode].id == "02") {
            outLetReference = dubaiOutletReference
            apiKey = paymentApiKeyDXB
            tokenApiUrl = paymentGatewayTokenApiUrl
            orderApiUrl = paymentGatewayCreateOrderUrl
        } else if (this.state.pickerCompanyData[this.state.companyCode].id == "03") {
            outLetReference = fujairahOutletReference
            apiKey = paymentApiKeyTest
            tokenApiUrl = paymentGatewayTokenApiUrl
            orderApiUrl = paymentGatewayCreateOrderUrl
        } else if (this.state.pickerCompanyData[this.state.companyCode].id == "05") {
            outLetReference = alainOutletReference
            apiKey = paymentApiKeyALN
            tokenApiUrl = paymentGatewayTokenApiUrl
            orderApiUrl = paymentGatewayCreateOrderUrl
        }

        if (await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl) != null) {
            let paidCardDetails = {
                name: "MASTER",
                cardType: "DEBIT"
            }
            let token = await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl)
            let createOrderHeader = {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/vnd.ni-payment.v2+json',
                'Accept': 'application/vnd.ni-payment.v2+json'
            };
            let createOrderReq = {
                "action": "SALE",
                "amount": {
                    "currencyCode": "AED",
                    "value": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) * 100 : parseFloat(this.state.feeDetails.totalAmt).toFixed(2) * 100
                },
                "emailAddress": this.state.email != "" ? this.state.email : (this.state.existingDetails.EMAIL != "") && (this.state.existingDetails.EMAIL != null) ? this.state.existingDetails.EMAIL : "accounts@sergas.com",
                "merchantDefinedData": {
                    "ContractId": "NEW CONNECTION - EID: " + this.state.existingDetails.EID + " Mobile: " + this.state.mobileNumber,
                    "CustomerName": this.state.fullName != "" ? this.state.fullName : this.state.existingDetails.PARTY_NAME
                },
                "MerchantOrderReference": `${(await this.getTraceId()).replace(/-/g, '').substring(0, 7).toUpperCase()}-MP`
            }

            axios.post(orderApiUrl + outLetReference + "/orders", createOrderReq, { headers: createOrderHeader })
                .then(async createOrderRes => {
                    // this.setState({ makepaymentcalled: false })
                    if (createOrderRes.reference != undefined) {
                        let currentDate = new Date()
                        let attachments = []
                        if (this.state.tenancyContractFront != null) {
                            let extension = this.state.tenancyContractFront.assets[0].fileName.replace(/^.*\./, '');
                            attachments.push({ name: this.state.tenancyContractFront.assets[0].fileName, type: this.state.tenancyContractFront.assets[0].type, extension: extension, size: this.state.tenancyContractFront.assets[0].fileSize, value: this.state.tenancyContractFront.assets[0].base64 });
                        }
                        if ((type == "applepay") || (type == "samsungpay")) {
                            try {
                                const payResponse = type == "samsungpay" ?
                                    await initiateSamsungPay(createOrderRes,
                                        this.state.pickerCompanyData[this.state.companyCode].id == "01" ? 'SERGAS Customer AUH' :
                                            this.state.pickerCompanyData[this.state.companyCode].id == "02" ? 'SERGAS Customer DXB' :
                                                this.state.pickerCompanyData[this.state.companyCode].id == "05" ? 'SERGAS Customer ALN' :
                                                    'SERGAS Customer',
                                        this.state.pickerCompanyData[this.state.companyCode].id == "01" ? '7b41f6ef17874fc3bf4ccb' :
                                            this.state.pickerCompanyData[this.state.companyCode].id == "02" ? '44f457d4b8da4a8bbe2dfe' :
                                                this.state.pickerCompanyData[this.state.companyCode].id == "05" ? 'c084781e34924bf7b13927' :
                                                    'aa1080513289421082caa1') :
                                    type == "applepay" ? await initiateApplePay(createOrderRes, {
                                        merchantIdentifier: this.state.pickerCompanyData[this.state.companyCode].id == "01" ? 'merchant.sergas.sergascustomerauh' : this.state.pickerCompanyData[this.state.companyCode].id == "02" ? 'merchant.sergas.sergascustomerdxb' : this.state.pickerCompanyData[this.state.companyCode].id == "05" ? 'merchant.sergas.sergascustomeralain' : 'merchant.sergas.sergascustomer', // Merchant ID created in Apple's portal
                                        countryCode: 'AE', // Country code of the order
                                        merchantName: this.state.pickerCompanyData[this.state.companyCode].id == "01" ? 'SERGAS Customer AUH' : this.state.pickerCompanyData[this.state.companyCode].id == "02" ? 'SERGAS Customer DXB' : this.state.pickerCompanyData[this.state.companyCode].id == "05" ? 'SERGAS Customer ALN' : 'SERGAS Customer', // name of the merchant to be shown in Apple Pay button
                                    }) : null;
                                if (payResponse.status == "Success") {

                                    token = await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl)
                                    createOrderHeader.Authorization = 'Bearer ' + token
                                    await axios.get(orderApiUrl + outLetReference + "/orders/" + createOrderRes.reference, { headers: createOrderHeader })
                                        .then(async getOrderDetailsRes => {

                                            if (getOrderDetailsRes &&
                                                (getOrderDetailsRes._embedded.length != 0) &&
                                                getOrderDetailsRes._embedded.payment[0].paymentMethod && getOrderDetailsRes._embedded.payment[0].state == "CAPTURED" &&
                                                getOrderDetailsRes._embedded.payment[0].paymentMethod.name) {
                                                if (type == "samsungpay") {
                                                    paidCardDetails = {
                                                        name: "SAMSUNG_PAY",
                                                        cardType: "DEBIT"
                                                    }
                                                }
                                                else {
                                                    paidCardDetails = getOrderDetailsRes._embedded.payment[0].paymentMethod
                                                }
                                                let reqBody = {
                                                    "company": this.state.pickerCompanyData[this.state.companyCode].id,
                                                    "partyName": this.state.fullName != "" ? this.state.fullName : this.state.existingDetails.PARTY_NAME,
                                                    "yearCode": currentDate.getFullYear(),
                                                    "docDate": new Date(),
                                                    "bCode": this.state.buildingCode,
                                                    "aCode": this.state.apartmentCode,
                                                    "address1": this.state.emirate,
                                                    "address2": this.state.emirate,
                                                    "address3": this.state.emirate,
                                                    "mobile": this.state.mobileNumber,
                                                    "email": this.state.email != "" ? this.state.email : this.state.existingDetails.EMAIL,
                                                    "emiratesId": this.state.existingDetails.EID,
                                                    "emirate": this.state.emirate,
                                                    "telCode": "971",
                                                    "userId": await AsyncStorage.getItem("sergas_customer_user_id"),
                                                    "deviceId": "test123",
                                                    "paid": this.state.paidConnection,
                                                    "txnNo": createOrderRes.reference,
                                                    "DATE": this.state.date,
                                                    "FILE_ATTACHMENTS": attachments,
                                                    "paid_amount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                    "brnCode": this.state.pickerCompanyData[this.state.companyCode].code,
                                                    "to_pay": "0"
                                                }
                                                this.setState({
                                                    makepaymentcalled: false,
                                                    apiCallFlags: { ...this.state.apiCallFlags, ...{ requestConnectionApiCalled: true } }
                                                }, async () => {
                                                    this.props.requestNewConnection(reqBody)
                                                    this.props.updatePaymentLog({
                                                        "OrderId": createOrderRes.reference,
                                                        "TotalAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                        "ReceivedAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                        "OnlineDocDate": new Date(),
                                                        "Status": "SUCCESS",
                                                        "ContractNo": "NEW CONTRACT - Mobile number: " + this.state.mobileNumber + ", User ID: " + await AsyncStorage.getItem("sergas_customer_user_id"),
                                                        "Company": this.state.pickerCompanyData[this.state.companyCode].id,
                                                        "TransactionId": createOrderRes.reference,
                                                        "InvoiceDocNo": "",
                                                        "InvoiceDocType": "",
                                                        "InvoiceYearCode": "",
                                                        "CreditCard": paidCardDetails.name,
                                                        "PaymentMode": paidCardDetails.name,
                                                        "PaymentType": "NEW_CONNECTION"
                                                    })
                                                })


                                            } else {

                                                this.setState({ currentTransaction: null, makepaymentcalled: false })
                                                this.toastIt("Something went wrong. Try again later.")
                                                const paidCardDetails =
                                                    type === "samsungpay"
                                                        ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                                        : type === "applepay"
                                                            ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                                            : { name: "", cardType: "" };

                                                this.props.updatePaymentLog({
                                                    "OrderId": createOrderRes.reference,
                                                    "TotalAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                    "ReceivedAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                    "OnlineDocDate": new Date(),
                                                    "Status": "FAILURE",
                                                    "ContractNo": "NEW CONTRACT - Mobile number: " + this.state.mobileNumber + ", User ID: " + await AsyncStorage.getItem("sergas_customer_user_id"),
                                                    "Company": this.state.pickerCompanyData[this.state.companyCode].id,
                                                    "TransactionId": createOrderRes.reference,
                                                    "InvoiceDocNo": "",
                                                    "InvoiceDocType": "",
                                                    "InvoiceYearCode": "",
                                                    "CreditCard": paidCardDetails.name,
                                                    "PaymentMode": paidCardDetails.name,
                                                    "PaymentType": "NEW_CONNECTION"
                                                })
                                            }

                                        })
                                        .catch(getOrderDetailsErr => {
                                            clg("getOrderDetailsErr >> ", getOrderDetailsErr)
                                        })


                                } else {
                                    this.setState({ currentTransaction: null, makepaymentcalled: false })
                                    this.toastIt("Something went wrong. Try again later.")
                                    const paidCardDetails =
                                        type === "samsungpay"
                                            ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                            : type === "applepay"
                                                ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                                : { name: "", cardType: "" };

                                    this.props.updatePaymentLog({
                                        "OrderId": createOrderRes.reference,
                                        "TotalAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                        "ReceivedAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                        "OnlineDocDate": new Date(),
                                        "Status": "FAILURE",
                                        "ContractNo": "NEW CONTRACT - Mobile number: " + this.state.mobileNumber + ", User ID: " + await AsyncStorage.getItem("sergas_customer_user_id"),
                                        "Company": this.state.pickerCompanyData[this.state.companyCode].id,
                                        "TransactionId": createOrderRes.reference,
                                        "InvoiceDocNo": "",
                                        "InvoiceDocType": "",
                                        "InvoiceYearCode": "",
                                        "CreditCard": paidCardDetails.name,
                                        "PaymentMode": paidCardDetails.name,
                                        "PaymentType": "NEW_CONNECTION"
                                    })
                                }

                            } catch (err) {
                                this.setState({ currentTransaction: null, makepaymentcalled: false })
                                this.toastIt("Payment Failed")

                                const paidCardDetails =
                                    type === "samsungpay"
                                        ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                        : type === "applepay"
                                            ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                            : { name: "", cardType: "" };

                                this.props.updatePaymentLog({
                                    "OrderId": createOrderRes.reference,
                                    "TotalAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                    "ReceivedAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                    "OnlineDocDate": new Date(),
                                    "Status": "FAILED",
                                    "ContractNo": "NEW CONTRACT - Mobile number: " + this.state.mobileNumber + ", User ID: " + await AsyncStorage.getItem("sergas_customer_user_id"),
                                    "Company": this.state.pickerCompanyData[this.state.companyCode].id,
                                    "TransactionId": createOrderRes.reference,
                                    "InvoiceDocNo": "",
                                    "InvoiceDocType": "",
                                    "InvoiceYearCode": "",
                                    "CreditCard": paidCardDetails.name,
                                    "PaymentMode": paidCardDetails.name,
                                    "PaymentType": "NEW_CONNECTION"
                                })
                            }
                        } else {
                            try {
                                const initiateCardPaymentResponse = await initiateCardPayment(createOrderRes);
                                if (initiateCardPaymentResponse.status == "Success") {


                                    token = await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl)
                                    createOrderHeader.Authorization = 'Bearer ' + token
                                    await axios.get(orderApiUrl + outLetReference + "/orders/" + createOrderRes.reference, { headers: createOrderHeader })
                                        .then(async getOrderDetailsRes => {

                                            if (getOrderDetailsRes &&
                                                (getOrderDetailsRes._embedded.length != 0) &&
                                                getOrderDetailsRes._embedded.payment[0].paymentMethod && getOrderDetailsRes._embedded.payment[0].state == "CAPTURED" &&
                                                getOrderDetailsRes._embedded.payment[0].paymentMethod.name) {

                                                paidCardDetails = getOrderDetailsRes._embedded.payment[0].paymentMethod
                                                let reqBody = {
                                                    "company": this.state.pickerCompanyData[this.state.companyCode].id,
                                                    "partyName": this.state.fullName != "" ? this.state.fullName : this.state.existingDetails.PARTY_NAME,
                                                    "yearCode": currentDate.getFullYear(),
                                                    "docDate": new Date(),
                                                    "bCode": this.state.buildingCode,
                                                    "aCode": this.state.apartmentCode,
                                                    "address1": this.state.emirate,
                                                    "address2": this.state.emirate,
                                                    "address3": this.state.emirate,
                                                    "mobile": this.state.mobileNumber,
                                                    "email": this.state.email != "" ? this.state.email : this.state.existingDetails.EMAIL,
                                                    "emiratesId": this.state.existingDetails.EID,
                                                    "emirate": this.state.emirate,
                                                    "telCode": "971",
                                                    "userId": await AsyncStorage.getItem("sergas_customer_user_id"),
                                                    "deviceId": "test123",
                                                    "paid": this.state.paidConnection,
                                                    "txnNo": createOrderRes.reference,
                                                    "DATE": this.state.date,
                                                    "FILE_ATTACHMENTS": attachments,
                                                    "paid_amount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                    "brnCode": this.state.pickerCompanyData[this.state.companyCode].code,
                                                    "to_pay": "0"
                                                }
                                                this.setState({
                                                    makepaymentcalled: false,
                                                    apiCallFlags: { ...this.state.apiCallFlags, ...{ requestConnectionApiCalled: true } }
                                                }, async () => {
                                                    this.props.requestNewConnection(reqBody)
                                                    this.props.updatePaymentLog({
                                                        "OrderId": createOrderRes.reference,
                                                        "TotalAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                        "ReceivedAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                        "OnlineDocDate": new Date(),
                                                        "Status": "SUCCESS",
                                                        "ContractNo": "NEW CONTRACT - Mobile number: " + this.state.mobileNumber + ", User ID: " + await AsyncStorage.getItem("sergas_customer_user_id"),
                                                        "Company": this.state.pickerCompanyData[this.state.companyCode].id,
                                                        "TransactionId": createOrderRes.reference,
                                                        "InvoiceDocNo": "",
                                                        "InvoiceDocType": "",
                                                        "InvoiceYearCode": "",
                                                        "CreditCard": paidCardDetails.name,
                                                        "PaymentMode": paidCardDetails.name,
                                                        "PaymentType": "NEW_CONNECTION"
                                                    })
                                                })
                                            } else {
                                                this.setState({ currentTransaction: null, makepaymentcalled: false })
                                                this.toastIt("Something went wrong. Try again later.")
                                                this.props.updatePaymentLog({
                                                    "OrderId": createOrderRes.reference,
                                                    "TotalAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                    "ReceivedAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                                    "OnlineDocDate": new Date(),
                                                    "Status": "FAILURE",
                                                    "ContractNo": "NEW CONTRACT - Mobile number: " + this.state.mobileNumber + ", User ID: " + await AsyncStorage.getItem("sergas_customer_user_id"),
                                                    "Company": this.state.pickerCompanyData[this.state.companyCode].id,
                                                    "TransactionId": createOrderRes.reference,
                                                    "InvoiceDocNo": "",
                                                    "InvoiceDocType": "",
                                                    "InvoiceYearCode": "",
                                                    "CreditCard": paidCardDetails.name,
                                                    "PaymentMode": paidCardDetails.name,
                                                    "PaymentType": "NEW_CONNECTION"
                                                })
                                            }

                                        })
                                        .catch(getOrderDetailsErr => {
                                            clg("getOrderDetailsErr >> ", getOrderDetailsErr)
                                        })
                                    // this.toastIt("Payment Successful. It will be reflected in your account shortly.", false)


                                } else {
                                    this.setState({ currentTransaction: null, makepaymentcalled: false })
                                    this.toastIt("Something went wrong. Try again later.")
                                    this.props.updatePaymentLog({
                                        "OrderId": createOrderRes.reference,
                                        "TotalAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                        "ReceivedAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                        "OnlineDocDate": new Date(),
                                        "Status": "FAILURE",
                                        "ContractNo": "NEW CONTRACT - Mobile number: " + this.state.mobileNumber + ", User ID: " + await AsyncStorage.getItem("sergas_customer_user_id"),
                                        "Company": this.state.pickerCompanyData[this.state.companyCode].id,
                                        "TransactionId": createOrderRes.reference,
                                        "InvoiceDocNo": "",
                                        "InvoiceDocType": "",
                                        "InvoiceYearCode": "",
                                        "CreditCard": paidCardDetails.name,
                                        "PaymentMode": paidCardDetails.name,
                                        "PaymentType": "NEW_CONNECTION"
                                    })
                                }
                            } catch (initiatePaymentErr) {
                                this.setState({ currentTransaction: null, makepaymentcalled: false })
                                if (initiatePaymentErr.status == "Failed") {
                                    this.toastIt("Payment Failed")
                                }
                                if (initiatePaymentErr.status == "Aborted") {
                                    this.toastIt("Payment Aborted")
                                }
                                this.props.updatePaymentLog({
                                    "OrderId": createOrderRes.reference,
                                    "TotalAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                    "ReceivedAmount": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2),
                                    "OnlineDocDate": new Date(),
                                    "Status": initiatePaymentErr.status,
                                    "ContractNo": "NEW CONTRACT - Mobile number: " + this.state.mobileNumber + ", User ID: " + await AsyncStorage.getItem("sergas_customer_user_id"),
                                    "Company": this.state.pickerCompanyData[this.state.companyCode].id,
                                    "TransactionId": createOrderRes.reference,
                                    "InvoiceDocNo": "",
                                    "InvoiceDocType": "",
                                    "InvoiceYearCode": "",
                                    "CreditCard": paidCardDetails.name,
                                    "PaymentMode": paidCardDetails.name,
                                    "PaymentType": "NEW_CONNECTION"
                                })
                            }
                        }
                    } else {
                        this.setState({ currentTransaction: null, makepaymentcalled: false })
                        this.toastIt("Something went wrong. Try again later.")
                    }
                })
                .catch(createOrderErr => {
                    this.setState({ currentTransaction: null, makepaymentcalled: false })
                    this.toastIt("Something went wrong. Try again later.")
                })
        } else {
            this.setState({ currentTransaction: null, makepaymentcalled: false })
            this.toastIt("Something went wrong. Try again later.")
        }
    }

    createContractWithoutpay = async () => {
        let currentDate = new Date()
        let attachments = []
        if (this.state.tenancyContractFront != null) {
            let extension = this.state.tenancyContractFront.assets[0].fileName.replace(/^.*\./, '');
            attachments.push({ name: this.state.tenancyContractFront.assets[0].fileName, type: this.state.tenancyContractFront.assets[0].type, extension: extension, size: this.state.tenancyContractFront.assets[0].fileSize, value: this.state.tenancyContractFront.assets[0].base64 });
        }
        let reqBody = {
            "company": this.state.pickerCompanyData[this.state.companyCode].id,
            "partyName": this.state.fullName != "" ? this.state.fullName : this.state.existingDetails.PARTY_NAME,
            "yearCode": currentDate.getFullYear(),
            "docDate": new Date(),
            "bCode": this.state.buildingCode,
            "aCode": this.state.apartmentCode,
            "address1": this.state.emirate,
            "address2": this.state.emirate,
            "address3": this.state.emirate,
            "mobile": this.state.mobileNumber,
            "email": this.state.email != "" ? this.state.email : this.state.existingDetails.EMAIL,
            "emiratesId": this.state.existingDetails.EID,
            "emirate": this.state.emirate,
            "telCode": "971",
            "userId": await AsyncStorage.getItem("sergas_customer_user_id"),
            "deviceId": "test123",
            "paid": this.state.paidConnection,
            "txnNo": "NA",
            "DATE": this.state.date,
            "FILE_ATTACHMENTS": attachments,
            "paid_amount": 0,
            "brnCode": this.state.pickerCompanyData[this.state.companyCode].code,
            "to_pay": this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105 + 52.5).toFixed(2).toString() + " AED. inclusive of Convinience fee 50 AED for Pay on connection and VIP fee 105 AED" : (parseFloat(this.state.feeDetails.totalAmt) + 52.5).toFixed(2).toString() + " AED. inclusive of Convinience fee 50 AED for Pay on connection",
        }
        this.setState({
            makepaymentcalled: false,
            apiCallFlags: { ...this.state.apiCallFlags, ...{ requestConnectionApiCalled: true } }
        }, () => {
            this.props.requestNewConnection(reqBody)
        })
    }

    getPaymentGatewayAccessToken = async (apiKey, tokenApiUrl) => {
        const reqBody = {};
        const headers = {
            'Authorization': 'Basic ' + apiKey,
            'Content-Type': 'application/vnd.ni-identity.v1+json'
        };
        let token = null
        await axios.post(tokenApiUrl, reqBody, { headers })
            .then(res => {
                if ((res.access_token != undefined) || (res.access_token != null)) {
                    token = res.access_token
                }
            })
            .catch(err => {
                this.setState({ makePaymentClicked: false })
                this.toastIt("Something went wrong. Try again later.")
            })
        return token
    }


    toastIt = (message, back) => {
        this.setState({
            showToast: false,
            toastMessage: "",
        }, () => {
            this.setState({
                showToast: true,
                toastMessage: message,
            });
            setTimeout(() => {
                this.setState({ showToast: false, toastMessage: "" });
                if (back) {
                    this.props.navigation.goBack()
                }
            }, 5000);
        })
    }

    onQrRead = (e) => {

        try {
            let qrData = JSON.parse(e.data)
            if ((qrData.qrId != undefined) && (qrData.qrId != null) && (qrData.qrId != "")) {
                this.setState({ getQrDetailsCalled: true },
                    () => this.props.getQrDetails({ "ID": qrData.qrId })
                )
            } else {
                this.toastIt("Unable to read QR code", false)
            }
            this.setState({
                openQrScanner: false
            })
        } catch (error) {
            this.setState({ openQrScanner: false })
            this.toastIt("Unable to read QR code", false)
        }
    }

    render() {
        const { emiratesIdFront, tenancyContractFront, buildingCode, noQR, apiCallFlags } = this.state;
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
                                        New Connection request
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                            Submit your details to request a new gas connection.
                        </Text>
                    </View>

                    <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
                        <KeyboardAwareScrollView
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                            // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_2 }}
                            style={{ flex: 1 }}
                            enabled
                            showsVerticalScrollIndicator={false}
                        >
                            <ScrollView
                                ref={(ref) => (this.scrollView = ref)}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollView}>

                                <View style={{...Mainstyles.bodyview, paddingHorizontal:20, }}>
                                    <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: 20, marginBottom: 40 }}>

                                        <Image source={require("../../../assets/images/Rectangle.png")} style={{ resizeMode: 'stretch', position: 'absolute', alignSelf: 'center', width: "100%" }} />

                                        <View style={this.state.step == 1 ? styles.tabIconActive : styles.tabIconInactive}>
                                            <Text style={this.state.step == 1 ? styles.tabNumberActive : styles.tabNumberInactive}>
                                                1
                                            </Text>
                                        </View>
                                        <View style={this.state.step == 2 ? styles.tabIconActive : styles.tabIconInactive}>
                                            <Text style={this.state.step == 2 ? styles.tabNumberActive : styles.tabNumberInactive}>
                                                2
                                            </Text>
                                        </View>
                                        <View style={this.state.step == 3 ? styles.tabIconActive : styles.tabIconInactive}>
                                            <Text style={this.state.step == 3 ? styles.tabNumberActive : styles.tabNumberInactive}>
                                                3
                                            </Text>
                                        </View>
                                        <View style={this.state.step == 4 ? styles.tabIconActive : styles.tabIconInactive}>
                                            <Text style={this.state.step == 4 ? styles.tabNumberActive : styles.tabNumberInactive}>
                                                4
                                            </Text>
                                        </View>

                                    </View>

                                    {this.state.step == 1 ?
                                        <>

                                            {
                                                this.state.existingDetails && (this.state.existingDetails.PARTY_NAME == "") ?
                                                    <View style={styles.inputGroupStyle}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={styles.inputLabelStyle}>Full Name</Text>
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
                                                    </View> : null
                                            }

                                            <View style={styles.inputGroupStyle}>
                                                {/* <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.inputLabelStyle}>{t("home.emirate")}</Text>
                                                </View> */}
                                                <View>
                                                    <Picker
                                                        placeholder="Select Emirate"
                                                        selectedValue={this.state.emirate}
                                                        onValueChange={(itemValue, key) => {
                                                            this.setState({
                                                                emirate: itemValue == null ? "" : itemValue,
                                                                companyCode: key >= 1 ? key - 1 : 0,
                                                                getBnoAnoCalled: true
                                                            }, () => {
                                                                this.props.getBnoAno({
                                                                    "TYPE": "METER_BRAND",
                                                                    "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                                    "B_CODE": "A",
                                                                    "A_CODE": "A"
                                                                })
                                                            })
                                                            if ((this.state.meterNo !== "") && (this.state.meterBrand != "")) {
                                                                this.setState({
                                                                    getMeterDetailsCalled: true
                                                                }, () => {
                                                                    let req = {
                                                                        "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                                        "QUERY": this.state.meterNo,
                                                                        "REMARKS": this.state.meterBrand
                                                                    }
                                                                    this.props.getMeterDetails(req)
                                                                })
                                                            }
                                                        }}
                                                        items={this.state.pickerCompanyData}
                                                        mode="dropdown"
                                                    />
                                                </View>
                                            </View>

                                            {
                                                this.state.existingDetails && !this.state.existingDetails.EMAIL.match(validRegex) ?
                                                    <View style={styles.inputGroupStyle}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={styles.inputLabelStyle}>Email</Text>
                                                        </View>
                                                        <View>
                                                            <TextInput
                                                                Value={this.state.email}
                                                                OnChange={(value) => {
                                                                    this.setState({ email: value })
                                                                }}
                                                                Style={{ borderColor: "#848484" }}
                                                            />
                                                        </View>
                                                    </View> : null
                                            }

                                            {this.state.openQrScanner
                                                ? <QRCodeScanner
                                                    // cameraContainerStyle={{height: 100, width: 100}}
                                                    containerStyle={{
                                                        flex: 1,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                    // topViewStyle={{flex: 0}}
                                                    // bottomViewStyle={{flex: 0}}
                                                    onRead={this.onQrRead}
                                                    cameraStyle={{
                                                        height: 300,
                                                        width: 300,
                                                        alignSelf: 'center',
                                                        borderWidth: 3,
                                                        borderColor: "#102D4F",
                                                        borderStyle: "solid",
                                                        borderRadius: 4,
                                                        overflow: 'hidden'
                                                        // height: 100,
                                                    }}
                                                    // containerStyle={{ marginVertical: 80 }}
                                                    flashMode={RNCamera.Constants.FlashMode.auto}
                                                />
                                                :
                                                // (!noQR && (buildingCode == "")) ? 
                                                // <View style={{ ...styles.cardView, ...{ marginBottom: 0 } }} >
                                                //     <View style={{ ...styles.inputGroupStyle, ...{ alignItems: 'center', marginBottom: 0 } }}>
                                                //         {/* <View style={{ alignSelf: 'flex-start' }}>
                                                //     <Text style={styles.inputLabelStyle}>Click to scan the qr code in your meter</Text>
                                                // </View> */}
                                                //         <TouchableOpacity
                                                //             style={{ ...styles.buttonStyle, ...{ width: "100%", flexDirection: 'row' } }}
                                                //             onPress={() => {
                                                //                 if ((this.state.emirate == "") || (this.state.emirate == null)) {
                                                //                     this.toastIt("Select Emirate to scan the QR Code", false)
                                                //                 } else {
                                                //                     this.setState({ buildingCode: "", apartmentCode: "", openQrScanner: true })
                                                //                 }
                                                //             }}
                                                //         >
                                                //             <Image
                                                //                 source={require('../../../assets/images/qr.png')}
                                                //                 style={{ ...styles.clickImage, marginRight: 5 }}
                                                //             />
                                                //             <Text
                                                //                 style={styles.buttonLabelStyle}>Scan QR Code in Your Meter</Text>
                                                //         </TouchableOpacity>
                                                //     </View>
                                                //     <View style={{ ...styles.inputGroupStyle, ...{ alignItems: 'center', marginBottom: 0 } }}>
                                                //         {/* <View style={{ alignSelf: 'flex-start' }}>
                                                //     <Text style={styles.inputLabelStyle}>Click to scan the qr code in your meter</Text>
                                                // </View> */}
                                                //         <TouchableOpacity
                                                //             style={{ ...styles.buttonStyle, ...{ width: "100%", flexDirection: 'row', backgroundColor: "#F7F9FB", marginTop: 5 } }}
                                                //             onPress={() => {
                                                //                 if ((this.state.emirate == "") || (this.state.emirate == null)) {
                                                //                     this.toastIt("Select Emirate", false)
                                                //                 } else {
                                                //                     this.setState({ noQR: true })
                                                //                 }
                                                //             }}
                                                //         >
                                                //             <Image
                                                //                 source={require('../../../assets/images/noQr.png')}
                                                //                 style={{ ...styles.clickImage, marginRight: 5 }}
                                                //             />
                                                //             <Text
                                                //                 style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Don't have QR Code</Text>
                                                //         </TouchableOpacity>
                                                //     </View>
                                                // </View> : 
                                                null
                                            }

                                            {
                                                // (this.state.noQR && (buildingCode == "")) || (this.state.meterNo != "") ?
                                                !this.state.noQR ?
                                                    <View style={{ ...styles.cardView, ...{ marginBottom: 0 } }} >
                                                        <View style={{ ...styles.inputGroupStyle, ...{ alignItems: 'center', marginBottom: 0 } }}>
                                                            {/* <View style={{ alignSelf: 'flex-start' }}>
                                            <Text style={styles.inputLabelStyle}>Click to scan the qr code in your meter</Text>
                                        </View> */}
                                                            <TouchableOpacity
                                                                style={{ ...styles.buttonStyle, ...{ width: "100%", flexDirection: 'row' } }}
                                                                onPress={() => {
                                                                    if ((this.state.emirate == "") || (this.state.emirate == null)) {
                                                                        this.toastIt("Select Emirate to scan the QR Code", false)
                                                                    } else {
                                                                        this.setState({ buildingCode: "", apartmentCode: "", openQrScanner: true })
                                                                    }
                                                                }}
                                                            >
                                                                <Image
                                                                    source={require('../../../assets/images/qr.png')}
                                                                    style={{ ...styles.clickImage, marginRight: 5 }}
                                                                />
                                                                <Text
                                                                    style={styles.buttonLabelStyle}>Scan QR Code in Your Meter</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{ ...styles.inputGroupStyle, ...{ alignItems: 'center', marginBottom: 0 } }}>
                                                            {/* <View style={{ alignSelf: 'flex-start' }}>
                                            <Text style={styles.inputLabelStyle}>Click to scan the qr code in your meter</Text>
                                        </View> */}
                                                            <TouchableOpacity
                                                                style={{ ...styles.buttonStyle, ...{ width: "100%", flexDirection: 'row', backgroundColor: "#F7F9FB", marginTop: 10 } }}
                                                                onPress={() => {
                                                                    if ((this.state.emirate == "") || (this.state.emirate == null)) {
                                                                        this.toastIt("Select Emirate", false)
                                                                    } else {
                                                                        this.setState({ noQR: true })
                                                                    }
                                                                }}
                                                            >
                                                                <Image
                                                                    source={require('../../../assets/images/noQr.png')}
                                                                    style={{ ...styles.clickImage, marginRight: 5 }}
                                                                />
                                                                <Text
                                                                    style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Don't have QR Code</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    :
                                                    this.state.noQR && this.state.noMeterNo ?

                                                        <View style={styles.inputGroupStyle}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={styles.inputLabelStyle}>Meter Serial Number</Text>
                                                            </View>
                                                            <View>
                                                                <TextInput
                                                                    // editable={this.state.noQR}
                                                                    Value={this.state.meterNo}
                                                                    OnChange={(value) => {
                                                                        this.setState({ meterNo: value })
                                                                    }}
                                                                    OnBlur={() => {
                                                                        if ((this.state.emirate == "") || (this.state.emirate == null)) {
                                                                            this.toastIt("Select Emirate to search Building code and Apartment code", false)
                                                                        } else {
                                                                            if (this.state.meterBrand != "") {
                                                                                this.setState({
                                                                                    getMeterDetailsCalled: true
                                                                                }, () => {
                                                                                    let req = {
                                                                                        "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                                                        "QUERY": this.state.meterNo,
                                                                                        "REMARKS": this.state.meterBrand
                                                                                    }
                                                                                    this.props.getMeterDetails(req)
                                                                                })
                                                                            }
                                                                        }
                                                                    }}
                                                                    Style={{ borderColor: "#848484" }}
                                                                />
                                                            </View>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={this.state.noQR ? styles.inputLabelStyle : { ...styles.inputLabelStyle, color: "#ABB2AC" }}>Select Meter Brand</Text>
                                                            </View>
                                                            <View>
                                                                <TextInput
                                                                    onFocus={() => {
                                                                        this.setState({
                                                                            showMeterBrandList: true,
                                                                        })
                                                                    }}
                                                                    Value={this.state.meterBrand}
                                                                    OnChange={(value) => {
                                                                        this.setState({
                                                                            showMeterBrandList: true
                                                                        })
                                                                    }}
                                                                    Style={{ borderColor: "#848484" }}
                                                                />
                                                            </View>
                                                            <TouchableOpacity
                                                                style={{ ...styles.buttonStyle, ...{ width: "100%", flexDirection: 'row', backgroundColor: "#F7F9FB", marginTop: 5 } }}

                                                                onPress={() => this.setState({ noMeterNo: false, noQR: false, buildingCode: "", apartmentCode: "", meterNo: "", meterBrand: "" })}
                                                            >
                                                                {/* <Image
                                                source={require('../../../assets/images/noQr.png')}
                                                style={{ ...styles.clickImage, marginRight: 5 }}
                                            /> */}
                                                                <Text
                                                                    style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Don't have Meter Serial Number</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        : <View style={styles.inputGroupStyle}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={styles.inputLabelStyle}>Plot Number</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", display: "flex", alignItems: 'center' }}>
                                                                <View style={(this.state.emirate == "DUBAI") || (this.state.emirate == "ABUDHABI") || (this.state.emirate == "FUJAIRAH") ? { width: "90%", marginRight: 5 } : { width: "100%" }}>
                                                                    <TextInput
                                                                        // editable={this.state.noQR}
                                                                        Value={this.state.plotNo}
                                                                        OnChange={(value) => {
                                                                            this.setState({ plotNo: value })
                                                                        }}
                                                                        OnBlur={() => {
                                                                            if ((this.state.emirate == "") || (this.state.emirate == null)) {
                                                                                this.toastIt("Select Emirate to search Building code and Apartment code", false)
                                                                            } else if ((this.state.plotNo == "") || (this.state.plotNo == null)) {
                                                                                this.toastIt("Enter Plot No. to search Building code and Apartment code", false)
                                                                            } else {
                                                                                this.setState({
                                                                                    getBuildingFromPlotNoCalled: true
                                                                                }, () => {
                                                                                    let req = {
                                                                                        "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                                                        "QUERY": this.state.plotNo
                                                                                    }
                                                                                    this.props.getBuildingFromPlotNo(req)
                                                                                })
                                                                            }
                                                                        }}
                                                                        Style={{ borderColor: "#848484" }}
                                                                    />
                                                                </View>
                                                                {
                                                                    (this.state.emirate === "DUBAI" || this.state.emirate === "ABUDHABI" || this.state.emirate === "FUJAIRAH") ? (
                                                                        <View style={{ width: "10%", alignItems: 'center', justifyContent: 'center' }}>
                                                                            <TouchableOpacity
                                                                                onPress={() => {
                                                                                    const helpImageUrl =
                                                                                        this.state.emirate === "DUBAI" ? require("../../../assets/images/dubai_plot_no.jpg") :
                                                                                            this.state.emirate === "ABUDHABI" ? require("../../../assets/images/abudhabi_plot_no.jpg") :
                                                                                                require("../../../assets/images/fujairah_tenancy_no.jpg");

                                                                                    this.setState({
                                                                                        showHelpModal: true,
                                                                                        helpImageUrl: helpImageUrl
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <Image
                                                                                    style={{ width: 22, height: 22, resizeMode: "stretch" }}
                                                                                    source={require("../../../assets/images/icon-feather-help-circle-2.png")}
                                                                                />
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    ) : null
                                                                }

                                                            </View>
                                                            <TouchableOpacity
                                                                style={{ ...styles.buttonStyle, ...{ width: "100%", flexDirection: 'row', backgroundColor: "#F7F9FB", marginTop: 5 } }}
                                                                onPress={() => this.setState({ noMeterNo: true, buildingCode: "", apartmentCode: "", pickerBuildingData: [], plotNo: "" })}
                                                            >
                                                                {/* <Image
                                                source={require('../../../assets/images/noQr.png')}
                                                style={{ ...styles.clickImage, marginRight: 5 }}
                                            /> */}
                                                                <Text
                                                                    style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Don't have Plot Number</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                // : null
                                            }

                                            <View style={(this.state.pickerBuildingData.length != 0) || (this.state.buildingCode != "") ? styles.inputGroupStyle : { ...styles.inputGroupStyle, display: "none" }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={!this.state.noMeterNo ? styles.inputLabelStyle : { ...styles.inputLabelStyle, color: "#ABB2AC" }}>Building Code</Text>
                                                    {/* <Text style={{ ...styles.inputLabelStyle, color: "#ABB2AC" }}>Building Code</Text> */}
                                                    {
                                                        this.state.getMeterDetailsCalled || this.state.getBuildingFromPlotNoCalled ? <ActivityIndicator size={'small'} color={'#102D4F'} style={{ marginLeft: 5 }} /> : null
                                                    }
                                                </View>
                                                <View>
                                                    {/* <TextInput
                                                editable={false}
                                                Value={this.state.buildingCode}
                                                OnChange={(value) => {
                                                    this.setState({ buildingCode: value })
                                                }}
                                                Style={{ borderColor: "#848484" }}
                                            /> */}
                                                    <TextInput
                                                        editable={this.state.noQR && (this.state.pickerBuildingData.length != 0)}
                                                        onFocus={() => {
                                                            this.setState({
                                                                showBuildingSearch: true
                                                            })
                                                        }}
                                                        Value={this.state.buildingCode}
                                                        OnChange={(value) => {
                                                            this.setState({
                                                                showBuildingSearch: true
                                                            })
                                                        }}
                                                        Style={{ borderColor: "#848484" }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={this.state.buildingCode != "" ? styles.inputGroupStyle : { ...styles.inputGroupStyle, display: "none" }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={!this.state.noMeterNo && (this.state.buildingCode != "") ? styles.inputLabelStyle : { ...styles.inputLabelStyle, color: "#ABB2AC" }}>Apartment Number</Text>
                                                    {/* <Text style={{ ...styles.inputLabelStyle, color: "#ABB2AC" }}>Apartment Number</Text> */}
                                                    {
                                                        this.state.getMeterDetailsCalled || this.state.getBuildingFromPlotNoCalled ? <ActivityIndicator size={'small'} color={'#102D4F'} style={{ marginLeft: 5 }} /> : null
                                                    }

                                                </View>
                                                <View>
                                                    <TextInput
                                                        editable={this.state.noQR && (this.state.meterNo == "") && (this.state.buildingCode != "")}
                                                        onFocus={() => {
                                                            this.setState({
                                                                showApartmentSearch: true,
                                                                getVacantApartmentsCalled: true
                                                            }, () => this.props.getVacantApartments({
                                                                "TYPE": "APARTMENT_CODE",
                                                                "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                                "B_CODE": this.state.buildingCode,
                                                                "A_CODE": ""
                                                            }))
                                                        }}
                                                        Value={this.state.apartmentCode}
                                                        OnChange={(value) => {
                                                            this.setState({
                                                                showApartmentSearch: true,
                                                                getVacantApartmentsCalled: true
                                                            }, () => this.props.getVacantApartments({
                                                                "TYPE": "APARTMENT_CODE",
                                                                "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                                "B_CODE": this.state.buildingCode,
                                                                "A_CODE": ""
                                                            }))
                                                        }}
                                                        Style={{ borderColor: "#848484" }}
                                                    />
                                                </View>
                                            </View>

                                            <TouchableOpacity
                                                style={{ ...Mainstyles.buttonStyle, marginTop: 20}}
                                                onPress={() => {

                                                    if ((this.state.emirate.trim() == "") ||
                                                        ((this.state.email.trim() == "") && (this.state.existingDetails.EMAIL == "")) ||
                                                        (this.state.buildingCode.trim() == "") ||
                                                        (this.state.apartmentCode.trim() == "") ||
                                                        ((this.state.fullName.trim() == "") && (this.state.existingDetails.PARTY_NAME == ""))
                                                    ) {

                                                        this.toastIt("Enter All Details", false)
                                                    } else if ((this.state.apartmentCode.trim() == "0") || (this.state.apartmentCode.trim() == 0)) {
                                                        this.toastIt("Error in Apartment Number, Please re-select.", false)
                                                    } else {

                                                        if (this.state.email.trim().match(validRegex) || this.state.existingDetails.EMAIL.match(validRegex)) {

                                                            this.setState({
                                                                getFeeDetailsCalled: true
                                                            }, () => {
                                                                this.props.getFeeDetails({
                                                                    company: this.state.pickerCompanyData[this.state.companyCode].id,
                                                                    bcode: this.state.buildingCode,
                                                                    acode: this.state.apartmentCode
                                                                })
                                                            })
                                                        } else {
                                                            this.toastIt("Enter valid email address", false)
                                                        }
                                                    }
                                                }}
                                                disabled={this.state.getFeeDetailsCalled}
                                            >
                                                {
                                                    (this.state.getFeeDetailsCalled) ?
                                                        <ActivityIndicator size='small' color='white' /> :
                                                        <>
                                                            <View style={{ ...styles.paymentDueRow2 }}
                                                            >
                                                                <Text style={Mainstyles.buttonLabelStyle}>Next</Text>
                                                                {/* <Image
                                                                    source={require('../../../assets/images/click.png')}
                                                                    style={styles.clickImage}
                                                                /> */}
                                                            </View>
                                                            {/* <Text
                                            style={styles.buttonLabelStyle}>Next</Text> */}
                                                        </>
                                                }
                                            </TouchableOpacity>
                                            {/* <TouchableOpacity
                                                        style={{ ...styles.buttonStyle, ...{ width: "100%", flexDirection: 'row', backgroundColor: "#F7F9FB", marginTop: 5 } }}
                                                        onPress={() => this.setState({ noMeterNo: false, noQR: false ,openQrScanner:false})}
                                                    >
                                                        
                                                        <Text
                                                            style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Don't have QR Code Existing Now</Text>
                                                    </TouchableOpacity> */}
                                        </> :
                                        this.state.step == 2 ?
                                            <>
                                                <View style={styles.inputGroupStyle}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={styles.inputLabelStyle}>Tenancy Contract / Ejari / Title deed / Initial sales agreement</Text>
                                                    </View>
                                                    <View>
                                                        <View style={{ alignItems: 'center', marginVertical: 15 }}>
                                                            <TouchableOpacity onPress={() => {
                                                                if (this.state.tenancyContractFront == null) {
                                                                    // this.handleAttachImages("capture", "tenancyContract")
                                                                    this.setState({
                                                                        showPickerModal: true,
                                                                        currentImageType: "tenancyContract"
                                                                    })
                                                                } else {
                                                                    this.setState({
                                                                        showImageModal: true,
                                                                        currentImageUri: this.state.tenancyContractFront.assets[0].uri,
                                                                        currentImageType: "tenancyContract"
                                                                    })
                                                                }
                                                            }}>
                                                                {this.state.tenancyContractFront != null ?
                                                                    <Image style={{ ...styles.addImage, borderRadius: 4 }} source={{ uri: this.state.tenancyContractFront.assets[0].uri }} />
                                                                    : <Image style={{ ...styles.addImage, resizeMode: 'contain' }} source={require("../../../assets/images/camera2.png")} />
                                                                }
                                                            </TouchableOpacity>
                                                            <Text style={styles.frontBackText}>Attach image here</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-around' }}>
                                                    <TouchableOpacity
                                                        style={{ ...styles.buttonStyle, width: "40%", alignSelf: 'flex-start', backgroundColor: "#FFFFFF" }}
                                                        onPress={() => {
                                                            this.setState({
                                                                step: 1
                                                            })
                                                        }}
                                                        disabled={apiCallFlags.requestConnectionApiCalled}
                                                    >
                                                        <View style={{ ...styles.paymentDueRow2 }}
                                                        >
                                                            <Image
                                                                source={require('../../../assets/images/backBlue.png')}
                                                                style={{ ...styles.clickImage, marginRight: 6, marginLeft: 0 }}
                                                            />
                                                            <Text style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Back</Text>
                                                        </View>
                                                        {/* <Text
                                            style={styles.buttonLabelStyle}>Next</Text> */}

                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{ ...styles.buttonStyle, width: "40%", alignSelf: 'flex-end' }}
                                                        onPress={() => {
                                                            if (tenancyContractFront == null) {
                                                                this.toastIt("Add tenancy contract image")
                                                            } else {
                                                                this.setState({
                                                                    step: 3
                                                                })
                                                            }
                                                        }}
                                                        disabled={apiCallFlags.requestConnectionApiCalled}
                                                    >
                                                        <View style={{ ...styles.paymentDueRow2 }}
                                                        >
                                                            <Text style={styles.buttonLabelStyle}>Next</Text>
                                                            <Image
                                                                source={require('../../../assets/images/clickWhite.png')}
                                                                style={styles.clickImage}
                                                            />
                                                        </View>
                                                        {/* <Text
                                            style={styles.buttonLabelStyle}>Next</Text> */}

                                                    </TouchableOpacity>
                                                </View>
                                            </> :
                                            this.state.step == 3 ?
                                                <>
                                                    <View style={{ ...Mainstyles.accountsLabelView }}>
                                                        <Text style={Mainstyles.accountsLabel} >
                                                            Choose your preference
                                                        </Text>
                                                    </View>

                                                    <View style={{ ...styles.headerView, marginBottom: 0, minHeight: 40 }}>
                                                        <View style={{ flexDirection: "row", }}>
                                                            <View style={styles.headerCol1}>
                                                                <TouchableOpacity style={this.state.paidConnection ? { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1 } : { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1, backgroundColor: "#102D4F" }}
                                                                    onPress={() => { this.setState({ paidConnection: false }) }}>
                                                                    {/* <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image> */}
                                                                </TouchableOpacity>
                                                                <Text style={styles.preferrenceLabel} >
                                                                    Regular Connection
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    {
                                                        !this.state.feeDetails.excludedPrefferedConnection ? <View style={{ ...styles.headerView, marginTop: 0, marginBottom: 20 }}>
                                                            <View style={{ flexDirection: "row", }}>
                                                                <View style={styles.headerCol1}>
                                                                    <TouchableOpacity style={this.state.paidConnection ? { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1, backgroundColor: "#102D4F" } : { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 0.4 }}
                                                                        onPress={() => { this.setState({ paidConnection: true }) }}>
                                                                        {/* <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image> */}
                                                                    </TouchableOpacity>
                                                                    <View>
                                                                        <Text style={styles.preferrenceLabel} >
                                                                            Preferred Date for Connection
                                                                        </Text>
                                                                        <Text style={{ ...styles.preferrenceLabel, fontSize: 10 }} >
                                                                            Additional charges apply for Immediate Connection + Associated Fees : 105 AED
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View> : null
                                                    }


                                                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-around' }}>
                                                        <TouchableOpacity
                                                            style={{ ...styles.buttonStyle, width: "40%", alignSelf: 'flex-start', backgroundColor: "#FFFFFF" }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    step: 2
                                                                })
                                                            }}
                                                            disabled={apiCallFlags.requestConnectionApiCalled}
                                                        >
                                                            <View style={{ ...styles.paymentDueRow2 }}
                                                            >
                                                                <Image
                                                                    source={require('../../../assets/images/backBlue.png')}
                                                                    style={{ ...styles.clickImage, marginRight: 6, marginLeft: 0 }}
                                                                />
                                                                <Text style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Back</Text>
                                                            </View>
                                                            {/* <Text
                                            style={styles.buttonLabelStyle}>Next</Text> */}

                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={{ ...styles.buttonStyle, width: "40%", alignSelf: 'flex-end' }}
                                                            onPress={() => {
                                                                if (this.state.paidConnection) {
                                                                    this.setState({
                                                                        showPaidModal: true
                                                                    })
                                                                } else {
                                                                    this.setState({
                                                                        step: 4
                                                                    })
                                                                }
                                                            }}
                                                            disabled={apiCallFlags.requestConnectionApiCalled}
                                                        >
                                                            <View style={{ ...styles.paymentDueRow2 }}
                                                            >
                                                                <Text style={styles.buttonLabelStyle}>Next</Text>
                                                                <Image
                                                                    source={require('../../../assets/images/clickWhite.png')}
                                                                    style={styles.clickImage}
                                                                />
                                                            </View>
                                                            {/* <Text
                                            style={styles.buttonLabelStyle}>Next</Text> */}

                                                        </TouchableOpacity>
                                                    </View>
                                                </> :
                                                <>
                                                    <View style={styles.inputGroupStyle}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ ...styles.inputLabelStyle, color: "#e5a026" }}>New Connection Charges</Text>
                                                        </View>
                                                    </View>
                                                    {
                                                        (this.state.feeDetails.connectionAmt != "") && (this.state.feeDetails.connectionAmt != 0) ?
                                                            <View style={styles.cardBodyRow}>
                                                                <View style={styles.cardBodyColumnLeft}>
                                                                    <Text style={styles.cardBodyText}>Connection fee:</Text>
                                                                </View>
                                                                <View style={styles.cardBodyColumnRight}>
                                                                    <Text style={styles.cardBodyText1}>{this.state.feeDetails.connectionAmt == "" ? 0 : (parseFloat(this.state.feeDetails.connectionAmt) + (parseFloat(this.state.feeDetails.connectionAmt) * (parseFloat(this.state.feeDetails.connectionTaxPerc) / 100))).toFixed(2)}</Text>
                                                                </View>
                                                            </View> : null
                                                    }

                                                    {
                                                        (this.state.feeDetails.depositAmt != "") && (this.state.feeDetails.depositAmt != 0) ?
                                                            <View style={styles.cardBodyRow}>
                                                                <View style={styles.cardBodyColumnLeft}>
                                                                    <Text style={styles.cardBodyText}>Deposit:</Text>
                                                                </View>
                                                                <View style={styles.cardBodyColumnRight}>
                                                                    <Text style={styles.cardBodyText1}>{this.state.feeDetails.depositAmt == "" ? 0 : (parseFloat(this.state.feeDetails.depositAmt) + (parseFloat(this.state.feeDetails.depositAmt) * (parseFloat(this.state.feeDetails.depositTaxPerc) / 100))).toFixed(2)}</Text>
                                                                </View>
                                                            </View> : null
                                                    }

                                                    {
                                                        (this.state.feeDetails.disconnectionAmt != "") && (this.state.feeDetails.disconnectionAmt != 0) ?
                                                            <View style={styles.cardBodyRow}>
                                                                <View style={styles.cardBodyColumnLeft}>
                                                                    <Text style={styles.cardBodyText}>Disconnection fee:</Text>
                                                                </View>
                                                                <View style={styles.cardBodyColumnRight}>
                                                                    <Text style={styles.cardBodyText1}>{this.state.feeDetails.disconnectionAmt == "" ? 0 : (parseFloat(this.state.feeDetails.disconnectionAmt) + (parseFloat(this.state.feeDetails.disconnectionAmt) * (parseFloat(this.state.feeDetails.disconnectionTaxPerc) / 100))).toFixed(2)}</Text>
                                                                </View>
                                                            </View> : null
                                                    }

                                                    {
                                                        (this.state.feeDetails.insuranceAmt != "") && (this.state.feeDetails.insuranceAmt != 0) ?
                                                            <View style={styles.cardBodyRow}>
                                                                <View style={styles.cardBodyColumnLeft}>
                                                                    <Text style={styles.cardBodyText}>Insurance:</Text>
                                                                </View>
                                                                <View style={styles.cardBodyColumnRight}>
                                                                    <Text style={styles.cardBodyText1}>{this.state.feeDetails.insuranceAmt == "" ? 0 : (parseFloat(this.state.feeDetails.insuranceAmt) + (parseFloat(this.state.feeDetails.insuranceAmt) * (parseFloat(this.state.feeDetails.insuranceTaxPerc) / 100))).toFixed(2)}</Text>
                                                                </View>
                                                            </View> : null
                                                    }

                                                    {
                                                        (this.state.feeDetails.maintainanceAmt != "") && (this.state.feeDetails.maintainanceAmt != 0) ?
                                                            <View style={styles.cardBodyRow}>
                                                                <View style={styles.cardBodyColumnLeft}>
                                                                    <Text style={styles.cardBodyText}>Maintenance Fee:</Text>
                                                                </View>
                                                                <View style={styles.cardBodyColumnRight}>
                                                                    <Text style={styles.cardBodyText1}>{this.state.feeDetails.maintainanceAmt == "" ? 0 : (parseFloat(this.state.feeDetails.maintainanceAmt) + (parseFloat(this.state.feeDetails.maintainanceAmt) * (parseFloat(this.state.feeDetails.maintainanceTaxPerc) / 100))).toFixed(2)}</Text>
                                                                </View>
                                                            </View> : null
                                                    }

                                                    {
                                                        ((this.state.feeDetails.other1Amt != "") && (this.state.feeDetails.other1Amt != 0)) || ((this.state.feeDetails.other2Amt != "") && (this.state.feeDetails.other2Amt != 0)) || ((this.state.feeDetails.other3Amt != "") && (this.state.feeDetails.other3Amt != 0)) ?
                                                            <View style={styles.cardBodyRow}>
                                                                <View style={styles.cardBodyColumnLeft}>
                                                                    <Text style={styles.cardBodyText}>Misc:</Text>
                                                                </View>
                                                                <View style={styles.cardBodyColumnRight}>
                                                                    <Text style={styles.cardBodyText1}>
                                                                        {
                                                                            ((this.state.feeDetails.other1Amt == "" ? 0 : parseFloat(this.state.feeDetails.other1Amt) + (parseFloat(this.state.feeDetails.other1Amt) * (parseFloat(this.state.feeDetails.other1TaxPerc) / 100))) +
                                                                                (this.state.feeDetails.other2Amt == "" ? 0 : parseFloat(this.state.feeDetails.other2Amt) + (parseFloat(this.state.feeDetails.other2Amt) * (parseFloat(this.state.feeDetails.other2TaxPerc) / 100))) +
                                                                                (this.state.feeDetails.other3Amt == "" ? 0 : parseFloat(this.state.feeDetails.other3Amt) + (parseFloat(this.state.feeDetails.other3Amt) * (parseFloat(this.state.feeDetails.other3TaxPerc) / 100)))).toFixed(2)
                                                                        }
                                                                    </Text>
                                                                </View>
                                                            </View> : null
                                                    }

                                                    {
                                                        (this.state.feeDetails.registrationAmt != "") && (this.state.feeDetails.registrationAmt != 0) ?
                                                            <View style={styles.cardBodyRow}>
                                                                <View style={styles.cardBodyColumnLeft}>
                                                                    <Text style={styles.cardBodyText}>Registration fee:</Text>
                                                                </View>
                                                                <View style={styles.cardBodyColumnRight}>
                                                                    <Text style={styles.cardBodyText1}>{this.state.feeDetails.registrationAmt == "" ? 0 : (parseFloat(this.state.feeDetails.registrationAmt) + (parseFloat(this.state.feeDetails.registrationAmt) * (parseFloat(this.state.feeDetails.registrationTaxPerc) / 100))).toFixed(2)}</Text>
                                                                </View>
                                                            </View> : null
                                                    }

                                                    {this.state.paidConnection ?
                                                        <View style={styles.cardBodyRow}>
                                                            <View style={styles.cardBodyColumnLeft}>
                                                                <Text style={styles.cardBodyText}>Preferred connection fee:</Text>
                                                            </View>
                                                            <View style={styles.cardBodyColumnRight}>
                                                                <Text style={styles.cardBodyText1}>{parseFloat(105).toFixed(2)}</Text>
                                                            </View>
                                                        </View> : null
                                                    }

                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={{ ...styles.cardBodyText, fontSize: 16 }}>Total to be paid now:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={{ ...styles.cardBodyText1, fontSize: 16 }}>{this.state.paidConnection ? (this.state.feeDetails.totalAmt + 105).toFixed(2) : this.state.feeDetails.totalAmt.toFixed(2)}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={{ ...styles.inputGroupStyle, marginTop: 20 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ ...styles.inputLabelStyle, color: "#e5a026" }}>Other Charges</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Monthly Fee:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.feeDetails.monthlyFee == "" ? 0 : (parseFloat(this.state.feeDetails.monthlyFee) + (parseFloat(this.state.feeDetails.monthlyFee) * (parseFloat(this.state.feeDetails.monthlyTaxPerc) / 100))).toFixed(2)}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Unit Price:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.feeDetails.unitPrice == "" ? 0 : (parseFloat(this.state.feeDetails.unitPrice)).toFixed(2)}</Text>
                                                        </View>
                                                    </View>


                                                    <View style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row', marginTop: 60 } }}
                                                    >
                                                        <View style={styles.optionIconViewCol1}>
                                                            <CheckBox isChecked={this.state.terms} checkBoxColor='#102D4F' style={{ borderRadius: 4 }}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        terms: !this.state.terms
                                                                    })
                                                                }} />
                                                        </View>
                                                        {/* <Text style={styles.accountNumberText}>{t("support.emergency")}</Text> */}
                                                        {/* <View style={styles.paymentDueRow1}>
                                                        <Text style={styles.notCustomerText}>{t("home.savedCards")}</Text>
                                                    </View>
                                                    <View style={styles.paymentDueRow1}>
                                                        <Text style={styles.accountNumberText}>{t("home.viewCrds")}</Text>
                                                    </View> */}
                                                        <View style={{ ...styles.paymentDueRow2 }}
                                                        >
                                                            <Text style={styles.payBillText}>Accept </Text>
                                                            <TouchableOpacity onPress={() => {
                                                                this.setState({ showTermsModal: true })
                                                            }}>
                                                                <Text style={{ fontSize: 12, color: "#102D4F" }}>Terms and Conditions</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-around' }}>
                                                        <TouchableOpacity
                                                            style={{ ...styles.buttonStyle, width: "40%", alignSelf: 'flex-start', backgroundColor: "#FFFFFF" }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    step: 3
                                                                })
                                                            }}
                                                            disabled={apiCallFlags.requestConnectionApiCalled}
                                                        >
                                                            <View style={{ ...styles.paymentDueRow2 }}
                                                            >
                                                                <Image
                                                                    source={require('../../../assets/images/backBlue.png')}
                                                                    style={{ ...styles.clickImage, marginRight: 6, marginLeft: 0 }}
                                                                />
                                                                <Text style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Back</Text>
                                                            </View>
                                                            {/* <Text
                                            style={styles.buttonLabelStyle}>Next</Text> */}

                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={{ ...styles.buttonStyle, width: "40%", alignSelf: 'flex-end' }}
                                                            onPress={() => {
                                                                if (this.state.terms) {
                                                                    this.setState({
                                                                        showPayModal: true
                                                                    })
                                                                } else {
                                                                    this.toastIt("Accept terms and conditions", false)
                                                                }
                                                            }}
                                                            disabled={apiCallFlags.requestConnectionApiCalled}
                                                        >
                                                            <View style={{ ...styles.paymentDueRow2 }}
                                                            >
                                                                {
                                                                    (this.state.makepaymentcalled || this.state.apiCallFlags.requestConnectionApiCalled) ?
                                                                        <ActivityIndicator size={"small"} color={"#FFFFFF"} /> :
                                                                        <Text style={styles.buttonLabelStyle}>Pay {this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2)} AED</Text>
                                                                }
                                                                {/* <Image
                                                            source={require('../../../assets/images/clickWhite.png')}
                                                            style={styles.clickImage}
                                                        /> */}
                                                            </View>
                                                            {/* <Text
                                            style={styles.buttonLabelStyle}>Next</Text> */}

                                                        </TouchableOpacity>
                                                    </View>

                                                </>
                                    }
                                </View>
                            </ScrollView>

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
                                        button1Text: "Retake",
                                        button2Text: "Cancel",
                                        uri: { uri: this.state.currentImageUri }
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                />
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
                            {this.state.showHelpModal ? (
                                <Modal
                                    onClose={() => this.setState({ showHelpModal: false })}
                                    visible={this.state.showHelpModal}
                                    // button2={true}
                                    onButton2={() => {
                                        this.setState({ showHelpModal: false })
                                    }}
                                    data={{
                                        title: "Test",
                                        message: "Test",
                                        button2Text: "Close",
                                        uri: this.state.helpImageUrl,
                                        imageStyle: {
                                            height: 400,
                                            width: 330,
                                            resizeMode: "stretch",
                                        }
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                />
                            ) : null}

                            {this.state.showPaidModal ? <Modal
                                onClose={() => this.setState({ showPaidModal: false })}
                                visible={this.state.showPaidModal}
                                button1={true}
                                button2={true}
                                onButton1={() => {
                                    this.setState({ showPaidModal: false })
                                }}
                                onButton2={() => {
                                    this.setState({ showPaidModal: false, step: 4 })
                                    // this.makePayment()

                                }}
                                data={{
                                    // title: "Immediate Disconnection",
                                    // message: "Test",
                                    button1Text: "Close",
                                    button2Text: "Next",
                                    // uri: this.state.helpImageUrl,
                                    view: <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                                        {/* <View style={{ ...styles.cardView, marginBottom: 0 }}> */}
                                        {/* <View style={styles.inputGroupStyle}> */}
                                        <View>
                                            <Text style={styles.inputLabelStyle}>{t("myLinks.preferredDateAndTime")}</Text>
                                        </View>
                                        <View>
                                            <DatePicker
                                                mode="date"
                                                minimumDate={new Date().getHours() > 10 ? new Date(new Date().getTime() + (1 * 86400000)) : new Date()}
                                                maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                                                minuteInterval={30}
                                                date={this.state.date}
                                                onDateChange={(date) => {
                                                    this.setState({
                                                        date: date
                                                    })
                                                }} />
                                        </View>
                                    </View>
                                }}
                                titleText={{ alignItems: 'center' }}
                            /> :
                                null
                            }
                            {
                                this.state.showPayModal ?
                                    <Modal
                                        onClose={() => {
                                            this.setState({ showPayModal: false })
                                        }}
                                        visible={this.state.showPayModal}
                                        data={{
                                            title: "Select payment method",
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>

                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "100%", marginBottom: 10 }}
                                                    onPress={() => {
                                                        this.setState({
                                                            showPayModal: false,
                                                            makepaymentcalled: true
                                                        })
                                                        this.makePayment("")
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.buttonLabelStyle}>Pay {this.state.paidConnection ? (parseFloat(this.state.feeDetails.totalAmt) + 105).toFixed(2) : parseFloat(this.state.feeDetails.totalAmt).toFixed(2)} AED now</Text>
                                                </TouchableOpacity>


                                                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                {
                                                    this.state.applePaySupported || this.state.samsungPaySupported ?

                                                        <TouchableOpacity
                                                            style={{ ...styles.buttonStyle, width: "100%", marginBottom: 20 }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    showPayModal: false,
                                                                    payMode: this.state.applePaySupported ? "applepay" : "samsungpay",
                                                                    makepaymentcalled: true
                                                                })
                                                                this.makePayment(this.state.applePaySupported ? "applepay" : "samsungpay")
                                                            }}
                                                        >
                                                            {
                                                                this.state.applePaySupported ? <Image source={require("../../../assets/images/Apple_Pay.png")} style={{ height: 25, resizeMode: "contain" }} /> :
                                                                    <Image source={require("../../../assets/images/Samsung_Pay.png")} style={{ height: 30, resizeMode: "contain" }} />
                                                            }
                                                        </TouchableOpacity>
                                                        : null
                                                }

                                                {/* <TouchableOpacity
                                                style={{ ...styles.buttonStyle, width: "100%", marginBottom: 2 }}
                                                onPress={() => {
                                                    this.setState({
                                                        showPayModal: false
                                                    }, this.createContractWithoutpay)
                                                }}
                                            >
                                                <Text
                                                    style={styles.buttonLabelStyle}>Pay on connection</Text>
                                            </TouchableOpacity>
                                            <View style={{ marginBottom: 10, width: "100%" }}>
                                            <Text style={{ ...styles.accountNumberText, fontSize: 14, lineHeight: 20, color: "red" }}>Pay on connection will add 50 AED as additional charges. Total - {this.state.paidConnection ? ((parseFloat(this.state.feeDetails.totalAmt) + 105 + 52.5).toFixed(2)) : ((parseFloat(this.state.feeDetails.totalAmt) + 52.5).toFixed(2))} AED</Text>
                                            </View> */}

                                                {/* </View> */}

                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.showBuildingSearch ?
                                    // true ?
                                    <Modal
                                        onClose={() => this.setState({ showBuildingSearch: false })}
                                        visible={this.state.showBuildingSearch}
                                        // visible={true}
                                        button1={false}
                                        button2={false}
                                        data={{
                                            view: <View style={{ width: "100%", marginTop: 10 }}>
                                                {/* <TextInput
                                                editable={true}
                                                Placeholder="Search Building"
                                                OnChange={(value) => {
                                                    // this.setState({ apartmentCode: value })
                                                    this.setState({
                                                        getVacantApartmentsCalled: true,
                                                        pickerApartmentData: []
                                                    }, () => {
                                                        this.props.getVacantApartments({
                                                            "TYPE": "APARTMENT_CODE",
                                                            "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                            "B_CODE": this.state.buildingCode,
                                                            "A_CODE": value
                                                        })
                                                    })
                                                }}
                                                Style={{ borderColor: "#848484", width: "100%" }}
                                            /> */}
                                                <Text style={{ ...styles.inputLabelStyle, color: "#ABB2AC" }}>Select Building</Text>
                                                <ScrollView
                                                    style={{ height: 300, marginBottom: 5 }}
                                                >
                                                    {
                                                        this.state.pickerBuildingData.length ? this.state.pickerBuildingData.map(
                                                            data => {
                                                                return <TouchableOpacity
                                                                    onPress={() => {
                                                                        this.setState({
                                                                            buildingCode: data.value,
                                                                            apartmentCode: "",
                                                                            showBuildingSearch: false
                                                                        })
                                                                    }}
                                                                    style={{
                                                                        borderBottomWidth: 0.4, borderColor: "#E2E2E2", borderStyle: "solid", height: 40, borderRadius: 4, justifyContent: 'center'
                                                                    }}>
                                                                    <Text style={{
                                                                        ...styles.inputLabelStyle,
                                                                        marginLeft: 10
                                                                    }}>
                                                                        {data.name}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            }
                                                        ) : <Text style={{ ...styles.inputLabelStyle, alignSelf: 'center' }}>No data found</Text>
                                                    }
                                                </ScrollView>
                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.showApartmentSearch ?
                                    // true ?
                                    <Modal
                                        onClose={() => this.setState({ showApartmentSearch: false })}
                                        visible={this.state.showApartmentSearch}
                                        // visible={true}
                                        button1={false}
                                        button2={false}
                                        data={{
                                            view: <View style={{ width: "100%", marginTop: 10 }}>
                                                <TextInput
                                                    editable={true}
                                                    Placeholder="Search Apartment"
                                                    OnChange={(value) => {
                                                        // this.setState({ apartmentCode: value })
                                                        this.setState({
                                                            getVacantApartmentsCalled: true,
                                                            pickerApartmentData: []
                                                        }, () => {
                                                            this.props.getVacantApartments({
                                                                "TYPE": "APARTMENT_CODE",
                                                                "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                                "B_CODE": this.state.buildingCode,
                                                                "A_CODE": value
                                                            })
                                                        })
                                                    }}
                                                    Style={{ borderColor: "#848484", width: "100%" }}
                                                />
                                                <ScrollView
                                                    style={{ height: 300, marginBottom: 5 }}
                                                >
                                                    {
                                                        this.state.pickerApartmentData.length ? this.state.pickerApartmentData.map(
                                                            data => {
                                                                return <TouchableOpacity
                                                                    onPress={() => {
                                                                        this.setState({
                                                                            apartmentCode: data.name,
                                                                            showApartmentSearch: false
                                                                        })
                                                                    }}
                                                                    style={{
                                                                        borderBottomWidth: 0.4, borderColor: "#E2E2E2", borderStyle: "solid", height: 40, borderRadius: 4, justifyContent: 'center'
                                                                    }}>
                                                                    <Text style={{
                                                                        ...styles.inputLabelStyle,
                                                                        marginLeft: 10
                                                                    }}>
                                                                        {data.name}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            }
                                                        ) : this.state.getVacantApartmentsCalled ? <ActivityIndicator size={'small'} color={'#102D4F'} style={{ marginLeft: 5 }} /> : <Text style={{ ...styles.inputLabelStyle, alignSelf: 'center' }}>No data found</Text>
                                                    }
                                                </ScrollView>
                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.showMeterBrandList ?
                                    // true ?
                                    <Modal
                                        onClose={() => this.setState({ showMeterBrandList: false })}
                                        visible={this.state.showMeterBrandList}
                                        // visible={true}
                                        button1={false}
                                        button2={false}
                                        data={{
                                            view: <View style={{ width: "100%", marginTop: 10 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ ...styles.inputLabelStyle, color: "#ABB2AC" }}>Select Meter Brand</Text>
                                                </View>
                                                <ScrollView
                                                    style={{ height: 300, marginBottom: 5 }}
                                                >
                                                    {
                                                        this.state.pickerBrandData.length ? this.state.pickerBrandData.map(
                                                            data => {
                                                                return <TouchableOpacity
                                                                    onPress={() => {
                                                                        this.setState({
                                                                            meterBrand: data.label,
                                                                            showMeterBrandList: false
                                                                        }, () => {
                                                                            if ((this.state.emirate == "") || (this.state.emirate == null)) {
                                                                                this.toastIt("Select Emirate to search Building code and Apartment code", false)
                                                                            } else {
                                                                                if (this.state.meterNo != "") {
                                                                                    this.setState({
                                                                                        getMeterDetailsCalled: true
                                                                                    }, () => {
                                                                                        let req = {
                                                                                            "COMPANY": this.state.pickerCompanyData[this.state.companyCode].id,
                                                                                            "QUERY": this.state.meterNo,
                                                                                            "REMARKS": this.state.meterBrand
                                                                                        }
                                                                                        this.props.getMeterDetails(req)
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    }}
                                                                    style={{
                                                                        borderBottomWidth: 0.4, borderColor: "#E2E2E2", borderStyle: "solid", height: 40, borderRadius: 4, justifyContent: 'center'
                                                                    }}>
                                                                    <Text style={{
                                                                        ...styles.inputLabelStyle,
                                                                        marginLeft: 10
                                                                    }}>
                                                                        {data.label}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            }
                                                        ) : this.state.getBnoAnoCalled ? <ActivityIndicator size={'small'} color={'#102D4F'} style={{ marginLeft: 5 }} /> : <Text style={{ ...styles.inputLabelStyle, alignSelf: 'center' }}>No data found</Text>
                                                    }
                                                </ScrollView>
                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.showModal ?
                                    <Modal
                                        close={this.state.readingResult.split(" ")[0] !== "Payment"}
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
                                            // uri: this.state.helpImageUrl,
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                    source={this.state.readingResult.split(" ")[0] == "Payment" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png")}
                                                // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png") }
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStyle}>{this.state.readingResult.split(" ")[0] == "Payment" ? "Thank You" : "Technical Error"} </Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={styles.accountNumberText}>{this.state.readingResult}</Text>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "100%" }}
                                                    onPress={() => {
                                                        this.setState({
                                                            showModal: false
                                                        })
                                                        this.state.readingResult.split(" ")[0] !== "Payment" ? null : this.props.navigation.goBack()
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.buttonLabelStyle}>{this.state.readingResult.split(" ")[0] !== "Payment" ? "Try Again" : "Done"}</Text>
                                                </TouchableOpacity>

                                                {/* </View> */}

                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }

                            {
                                this.state.updateEmiratesId ?
                                    <Modal
                                        onClose={() => {
                                            this.setState({ updateEmiratesId: false })
                                            this.props.navigation.goBack()
                                        }}
                                        visible={this.state.updateEmiratesId}
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
                                            // uri: this.state.helpImageUrl,
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                    source={require("../../../assets/images/readingSuccess.png")}
                                                // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png") }
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStyle}>Update Emirates ID</Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={styles.accountNumberText}>Update Emirates ID to proceed for requesting the new connection</Text>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "100%" }}
                                                    onPress={() => {
                                                        this.setState({
                                                            updateEmiratesId: false
                                                        })
                                                        this.props.navigation.navigate("OcrTest", { fromOtp: true })
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.buttonLabelStyle}>Update Now</Text>
                                                </TouchableOpacity>

                                                {/* </View> */}

                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.excludedConnectionModal ?
                                    <Modal
                                        onClose={() => {
                                            this.setState({ excludedConnectionModal: false })
                                        }}
                                        visible={this.state.excludedConnectionModal}
                                        data={{
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                    source={require("../../../assets/images/readingSuccess.png")}
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStyle}>Almost there</Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={{ ...styles.accountNumberText, fontSize: 14, lineHeight: 20 }}>You are our special customer 😀. We get you everything at your doorstep 🧑‍🔧.</Text>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "100%" }}
                                                    onPress={() => {
                                                        this.setState({
                                                            excludedConnectionModal: false
                                                        })
                                                        Linking.openURL(`tel:600565657`)
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.buttonLabelStyle}>Call us</Text>
                                                </TouchableOpacity>

                                                {/* </View> */}

                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {this.state.showTermsModal ? (
                                <Modal
                                    onClose={() => this.setState({ showTermsModal: false })}
                                    visible={this.state.showTermsModal}
                                    onButton2={() => {
                                        this.setState({ showTermsModal: false })
                                    }}
                                    //   }}
                                    data={{
                                        title: "Terms & conditions",
                                        message: this.state.buildingTerms
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                />
                            ) : null}

                        </KeyboardAwareScrollView>
                    </InfoContainer>
                    {/* </InfoContainer> */}
                    {this.state.showToast ? (
                        <Toast message={this.state.toastMessage} isImageShow={false} />
                    ) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(RequestNewConnection, {
    methods: {
        getQrDetails: {
            type: 'post',
            moduleName: 'api',
            url: 'getQrDetails',
            authenticate: true,
        },
        requestNewConnection: {
            type: 'post',
            moduleName: 'api',
            url: 'createGasContract',
            authenticate: true,
        },
        updatePaymentLog: {
            type: 'post',
            moduleName: 'api',
            url: 'PaymentLog',
            authenticate: true,
        },
        getFeeDetails: {
            type: 'get',
            moduleName: 'api',
            url: 'getConnectionFee',
            authenticate: true,
        },
        getAvailableDatabase: {
            type: 'get',
            moduleName: 'api',
            url: 'getAvailableDatabaseCA',
            authenticate: true,
        },
        createnewContract: {
            type: 'post',
            moduleName: 'api',
            url: 'createGasContract',
            authenticate: true,
        },
        getUserDetails: {
            type: 'get',
            moduleName: 'api',
            url: 'getMobileUserDetails',
            authenticate: true,
        },
        getMeterDetails: {
            type: 'post',
            moduleName: 'api',
            url: 'getMeterDetails',
            authenticate: true,
        },
        getAllContracts: {
            type: 'get',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getContractsByMobile',
            authenticate: false,
        },
        getBuildingFromPlotNo: {
            type: 'post',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getBuildingfromPlotNo',
            authenticate: true,
        },
        getVacantApartments: {
            type: 'get',
            moduleName: 'api',
            url: 'getVacantApartments',
            authenticate: true,
        },
        getBnoAno: {
            type: 'get',
            moduleName: 'api',
            url: 'getBuildingApartmentLike',
            authenticate: true,
        },
    }
})
)



{/* <View style={{ ...styles.cardView, ...{ marginBottom: 10 } }} >
                                                            <View style={styles.paymentDueRow1}>
                                                                <Text style={styles.accountNumberText}>{t("support.attachImages")} <Text style={{ color: "red" }}> *</Text></Text>
                            
                                                                <View style={styles.addImageView}>
                                                                    <View style={styles.addImageViewCol1}>
                                                                        <TouchableOpacity onPress={() => {
                                                                            if (this.state.emiratesIdFront == null) {
                                                                                // this.handleAttachImages("capture", "emiratesId")
                                                                                this.setState({
                                                                                    showPickerModal: true,
                                                                                    currentImageType: "emiratesId"
                                                                                })
                                                                            } else {
                                                                                this.setState({
                                                                                    showImageModal: true,
                                                                                    currentImageUri: this.state.emiratesIdFront.assets[0].uri,
                                                                                    currentImageType: "emiratesId"
                                                                                })
                                                                            }
                                                                        }}>
                                                                            {this.state.emiratesIdFront != null ?
                                                                                <Image style={styles.addImage} source={{ uri: this.state.emiratesIdFront.assets[0].uri }} />
                                                                                : <Image style={styles.addImage} source={require("../../../assets/images/add.png")} />
                                                                            }
                                                                        </TouchableOpacity>
                                                                        <Text style={styles.frontBackText}>{t("home.emiratesId")}</Text>
                                                                    </View>
                                                                    <View style={styles.addImageViewCol2}>
                                                                        <TouchableOpacity onPress={() => {
                                                                            if (this.state.tenancyContractFront == null) {
                                                                                // this.handleAttachImages("capture", "tenancyContract")
                                                                                this.setState({
                                                                                    showPickerModal: true,
                                                                                    currentImageType: "tenancyContract"
                                                                                })
                                                                            } else {
                                                                                this.setState({
                                                                                    showImageModal: true,
                                                                                    currentImageUri: this.state.tenancyContractFront.assets[0].uri,
                                                                                    currentImageType: "tenancyContract"
                                                                                })
                                                                            }
                                                                        }}>
                                                                            {this.state.tenancyContractFront != null ?
                                                                                <Image style={styles.addImage} source={{ uri: this.state.tenancyContractFront.assets[0].uri }} />
                                                                                : <Image style={styles.addImage} source={require("../../../assets/images/add.png")} />
                                                                            }
                                                                        </TouchableOpacity>
                                                                        <Text style={styles.frontBackText}>{t("home.tenancyContract")}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View> */}

{/* <View style={styles.cardView} >

                                {
                                    emiratesIdFront != null ?
                                        <View style={styles.inputGroupStyle}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.inputLabelStyle}>{t("home.fullName")}</Text>
                                                <Text style={{ color: "red" }}> *</Text>
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
                                        : null
                                }

                                {
                                    emiratesIdFront != null ?
                                        <View style={styles.inputGroupStyle}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.inputLabelStyle}>{t("home.eIdNumber")}</Text>
                                                <Text style={{ color: "red" }}> *</Text>
                                            </View>
                                            <View>
                                                <TextInput
                                                    Type={"numeric"}
                                                    Value={this.state.emiratesIdNumber}
                                                    OnChange={(value) => {
                                                        this.setState({ emiratesIdNumber: value })
                                                    }}
                                                    keyboardType={"numeric"}
                                                />
                                            </View>
                                        </View>
                                        : null
                                }

                                {
                                    tenancyContractFront != null ?
                                        <>
                                            <View style={styles.inputGroupStyle}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.inputLabelStyle}>{t("home.plotNumber")}</Text>
                                                    <Text style={{ color: "red" }}> *</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", display: "flex", alignItems: 'center', }}>
                                                    <View style={(this.state.emirate == "DUBAI") || (this.state.emirate == "ABU_DHABI") ? { width: "90%", marginRight: 5 } : { width: "100%" }}>
                                                        <TextInput
                                                            // Style={{width: "100%"}}
                                                            Value={this.state.meterNo}
                                                            OnChange={(value) => {
                                                                this.setState({ meterNo: value })
                                                            }}
                                                        />
                                                    </View>
                                                    {
                                                        (this.state.emirate == "DUBAI") || (this.state.emirate == "ABU_DHABI") ?
                                                            <View style={{ width: "10%" }}>
                                                                <TouchableOpacity onPress={() => {
                                                                    this.setState({
                                                                        showHelpModal: true,
                                                                        helpImageUrl: this.state.emirate == "DUBAI" ? require("../../../assets/images/dubai_plot_no.jpg") : require("../../../assets/images/abudhabi_plot_no.jpg")
                                                                    })
                                                                }}>
                                                                    <Image style={{ width: 22, height: 22, resizeMode: "stretch", }}
                                                                        source={require("../../../assets/images/icon-feather-help-circle-2.png")}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                            : null
                                                    }
                                                </View>
                                            </View>

                                            <View style={styles.inputGroupStyle}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.inputLabelStyle}>{t("home.tenancyContractNumber")}</Text>
                                                    <Text style={{ color: "red" }}> *</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", display: "flex", alignItems: 'center', }}>
                                                    <View style={(this.state.emirate == "DUBAI") || (this.state.emirate == "ABU_DHABI") ? { width: "90%", marginRight: 5 } : { width: "100%" }}>
                                                        <TextInput
                                                            Value={this.state.tenancyContractNo}
                                                            OnChange={(value) => {
                                                                this.setState({ tenancyContractNo: value })
                                                            }}
                                                        />
                                                    </View>
                                                    {
                                                        (this.state.emirate == "DUBAI") || (this.state.emirate == "ABU_DHABI") ?
                                                            <View style={{ width: "10%" }}>
                                                                <TouchableOpacity onPress={() => {
                                                                    this.setState({
                                                                        showHelpModal: true,
                                                                        helpImageUrl: this.state.emirate == "DUBAI" ? require("../../../assets/images/dubai_tenancy_no.jpg") : require("../../../assets/images/abudhabi_tenancy_no.jpg")
                                                                    })
                                                                }}>
                                                                    <Image style={{ width: 22, height: 22, resizeMode: "stretch", }}
                                                                        source={require("../../../assets/images/icon-feather-help-circle-2.png")}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                            : null
                                                        }

                                                </View>
                                            </View>
                                        </> : null
                                }

                                {((buildingCode != "") || noQR) ?
                                    <>
                                        <View style={styles.inputGroupStyle}>
                                            <View>
                                                <Text style={styles.inputLabelStyle}>Building Code</Text>
                                            </View>
                                            <View>
                                                <TextInput
                                                    Value={this.state.buildingCode}
                                                    OnChange={(value) => {
                                                        this.setState({ buildingCode: value })
                                                    }}
                                                    Style={{ borderColor: "#848484" }}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputGroupStyle}>
                                            <View>
                                                <Text style={styles.inputLabelStyle}>Apartment Code</Text>
                                            </View>
                                            <View>
                                                <TextInput
                                                    Value={this.state.apartmentCode}
                                                    OnChange={(value) => {
                                                        this.setState({ apartmentCode: value })
                                                    }}
                                                    Style={{ borderColor: "#848484" }}
                                                />
                                            </View>
                                        </View>
                                    </>
                                    :
                                    null
                                }

                            </View> */}



