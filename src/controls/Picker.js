/**
 * Component for slect the value from the dropdown list.
 * Usage:
 * import PickerControl from "../../controls/Picker";
 * const pickeritems = [{ "id": "1", "label": "one", "value": "one" }, { "id": "2", "label": "two", "value": "two" }]
 * const [selectedValue, setSelectedValue] = useState("one");
 * const onValueChange = (itemValue, itemIndex) => {
 *  setSelectedValue(itemValue)
 * }
 * <PickerControl
        mode="dropdown"
        placeholder = 'Please select...'
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        items={pickeritems}
        style={styles.cityInputTextInput}
    />
 */
import React, { useState } from "react";
import { View, StyleSheet, Text, Image, Platform } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import propTypes from "prop-types";

export default function PickerControl(props) {

    const [selectedPickerValue, setSelectedPickerValue] = useState(undefined);

    const {
        selectedValue,
        onValueChange,
        mode,
        items,
        placeholder,
        style
    } = props

    const PickerPlaceholder = {
        label: placeholder,
        value: null,
        color: '#9EA0A4',
    };

    const pickeritems = [
        { "id": "1", "label": "Women Fashion", "value": "womenFashion" },
        { "id": "2", "label": "Men Fashion", "value": "menfashion" },
        { "id": "3", "label": "Mom & Baby", "value": "momandbaby" },
        { "id": "4", "label": "Beauty", "value": "beauty" },
        { "id": "5", "label": "Home", "value": "home" },
        { "id": "6", "label": "Electronics", "value": "electronics" },
        { "id": "7", "label": "Imports", "value": "imports" },
    ]

    function onPickerValueChange(itemValue, itemIndex) {
        props.onValueChange(itemValue, itemIndex);
    }

    let newItems = [];
    let fontcolor=Platform.OS == "android" ? "black" : "#000000"
    items.map(item => {
        newItems.push({ "id": item.id, "label": item.label, "value": item.value, "code": item.code, "color": fontcolor })
    })
    return (
        <View style={style}>
            {/* <Picker
                mode={mode}
                selectedValue={selectedValue}
                style={{ bottom: 6, backgroundColor: 'transparent' }}
                onValueChange={onValueChangee}
                itemStyle={styles.itemStyle}
            >
                {items && items.map(item => {
                    return (
                        <Picker.Item label={item.label} value={item.value} key={item.id} color="#828E92" />
                    )
                })}
            </Picker>
            <Image
                source={require("../../../assets/images/icon-ionic-ios-arrow-back.png")}
                style={styles.iconIonicIosArrowImage}
            /> */}
            <RNPickerSelect
                placeholder={PickerPlaceholder}
                items={newItems}
                onValueChange={onValueChange}
                style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                        top: 14,
                        right: 12,
                    },
                    
                }}
                value={selectedValue}
                doneText="Done"
                useNativeAndroidPickerStyle={false}
                textInputProps={{ underlineColor: 'yellow', color: "#2D395A" }}
                Icon={() => {
                    return <Image
                        source={require("../../assets/images/dropdown.png")}
                        style={styles.iconIonicIosArrowImage}
                    />;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    itemStyle: {
        fontSize: 14,
        height: 75,
        color: '#2D395A',
        textAlign: 'left',
        fontWeight: 'normal'
    },
    iconIonicIosArrowImage: {
        resizeMode: "stretch",
        backgroundColor: "transparent",
        position: "absolute",
        right: 5,
        width: 16,
        height: 16,
        // top: 9,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        color: "#828E92",
        fontFamily: "Tajawal-Regular",
        fontSize: 14,
        backgroundColor:'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        borderRadius: 4,
        paddingRight: 30, // to ensure the text is never behind the icon
        height: 40,
        marginBottom:15
    },
    placeholder: {
        color: '#828E92',
        fontSize: 14
    },
    inputAndroid: {
        color: "#102D4F",
        fontFamily: "Tajawal-Regular",
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        borderRadius: 4,
        backgroundColor: 'white',
        paddingRight: 30, // to ensure the text is never behind the icon
        height: 40,
        marginBottom:15
    },

});

PickerControl.propTypes = {
    props: propTypes.object
};