import Mainstyles from '../../styles/globalStyles'
import styles from './HelpAndSupportStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, LayoutAnimation, ActivityIndicator, ImageBackground, UIManager } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import TextInputControl from '../../controls/TextInput'
import PropTypes from 'prop-types'
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextInput from '../../controls/TextInput'
import HomeMainCard from '../../components/HomeMainCard';
import Toast from '../../controls/Toast'
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles'; 
import { ArrowIcon } from '../../../assets/icons'


if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}


class HelpAndSupport extends Component {
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
            howTo: [],
            showToast: false,
            toastMessage: "",
            apiCallFlags: {
                getHelpDocsCalled: true
            },
            activeTab: 'FAQ',
            expandedIndex: null,
            tabs: ['FAQ', 'Contact'],
        }
        this.scrollView = React.createRef()
    }

    componentWillMount() {
        this.props.getHelpDocs()
    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillReceiveProps(nextProps) {
        const { getHelpDocsResult } = nextProps;
        if (this.state.apiCallFlags.getHelpDocsCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ getHelpDocsCalled: false } }
            }, () => {
                if (getHelpDocsResult.content[0]) {
                    this.setState({
                        howTo: [...this.state.howTo, ...getHelpDocsResult.content]
                    })
                } else {
                    this.toastIt("Something went wrong. Please try again later.")
                }
            })
        }
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

    toastIt = (message) => {
        this.setState({
            showToast: true,
            toastMessage: message,
        });
        setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
        }, 5000);
    }

    handleToggle = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState((prevState) => ({
            expandedIndex: prevState.expandedIndex === index ? null : index,
        }));
    };

    handleContactToggle = (label) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState((prevState) => ({
            expandedContactIndex: prevState.expandedContactIndex === label ? null : label,
        }));
    };

    renderAccordionItem = (item, index) => {
        const isExpanded = this.state.expandedIndex === index;
        return (
            <View key={index} style={styles.accordionItem}>
                <TouchableOpacity onPress={() => this.handleToggle(index)} style={styles.accordionHeader}>
                    <Text style={styles.accordionTitle}>{item.title}</Text>
                    <ArrowIcon direction={isExpanded ? "up" : "down"} size={20} color="#102D4F" />
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.accordionContent}>
                        {item.content.length > 0 ? (
                            item.content.map((line, i) => (
                                <Text key={i} style={styles.accordionText}>
                                    {`${i + 1}. ${line}`}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.accordionText}>Coming soon...</Text>
                        )}
                    </View>
                )}
            </View>
        );
    };

    renderContactItem = (label, details = [], showDivider = false) => {
        const isExpanded = this.state.expandedContactIndex === label;

        const icons = {
            'Customer Care': '🎧',
            'WhatsApp': '💬',
            'Website': '🌐',
            'Facebook': '📘',
            'Twitter': '🐦',
            'Instagram': '📸',
        };

        return (
            <View style={styles.contactItemWrapper} key={label}>
                <TouchableOpacity
                    style={styles.contactCard}
                    onPress={() => this.handleContactToggle(label)}
                    activeOpacity={0.8}
                >
                    <View style={styles.contactRow}>
                        <Text style={styles.contactIcon}>{icons[label] || '🔗'}</Text>
                        <Text style={styles.contactLabel}>{label}</Text>
                        {/* <Text style={styles.contactArrow}>{isExpanded ? '▲' : '▼'}</Text> */}
                        <ArrowIcon direction={isExpanded ? "up" : "down"} size={20} color="#102D4F" />
                    </View>
                    {isExpanded && details.length > 0 && (
                        <>
                            {showDivider && <View style={styles.divider} />}
                            <View style={styles.contactDetails}>
                                {details.map((line, i) => (
                                    <Text key={i} style={styles.contactDetailLine}>
                                        ● {line}
                                    </Text>
                                ))}
                            </View>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const { activeTab, tabs } = this.state;

        const faqData = [
            {
                title: 'PROPER GAS METER CABINET USAGE.',
                content: [
                    'Ensure proper ventilation to avoid gas buildup.',
                    'Do not store flammable materials inside.',
                    'Keep the cabinet clean and inspect it regularly.',
                    'Make sure it’s easily accessible for technicians.',
                    'Protect it from water and moisture.',
                    'Report any damage or leaks immediately.',
                ],
            },
            { title: 'KEEP AWAY THE GAS DETECTOR.', content: [] },
            { title: 'DO NOT SPILL WATER ON GAS!', content: [] },
            { title: 'GAS SMELL TIPS.', content: [] },
        ];

        return (
            <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
                    <View style={{ ...Mainstyles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                        <View style={Mainstyles.headerLeft}>
                            <TouchableOpacity
                                style={Mainstyles.backbutton}
                                onPress={() => this.props.navigation.goBack()} >
                                <ArrowIcon direction={"left"} size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <View style={Mainstyles.textContainer}>
                                <View style={Mainstyles.nameRow}>
                                    <Text style={Mainstyles.welcomeLabel} >
                                        Help and Support
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                            Need assistance? contact our support team, or access FAQs to get help quickly.
                        </Text>
                    </View>

                     <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
                        <KeyboardAwareScrollView
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                            // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
                            style={{ flex: 1 }}
                            enabled
                            showsVerticalScrollIndicator={false}
                        >
                            {/* <ScrollView
                                ref={(ref) => (this.scrollView = ref)}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollView}> */}



                            {/* Tabs */}
                            <View style={styles.tabContainer}>
                                {tabs.map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => this.setState({ activeTab: tab })}
                                        style={[
                                            styles.tab,
                                            activeTab === tab ? styles.activeTab : styles.inactiveTab,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.tabText,
                                                activeTab === tab
                                                    ? styles.activeTabText
                                                    : styles.inactiveTabText,
                                            ]}
                                        >
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Tab Content */}
                            {activeTab === 'FAQ' && (
                                <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                                    {faqData.map(this.renderAccordionItem)}
                                </ScrollView>
                            )}

                            {activeTab === 'Contact' && (
                                <View>
                                    {this.renderContactItem('Customer Care')}
                                    {this.renderContactItem('WhatsApp', ['(+971) 0000-0103'], true)}
                                    {this.renderContactItem('Website')}
                                    {this.renderContactItem('Facebook')}
                                    {this.renderContactItem('Twitter')}
                                    {this.renderContactItem('Instagram')}
                                </View>
                            )}





                            {/* </ScrollView> */}
                        </KeyboardAwareScrollView>
                    </InfoContainer>
                </SafeAreaView>
            </LinearGradient>
        )
    }

}

export default withApiConnector(HelpAndSupport, {
    methods: {
        getHelpDocs: {
            type: 'get',
            moduleName: 'api',
            url: 'getHelpDocs',
            authenticate: true,
        }
    }
})



