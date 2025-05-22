import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import { t } from '../services/translate/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBuildingUser, faBuilding, faFileSignature } from '@fortawesome/free-regular-svg-icons';
import { faDoorClosed, faDoorOpen, faFileContract } from '@fortawesome/free-solid-svg-icons';

class HomeMainCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentIndex: 0
        }

        // this.carousel = React.createRef();
    }


    async componentDidMount() {
        let activeIndex = await AsyncStorage.getItem("sergas_customer_active_contract_index")
        this.setState({
            currentIndex: parseInt(activeIndex)
        }, () => {
            setTimeout(() => {
                if (this.carousel && this.carousel.snapToItem) {
                    this.carousel.snapToItem(this.state.currentIndex)
                }
            }, 250)

            this.props.currentIndex(this.state.currentIndex)
        })
    }

    renderItem = ({ item, index }) => {
        const isSelected = index === this.state.currentIndex;

        return (
            <View>
                {/* Floating Label ABOVE the card */}
                {/* <View style={styles.cardFloatingLabel}>
                    <Text style={styles.cardFloatingLabelText}>
                        {item.CONTRACT_NO}
                    </Text>
                </View> */}

                <View style={[
                    styles.cardContainer,
                    {
                        borderColor: isSelected ? "#102D4F1F" : "#E2E8F0",
                        borderWidth: isSelected ? 2 : 1,
                        marginTop: 10, // Add margin below label
                    }
                ]}>
                    {/* Header Row */}

                    <View style={styles.grid}>
                        <View style={styles.gridItem}>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faFileContract} size={10} style={{ fontWeight: 'normal' }} />

                                <Text style={styles.label}> Contract No.</Text>
                            </View>
                            <Text style={styles.value}>{item.CONTRACT_NO}</Text>
                        </View>

                        <View style={styles.gridItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faDoorOpen} size={10} style={{ fontWeight: 'normal' }} />
                                <Text style={styles.label}> Flat No.</Text>
                            </View>
                            <Text style={styles.value}>{item.APARTMENT_CODE}</Text>
                        </View>

                    </View>

                    <View style={styles.headerRow}>
                        {/* Building Name */}


                        <View style={styles.headerBox}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <Icon name="business-outline" style={styles.TitleIcon} /> */}
                                <FontAwesomeIcon icon={faBuilding} size={10} style={{ fontWeight: 'normal' }} />
                                <Text style={styles.label}> Building Name</Text>
                            </View>
                            <Text style={styles.value}>{item.BUILDING_NAME}</Text>
                            {/* <Text style={styles.value}>AL MASKAN BUILDING-AL GHANDI </Text> */}

                        </View>

                    </View>

                    {/* 2x2 Grid of Details */}
                    <View style={styles.grid}>
                        {/* <View style={styles.gridItem}>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faFileContract} size={10} style={{ fontWeight: 'normal' }} />

                                <Text style={styles.label}> Building No.</Text>
                            </View>
                            <Text style={styles.value}>{item.BUILDING_NAME}</Text>
                        </View>

                        <View style={styles.gridItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faDoorOpen} size={10} style={{ fontWeight: 'normal' }} />
                                <Text style={styles.label}> Flat No.</Text>
                            </View>
                            <Text style={styles.value}>{item.APARTMENT_CODE}</Text>
                        </View> */}

                        <View style={styles.gridItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="speedometer-outline" style={styles.TitleIcon} />
                                <Text style={styles.label}> Last Meter Reading</Text>
                            </View>

                            <Text style={styles.value}>{item.LAST_READING}</Text>
                        </View>

                        {/* Last Consumption */}
                        <View style={styles.gridItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="pulse-outline" style={styles.TitleIcon} />
                                {/* <FontAwesomeIcon icon={faBuilding} style={{fontSize:50}} /> */}
                                <Text style={styles.label}> Last Consumption</Text>
                            </View>
                            <Text style={styles.value}>
                                {Math.round((item.LAST_READING - item.PREVIOUS_READING) * 100) / 100}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };


    render() {
        const { height, width } = Dimensions.get("screen")
        return (
            <View style={styles.cardView} >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {this.props.contracts.length ? (this.props.from == "home" || this.props.from == "profile")
                        ?
                        null
                        // <View style={styles.cardHeader}>
                        //     <Image
                        //         source={require("../../assets/images/HomeProfile.png")}
                        //         style={styles.HomeProfileImage} />
                        //     <View style={styles.profileLabelView}>
                        //         <Text style={styles.cardHeaderText}>{this.props.contracts.length ? this.props.contracts[0].PARTYNAME : ''}</Text>
                        //         <Text style={styles.accountNumberText}>{this.props.contracts.length ? this.props.contracts[0].USER_ID : ''}</Text>
                        //     </View>
                        // </View>
                        : this.props.from == "payment"
                            ? null
                            // <View style={styles.cardHeader}>
                            //     <View style={styles.paymentDueRow1}>
                            //         <Text style={styles.accountNumberText}>{t("payment.totalAmountDue")}</Text>
                            //     </View>
                            //     <View style={styles.paymentDueRow2}>
                            //         <View style={styles.amountView}>
                            //             <Text style={styles.paymentAmountText}>{this.props.contracts.length ? 
                            //             this.props.contracts[this.state.currentIndex].OUTSTANDING_AMT > 0 ? this.props.contracts[this.state.currentIndex].OUTSTANDING_AMT  : 0 
                            //             : 0}</Text>
                            //             <Text style={styles.aedText}>{t("home.aed")}</Text>
                            //         </View>
                            //     </View>
                            // </View>
                            : null : null}
                </View>

                <View style={(this.props.from == "profile" || this.props.from == "raiseComplaint") ? { ...styles.cardBodyView, ...{ borderBottomWidth: 0 } } : styles.cardBodyView}>
                    <Carousel
                        // layout='stack'
                        removeClippedSubviews={false}
                        ref={(c) => { this.carousel = c; }}
                        data={this.props.contracts}
                        renderItem={this.renderItem}
                        sliderWidth={width * (100 / 100)}
                        itemWidth={width * (85 / 100)}
                        onSnapToItem={async (index) => {
                            await AsyncStorage.setItem("sergas_customer_active_contract_index", this.carousel.currentIndex.toString())
                            this.setState({ currentIndex: this.carousel.currentIndex }, () => this.props.currentIndex(this.carousel.currentIndex))
                        }}
                        enableSnap={true}

                    />
                </View>

                {/* {this.props.contracts.length ? this.props.from == "home"
                    ? <View style={styles.buttonView}>
                        <Text style={{ ...styles.accountNumberText, ...{ color: "#707070" } }}>{t("home.usageCharges")}</Text>
                        <View style={styles.amountView}>

                            <View style={{ width: "50%", alignItems: 'center' }}>
                                <View style={{ width: "100%", flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <Text style={styles.amountText}>{this.props.contracts.length ?
                                        this.props.contracts[this.state.currentIndex].OUTSTANDING_AMT > 0 ? this.props.contracts[this.state.currentIndex].OUTSTANDING_AMT : 0
                                        : 0}</Text>
                                    <Text style={styles.aedText}>{t("home.aed")}</Text>
                                </View>
                                <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={{...styles.payBillView, marginTop: 0, width: "100%", justifyContent: 'flex-start'}}
                                        onPress={this.props.handlePayBill}
                                        disabled={!(this.props.contracts[this.state.currentIndex].OUTSTANDING_AMT > 0)}
                                    >
                                        {
                                this.props.loading ?
                                <ActivityIndicator size={'small'} color={'black'}/> :
                                        <Text style={
                                            this.props.contracts[this.state.currentIndex].OUTSTANDING_AMT > 0 ?
                                            styles.payBillText : {...styles.payBillText, color: "rgba(245, 226, 171, 1)"}}>Pay</Text> }
                                        // <Image
                                        //     source={require('../../assets/images/click.png')}
                                        //     style={styles.clickImage}
                                        // />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <TouchableOpacity
                                style={{...styles.payBillView, height: "100%"}}
                                onPress={this.props.handleMoreServices}
                            >
                                <Text style={styles.payBillText}>{t("home.payBill")}</Text>
                                <Image
                                    source={require('../../assets/images/click.png')}
                                    style={styles.clickImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    : this.props.from == "payment"
                        ? <View style={styles.buttonView}>
                        <TouchableOpacity
                          onPress={this.props.makePayment}
                          style={this.props.contracts.length ? 
                            this.props.contracts[this.state.currentIndex].OUTSTANDING_AMT > 0 ? styles.buttonStyle : {...styles.buttonStyle,backgroundColor: "#9eb3db"} : styles.buttonStyle}
                          disabled={this.props.contracts.length ? 
                            !(this.props.contracts[this.state.currentIndex].OUTSTANDING_AMT > 0) : false}
                        // disabled={true}
                        >
                            {
                                this.props.loading ?
                                <ActivityIndicator size={'small'} color={'white'}/> :
                                <Text
                            style={styles.buttonLabelStyle}>{t("home.makePayment")}</Text>
                            }
                          
                        </TouchableOpacity>
                      </View>
                        : null : null} */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        width: "100%",
        minHeight: 100,
        // borderRadius: 8,
        // borderStyle: "solid",
        // borderColor: "rgba(0, 0, 0, 0.5)",
        // borderWidth: 0.5,
        // shadowColor: 'rgba(0, 0, 0, 0.5)',
        // shadowOffset: { height: 2, width: 2 }, // IOS
        // shadowOpacity: 0.5, // IOS
        // shadowRadius: 1, //IOS
        // backgroundColor: '#fff',
        // elevation: 15,  // Android,
        // paddingVertical: 20,
        marginBottom: 10,
    },
    cardHeader: {
        // paddingHorizontal: "10%",
        width: Dimensions.get('screen').width * (90 / 100),
        alignItems: "center",
        flexDirection: "row",
        justifyContent: 'flex-start',
    },
    HomeProfileImage: {
        backgroundColor: "transparent",
        // resizeMode: "center",
        width: 60,
        height: 60,
        // marginTop: -125,
    },
    profileLabelView: {
        flexDirection: "column",
        marginHorizontal: 10,
        //   height: "100%",
        justifyContent: "center",
    },
    cardHeaderText: {
        fontFamily: "Tajawal-Bold",
        fontSize: 14,
        color: "#2D395A",
        marginBottom: 4
    },
    accountNumberText: {
        fontFamily: "Tajawal-Medium",
        fontSize: 12,
        color: "#707070"
    },
    paymentDueRow1: {
        // paddingHorizontal: 15,
        width: "50%"
    },
    paymentDueRow2: {
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        width: "50%",
        justifyContent: 'flex-end'
    },
    cardBodyView: {
        // paddingHorizontal: "10%",
        // marginBottom: 10,
        marginTop: 5,
        paddingBottom: 0,
        // borderBottomWidth: 1,
        // borderBottomColor: "rgba(232, 226, 226, 1)",
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputLabelStyle: {
        color: "rgba(134, 120, 120, 1)",
        fontFamily: "Tajawal-Regular",
        fontSize: 18,
        fontWeight: "600"
    },
    buttonView: {
        paddingHorizontal: 15,
        marginVertical: 10,
        height: 30
    },
    buttonStyle: {
        // backgroundColor: "rgb(79, 194, 212)",
        borderColor: "rgba(110, 149, 213, 0.2)",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        alignSelf: "flex-end",
        width: "100%",
        height: 50,
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#577ABD',
        elevation: 5,  // Android
    },
    buttonLabelStyle: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily: "Tajawal-Medium"
    },
    clickImage: {
        height: 19,
        width: 10,
        resizeMode: 'stretch',

    },
    clickButton: {
        width: 30,
        alignItems: 'center'
    },
    payBillView: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-end",
        marginTop: 5,
        width: "50%"
    },
    payBillText: {
        color: "rgba(250, 203, 64, 1)",
        fontFamily: "Tajawal-Regular",
        fontSize: 14,
        marginRight: 10
    },
    cardBodyTitleView: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 8,
        flexDirection: 'row'
    },
    cardBodyTitleText: {
        color: "#e5a026",
        fontFamily: "Tajawal-Bold",
        fontSize: 16,
        // marginHorizontal: 10,
    },
    cardBodyRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        marginBottom: 2,
    },
    cardBodyColumnLeft: {
        width: "50%",
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    cardBodyColumnRight: {
        width: "50%",
        alignItems: 'flex-start',
        paddingLeft: "10%"
    },
    cardBodyText: {
        color: "#102D4F",
        fontFamily: "Tajawal-Bold",
        fontSize: 14
    },
    cardBodyText1: {
        color: "#8E9093",
        fontFamily: "Tajawal-Medium",
        fontSize: 12
    },
    amountText: {
        color: "#2D395A",
        fontFamily: "Tajawal-Bold",
        fontSize: 13,
    },
    paymentAmountText: {
        color: "#2D395A",
        fontFamily: "Tajawal-Bold",
        fontSize: 18,
    },
    aedText: {
        color: "#2D395A",
        fontFamily: "Tajawal-Bold",
        fontSize: 8,
        marginLeft: 1,
        paddingBottom: 3
    },
    amountView: {
        flexDirection: "row",
        alignItems: 'flex-end',
    },


    cardContainer: {
        borderRadius: 15,
        padding: 7,
        marginBottom: 2,
        backgroundColor: "#FFFFFF",
    },
    headerRow: {
        justifyContent: 'space-between',
        marginBottom: 3,
        marginTop: 3,
    },
    headerBox: {
        backgroundColor: '#F7FAFC',
        borderRadius: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 2,
    },
    label: {
        fontSize: 9,
        color: '#4A5563',
        fontWeight: '300',
    },
    value: {
        fontSize: 11,
        fontWeight: '800',
        color: '#0058a2',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    gridItem: {
        width: '48%',
        backgroundColor: '#F7FAFC',
        borderRadius: 10,
        padding: 7,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 2,
    },
    cardFloatingLabel: {
        position: 'absolute',
        top: 0,
        left: 15,
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 2,
        zIndex: 2,
        borderRadius: 5,
    },
    cardFloatingLabelText: {
        fontSize: 14,
        color: '#0058a2',
        fontWeight: '900',
        paddingBottom: 0,
    },

})

export default HomeMainCard
