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
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: Platform.OS === 'ios' ? null : 20,
    zIndex: 2,
    justifyContent: "center"
  },
  headerCol1:{
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
  cardView: {
    width: "95%",
    minHeight: 100,
    borderRadius: 4,
    borderStyle: "solid",
        borderColor: "#ABB2AC",
        borderWidth: 0.4,
    //     shadowColor: 'rgba(0, 0, 0, 0.5)',
    //     shadowOffset: { height: 2, width: 2 }, // IOS
    //     shadowOpacity: 0.5, // IOS
    //     shadowRadius: 1, //IOS
    // backgroundColor: '#fff',
    // elevation: 15,  // Android,
    paddingVertical: 10,
    marginBottom: 8
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
    alignItems: "center"
  },
  optionIconViewCol1: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "95%"
  },
  optionIconViewCol2: {
      justifyContent: "center",
      width: "5%",
      alignItems: "flex-end"
    // backgroundColor: "red"
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
    fontSize: 16,
    color: "rgba(134, 120, 120, 1)"
  },
  addImage: {
    height: 58,
    width: 68,
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
    color: "#5F8AC7",
    fontFamily: "Tajawal-Regular",
    fontSize: 14,
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






  //Enayat
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#102C4E',
  },
  inactiveTab: {
    backgroundColor: '#E0E5EB',
    borderWidth: 1,
    borderColor: '#A2ADBC',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    color: '#8D9BAC',
  },

  // Contact Card
  contactItemWrapper: {
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 22,
    color: '#102D4F',
    width: 26, // Ensures consistent spacing
    marginRight: 14,
  },
  contactLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#102D4F',
  },
  contactArrow: {
    fontSize: 16,
    color: '#102D4F',
  },
  divider: {
    marginTop: 14,
    height: 1,
    backgroundColor: '#E5EEF6',
  },
  contactDetails: {
    marginTop: 12,
    paddingLeft: 40,
  },
  contactDetailLine: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 6,
  },

  // FAQ Accordion (same refinement)
  accordionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5EEF6',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 16,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontWeight: '500',
    fontSize: 14,
    color: '#102D4F',
    flex: 1,
  },
  arrow: {
    fontSize: 16,
    color: '#102D4F',
    marginLeft: 10,
  },
  accordionContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 10,
  },
  accordionText: {
    fontSize: 11,
    color: '#102D4F',
    lineHeight: 10,
    marginBottom: 6,
  },



  watchVideoButton: {
    flexDirection:"row",
    backgroundColor: "#102D4F",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-start", 
},
watchVideoButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
},
optionIconViewCol1: {
    flex: 1,
},
optionIconViewCol2: {
    width: 20,
    height: 20,
},
clickImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
},
})

export default styles
