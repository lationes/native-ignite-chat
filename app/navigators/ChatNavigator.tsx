import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { ChatRoomScreen } from "app/screens/ChatRoomsScreen/ChatRoomsScreen"
import { NotificationsScreen } from "app/screens/NotificationsScreen/NotificationsScreen"
import { ProfileScreen } from "app/screens/ProfileScreen/ProfileScreen"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { useStores } from "app/models"
import { AdminPanel } from "app/screens/AdminPanel/AdminPanel"

export type ChatTabParamList = {
  ChatRooms: { chatRoomId?: number | 'new'; }
  Notifications: { page?: 'list' | 'new' },
  Profile: undefined;
  AdminPanel: undefined;
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type ChatTabScreenProps<T extends keyof ChatTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ChatTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<ChatTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `ChatNavigator`.
 */
export function ChatNavigator() {
    const { bottom } = useSafeAreaInsets();
  const {
    authenticationStore: { isAdmin},
  } = useStores();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="ChatRooms"
        component={ChatRoomScreen}
        options={{
          tabBarAccessibilityLabel: translate("chatNavigator.chatRoomsTab"),
          tabBarLabel: translate("chatNavigator.chatRoomsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="podcast" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        initialParams={{ page: 'list' }}
        options={{
          tabBarAccessibilityLabel: translate("chatNavigator.notificationsTab"),
          tabBarLabel: translate("chatNavigator.notificationsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="notifications" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarAccessibilityLabel: translate("chatNavigator.profileTab"),
          tabBarLabel: translate("chatNavigator.profileTab"),
          tabBarIcon: ({ focused }) => (
            <FontAwesome name={'user-o'} color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminPanel"
        component={AdminPanel}
        options={{
          tabBarAccessibilityLabel: translate("chatNavigator.adminTab"),
          tabBarLabel: translate("chatNavigator.adminTab"),
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name={'admin-panel-settings'} color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
