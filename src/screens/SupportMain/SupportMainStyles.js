import { StyleSheet, Platform } from "react-native"
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
  // headerView: {
  //   flexDirection: "row",
  //   paddingHorizontal: 15,
  //   alignItems: "center",
  //   marginVertical: Platform.OS === 'ios' ? null : 10,
  //   minHeight: Platform.OS === 'ios' ? null : 60,
  //   zIndex: 2
  // },
  headerCol1: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
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
  welcomeLabel: {
    fontFamily: "Tajawal-Bold",
    fontSize: 18,
    color: "#FFFFFF"
  },
  scrollView: {
    // flex: 1,
    // display: "flex",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: 'center',
    paddingBottom: 80
    // height: "100%",
    // overflow: "scroll"
  },

  userNameLabel: {
    fontFamily: "Tajawal-Regular",
    fontSize: 24,
    color: "rgba(110, 149, 213, 1)"
  },
  

  paymentDueRow1: {
    paddingHorizontal: 15
  },
  // paymentDueRow2: {
  //   marginTop: 10,
  //   paddingHorizontal: 15,
  //   flexDirection: "row",
  //   alignItems: "center"
  // },

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


//Enayat

//Enayat


})

export default styles
