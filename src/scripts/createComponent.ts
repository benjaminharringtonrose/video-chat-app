import fs from "fs-extra";

const createComponent = async () => {
  const componentName = process.argv[2];

  await fs.outputFile(
    `${process.cwd()}/src/components/${componentName}/styles.ts`,
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
    `${process.cwd()}/src/components/${componentName}/index.tsx`,
    `import React, { FC } from 'react';
  import { View, Text } from 'react-native';
  import styles from './styles';
  
  const ${componentName}: FC = () => {
  
    return (
      <View style={styles.root}>
        <Text>{"${componentName}"}</Text>
      </View>
    )
  };

  export default ${componentName}
  `
  );
};

createComponent();
