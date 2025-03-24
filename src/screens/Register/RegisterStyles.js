import { StyleSheet,Dimensions } from "react-native"
import { fontSize } from "../../services/api/data/data/constants"

const { width: screenWidth } = Dimensions.get('window');

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
  headerView: {
    // position: "absolute",
    paddingHorizontal: 15,
    alignItems: "center",
    // marginVertical: 20,
    minHeight: 60,
    zIndex: 2,
  },
  headerCol1: {
    width: "75%",
    alignItems: "flex-start",
  },
  headerCol2: {
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
    // justifyContent: "center",
    alignItems: 'center',
    // height: "100%",
    // overflow: "scroll"
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
    // backgroundColor: '#fff',
    // elevation: 10,  // Android
    // paddingVertical: 20,
    // marginBottom: 30
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
    color: "#102D4F",
  },
  inputGroupStyle: {
    paddingHorizontal: 15,
    marginBottom: 10
  },
  inputLabelStyle: {
    color: "#2D395A",
    fontFamily: "Tajawal-Medium",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5
  },
  buttonView: {
    paddingHorizontal: 15,
    marginTop: 25
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
    color: "#102D4F",
    fontFamily: "Tajawal-Medium",
    fontSize: 14,
    fontWeight: "600"
  },
  registerHereText: {
    color: "#FEBA12",
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

  },
  uaepassorText: {
    color: "#FEBA12",
    fontSize: 14,
    fontFamily: "Tajawal-Bold",
    alignItems: 'center',
  },
  buttonuaepassStyle: {
    backgroundColor: "transparent",
    resizeMode: "stretch",
    width: screenWidth * 0.9,  // 90% of the screen width
    height: 50,
  },
})

export default styles
