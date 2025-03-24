import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const CustomKeyboardAwareScrollView = (props) => {

    const {
        style,
        contentContainerStyle
    } = props

    return (
        <KeyboardAwareScrollView
            extraHeight={100}
            keyboardShouldPersistTaps={'handled'}
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={[{ flex: 1 }, style]}
            contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        >
            {
                props.children
            }
        </KeyboardAwareScrollView>
    )
}

export default CustomKeyboardAwareScrollView