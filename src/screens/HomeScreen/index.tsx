import React, { FC } from 'react';
  import { View, Text } from 'react-native';
  import styles from './styles';
  
  const HomeScreen: FC = () => {
  
    return (
      <View style={styles.root}>
        <Text>{"HomeScreen"}</Text>
      </View>
    )
  };

  export default HomeScreen
  