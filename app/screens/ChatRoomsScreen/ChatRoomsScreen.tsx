import { Link, RouteProp, useRoute } from "@react-navigation/native"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Image, ImageStyle, Platform, View, ViewStyle } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { type ContentStyle } from "@shopify/flash-list"
import { Button, ListItem, ListView, ListViewRef, Screen, Text } from "app/components"
import { isRTL } from "app/i18n"
import { ChatTabParamList, ChatTabScreenProps } from "app/navigators/ChatNavigator"
import { colors, spacing } from "app/theme"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { DrawerIconButton } from "app/components/DrawerIconButton"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { ChatRoomPage } from "app/screens/ChatRoomsScreen/components/ChatRoomPage"
import {
  ChatRoomInfoEditorPage,
} from "app/screens/ChatRoomsScreen/components/ChatRoomInfoEditorPage"
import { ChatRoom } from "app/models/ChatRoom"
import LogoutButton from "app/components/LogoutButton"

const logo = require("../../../assets/images/logo.png")

interface ChatRoomGroupItem {
  item: ChatRoom;
  navigateToChatRoom: (chatRoomId: number) => void;
}

const WebListItem: FC<ChatRoomGroupItem> = ({ item }) => {
  return (
    <View>
      <Link style={$webListItem} key={`chatRoom-${item.id}`} to={`/chatRooms/${item.id}`}>
        <Text>{item.title}</Text>
      </Link>
    </View>
  )
}

const NativeListItem: FC<ChatRoomGroupItem> = ({ item, navigateToChatRoom }) => (
  <View>
    <ListItem
      key={`chatRoom-${item.id}`}
      onPress={() => navigateToChatRoom(item.id)}
      text={item.title}
    />
  </View>
)

const ShowroomListItem = Platform.select({ web: WebListItem, default: NativeListItem })

export const ChatRoomScreen: FC<ChatTabScreenProps<"ChatRooms">> = observer(
  function ChatRoomScreen({ navigation }) {
    const [open, setOpen] = useState(false)
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const menuRef = useRef<ListViewRef<ChatRoomGroupItem["item"]>>(null)
    const route = useRoute<RouteProp<ChatTabParamList, "ChatRooms">>()
    const params = route.params;
    const {
      chatRoomStore: { chatRooms },
    } = useStores();

    const chatRoomsProxy = chatRooms.slice();

    useEffect(() => {
      if (chatRoomsProxy?.length && !params.chatRoomId) {
        navigation.setParams({
          chatRoomId: chatRoomsProxy.slice()[0].id,
        })
      }
    }, [params, chatRoomsProxy]);

    const toggleDrawer = () => {
      if (!open) {
        setOpen(true)
      } else {
        setOpen(false)
      }
    }

    useEffect(() => {
      return () => timeout.current && clearTimeout(timeout.current)
    }, [])

    const navigateToChatRoom = (chatRoomId: number | 'new') => {
      navigation.setParams({
        chatRoomId: chatRoomId,
      })

      setOpen(false);
    }

    const $drawerInsets = useSafeAreaInsetsStyle(["top"])

    return (
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerType={"slide"}
        drawerPosition={isRTL ? "right" : "left"}
        renderDrawerContent={() => (
          <View style={[$drawer, $drawerInsets]}>
            <View style={$logoContainer}>
              <Image source={logo} style={$logoImage} />
            </View>

            <ListView<ChatRoomGroupItem["item"]>
              ListHeaderComponent={<Text preset={'subheading'} tx={'chatRoomScreen.drawerTitle'}></Text>}
              ref={menuRef}
              contentContainerStyle={$listContentContainer}
              estimatedItemSize={250}
              data={chatRoomsProxy}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <ShowroomListItem {...{ item, navigateToChatRoom }} />
              )}
            />

            <Button
              testID={`chat-room-create-button`}
              tx={ "chatRoomScreen.createChatRoomButton.title"}
              preset="reversed"
              style={$sideBarButton}
              onPress={(e) => {
                e.stopPropagation();
                navigateToChatRoom('new');
              }}
            />
          </View>
        )}
      >
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
          <View style={$headerContainer}>
            <DrawerIconButton onPress={toggleDrawer} />
            <LogoutButton />
          </View>
          { params.chatRoomId === 'new' ? (
            <ChatRoomInfoEditorPage chatRoomId={null} navigateToChatRoom={navigateToChatRoom} />
          ) : (
            <ChatRoomPage chatRoomId={Number(params.chatRoomId)} navigateToChatRoom={navigateToChatRoom} />
          )}
        </Screen>
      </Drawer>
    )
  }
)

const $screenContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.sm,
}

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
  gap: spacing.sm,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
}

const $logoImage: ImageStyle = {
  height: 42,
  width: 77,
}

const $logoContainer: ViewStyle = {
  justifyContent: "center",
  height: 56,
  width: '100%',
  paddingHorizontal: spacing.lg,
}

const $headerContainer: ViewStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
}

const $sideBarButton: ViewStyle = {
  borderRadius: 2,
}

const $webListItem: ViewStyle = {
  minHeight: 56,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
}
