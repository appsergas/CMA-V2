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
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
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
    marginTop: 15,
  },
  buttonStyle: {
    backgroundColor: '#FF8D00',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabelStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButtonViewStyle: {
    width: "95%",
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
  registerHereText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  notCustomerView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  payBillView: {
    marginLeft: 5,
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
    color: '#FFFFFF',
    fontSize: 14,
    marginVertical: 16,
    textAlign: 'center',
  },
  buttonuaepassStyle: {
    width: 380,
    height: 61,
    resizeMode: 'contain',
  },


  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  dividerLineV: {
    width: 1,        
    height: '100%',
    backgroundColor: '#0057A2',
    opacity: 0.3,
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

  tooltipBubble: {
    position: 'absolute',
    bottom: 60, // adjust as needed
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // 40% opaque black
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  
  tooltipText: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
  },
  
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '100%',
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  
  
})

export default styles
