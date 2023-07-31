import { FC } from "react";
import { TouchableOpacity, SafeAreaView, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Feather";
import { Color } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Routes } from "../../navigation/types";

const TabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={{ flexDirection: "row", marginBottom: bottom }}>
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
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({
              name: route.name,
              params: undefined,
              merge: true,
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const getIcon = (routeName: Routes) => {
          console.log(routeName);
          const color = isFocused ? Color.primary : Color.grey;
          switch (routeName) {
            case Routes.HomeStack:
              return (
                <Icon
                  name={"home"}
                  size={30}
                  color={color}
                  style={{ paddingTop: 20 }}
                />
              );
            case Routes.SearchStack:
              return (
                <Icon
                  name={"search"}
                  size={30}
                  color={color}
                  style={{ paddingTop: 20 }}
                />
              );
            case Routes.NotificationsStack:
              return (
                <Icon
                  name={"bell"}
                  size={30}
                  color={color}
                  style={{ paddingTop: 20 }}
                />
              );
            case Routes.AccountStack:
              return (
                <Icon
                  name={"user"}
                  size={30}
                  color={color}
                  style={{ paddingTop: 20 }}
                />
              );
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
    </View>
  );
};

export default TabBar;
