
import styles from './EmailLoginStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextInputControl from '../../controls/TextInput'
import PropTypes from 'prop-types'
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextInput from '../../controls/TextInput'



class EmailLogin extends Component {
  constructor(props) {
    super(props)
    AsyncStorage.getItem('language', (err, res) => {
      if (res != null) {
        if (res == "ar") {
          setI18nConfig(res, true);
          this.forceUpdate();
        } else {
          setI18nConfig(res, false);
          this.forceUpdate();
        }
      } else {
        setI18nConfig("en", false);
        this.forceUpdate();
      }
    })
    this.state = {

    }
    this.scrollView = React.createRef()
  }

  componentDidMount() {
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    AsyncStorage.getItem('language', (err, res) => {
      if (res != null) {
        if (res == "ar") {
          setI18nConfig(res, true);
        } else {
          setI18nConfig(res, false);
        }
      } else {
        setI18nConfig('en', false);
      }
    })
    this.forceUpdate();
  }

  handleSendOtp = () => {
    this.props.navigation.navigate("Otp")
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#e0e7f4ff', flex: 1 }} >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)"}}
          enabled
        >
          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>
            <View style={styles.imageView}>
              <Image
                source={require("../../../assets/images/sergas_logo.png")}
                style={styles.goodieeLogoImage} />
            </View>
            <View style={styles.cardView} >
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>{t("login.loginUsing")}</Text>
              </View>
              <View style={styles.inputGroupStyle}>
                <View>
                  <Text style={styles.inputLabelStyle}>{t("login.email")}</Text>
                </View>
                <View>
                  <TextInput></TextInput>
                </View>
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  onPress={this.handleSendOtp}
                  style={styles.buttonStyle}
                >
                  <Text
                    style={styles.buttonLabelStyle}>{t("login.sendOtp")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

}

export default withApiConnector(EmailLogin, {
  methods: {

  }
})



