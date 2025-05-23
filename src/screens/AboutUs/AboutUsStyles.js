import { StyleSheet } from "react-native"
import { fontSize } from "../../services/api/data/data/constants"

const styles = StyleSheet.create({
  viewView: {
    backgroundColor: "#e0e7f4ff",
    // flex: 1,
    // display: "flex",
    
  },
  imageView: {
    width: "100%",
    // alignItems: "center",
    marginVertical: "10%",
    flexDirection: "row"
  },
  goodieeLogoImage: {
    backgroundColor: "transparent",
    resizeMode: "center",
    width: 101.32,
    height: 66.41,
    // marginTop: -125,
  },
  headerView: {
    // position: "absolute",
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: Platform.OS === 'ios' ? null : 20,
    minHeight: 60,
    zIndex: 2,
  },
  headerCol1: {
    width: "75%",
    alignItems: "flex-start",
  },
  headerCol2:{
    width: "25%",
    alignItems: "flex-end"
  },
  pageHeader: {
    fontFamily: "Tajawal-Bold",
    fontSize: 17,
    color: "#FFFFFF"
  },
  scrollView: {
    // flex: 1,
    // display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: 'center',
    paddingBottom: 80,
    // paddingTop: 120,
    // height: "100%",
    // overflow: "scroll"
  },

  userNameLabel: {
    fontFamily: "Tajawal-Regular",
    fontSize: 24,
    color: "rgba(110, 149, 213, 1)"
  },
  cardView: {
    width: "95%",
    minHeight: 100,
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: "rgba(0, 0, 0, 1)",
    // borderWidth: 0.1,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { height: 25, width: 25 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 15,  // Android,
    paddingVertical: 20,
    marginVertical: 10,
    paddingHorizontal: 15
  },
  paymentDueRow1: {
    paddingHorizontal: 15
  },
  paymentDueRow2: {
    marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  optionIconViewCol1: {
    paddingHorizontal: 15,
  },
  optionIconViewCol2: {
    width: "95%",
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
      fontFamily: "Tajawal-Regular",
      fontSize: 21,
      color: "rgba(110, 149, 213, 1)",
      textAlign: "justify"
  },
  answerText: {
    fontFamily: "Tajawal-Regular",
    fontSize: 13,
    color: "#2D395A",
    textAlign: "justify"
  },
  whoWeAreText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 30,
    color: "#2D395A",
    textAlign: "justify"
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
  amountView: {
      flexDirection: "row",
      alignItems: 'flex-end',
      marginTop: 5,
      width: "50%"
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
    fontWeight: "600"
},
  cardBodyView: {
    paddingHorizontal: 15,
    marginBottom: 10
  },
  inputLabelStyle: {
    color: "rgba(134, 120, 120, 1)",
    fontFamily: "Tajawal-Regular",
    fontSize: 18,
    fontWeight: "600"
  },
  buttonView: {
    paddingHorizontal: 15,
    marginVertical: 25
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
    height: 59,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 5,  // Android
  },
  buttonLabelStyle: {
    color: "rgba(250, 203, 64, 1)",
    fontSize: 24,
    fontFamily: "Tajawal-Regular"
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
    color: "rgba(250, 203, 64, 1)",
    fontFamily: "Tajawal-Regular",
    fontSize: 11,
  },
  findUs: {
    color: "#2D395A",
    fontSize: 14,
    fontFamily: "Tajawal-Bold",
    marginTop: 30,
    marginBottom: 10,
    width: "95%"
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
    height: 20,
    // width: 7,
    resizeMode: 'center',
    marginLeft: 6

  }
})

export default styles
