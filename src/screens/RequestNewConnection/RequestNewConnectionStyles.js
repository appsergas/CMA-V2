import { Platform, StyleSheet } from "react-native"
import { fontSize } from "../../services/api/data/data/constants"

const styles = StyleSheet.create({
  viewView: {
    backgroundColor: "#e0e7f4ff",
    // flex: 1,
    // display: "flex",
    
  },
  imageView: {
    width: "100%",
    alignItems: "center",
    marginBottom: "5%"
  },
  goodieeLogoImage: {
    backgroundColor: "transparent",
    resizeMode: "center",
    width: "75%",
    maxWidth: 300,
    minWidth: 150,
    height: 200,
    // marginTop: -125,
  },
  headerView: {
    // position: "absolute",
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: Platform.OS === 'ios' ? null : 10,
    minHeight: Platform.OS === 'ios' ? null : 60,
    // zIndex: 2
  },
  headerCol1: {
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  headerCol2:{
    width: "25%",
    alignItems: "flex-end"
  },
  amountView: {
    width: "95%",
    height: 48,
    borderRadius: 4,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    zIndex: 2,
    backgroundColor: "#FEFBF6",
    marginBottom: 50
  },
  amountCol1: {
    width: "75%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  amountCol2:{
    width: "25%",
    alignItems: "flex-end"
  },
  amountLabel: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
    color: "#FFFFFF"
  },
  pageHeader: {
    fontFamily: "Tajawal-Bold",
    fontSize: 17,
    color: "#FFFFFF"
  },
  welcomeLabel: {
    fontFamily: "Tajawal-Bold",
    fontSize: 18,
    color: "#FFFFFF"
  },
  preferrenceLabel: {
    fontFamily: "Tajawal-Regular",
    fontSize: 14,
    color: "#8E9093"
  },
  cardBodyRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    marginBottom: 2,
    width: "80%"
},
  cardBodyColumnLeft: {
    width: "70%",
    alignItems: 'flex-start',
    flexDirection: 'row'
},
cardBodyColumnRight: {
    width: "30%",
    alignItems: 'flex-start',
    paddingLeft: "10%"
},
cardBodyText: {
    color: "#102D4F",
    fontFamily: "Tajawal-Medium",
    fontSize: 12
},
cardBodyText1: {
    color: "#8E9093",
    fontFamily: "Tajawal-Regular",
    fontSize: 12
},
  scrollView: {
    // flex: 1,
    // display: "flex",
    // flexGrow: 1,
    // justifyContent: "flex-start",
    // alignItems: 'center',
    // alignContent: "center",
    // paddingBottom: 80
    // height: "100%",
    // overflow: "scroll"
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: 'center',
    paddingBottom: 80
  },
  tabNumberActive: { fontSize: 16, color: "#FFFFFF", fontFamily: "Tajawal-Bold" },
  tabNumberInactive: { fontSize: 16, color: "#8E9093", fontFamily: "Tajawal-Bold" },
  tabIconActive: { height: 24, width: 24, borderRadius: 16, backgroundColor: "#102D4F", alignItems: 'center', justifyContent: "center" },
  tabIconInactive: { height: 24, width: 24, borderRadius: 16, backgroundColor: "#E2E2E2", alignItems: 'center', justifyContent: "center" },

  userNameLabel: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
    color: "#e5a026"
  },
  accountLabel: {
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    color: "#102D4F"
  },
  cardView: {
    width: "100%",
    minHeight: 100,
    borderRadius: 4,
    // borderStyle: "solid",
    //     borderColor: "#ABB2AC",
    //     borderWidth: 0.4,
    //     shadowColor: 'rgba(0, 0, 0, 0.5)',
    //     shadowOffset: { height: 2, width: 2 }, // IOS
    //     shadowOpacity: 0.5, // IOS
    //     shadowRadius: 1, //IOS
    // backgroundColor: '#fff',
    // elevation: 15,  // Android,
    paddingVertical: 10,
    marginBottom: 8,
    alignItems: "center"
  },
  icon:  {
    height: 40,
    width: 40,
    resizeMode: "stretch"
},
  paymentDueRow1: {
    paddingHorizontal: 15
  },
  paymentDueRow2: {
    // marginTop: 10,
    // paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  optionIconViewCol1: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  addImageView: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    overflow: "visible",
  },
  addImageViewCol: {
    width: "33%",
    alignItems: "center"
  },
  optionIconViewCol2: {
      justifyContent: "center",
    // backgroundColor: "red"
  },
  cardHeader: {
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginVertical: 20
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
    fontFamily: "Tajawal-Regular",
    fontSize: 18,
    color: "rgba(110, 149, 213, 1)",
  },
  accountNumberText: {
      fontFamily: "Tajawal-Medium",
      fontSize: 12,
      color: "#102D4F"
  },
  noteText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 12,
    color: "#FEBA12"
  },
  imageClearText: {
    fontFamily: "Tajawal-Medium",
    fontSize: 12,
    color: "#707070"
  },
  frontBackText: {
    fontFamily: "Tajawal-Regular",
    fontSize: 14,
    color: "rgba(134, 120, 120, 1)"
  },
  addImage: {
    height: 48,
    width: 58,
    resizeMode: "stretch",
  },
  amountText: {
      color: "rgba(110, 149, 213, 1)",
      fontFamily: "Tajawal-Bold",
      fontSize: 24,
  },
  aedText: {
      color: "rgba(110, 149, 213, 1)",
      fontFamily: "Tajawal-Bold",
      fontSize: 12,
      marginLeft: 1
  },
  payBillView: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "flex-end",
    marginTop: 5,
    width: "50%"
},
payBillText: {
    color: "#8E9093",
    fontFamily: "Tajawal-Regular",
    fontSize: 12,
    fontWeight: "600"
},
  cardBodyView: {
    paddingHorizontal: 15,
    marginBottom: 10
  },
  inputGroupStyle: {
    width: "100%",
    // flexDirection: "row",
    marginBottom: 10
  },
  inputLabelStyle: {
    color: "#102D4F",
    fontFamily: "Tajawal-Bold",
    fontSize: 18,
    fontWeight: "600"
  },
  buttonView: {
    paddingHorizontal: 15,
    marginVertical: 25
  },
  buttonStyle: {
    // backgroundColor: "rgb(79, 194, 212)",
    // borderColor: "rgba(110, 149, 213, 0.2)",
    // borderStyle: "solid",
    // borderWidth: 1,
    borderRadius: 8,
    // flexDirection: "row",
    alignItems: "center",
    paddingLeft:20,
    // justifyContent: "center",
    padding: 0,
    // alignSelf: "flex-end",
    width: "95%",
    height: 40,
    // shadowColor: 'rgba(0,0,0, .4)',
    // shadowOffset: { height: 2, width: 2 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    // backgroundColor: '#102D4F',
    backgroundColor: '#0057A2',
    // elevation: 5,  // Android
  },
  buttonLabelStyle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight:"500",
    fontFamily: "Tajawal-Medium"
  },
  registerButtonViewStyle: {
    width: "95%",
  },
  registerButtonStyle: {
    // backgroundColor: "rgb(79, 194, 212)",
    borderColor: "rgba(110, 149, 213, 0.2)",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    alignSelf: "flex-end",
    width: "100%",
    height: 59,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 5,  // Android
  },
  notCustomerText: {
    color: "#102D4F",
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
    fontWeight: "600"
  },
  registerHereText: {
    color: "rgba(250, 203, 64, 1)",
    fontSize: 14,
    fontFamily: "Tajawal-Regular"
  },
  notCustomerView: {
    width: "50%",
    alignItems: "flex-start",
  },
  registerHereView: {
    width: "50%",
    alignItems: 'center',
    textAlign: "right",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  clickImage: {
    height: 16,
    width: 16,
    resizeMode: 'stretch',
    marginLeft: 6

  },

  containerr: {
    position: 'relative',
    width: '100%',
    borderColor: '#848484',
    borderWidth: 1,
    borderRadius: 10,
    paddingRight: 40, // space for the icon
    marginVertical: 10,
  },
  textInput: {
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
    color: '#000',
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  iconn: {
    width: 20,
    height: 20,
    tintColor: '#003366', // Optional, if you want to color it like the screenshot
  },


})

export default styles
