import Mainstyles from '../../styles/globalStyles'
import styles from './StatementStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,Dimensions as dim, ActivityIndicator } from 'react-native'
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
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import Toast from '../../controls/Toast'
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';

// const chartConfig = {
//     backgroundGradientFrom: "#FFFF",
//     backgroundGradientFromOpacity: 0,
//     backgroundGradientTo: "#FFFF",
//     backgroundGradientToOpacity: 1,
//     color: (opacity = 2) => `rgba(250, 203, 64, 1)`,
//     labelColor: (opacity = 1) => `#577ABD`,
//     strokeWidth: 10, // optional, default 3
//     barPercentage: 0.5,
//     useShadowColorFromDataset: false, // optional
//     fillShadowGradient: 'rgba(250, 203, 64, 1)',
//     fillShadowGradientOpacity: 10,
//     fillShadowGradientFromOpacity: 10
//   };

const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientFromOpacity: 'white',
    backgroundGradientTo: 'white',
    color: () => '#FEBA12',
    fillShadowGradient: '#FEBA12',
    fillShadowGradientOpacity: 1,
    // fillShadowGradientFromOpacity: 1,
    labelColor: () => `#2D395A`,
    barPercentage: 1,
    barRadius: 5,
    propsForBackgroundLines: {
      strokeWidth: 1,
      strokeDasharray: 0,
      stroke: "#e3e3e3"
    },
    decimalPlaces: 0
  };

