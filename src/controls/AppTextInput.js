import React from 'react';
import { TextInput as RNTextInput, StyleSheet, I18nManager, View } from 'react-native';

function AppTextInput(props) {
  return (
    <View>
      <RNTextInput
        onFocus={props.onFocus}
        multiline={props.multiline || false}
        placeholderTextColor={"#828E92"}
        defaultValue={props.defaultValue}
        placeholder={props.Placeholder}
        onChangeText={props.OnChange}
        autoFocus={props.autoFocus}
        value={props.Value}
        keyboardType={props.Type}
        editable={props.Editable}
        maxLength={props.MaxLength}
        onSelectionChange={props.OnSelectionChange}
        onBlur={props.OnBlur}
        secureTextEntry={props.SecureTextEntry}
        contextMenuHidden={props.ContextMenuHidden}
        underlineColorAndroid="transparent"
        style={{
          ...styles.textInputStyle,
          ...(props.Editable ? styles.textEditable : styles.textNotEditable),
          ...props.Style, // ✅ override styles like background
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'Tajawal-Regular',
    paddingHorizontal: 10,
    height: 50,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  textEditable: {
    // backgroundColor: 'white',
  },
  textNotEditable: {
    // backgroundColor: '#eee',
  },
});

export default AppTextInput;
