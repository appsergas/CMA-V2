import React from "react"
import ReactNativePickerModule from "react-native-picker-module"
import { Colors } from "../../utils/Colors/Colors"




export const CustomPicker = React.forwardRef((props, ref) => {

    const {
        value = '',
        data = [],
        title = ''
    } = props


    return (
        <ReactNativePickerModule

            ref={ref}
            value={value}
            title={title}
            backdropColor={Colors.Black}
            items={data}
            tintColor={'black'}
            titleStyle={{ color: Colors.DarkBlue }}
            // itemStyle={{ color: '#111', backgroundColor: 'red' }}
            // itemStyle={{ }}
            selectedColor={'blue'}
            confirmButtonEnabledTextStyle={{ color: "blue" }}
            confirmButtonDisabledTextStyle={{ color: "grey" }}
            cancelButtonTextStyle={{ color: "red" }}
            useNativeDriver={true}
            confirmButtonStyle={{
                backgroundColor: "rgba(0,0,0,1)",

            }}
            cancelButtonStyle={{
                backgroundColor: "rgba(0,0,0,1)",
            }}
            contentContainerStyle={{
                backgroundColor: "rgba(0,0,0,1)",
            }}
            onCancel={() => {
                props.onCancel()
            }}
            onValueChange={(value, index) => {
                props.onValueChange(value,index)
                // setValue(value)
            }}
        />

    )
})