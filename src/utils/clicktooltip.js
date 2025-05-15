import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ClickTooltip = ({ IconComponent, tooltipText = 'Tooltip', iconColor = '#FFFFFF99', autoHideMs = 3000 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef(null);
  const isMounted = useRef(true);

  const handleClick = () => {
    setShowTooltip(true);
    // Auto-hide after X ms
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) setShowTooltip(false);
    }, autoHideMs);
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
      clearTimeout(timeoutRef.current); // Clean up timeout
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleClick}>
        <IconComponent color={iconColor} />
      </TouchableOpacity>
      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltipText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'flex-start',
  },
  tooltip: {
    position: 'absolute',
    top: 30,
    left: 0,
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 13,
  },
});

export default ClickTooltip;
