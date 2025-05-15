import { StyleSheet } from "react-native"
import { fontSize } from "../../services/api/data/data/constants"

const styles = StyleSheet.create({
  viewView: {
    backgroundColor: "#e0e7f4ff",
    // flex: 1,
    // display: "flex",
    
  },
  imageView: {
    alignItems: 'center',
    marginBottom: 30,
  },
  goodieeLogoImage: {
    backgroundColor: "transparent",
    resizeMode: "stretch",
    width: 155,
    height: 101.6,
    // marginTop: -125,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  cardView: {
    backgroundColor: 'transparent',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  cardHeader: {
    alignItems: 'center',
    marginVertical: 5,
  },
  cardHeaderText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 15,
    // color: "#4A5E9C",
    color: "#ffffff",
  },
  cardPerText: {
    fontFamily: "Tajawal",
    fontSize: 11,
    // color: "#4A5E9C",
    color: "#ffffff",
  },
  inputGroupStyle: {
    paddingHorizontal: 15,
    marginBottom: 10
  },
  inputLabelStyle: {
    color: "#2D395A",
    fontFamily: "Tajawal-Medium",
    fontSize: 14,
    marginBottom: 5
  },
  buttonView: {
    // paddingHorizontal: 15,
    marginTop: 15
  },
  buttonStyle: {
    // backgroundColor: "rgb(79, 194, 212)",
    borderColor: "rgba(110, 149, 213, 0.2)",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    alignSelf: "center",
    width: "100%",
    height: 50,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 0, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#FF8D00',
    elevation: 5,  // Android
  },
  buttonLabelStyle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Tajawal-Medium",
  },
  registerButtonStyle: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notCustomerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  // registerHereView: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  // },
  notCustomerView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  payBillView: {
    marginLeft: 5,
  },
  registerHereText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  uaepassorText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginVertical: 16,
    textAlign: 'center',
  },
  buttonuaepassStyle: {
    width: 250,
    height: 50,
    resizeMode: 'contain',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#0057A2',
    opacity: 0.3,
  },
  dividerText: {
    color: '#FFFFFF',
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  registerHereView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  
  inlineRegisterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
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
    width: 300,
    height: 50,
  },noteContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 50,
  },
  headerText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#2D395A",
  },
  bulletPointView: {
    alignItems: 'flex-start',
    marginBottom: 5,
    color: "#2D395A",
  },
  bulletPointText: {
    fontSize: 10,
    marginLeft: 10,
    // color: "#2D395A",
    color: "#FFFFFF",
    
  },

  registerLinkText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
    color: '#FFFFFF',
    fontSize: 14,
  },



  inputGroupStyle: {
    // backgroundColor: 'rgba(255, 255, 255, 0.06)', // ✅ Subtle frosted look
    borderColor: '#0057A2',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    // paddingVertical: 1,
    marginTop: 30,
    
  },
  
  
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent', // ✅ must be transparent
  },
  
  flagIcon: {
    width: 46,
    height: 34,
    marginRight: 8,
  },
  
  countryCode: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  

  headerCol1: {
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  
})

export default styles
