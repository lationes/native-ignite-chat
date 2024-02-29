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
import { ChatRoom } from "app/models/ChatRoom"
import { observer } from "mobx-react-lite"
import { ChatRoomView } from "app/screens/ChatRoomsScreen/components/ChatRoomView"
import { JoinedChatRoom } from "app/types/chatroom.types"

const logo = require("../../../assets/images/logo.png")

interface ChatRoomsGroupsModel {
  id: 'joined' | 'available';
  title: string;
  data: ChatRoom[];
}

interface ChatRoomGroupItem {
  item: ChatRoomsGroupsModel;
  joinChatRoom: (chatRoomId: number) => void;
  navigateToChatRoom: (chatRoomId: number) => void;
}

const WebListItem: FC<ChatRoomGroupItem> = ({ item, joinChatRoom }) => {
  return (
    <View>
      <Text style={$menuContainer} preset="bold">{item.title}</Text>
      {item.data.map((chatRoom) => {
        return (
          <Link key={`chatRoom-${chatRoom.id}`} to={`/chatRooms/${chatRoom.id}`}>
            <Text>{chatRoom.title}</Text>
            <Button
              testID={`chat-room-join-button-${chatRoom.id}`}
              tx={ "chatRoomScreen.joinChatRoomButton.title"}
              preset="reversed"
              onPress={(e) => {
                e.stopPropagation();
                joinChatRoom(chatRoom.id)
              }}
            />
          </Link>
        )
      })}
    </View>
  )
}

const NativeListItem: FC<ChatRoomGroupItem> = ({ item, navigateToChatRoom, joinChatRoom }) => (
  <View>
    <Text preset="bold" style={$menuContainer}>
      {item.title}
    </Text>
    {item.data.map((chatRoom) => (
      <ListItem
        key={`chatRoom-${chatRoom.id}`}
        onPress={() => navigateToChatRoom(chatRoom.id)}
        text={chatRoom.title}
        RightComponent={<Button
          testID={`chat-room-join-button-${chatRoom.id}`}
          tx={ "chatRoomScreen.joinChatRoomButton.title"}
          preset="reversed"
          onPress={(e) => {
            e.stopPropagation();
            joinChatRoom(chatRoom.id)
          }}
        />}

      />
    ))}
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
      chatRoomStore: { chatRooms, connectUserToChatRoom },
      authenticationStore: { authenticatedUserId, logout },
    } = useStores()

    const markedJoinedChatRooms: JoinedChatRoom[] | null = useMemo(() => {
      if (chatRooms?.length && authenticatedUserId) {
        return chatRooms.map(chatRoom => {
          const chatRoomUsersIds = chatRoom.users.map(user => user.id);
          const joined =  chatRoomUsersIds.includes(authenticatedUserId);

          return {
            ...chatRoom,
            joined,
          }
        })
      }

      return null;
    }, [chatRooms, authenticatedUserId])

    const joinedChatRooms = useMemo(() => {
      if (markedJoinedChatRooms?.length) {
        return markedJoinedChatRooms.filter(chatRoom => chatRoom.joined);
      }

      return null;
    }, [markedJoinedChatRooms]);

    const availableChatRooms = useMemo(() => {
      if (markedJoinedChatRooms?.length) {
        return markedJoinedChatRooms.filter(chatRoom => !chatRoom.joined);
      }

      return null;
    }, [markedJoinedChatRooms]);

    useEffect(() => {
      if (availableChatRooms?.length && !params.chatRoomId) {
        navigation.setParams({
          chatRoomId: availableChatRooms[0].id,
        })
      }
    }, [params, availableChatRooms]);

    const chatRoomsGroups: ChatRoomsGroupsModel[] | null = useMemo(() => {
      const groups: ChatRoomsGroupsModel[] = [];

      if (joinedChatRooms?.length) {
        groups.push({
          id: 'joined',
          title: 'Your chat rooms',
          data: joinedChatRooms,
        })
      }

      if (availableChatRooms?.length) {
        groups.push({
          id: 'available',
          title: 'Available chat rooms',
          data: availableChatRooms,
        })
      }

      return groups;
    }, [joinedChatRooms, availableChatRooms])

    const currentChatRoom = useMemo(() => {
      if (markedJoinedChatRooms && markedJoinedChatRooms?.length) {
        return markedJoinedChatRooms.find(chatRoom => chatRoom.id === Number(params.chatRoomId)) || null;
      }

      return null;
    }, [params, chatRooms])

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

    const navigateToChatRoom = (chatRoomId: number) => {
      navigation.setParams({
        chatRoomId: chatRoomId,
      })
    }

    const joinChatRoom = async (chatRoomId: number) => {
      await connectUserToChatRoom(chatRoomId);

      navigateToChatRoom(chatRoomId);
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
              ref={menuRef}
              contentContainerStyle={$listContentContainer}
              estimatedItemSize={250}
              data={chatRoomsGroups}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <ShowroomListItem {...{ item, joinChatRoom, navigateToChatRoom }} />
              )}
            />
          </View>
        )}
      >
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
          <View style={$headerContainer}>
            <DrawerIconButton onPress={toggleDrawer} />
            <Text onPress={logout} tx={"common.logOut"} />
          </View>
          <ChatRoomView chatRoom={currentChatRoom} />
        </Screen>
      </Drawer>
    )
  }
)

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
}

const $logoImage: ImageStyle = {
  height: 42,
  width: 77,
}

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  height: 56,
  width: '100%',
  paddingHorizontal: spacing.lg,
}

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
}

const $headerContainer: ViewStyle = {
  display: 'flex',
  justifyContent: 'space-between',
}
