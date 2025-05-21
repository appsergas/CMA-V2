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
    resizeMode: "center",
    width: "75%",
    maxWidth: 300,
    minWidth: 150,
    height: 200,
    // marginTop: -125,
  },
  // headerView: {
  //   // position: "absolute",
  //   flexDirection: "row",
  //   paddingHorizontal: 15,
  //   alignItems: "center",
  //   marginVertical: Platform.OS === 'ios' ? null : 10,
  //   minHeight: Platform.OS === 'ios' ? null : 60,
  //   zIndex: 2
  // },
  headerCol1: {
    width: "60%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  headerCol2:{
    width: "40%",
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

  icon:  {
    height: 40,
    width: 40,
    resizeMode: "stretch"
},
  paymentDueRow1: {
    paddingHorizontal: 15
  },
  paymentDueRow2: {
    marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  optionIconViewCol1: {
    // paddingHorizontal: 15,
    justifyContent: "center",
    // alignItems: "flex-start",
    // width: "50%"
  },

  optionIconViewCol11: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  optionIconViewCol22: {
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
payBillText: {
    color: "#e5a026",
    fontFamily: "Tajawal-Medium",
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
    color: "#394B62",
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
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
    borderRadius: 4,
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    // alignSelf: "flex-end",
    width: "95%",
    height: 40,
    // shadowColor: 'rgba(0,0,0, .4)',
    // shadowOffset: { height: 2, width: 2 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    backgroundColor: '#102D4F',
    // elevation: 5,  // Android
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
    fontFamily: "Tajawal-Medium",
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
    // height: 24,
    // width: 24,
    // resizeMode: 'stretch',
    // marginRight: 6,

    width: 16,
    height: 16,
    resizeMode: "contain",
  },



  //Enayat

   headerView: {
      // flexDirection: "row",
      // justifyContent: "space-between",
      // alignItems: "center",
      // paddingHorizontal: 20,
      // paddingVertical: 15,
      // marginVertical: Platform.OS === 'ios' ? null : 20,

      flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingTop: 30,
  paddingBottom: 10,
  backgroundColor: "#FFFFFF",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  },
  headerLeft: {
      flexDirection: "row",
      alignItems: "center",
  },
  profileImageContainer: {
      // width: 50,
      // height: 50,
      // borderRadius: 10, // Rounded square effect
      // overflow: "hidden", // Ensures image stays inside rounded square
      // backgroundColor: "#fff", // White background like in the screenshot

      width: 56,
      height: 56,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#E1E7ED",
  },
  profileImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
  },
  textContainer: {
      // marginLeft: 10,
      marginLeft: 12,
      flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#102D4F",
    fontWeight: "700",
    marginRight: 6,
  },
  welcomeSubText: {
      fontSize: 14,
      color: "#102D4F",
      opacity:0.6,
      marginTop: 2,
      textDecorationLine: "underline",
  },
  verifiedIcon: {
    marginTop: 2,
  },
  
  divider: {
    width: "90%",
    height: 1,
    backgroundColor: "#E1E7ED",
    alignSelf: "center",
    marginVertical: 2,
  },

  cardView: {
    borderRadius: 16,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    // elevation: 2,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    // height: 50,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center", 
  },
  accountNumberText: {
    paddingLeft:20,
      fontFamily: "Tajawal-Medium",
      fontSize: 16,
      color: "#102D4F",
      fontWeight: "600",
  },
  optionIconViewCol2: {
    justifyContent: "center",
    alignItems: "center",
},
logoutRow: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  padding: 15,
  marginTop: 15,
  borderRadius: 12,
  paddingLeft:25,
},

logoutText: {
  color: "#E53935",
  fontWeight: "bold",
  fontSize: 16,
  marginLeft: 10,
},
footerText: {
  fontSize: 12,
  color: "#A0A0A0",
  textAlign: "center",
  marginBottom: 80,
},



logoutTitle: {
  color: '#D93025', // red
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 10,
  textAlign: 'center',
},

logoutMessage: {
  color: '#102D4F', // navy
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: 20,
},

logoutButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 0,
},

cancelButton: {
  flex: 1,
  backgroundColor: '#102D4F', // navy
  paddingVertical: 12,
  borderRadius: 12,
  marginRight: 10,
  alignItems: 'center',
},

cancelButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '700',
},

logoutButton: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingVertical: 12,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#102D4F',
  alignItems: 'center',
},

logoutButtonText: {
  color: '#102D4F',
  fontSize: 16,
  fontWeight: '700',
}

})

export default styles
