import React, { FC, useEffect, useMemo } from "react"
import { ActivityIndicator, ImageStyle, View, ViewStyle } from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import { Button, EmptyState, ListView, Screen, Text } from "app/components"
import { ChatTabParamList, ChatTabScreenProps } from "app/navigators/ChatNavigator"
import { spacing } from "app/theme"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { AddRequest } from "app/models/AddRequest"
import { isRTL } from "app/i18n"
import { NotificationCard } from "app/screens/NotificationsScreen/components/NotificationCard"
import { RouteProp, useRoute } from "@react-navigation/native"
import { CreateAddRequestPage } from "app/screens/NotificationsScreen/components/CreateAddRequestPage"
import LogoutButton from "app/components/LogoutButton"

export const NotificationsScreen: FC<ChatTabScreenProps<"Notifications">> = observer(
  function NotificationsScreen({ navigation }) {
    const route = useRoute<RouteProp<ChatTabParamList, "Notifications">>()
    const params = route.params;

    const {
      chatRoomStore: { connectUserToChatRoom },
      authenticationStore: { authenticatedUserId },
      addRequestStore: { getAddRequestsByUserId, addRequests, deleteAddRequest, loading },
    } = useStores()

    const isLoading = useMemo(() => {
      return loading.action === 'get' && loading.loading;
    }, [loading]);

    useEffect(() => {
      if (authenticatedUserId) {
        getAddRequestsByUserId(authenticatedUserId);
      }
    }, [authenticatedUserId])

    async function getAddRequests() {
      if (authenticatedUserId) {
        await getAddRequestsByUserId(authenticatedUserId)
      }
    }

    const navigateToCreateAddRequest = () => {
      navigation.setParams({
        page: 'new',
      })
    }

    const navigateToGeneralAddRequestScreen = () => {
      navigation.setParams({
        page: 'list',
      })
    }

    const navigateToChatRoom = (chatRoomId: number | 'new') => {
      navigation.navigate('ChatRooms', { chatRoomId })
    }

    const handleDeleteAddRequest = async (chatRoomId: number) => {
      await deleteAddRequest(chatRoomId, getAddRequests);
    }

    const handleAcceptAddRequest = async (addRequestId: number) => {
      const addRequest = addRequests.slice().find(addRequest => addRequest.id === addRequestId);

      if (addRequest) {
        await connectUserToChatRoom(addRequest.chatRoomId, async () => {
          await getAddRequests();
          navigateToChatRoom(addRequest.chatRoomId);
        });
      }
    }

    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
        <View style={$headerContainer}>
          <LogoutButton />
        </View>
        {params.page === 'list' ? (
          <View style={$listRequestsContainer}>
            <ListView<AddRequest>
              contentContainerStyle={$listContentContainer}
              data={addRequests.slice() || []}
              refreshing={isLoading}
              estimatedItemSize={177}
              onRefresh={getAddRequests}
              ListEmptyComponent={
                isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <EmptyState
                    preset="generic"
                    style={$emptyState}
                    headingTx={"notificationsScreen.notificationsEmptyState.heading"}
                    contentTx={"notificationsScreen.notificationsEmptyState.content"}
                    button={''}
                    buttonOnPress={getAddRequests}
                    imageStyle={$emptyStateImage}
                    ImageProps={{ resizeMode: "contain" }}
                  />
                )
              }
              ListHeaderComponent={
                <View style={$heading}>
                  <Text preset="heading" tx="notificationsScreen.title"/>
                </View>
              }
              renderItem={({ item }) => (
                <NotificationCard
                  addRequestId={item.id}
                  joinChatRoom={handleAcceptAddRequest}
                  deleteAddRequest={handleDeleteAddRequest}
                />
              )}
            />
            <Button
              testID="message-editor-button"
              tx={"notificationsScreen.navigateTo"}
              preset="reversed"
              onPress={navigateToCreateAddRequest}
            />
          </View>
        ) : null}
        { params.page === 'new' ? (
          <CreateAddRequestPage goBack={navigateToGeneralAddRequestScreen} />
        ) : null}
      </Screen>
    )
  }
)

const $headerContainer: ViewStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  flexDirection: 'row',
  alignItems: 'center',
}

const $screenContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.sm,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
  display: 'flex',
  justifyContent: 'space-between',
}

const $listRequestsContainer: ViewStyle = {
  flexDirection: 'column',
  height: 'calc(100% - 56px)',
  justifyContent: 'space-between',
  gap: spacing.md,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
