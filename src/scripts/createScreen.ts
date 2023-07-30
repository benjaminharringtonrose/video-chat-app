console.log("yup");
import fs from "fs-extra";

const createScreen = async () => {
  const screenName = process.argv[2];

  await fs.outputFile(
    `${process.cwd()}/src/screens/${screenName}/styles.ts`,
    `import { StyleSheet } from 'react-native';
  
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });
  
  export default styles;
  `
  );

  await fs.outputFile(
    `${process.cwd()}/src/screens/${screenName}/index.tsx`,
    `import React, { FC } from 'react';
  import { View, Text } from 'react-native';
  import styles from './styles';
  
  const ${screenName}: FC = () => {
  
    return (
      <View style={styles.root}>
        <Text>{"${screenName}"}</Text>
      </View>
    )
  };

  export default ${screenName}
  `
  );
};

createScreen();
