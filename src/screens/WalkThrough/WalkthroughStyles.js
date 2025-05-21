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
  imageView: {
    alignItems: 'center',
    marginBottom: 30,
  },
  goodieeLogoImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
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
    fontSize: 18,
    fontWeight: 'bold',
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
  
  registerLinkText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: '#FFFFFF',
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
  

  
  
  
})

export default styles
