import { StyleSheet, useColorScheme } from 'react-native';

export default function useThemeStyles() {
  const theme = useColorScheme();

const colors = {
  background: theme === 'dark' ? '#077f8a' : '#077f8a',
  text: theme === 'dark' ? '#000000' : '#ffffff',
  inputBackground: theme === 'dark' ? '#bfd9db' : '#bfd9db',
  border: theme === 'dark' ? '#333333' : '#cccccc',
  accent: theme === 'dark' ? '#bfd9db' : '#bfd9db', // changed from green to blue
  primary: theme === 'dark' ? '#bfd9db' : '#bfd9db', // also blue
  black: '#000000',
  white: '#ffffff',
};


  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.accent,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      color: colors.text,
      opacity: 0.6,
      textAlign: 'center',
      marginBottom: 20,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 12,
      width: '100%',
    },
    icon: {
      marginRight: 10,
      color: '#000000',
    },
    input: {
      flex: 1,
      color: '#000000',
      paddingVertical: 10,
    },
    button: {
      padding: 12,
      borderRadius: 5,
      backgroundColor: colors.primary,
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
    },
    buttonText: {
      color: '#000000',
      fontWeight: 'bold',
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      color: colors.primary,
      marginBottom: 20,
    },
    linkRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    linkText: {
      color: colors.text,
      marginRight: 5,
    },
    linkAccent: {
      color: colors.accent,
      fontWeight: 'bold',
    },
    popup: {
      position: 'absolute',
      top: 30,
      left: 20,
      right: 20,
      padding: 15,
      borderRadius: 8,
      backgroundColor: colors.primary,
      zIndex: 999,
    },
    popupText: {
      color: colors.white,
      textAlign: 'center',
      fontWeight: '600',
    },
    card: {
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderRadius: 10,
      padding: 20,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });
}
