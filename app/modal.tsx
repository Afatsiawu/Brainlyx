import { Colors, Spacing, Typography } from '@/constants/theme';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.separator} />
      <Text style={styles.message}>This is a modal screen.</Text>
      
      <Link href="../" style={styles.link}>
        <Text style={styles.linkText}>Dismiss</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: Colors.border,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  link: {
    paddingVertical: 15,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  }
});
