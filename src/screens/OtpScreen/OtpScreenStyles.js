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
    alignItems: "center",
    marginBottom: "5%"
  },
  goodieeLogoImage: {
    backgroundColor: "transparent",
    resizeMode: "stretch",
    width: 155,
    height: 101.6,
    // marginTop: -125,
  },
  scrollView: {
    // flex: 1,
    // display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: 'center',
    // height: "100%",
    // overflow: "scroll"
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
  cardView: {
    width: "95%",
    minHeight: 100,
    // borderRadius: 8,
    // borderStyle: "solid",
    // borderColor: "rgba(0, 0, 0, 1)",
    // // borderWidth: 0.1,
    // shadowColor: 'rgba(0,0,0, .4)',
    // shadowOffset: { height: 25, width: 25 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    backgroundColor: 'transparent',
    // elevation: 10,  // Android
    paddingVertical: 20,
    marginBottom: 30
  },
  cardHeader: {
    paddingHorizontal: 15,
    alignItems: "center",
    height: 35,
    marginVertical: 25
  },
  cardHeaderText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 20,
    color: "#4A5E9C",
  },
  inputGroupStyle: {
    paddingHorizontal: 15,
    // marginBottom: 10
  },
  inputLabelStyle: {
    color: "#8E9093",
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    fontWeight: "600"
  },
  resendOtpViewStyle: {
    alignItems: "center",
    marginBottom: 10,
  },
  resendOtpStyle: {
    color: "rgba(110, 149, 213, 1)",
    fontFamily: "Tajawal-Regular",
    fontSize: 20,
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
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    alignSelf: "flex-end",
    width: "100%",
    height: 40,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#102D4F',
    elevation: 5,  // Android
  },
  buttonLabelStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Tajawal-Medium"
  },
  registerButtonViewStyle: {
    width: "95%",
  },
  registerButtonStyle: {
    // backgroundColor: "rgb(79, 194, 212)",
    // borderColor: "rgba(110, 149, 213, 0.2)",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    alignSelf: "flex-end",
    width: "95%",
    // height: 70,
    // shadowColor: 'rgba(0,0,0, .4)',
    // shadowOffset: { height: 25, width: 25 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    // elevation: 5,  // Android
  },
  notCustomerText: {
    color: "#8E9093",
    fontFamily: "Tajawal-Medium",
    fontSize: 12,
    fontWeight: "600"
  },
  registerHereText: {
    color: "#102D4F",
    fontSize: 14,
    fontFamily: "Tajawal-Bold"
  },
  notCustomerView: {
    // width: "50%",
    alignItems: "flex-start",
  },
  registerHereView: {
    // width: "50%",
    alignItems: 'center',
    textAlign: "right",
    flexDirection: "row",
  },
  clickImage: {
    height: 20,
    // width: 7,
    resizeMode: 'center',

  }
})

export default styles
