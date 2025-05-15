import React, { Component } from 'react'

import { StyleSheet } from "react-native";
import Toast from "react-native-whc-toast"

const backgroundColor = {
  footer: "",
  appStatusBar: "rgb(79, 194, 212)",
  button: "rgb(79, 194, 212)",
  storageError: "#EA9494"
};

class CustomToast extends Component {
  componentDidMount() {
    this.refs.toast.show(this.props.message, Toast.Duration.infinite);
  }
  render() {
    const { toastStyle, toastTextStyle, isImageShow } = this.props;
    return (
      <Toast ref="toast" style={{ ...styles.toastStyle, ...toastStyle }} textStyle={{ ...styles.toastText, ...toastTextStyle }}
        fadeInDuration={0}
        fadeOutDuration={300}
        isImageShow={isImageShow}
        duration={Toast.Duration.long} />
    )
  }
}
const styles = StyleSheet.create({
  toastStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "#FFFFFF",
    // textAlign:"center",
    top:-30
  },
  toastText: {
    color: "black",
    textAlign:"center",
    fontFamily: "Tajawal-Bold",
  }
})
export default CustomToast

