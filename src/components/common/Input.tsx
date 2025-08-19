import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
  leftElement?: React.ReactNode;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  leftElement,
  ...props
}: InputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<TextInput>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        {leftElement ? (
          <View style={styles.leftElement}>{leftElement}</View>
        ) : leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={Layout.iconSize.md}
            color={Colors.gray400}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          ref={inputRef}
          style={[styles.input, (leftIcon || leftElement) ? styles.inputWithLeftIcon : null]}
          placeholderTextColor={Colors.gray400}
          secureTextEntry={isSecure}
          autoCorrect={false}
          autoCapitalize={props.autoCapitalize || "none"}
          returnKeyType={props.returnKeyType || "next"}
          blurOnSubmit={props.blurOnSubmit !== undefined ? props.blurOnSubmit : false}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          editable={props.editable !== false}
          textAlign={props.textAlign || 'left'}
          onKeyPress={props.onKeyPress}
          multiline={false}
          contextMenuHidden={false}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.rightIcon}>
            <Ionicons
              name={isSecure ? 'eye-off' : 'eye'}
              size={Layout.iconSize.md}
              color={Colors.gray400}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons
              name={rightIcon}
              size={Layout.iconSize.md}
              color={Colors.gray400}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    minHeight: 50,
  },
  inputContainerFocused: {
    borderColor: Colors.modernGreen,
    backgroundColor: Colors.white,
    shadowColor: Colors.modernGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: Layout.fontSize.md,
    color: Colors.text,
    paddingVertical: Layout.spacing.md,
  },
  inputWithLeftIcon: {
    marginLeft: Layout.spacing.sm,
  },
  leftIcon: {
    marginRight: Layout.spacing.sm,
  },
  rightIcon: {
    padding: Layout.spacing.xs,
  },
  error: {
    fontSize: Layout.fontSize.xs,
    color: Colors.error,
    marginTop: Layout.spacing.xs,
  },
  leftElement: {
    marginRight: Layout.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
