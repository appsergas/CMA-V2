 import { StyleSheet, Platform } from "react-native"
 import { fontSize } from "../../services/api/data/data/constants"
 
 const styles = StyleSheet.create({
 //Enayat

 headerView: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: Platform.OS === 'ios' ? null : 10,
    minHeight: Platform.OS === 'ios' ? null : 60,
    zIndex: 2,
  },

  headerSubView: {
    flexDirection: "row",
    // paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: Platform.OS === 'ios' ? null : 10,
    minHeight: Platform.OS === 'ios' ? null : 60,
    zIndex: 2
  },
  
 headerLeft: {
    flexDirection: "row",
    alignItems: "center",
},
backbutton:{
  width: 40,
  height: 40,
  borderRadius: 14,
  overflow: "hidden", 
  alignItems: "center",
  justifyContent: "center", 
  backgroundColor: "#FF8D00",
},
textContainer: {
  marginLeft: 10,
},
nameRow: {
  flexDirection: "row",
  alignItems: "center",
},

banner: {
  paddingHorizontal: 20,
  marginBottom:20
},
bannerText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#fff",
  textAlign: "left",
},
welcomeLabel: {
    fontFamily: "Tajawal-Bold",
    fontSize: 18,
    color: "#FFFFFF"
  },

  containerView: {
    flexGrow: 1,
    paddingBottom: 80,
    paddingHorizontal: 20,
    // justifyContent: "flex-start",
    // alignItems: 'center',
    // marginRight:15, marginLeft:15
  },

  bodyview:{
    backgroundColor: "#FFFFFF",padding: 5,borderRadius: 12,width: '90%',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,elevation: 3,
    margin:12,
    position: 'absolute',
   
  },


  //ContentBody
  cardView: {
    // width: "95%",
    // minHeight: 100,
    // borderRadius: 4,
    // borderStyle: "solid",
    // borderColor: "#ABB2AC",
    // borderWidth: 0.4,
    // paddingVertical: 10,
    // marginBottom: 8
    minHeight: "auto", flexDirection: 'row', marginBottom: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    // shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E1E7ED',
  },
  
  optionIconViewCol1: {
    // paddingHorizontal: 15,
    // justifyContent: "center",
    // alignItems: "center"
    // backgroundColor: '#E6F0FB',
    // backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E7ED',
    
  },
  optionIconViewCol2: {
    flex: 1,
    marginTop: 15,
    position: 'relative',
},
paymentDueRow1: {
    paddingHorizontal: 10
  },
  icon:  {
    height: 40,
    width: 40,
    // resizeMode: "stretch"
    resizeMode: "contain"
  },
  notCustomerText: {
    alignItems: "flex-start",
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1F2C3F', 
    marginBottom: 4,
    // color: "#102D4F",
    fontFamily: "Tajawal-Bold",
  },
  accountNumberText: {
    fontFamily: "Tajawal-Medium",
    fontSize: 14,
    // color: "#8E9093"
    color: '#5A6A85',
    marginBottom: 10,
  },
  payBillView:{
    flex: 1, flexDirection: 'row', justifyContent: 'flex-end', 
  },
  payBillButton:{
    backgroundColor: '#0A2540',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
  },
  payBillText: {
    // color: "#5F8AC7",
    fontFamily: "Tajawal-Regular",
    fontSize: 12,
    fontWeight: "800",
    color: '#fff',
    marginTop: 2
  },
  clickImage: {
    // height: 16,
    // width: 16,
    // resizeMode: 'stretch',
    // marginLeft: 6
    width: 14,
    height: 14,
    resizeMode: 'contain',
  
  },

  accountsLabelView: {
    width: "95%",
    marginBottom: 10
  },
  accountsLabel: {
      fontFamily: "Tajawal-Bold",
      fontSize: 18,
      color: "#102D4F"
  },
  buttonStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    // width: "95%",
    height: 40,
    backgroundColor: '#102C4E',
    fontSize:14,
    fontWeight:"bold",
    // elevation: 5,  // Android
  },
  buttonLabelStyle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Tajawal-Medium",
    fontWeight:"bold",
  },


  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // left and right align
    alignItems: 'center',
    // paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FBFD', // match your background
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#102C4E', // navy blue
    // fontFamily: 'OwnersText-Bold', // replace with Inter or system font if needed
  },
  badge: {
    backgroundColor: '#F29C1F', // orange
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  amount: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    // fontFamily: 'OwnersText-Bold', // optional
  },



  headerCol1: {
    // width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  headerCol2:{
    width: "25%",
    alignItems: "flex-end"
  },
  preferrenceHeader: {
    // marginRight:30,
    fontFamily: "Tajawal-Regular",
    fontSize: 16,
    fontWeight:"600",
    // color: "#102C4E",
  },
  preferrenceLabel: {
    fontFamily: "Tajawal-Regular",
    fontSize: 10,
    color: "#102C4ECC",
  },

  textAreaBox: {
    height: 100,
    width: "100%",
    fontSize: 14,
    textAlignVertical: 'top',
    fontFamily: "Tajawal-Medium",
    borderRadius: 16,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 12,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF", // optional for better contrast
    borderWidth: 1,             // optional for clear boundary
    borderColor: "#DDD"         // optional border color
  }
  //Enayat

  

})

export default styles