class Statement extends Component {
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
            contractList: [],
            activeItemIndex: 0,
            apiCallFlags: {
                statementApiCalled: false
            },
            showToast: false,
            toastMessage: "",    
            statement: [],
            chartData : {
                labels: ["", "", "", "", "", ""],
                datasets: [
                    {
                        data: [0,0,0,0,0,0]
                    }
                ]
            }
        }
        this.scrollView = React.createRef()
    }

    async componentWillMount () {
        let contracts = await AsyncStorage.getItem("contract_list")
        this.setState({contractList: [...JSON.parse(contracts)]}, () => {
            let toDate = this.formatDate(new Date().toDateString());
        let fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 6)
        this.setState({
            apiCallFlags: {...this.state.apiCallFlags,...{statementApiCalled: true}}
          }, () =>
            this.props.getStatement({
                contractNumber: this.props.contracts[0].CONTRACT_NO,
                companyCode: this.props.contracts[0].COMPANY,
                fromDate: this.formatDate(fromDate),
                toDate: this.formatDate(toDate)
            })
        )
        })


    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillReceiveProps (nextProps) {
        const { getStatementResult } = nextProps
    if (this.state.apiCallFlags.statementApiCalled) {
      this.setState({
        apiCallFlags: {...this.state.apiCallFlags,...{statementApiCalled: false}}
      })
      if (getStatementResult && getStatementResult.content && (getStatementResult.content.STATUS == "SUCCESS")) {
        this.setState({
            statement: getStatementResult.content.DETAIL
        })

        let chartLabels = []
        let chartValues = []
        // getStatementResult.content.DETAIL.reverse().map(statement => {
        //     chartLabels.push(new Date(statement.LAST_READING_DATE).toDateString().split(' ')[1])
        //     chartValues.push(((statement.LAST_READING - statement.PREVIOUS_READING) * 100) / 100);
        // })

        let lastMonth = 0;

        // for (let index = 0; index < 6; index++) {
        //     const element = getStatementResult.content.DETAIL[index];
        //     if (element != undefined) {
        //         chartLabels.push(new Date(element.LAST_READING_DATE).toDateString().split(' ')[1])
        //     chartValues.push(((element.LAST_READING - element.PREVIOUS_READING) * 100) / 100);
        //     lastMonth = new Date(element.LAST_READING_DATE).getMonth()
        //     } else {
        //         let date = new Date(`${lastMonth}/01/2021`)

        //         date.setMonth(date.getMonth())
        //         lastMonth = date.getMonth()
        //         chartLabels.push(date.toDateString().split(' ')[1])
        //     chartValues.push(0);
        //     }
        // }

        // for (let index = 0; index < 6; index++) {
            // getStatementResult.content.DETAIL.map(element => {
            //     chartLabels.push(element.LAST_READING_DATE.split(" ")[0].substr(0, 3)+"\n"+element.LAST_READING_DATE.split(" ")[1])
            // chartValues.push(element.AMT);
            // lastMonth = new Date(element.LAST_READING_DATE).getMonth()
            // })
        // }

        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let today = new Date();
        let d;
        let month;
        let year;

        for (let i = 6; i > 0; i -= 1) {
            d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            month = monthNames[d.getMonth()];
            year = d.getFullYear();
            let matchingData = getStatementResult.content.DETAIL.filter(data => data.LAST_READING_DATE == (month+" "+year))
            chartLabels.push(month.substr(0, 3) +" "+ year)
            if (matchingData.length) {
                chartValues.push(matchingData[0].AMT);
            } else {
                chartValues.push(0);
            }
        }

        

        let chartData = {
            labels: chartLabels,
            datasets: [
                {
                    data: chartValues
                }
            ]
        }

        this.setState({
            chartData: chartData
        })

      } else if (getStatementResult && getStatementResult.content && (getStatementResult.content.MSG == "Transactions not found")) {
          this.setState({
              statement: [],
              chartData : {
                  labels: ["", "", "", "", "", ""],
                  datasets: [
                      {
                          data: [0,0,0,0,0,0]
                        }
                    ]
                }
            })
            // this.toastIt("Transactions not found")
      } else {
        this.setState({
            statement: [],
            chartData : {
                labels: ["", "", "", "", "", ""],
                datasets: [
                    {
                        data: [0,0,0,0,0,0]
                      }
                  ]
              }
          })
        this.toastIt("Something went wrong, please try again later")
      }
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

    formatDate = date => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }
        

    carouselCurrentItem = (currentItemIndex) => {
        const { contractList } = this.state
        this.setState({activeItemIndex: currentItemIndex})

        let toDate = this.formatDate(new Date().toDateString());
        let fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 6)


        this.setState({
            apiCallFlags: {...this.state.apiCallFlags,...{statementApiCalled: true}}
          }, () =>
        this.props.getStatement({
            contractNumber: this.props.contracts[currentItemIndex].CONTRACT_NO,
            companyCode: this.props.contracts[currentItemIndex].COMPANY,
            fromDate: this.formatDate(fromDate),
            toDate: this.formatDate(toDate)
        })
        )
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

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
                <View style={{ ...styles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={styles.headerCol1}>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image>
                            </TouchableOpacity>
                            <Text style={styles.welcomeLabel} >
                                Statement
                            </Text>
                        </View>
                    </View>
                    <View style={{ ...Mainstyles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                    </View>
                </View>

                {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}> */}
                <View style={{
                    height: "100%", backgroundColor: "#FFFFFF", overflow: 'hidden',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    width: '100%'
                }} >
                    <KeyboardAwareScrollView
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
                        style={{ flex: 1 }}
                        enabled
                        showsVerticalScrollIndicator={false}
                    >
                        <ScrollView
                            ref={(ref) => (this.scrollView = ref)}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollView}>

                        <HomeMainCard
                            contracts={this.props.contracts}
                            from="raiseComplaint"
                            usageCharges={1234}
                            userName="User NameX"
                            accountNumber="YYYY XXXX YYYY XXXX"
                            currentIndex={this.carouselCurrentItem}
                        />

                        {this.state.statement.length ?
                        <>
                        <View style={{width: "95%"}}>
                            <Text style={Mainstyles.accountsLabel} >
                                Your Invoice History
                            </Text>
                            <View style={{...styles.cardView,...{ flexDirection: "row",minHeight: 0, width: "100%" }}}>
                                    <View style={{ width: "10%", justifyContent: "center" }}>
                                        <Text style={styles.colHeadeingText}>No</Text>
                                    </View>
                                    <View style={{ width: "20%", justifyContent: "center" }}>
                                        <Text style={styles.colHeadeingText}>Month</Text>
                                    </View>
                                    <View style={{ width: "22.5%", justifyContent: "center" }}>
                                        <Text style={styles.colHeadeingText}>Reading</Text>
                                    </View>
                                    <View style={{ width: "22.5%", justifyContent: "center", overflow: 'scroll' }}>
                                        <Text style={styles.colHeadeingText}>Consumption</Text>
                                    </View>
                                    <View style={{ width: "25%", justifyContent: "center" }}>
                                        <Text style={styles.colHeadeingText}>Invoice Amt</Text>
                                    </View>
                                </View>
                            {this.state.statement.map((statement,index) => {
                                return <View style={{...styles.cardView,...{ flexDirection: "row",minHeight: 0, width: "100%", paddingVertical: 10 }}}>
                                        <View style={{ width: "10%", justifyContent: "center" }}>
                                            <Text style={styles.dataText}>{index+1}</Text>
                                        </View>
                                        <View style={{ width: "20%", justifyContent: "center" }}>
                                            <Text style={styles.dataText}>{statement.LAST_READING_DATE.split(' ')[0].substr(0,3) + " " + statement.LAST_READING_DATE.split(' ')[1].substr(0,4)}</Text>
                                        </View>
                                        <View style={{ width: "22.5%", justifyContent: "center" }}>
                                            <Text style={styles.dataText}>{statement.LAST_READING}</Text>
                                        </View>
                                        <View style={{ width: "22.5%", justifyContent: "center" }}>
                                            <Text style={styles.dataText}>{statement.PREVIOUS_READING}</Text>
                                        </View>
                                        <View style={{ width: "25%", justifyContent: "center" }}>
                                            <Text style={styles.amtPaidText}>{statement.AMT} AED</Text>
                                        </View>
                                    </View>
                            })}
                        </View>

                        {/* <View style={{...styles.cardView,...{alignItems: "center"}}}> */}
                            <BarChart
                            verticalLabelRotation={270}
                            fromZero={true}
                            withInnerLines={false}
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                    borderColor: "rgba(0, 0, 0, 0.5)",
                                    borderWidth: 0.5,
                                    width: "95%"
                                  }}
                                data={this.state.chartData}
                                width={dim.get("window").width * (0.94)}
                                height={290}
                                chartConfig={chartConfig}
                                showBarTops={false}
                                yAxisInterval={100}
                                
                            />
                            {/* <Text style={Mainstyles.accountsLabel}>Invoice History</Text> */}
                        {/* </View> */}
                        </> : this.state.apiCallFlags.statementApiCalled ? <ActivityIndicator size={'small'} color={'#102D4F'}/> :
                                                <View style={{width: "95%", alignItems: "center"}}>
                                                <Text style={Mainstyles.accountsLabel} >
                                                    No Invoice Found
                                                </Text></View>
                    }

                        
                        {/* {this.state.howTo.map(data => {
                            return <TouchableOpacity 
                            style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                            onPress={() => this.props.navigation.navigate("HelpAnswer", { "helpData": data})}
                            >
                            <View style={styles.optionIconViewCol2}>
                                    <Text style={styles.accountNumberText}>{data.que}</Text>
                            </View>
                        </TouchableOpacity>
                        })} */}

                    </ScrollView>
                    
                </KeyboardAwareScrollView>
                </View>
                {this.state.showToast ? (
              <Toast message={this.state.toastMessage} isImageShow={false} />
            ) : null}
                {/* </InfoContainer> */}
            </SafeAreaView>
        )
    }

}

const mapStateToProps = ({contractsReducer}) => {
    return {
        contracts: contractsReducer.contracts
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        updateContracts: (data) => dispatch(updateContracts(data))
    };
  
  }
  
  export default connect(mapStateToProps,mapDispatchToProps) (withApiConnector(Statement, {
    methods: {
        getStatement: {
            type: 'get',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getPastStatements',
            authenticate: true,
          },
    }
})
  )



