import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import {
  View,
  ViewStyle,
} from "react-native"
import {
  Button,
  Screen, Text,
} from "app/components"
import { useStores } from "app/models"
import { spacing } from "app/theme"
import { AutoComplete } from "app/components/AutoComplete"
import { CommonItemModel, KeyValueModel } from "app/types/common.types"

interface IProps {
  goBack: () => void,
}


export const CreateAddRequestPage: FC<IProps> = observer(
  function CreateAddRequestPage({ goBack }) {
    const {
      authenticationStore: { authenticatedUserId},
      addRequestStore: { createAddRequest },
      userStore: { loading: loadingUsers, getUsers, clearUserSuggestions, userSuggestions },
      chatRoomStore: { loading: loadingChatRooms, fetchAvailableChatRooms, clearChatRoomSuggestions, chatRoomSuggestions },
    } = useStores();

    const userSuggestionsProxy = userSuggestions.slice();
    const chatRoomSuggestionsProxy = chatRoomSuggestions.slice();

    const [selectedUserId, setSelectedUserId] = useState<number | null>();
    const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>();

    const [errors, setErrors] = useState<KeyValueModel | null>(null);

    const userDropdownItems = useMemo(() => {
      if (userSuggestionsProxy) {
        return userSuggestionsProxy.map(user => {
          return {
            id: user.id,
            title: user.email,
          }
        })
      }

      return null;
    }, [userSuggestionsProxy]);

    const chatRoomDropdownItems = useMemo(() => {
      if (chatRoomSuggestionsProxy) {
        return chatRoomSuggestionsProxy.map(chatRoom => {
          return {
            id: chatRoom.id,
            title: chatRoom.title,
          }
        })
      }

      return null;
    }, [chatRoomSuggestionsProxy]);

    useEffect(() => {
      if (authenticatedUserId) {
        getUsers({}, undefined, 'userSuggestions' );
        fetchAvailableChatRooms(authenticatedUserId,{}, undefined, 'chatRoomSuggestions');
      }
    }, [authenticatedUserId]);

    const handleSelectItem = (item: CommonItemModel, field: 'user' | 'chatRoom') => {
      if (!item) {
        return;
      }

      const setFunction = field === 'user' ? setSelectedUserId : setSelectedChatRoomId;

      setFunction(Number(item.id));
    }

    const handleSaveAddRequest = async () => {
      let errors = {};

      if (!selectedUserId) {
        errors = { ...errors, selectedUserId: "Please specify user you want send add request to!"};
      }

      if (!selectedChatRoomId) {
        errors = { ...errors, selectedChatRoomId: "Please specify chat room you want to add user to!"};
      }

      if (Object.values(errors).length) {
        setErrors(errors);
        return;
      }

      if (selectedUserId && selectedChatRoomId) {
        await createAddRequest({ userId: selectedUserId, chatRoomId: selectedChatRoomId }, goBack);
      }
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View style={$heading}>
          <Text preset="heading" tx="notificationsScreen.addRequestEditorTitle" />
        </View>
        <View style={$pageContent}>
          <View style={$inputContainers}>
            <AutoComplete
              labelTx={'notificationsScreen.userAutoComplete.label'}
              placeholderTx={'notificationsScreen.userAutoComplete.placeholder'}
              dataSet={userDropdownItems}
              selectItem={(item) => handleSelectItem(item, 'user')}
              loading={loadingUsers.action === 'get' && loadingUsers.loading}
              status={errors?.selectedUserId ? 'error' : undefined}
              helper={errors?.selectedUserId ? errors?.selectedUserId : undefined}
            />
            <AutoComplete
              labelTx={'notificationsScreen.chatRoomAutoComplete.label'}
              placeholderTx={'notificationsScreen.chatRoomAutoComplete.placeholder'}
              dataSet={chatRoomDropdownItems}
              selectItem={(item) => handleSelectItem(item, 'chatRoom')}
              loading={loadingChatRooms.action === 'getMany' && loadingChatRooms.loading}
              status={errors?.selectedChatRoomId ? 'error' : undefined}
              helper={errors?.selectedChatRoomId ? errors?.selectedUserId : undefined}
            />
          </View>
          <View style={$buttonContainer}>
            <Button
              testID="message-editor-button"
              tx={"chatRoomScreen.chatRoomEditorPage.saveChatRoomInfoButtonTitle"}
              preset="reversed"
              onPress={handleSaveAddRequest}
            />
            <Button
              testID="message-editor-button"
              tx={"common.cancel"}
              preset="outline"
              onPress={goBack}
            />
          </View>
        </View>
      </Screen>
    )
  },
)

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $heading: ViewStyle = {
  alignSelf: 'center',
  marginBottom: spacing.md,
}

const $pageContent: ViewStyle = {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing.md,
}

const $inputContainers: ViewStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: spacing.lg,
}

const $buttonContainer: ViewStyle = {
  width: '100%',
  gap: spacing.xs,
}

// #endregion