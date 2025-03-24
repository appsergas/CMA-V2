// import React, { useState } from "react";
// import { StyleSheet, Text, View } from "react-native";

// import CheckBox from '@react-native-community/checkbox'

// //** CheckBox Component */
// //** Props Accepted = [labelText , isSelectedByPage, isCheckedValue, checkboxContainerStyle, labelStyle, checkboxStyle] */
// //** "isCheckedValue" prop is a callback method that returns checkbox state to the parent component*/
// //** @Author: Aslam */

// export const SergasChkBox = (props) => {
//   const {labelText , isSelectedByPage, onValueChange, checkboxContainerStyle, labelStyle, checkboxStyle, falseColor, trueColor} = props;
//   const [isSelected, setSelection] = useState(isSelectedByPage );

//   const onCheck = (value) => {
//     setSelection(value);
//     onValueChange(value);
// }
  

//   return (
//       <View style={{...styles.checkboxContainer,...checkboxContainerStyle}}>
//         <CheckBox
//           value={isSelected}
//           onValueChange={onCheck}
//           style={{...styles.checkbox,...checkboxStyle}}
//           // tintColors={{ true:  'rgb(79, 194, 212)', false:  'rgb(79, 194, 212)' }}
//         />
//         <Text style={{...styles.label,...labelStyle}}>{labelText}</Text>
//       </View>
//   );
// };

// const styles = StyleSheet.create({
//   checkboxContainer: {
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   checkbox: {
//     alignSelf: "center",
//     borderColor: "black",
//     borderStyle: "solid",
//     borderWidth: 1
//   },
//   label: {
// 		fontSize: 12,
//     fontFamily: "Tajawal-Regular",
//     color: "rgb(128, 140, 144)"
//   },
// });