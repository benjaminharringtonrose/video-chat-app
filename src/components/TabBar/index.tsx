import { FC, useState } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Feather";
import { Color } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Routes } from "../../navigation/types";
import Reanimated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import styles from "./styles";
import { useNotifications } from "../../atoms/notifications";

const TabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const { unreadNotifications } = useNotifications();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabWidth = (width - 20) / state.routes.length;

  const tabIndicatorStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: withTiming(tabWidth * selectedIndex) }],
    }),
    [selectedIndex]
  );

  return (
    <View
      style={[
        styles.root,
        {
          marginBottom: bottom,
          backgroundColor: Color.card,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({
              name: route.name,
              params: route.params,
              merge: true,
            });
          }
          setSelectedIndex(index);
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
          setSelectedIndex(index);
        };

        const getIcon = (routeName: Routes) => {
          const color = isFocused ? Color.primary : Color.grey;
          switch (routeName) {
            case Routes.HomeStack:
              return <Icon name={"home"} size={30} color={color} />;
            case Routes.SearchStack:
              return <Icon name={"search"} size={30} color={color} />;
            case Routes.NotificationsStack:
              return (
                <View>
                  {unreadNotifications && <View style={styles.badge} />}
                  <Icon name={"bell"} size={30} color={color} />
                </View>
              );
            case Routes.AccountStack:
              return <Icon name={"user"} size={30} color={color} />;
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center" }}
          >
            {getIcon(route.name as Routes)}
          </TouchableOpacity>
        );
      })}
      <Reanimated.View
        style={[
          styles.tabIndicator,
          { width: tabWidth, backgroundColor: Color.primary },
          tabIndicatorStyle,
        ]}
      />
    </View>
  );
};

export default TabBar;
