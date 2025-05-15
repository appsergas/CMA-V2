/**
 * BarChart component for showing 6 monthly profit average
 * Usage:
 * import BarChart from "../../../common-components/bar-chart/BarChart"
 * <BarChart BarChartData={BarChartData} />
 */
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SlideBarChart } from 'react-native-slide-charts';
import i18n from '../../services/translate/i18n';
import PropTypes from "prop-types";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import Loading_Spinner from '../../common-components/Loading/index'
/**
 * @param  {} {BarChartData}
 * @param  {} {BarChartData}
 */
const SCREEN_WIDTH = Dimensions.get('window').width
export default function BarChart({ BarChartData, receivedData, Type }) {

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var today = new Date();
    var d;
    var month;
    var renderMonth =[]

    for (var i = 5; i >= 0; i -= 1) {
        d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        month = monthNames[d.getMonth()];
        renderMonth.push({'month': month, profitForMonth : 0})
    }

    const mergeByProperty = (target, source, prop) => {
        source.forEach(sourceElement => {
          let targetElement = target.find(targetElement => {
            return sourceElement[prop] === targetElement[prop];
          })
          targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
        })
      }
      var target = renderMonth;
      var source = BarChartData
    
      mergeByProperty(target, source, 'month');

    let axisMarkerLabelsArr = [];
    target && target.map((element) => {
        axisMarkerLabelsArr.push(element.month.slice(0, 3).toUpperCase())
    })
    var d = new Date();
    d.setMonth(d.getMonth() - 3);

    const axisMarkerLableForVietanam = []
    target && target.map((element) => {
        axisMarkerLableForVietanam.push("T"+(monthNames.indexOf(element.month)+1))
    })
    let chartData = [];
    let unitsAverageArray = [];
    target && target.map((element, index) => {
        unitsAverageArray.push(element.profitForMonth)
        chartData.push({ x: index, y: element.profitForMonth })
    })

    let currentYear = new Date().getFullYear();
    let yearBefore6Month = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    function monthlyProfitAverage(unitsAverageArray) {
        var profitAverage = unitsAverageArray.reduce((acc, next) => acc + next) / unitsAverageArray.length;
        var average = profitAverage.toFixed(0)
        var averageParts = average.toString().split(".");
        averageParts[0] = averageParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return averageParts.join(".");
    }

    let graphYear ;
    if(i18n.locale==="en"){
        graphYear =  `${axisMarkerLabelsArr[0].charAt(0) + axisMarkerLabelsArr[0].slice(1).toLowerCase()} - ${axisMarkerLabelsArr[5].charAt(0) + axisMarkerLabelsArr[5].slice(1).toLowerCase()} ${currentYear}`
    }else{
        graphYear = `Tháng ${yearBefore6Month.getMonth()+1}/${yearBefore6Month.getFullYear()} đến Tháng ${today.getMonth()+1}/${today.getFullYear()}`
    }

    const yourMonthlyProfitAverage = monthlyProfitAverage(unitsAverageArray)

    return (
        receivedData ?  <Loading_Spinner loading={true}>
        <View
          style={{
            height: 213,
            width:300,
            backgroundColor: 'transparent'
          }}
        />
      </Loading_Spinner> :
        <View>
            <View style={styles.profitOverviewRow}>
                <Text style={styles.profitOverviewText}>{i18n.t('myshopoverview.barChart.ProfitOverview')}</Text>
                <Text style={styles.profitOverviewMonth}>{graphYear}
                    </Text>
            </View>
            <View>
                <SlideBarChart
                    fillColor='#D3D3D3'
                    width={SCREEN_WIDTH - 42}
                    barSelectedColor={'#51C2D4'}
                    barWidth={38}
                    barSpacing={3}
                    axisWidth={yourMonthlyProfitAverage == 0 ? 2 : 20}
                    axisHeight={40}
                    axisLabelStyle={{
                        fontFamily: "Tajawal-Bold", fontWeight: "bold",
                        color: '#B0B4C8'
                    }}
                    xAxisProps={{
                        axisMarkerLabels: i18n.locale==="en"?axisMarkerLabelsArr:axisMarkerLableForVietanam,
                        axisLabelStyle: { fontFamily: "Tajawal-Bold", fontWeight: "bold", fontSize: 10, color: '#B0B4C8' }
                    }}
                    yAxisProps={{
                        axisMarkerStyle: { fontFamily: "Tajawal-Bold", fontWeight: "bold", fontSize: 10, color: '#B0B4C8' },
                        numberOfTicks: 2,
                        showBaseLine: false,
                        axisLabelAlignment: 'aboveTicks',
                        horizontalLineColor: "#F6F7F9",
                        markFirstLine: true,
                    }}
                    data={chartData}
                />
                {yourMonthlyProfitAverage == 0 ? <Text style={styles.nodataErrorText}>{i18n.t('myBusiness.NoDataStartSelling')}</Text>:<View></View>}
                
            </View>
            <View style={styles.monthlyProfitAverageRow}>
                <Text style={styles.monthlyProfitAverageText}>{Type === 'MyBusiness' ? i18n.t('commonComponents.barchart.monthilySalesAverage') : i18n.t('commonComponents.barchart.monthilyProfitAverage')} 
                <Text style={styles.monthlyProfitAverageRate}>{yourMonthlyProfitAverage}{i18n.t('commonComponents.vnd')}</Text></Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    timelineActive: {
        marginLeft: 40,
        marginTop: 20
    },
    profitOverviewRow: {
        alignItems: 'center'
    },
    profitOverviewText: {
        fontFamily: "Tajawal-Regular",
        color: '#808C90',
        fontSize: 10,
        fontStyle: "normal",
        fontWeight: "bold",
    },
    profitOverviewMonth: {
        fontFamily: "Tajawal-Regular",
        color: '#808C90',
        fontSize: 10,
        fontStyle: "normal",
        fontWeight: "normal",
    },
    monthlyProfitAverageRow: {
        backgroundColor: '#F7F8FA',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        // marginLeft:10,
        // marginRight:10
    },
    monthlyProfitAverageText: {
        fontFamily: "Tajawal-Bold",
        color: '#808C90',
        fontSize: 14,
        fontStyle: "normal",
        textAlign: 'center',
        fontWeight: "600",
    },
    monthlyProfitAverageRate: {
        color: '#52C2D4'
    },
    nodataErrorText: {
        position:'absolute',
        fontSize:12 ,
        color: "rgb(82, 194, 212)",
        top:'46%',
        alignSelf:'center'
    }
})

BarChart.PropTypes = {
    BarChartData: PropTypes.object,
};
