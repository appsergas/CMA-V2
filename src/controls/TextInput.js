import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TextInput, I18nManager } from 'react-native'

/**
 * Input Text Function Component - Render part
 * @param {*} props Props received from parent page
 */

function InputText(props) {
  return (
    <View>
      <TextInput
        onFocus={props.onFocus}
        multiline={props.multiline ? props.multiline : false}
        placeholderTextColor={'#828E92'}
        ref={props.ref}
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
        {...props}
        style={{
          ...styles.textInputStyle,
          ...props.Style,
          ...(props.Editable ? styles.textEditable : styles.textNotEditable)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textNotEditable: {
    backgroundColor: '#eee'
  },
  textEditable: {
    backgroundColor: '#fff'
  },
  textInputStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 0.4,
    borderColor: '#E2E2E2',
    borderStyle: 'solid',
    paddingHorizontal: 10,
    color: '#828E92',
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    // textAlign: "left",
    height: 40,
    marginBottom: 15,
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  }
})

/**
 * Proptypes used
 */
InputText.propTypes = {
  Type: PropTypes.string,
  Editable: PropTypes.bool,
  ref: PropTypes.string,
  OnChange: PropTypes.func,
  OnBlur: PropTypes.func,
  Value: PropTypes.string,
  MaxLength: PropTypes.number,
  autoFocus: PropTypes.bool
}

/**
 * Default props set
 */
InputText.defaultProps = {
  Editable: true
}

export default InputText
