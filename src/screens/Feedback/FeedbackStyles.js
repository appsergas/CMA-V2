import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  viewView: {
    backgroundColor: '#e0e7f4ff'
  },
  imageView: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '5%'
  },
  goodieeLogoImage: {
    backgroundColor: 'transparent',
    resizeMode: 'center',
    width: '75%',
    maxWidth: 300,
    minWidth: 150,
    height: 200
    // marginTop: -125,
  },
  headerView: {
    // position: "absolute",
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: Platform.OS === 'ios' ? null : 10,
    minHeight: Platform.OS === 'ios' ? null : 60,
    zIndex: 2
  },
  headerCol1: {
    width: '75%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  headerCol2:{
    width: '25%',
    alignItems: 'flex-end'
  },
  pageHeader: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 17,
    color: '#FFFFFF'
  },
  welcomeLabel: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 18,
    color: '#FFFFFF'
  },
  scrollView: {

    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 80,
    margin:20
  },
 
  userNameLabel: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 24,
    color: 'rgba(110, 149, 213, 1)'
  },
  cardView: {
    width: '95%',
    minHeight: 100,
    borderRadius: 8,
    borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.5)',
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
    marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  addImageView: {
    flexDirection: 'row',
    marginTop: 10
  },
  addImageViewCol: {
    width: '33%',
    alignItems: 'center'
  },
  optionIconViewCol1: {
    paddingHorizontal: 15
  },
  optionIconViewCol2: {
    // backgroundColor: "red"
  },
  cardHeader: {
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20
  },
  HomeProfileImage: {
    backgroundColor: 'transparent',
    // resizeMode: "center",
    width: 60,
    height: 60
    // marginTop: -125,
  },
  profileLabelView: {
    flexDirection: 'column',
    marginHorizontal: 10,
    //   height: "100%",
    justifyContent: 'center'
  },
  cardHeaderText: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 18,
    color: 'rgba(110, 149, 213, 1)'
  },
  accountNumberText: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 18,
    color: 'rgba(134, 120, 120, 1)'
  },
  frontBackText: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: 'rgba(134, 120, 120, 1)'
  },
  addImage: {
    height: 58,
    width: 68,
    resizeMode: 'stretch'
  },
  amountText: {
    color: 'rgba(110, 149, 213, 1)',
    fontFamily: 'Tajawal-Bold',
    fontSize: 24
  },
  aedText: {
    color: 'rgba(110, 149, 213, 1)',
    fontFamily: 'Tajawal-Bold',
    fontSize: 12,
    marginLeft: 1
  },
  amountView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 5,
    width: '50%'
  },
  payBillView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
    width: '50%'
  },
  payBillText: {
    color: 'rgba(250, 203, 64, 1)',
    fontFamily: 'Tajawal-Regular',
    fontSize: 14,
    fontWeight: '600'
  },
  cardBodyView: {
    paddingHorizontal: 15,
    marginBottom: 10
  },
  inputGroupStyle: {
    paddingVertical: 15,
    // marginBottom: 10,
    width: '100%'
  },

  inputLabelStylee: {
    color: '#102C4E',
    fontFamily: 'Tajawal-Bold',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalMessageText: {
    color: '#102D4F',
    fontFamily: 'Tajawal-Medium',
    fontSize: 16,
    fontWeight: '600'
  },

  inputLabelStyle: {
    color: '#102D4F',
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    fontWeight: '600'
  },
  // modalMessageText: {
  //   color: "#102D4F",
  //   fontFamily: "Tajawal-Medium",
  //   fontSize: 12,
  //   fontWeight: "600"
  // },
  buttonView: {
    paddingHorizontal: 15,
    marginVertical: 25
  },
  buttonStyle: {
    // backgroundColor: "rgb(79, 194, 212)",
    // borderColor: "rgba(110, 149, 213, 0.2)",
    // borderStyle: "solid",
    // borderWidth: 1,
    borderRadius: 12,
    // flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    // alignSelf: "flex-end",
    width: '100%',
    height: 40,
    // shadowColor: 'rgba(0,0,0, .4)',
    // shadowOffset: { height: 2, width: 2 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    backgroundColor: '#102D4F'
    // elevation: 5,  // Android
  },
  buttonLabelStyle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    fontWeight:'bold'
  },
 
  registerButtonViewStyle: {
    width: '95%'
  },
  registerButtonStyle: {
    // backgroundColor: "rgb(79, 194, 212)",
    borderColor: 'rgba(110, 149, 213, 0.2)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    alignSelf: 'flex-end',
    width: '100%',
    height: 59,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 5  // Android
  },
  notCustomerText: {
    color: 'rgba(134, 120, 120, 1)',
    fontFamily: 'Tajawal-Regular',
    fontSize: 14,
    fontWeight: '600'
  },
  registerHereText: {
    color: 'rgba(250, 203, 64, 1)',
    fontSize: 14,
    fontFamily: 'Tajawal-Regular'
  },
  notCustomerView: {
    width: '50%',
    alignItems: 'flex-start'
  },
  registerHereView: {
    width: '50%',
    alignItems: 'center',
    textAlign: 'right',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  clickImage: {
    height: 20,
    // width: 7,
    resizeMode: 'center',
    marginLeft: 6

  },
  bodyview: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 24,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 8,
    position: 'relative' // Important for absolute positioning
  },



emojiContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%'
},
emojiWrapper: {
  alignItems: 'center',
  padding: 10
},
emojiCircle: {
  width: 48,
  height: 48,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center'
},
emojiUnselected: {
  borderWidth: 1,
  borderColor: '#D1D5DB', // light gray border
  backgroundColor: '#FFFFFF'
},
emojiSelected: {
  backgroundColor: '#0047AB' // solid blue fill
},
emoji: {
  fontSize: 28
},
label: {
  fontSize: 12,
  marginTop: 5,
  textAlign: 'center',
  color: '#000'
}

  
  

})

export default styles
