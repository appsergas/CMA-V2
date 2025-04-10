import { Platform, StyleSheet } from "react-native"
import { fontSize } from "../../services/api/data/data/constants"
import { bounce } from "react-native/Libraries/Animated/Easing"

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
    resizeMode: "contain",
    width: 48.82,
    height: 32,
    // marginTop: -125,
    marginRight: 10
  },

  headerCol1:{
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  headerCol2:{
    width: "50%",
    alignItems: "flex-end"
  },
  scrollView: {
    // flex: 1,
    // display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: 'center',
    paddingBottom: 80,
    paddingTop: 30,
    // backgroundColor: "red"
    // height: "100%",
    // overflow: "scroll",
  },
  accountsLabelView: {
      backgroundColor: "#FF8D00",
      paddingVertical:2,
      paddingHorizontal:12,
      borderRadius:8,
      alignSelf:"flex-start",
      marginBottom:10,
  },
  accountsLabel: {
      fontFamily: "Tajawal-Bold",
      fontSize: 16,
      color: "#FFFFFF",
      fontWeight:"bold",
      textAlign:"center",
      paddingTop:5
      
  },
  welcomeLabel: {
    fontFamily: "Tajawal-Medium",
    fontSize: 18,
    color: "#FFFFFF"
  },
  userNameLabel: {
    fontFamily: "Tajawal-Medium",
    fontSize: 16,
    color: "#e5a026"
  },
  cardView: {
    width: "95%",
    borderRadius: 8,
    borderStyle: "solid",
        borderColor: "rgba(0, 0, 0, 0.5)",
        borderWidth: 0.5,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 0.5, // IOS
        shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 15,  // Android,
    paddingVertical: 20,
    marginBottom: 30
  },
  paymentDueRow1: {
    paddingHorizontal: 15
  },
  paymentDueRow2: {
    // marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  cardHeader: {
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
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
      color: "#707070"
  },
  amountText: {
      color: "#2D395A",
      fontFamily: "Tajawal-Bold",
      fontSize: 13,
  },
  aedText: {
      color: "#2D395A",
      fontFamily: "Tajawal-Bold",
      fontSize: 8,
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
    color: "#FEBA12",
    fontFamily: "Tajawal-Medium",
    fontSize: 13,
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
  homeOptionRow: {
    // flexDirection: "row",
    width: "100%",
    // alignItems: "flex-start",
    // padding: 8,
    marginBottom: 20

  },
  homeOption: {
    backgroundColor: "#F7FAFC", // Light grayish-blue background
    borderRadius: 16, // Rounded corners for the box
    paddingVertical: 4,
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "space-between",
    width: 106, // Adjust width based on UI
    height: 106, // Keeps a balanced height
    elevation: 4, // Shadow for Android
    borderWidth: 1,
    borderColor: "#E0E6ED", // Light border for structure
    marginRight:5,
},
iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1, // Takes up the top space
},
labelContainer: {
  width:"90%",
    backgroundColor: "#FFFFFF", // White background for text
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 10, // Rounded edges for a smooth look
    // marginTop: 10, // Spacing from the icon
    // width: "100%", // Ensures text stays within bounds
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2, // Light shadow for floating effect
},
homeOptionText: {
    color: "#1E293B", // Dark blue text
    textAlign: "center",
},
  homeOptionIcon: {
    resizeMode: 'stretch',
    height: 40,
    width: 40,
    marginBottom: 8
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
    color: "#2D395A",
    fontFamily: "Tajawal-Bold",
    fontSize: 14,
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
    height: 20,
    // width: 7,
    resizeMode: 'center',
    marginLeft: 6

  },

  // Enayat


  body:{
    backgroundColor: "#F7FAFC", 
    overflow: 'hidden',
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24,
    width: '100%'
  },
  bodyview:{
    backgroundColor: "#FFFFFF",padding: 10,borderRadius: 12,width: '90%',shadowColor: "#000",shadowOpacity: 0.1,shadowOffset: { width: 0, height: 2 },shadowRadius: 4,elevation: 3
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: Platform.OS === 'ios' ? null : 20,
},
headerLeft: {
    flexDirection: "row",
    alignItems: "center",
},
profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 10, // Rounded square effect
    overflow: "hidden", // Ensures image stays inside rounded square
    backgroundColor: "#fff", // White background like in the screenshot
},
profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
},
textContainer: {
    marginLeft: 10,
},
nameRow: {
  flexDirection: "row",
  alignItems: "center",
},
welcomeText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#fff", // White text
  marginRight: 5, // Space between text and checkmark
},
welcomeSubText: {
    fontSize: 14,
    color: "#A0AEC0", // Light grayish text for subtitle
},
notificationContainer: {
    width: 40,
    height: 40,
    borderRadius: 10, // Rounded square for notification background
    backgroundColor: "#fff", // White box for notification icon
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
},
notificationDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
},
banner: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 35,


},
bannerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
},

  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    position: 'absolute',  // Makes sure it's over the white background
          // Moves it down, overlapping the white container
        transform: [{ translateY: -20 }],  // Fine-tunes the positioning for half-half effect
        zIndex: 10, // Ensures tabs are above the white container
},
firstTab: {
    backgroundColor: '#fff', // Keep background white like others
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10, // Slight rounding on right side
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#004EA2', // Light outline
    marginRight: 5, // Creates the gap between "All" and other tabs
},
firstTabText: {
    color: '#0057A2', // Dark blue text for inactive
    fontWeight: '700',
    fontSize: 16,
},
tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff', // White background for tabs
    borderRadius: 10,
    borderWidth: 1, // Outline like in the image
    borderColor: '#D3DAE4',
    flex: 1, // Take remaining space
},
tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
},
tabText: {
    fontSize: 16,
    color: '#0057A2', // Dark blue text for inactive tabs
    fontWeight: '600',
},
tabActiveAll: {
  backgroundColor: '#0057A2', // Active tab background
  borderRadius: 10,
   paddingVertical: 11, // Reduce height slightly
  paddingHorizontal: 11, // Reduce width slightly
  marginHorizontal: 5, // Adds spacing to keep alignment correct
  alignSelf: 'center',
},
tabActive: {
    backgroundColor: '#0057A2', // Active tab background
    borderRadius: 10,
     paddingVertical: 7, // Reduce height slightly
    paddingHorizontal: 7, // Reduce width slightly
    marginHorizontal: 5, // Adds spacing to keep alignment correct
    alignSelf: 'center',
},
tabActiveText: {
    color: '#fff', // White text for active tab
    fontWeight: '700',
    textAlign: 'center',
},


  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  contentText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },

  // Enayat

})

export default styles
