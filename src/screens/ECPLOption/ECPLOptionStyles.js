import { StyleSheet } from "react-native"
import { fontSize } from "../../services/api/data/data/constants"

const styles = StyleSheet.create({
  viewView: {
    backgroundColor: "#e0e7f4ff",
    // flex: 1,
    // display: "flex",
    
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
  cardView: {
    backgroundColor: 'transparent',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  cardHeader: {
    // paddingHorizontal: 15,
    alignItems: "center",
    height: 35,
    marginVertical: 25
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
    flexDirection: "row",
    padding:20
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
    width: "90%",
    height: 40,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 0, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#FF8D00',
    elevation: 5,  // Android
  },
  buttonLabelStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Tajawal-Medium",
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
    //flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop:10,
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
    color: "#2D395A",
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
  payBillView: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    margin: 5
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
    width: 300,
    height: 50,
  },
  instructionsContainer: {
    
    padding:5
  },
  noteContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding:5
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
    color: "#ffffff",
    
  },
  TitleIconT: {
    fontSize: 16,
    height: 16, 
    color: 'white',
    fontWeight: 'bold',
    marginLeft:-15
  },
  TitleIconF: {
    fontSize: 16,
    height: 16, 
    color: '#FEBA12',
    fontWeight: 'bold',
    marginLeft:-15
  },
})

export default styles
