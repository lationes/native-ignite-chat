import { observer } from "mobx-react-lite"
import React, { FC, useMemo, useState } from "react"
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
import { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown"
import { KeyValueModel } from "app/types/common.types"

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

    const [selectedUserId, setSelectedUserId] = useState<number>();
    const [selectedChatRoomId, setSelectedChatRoomId] = useState<number>();
    const [errors, setErrors] = useState<KeyValueModel | null>(null);

    const userDropdownItems = useMemo(() => {
      if (userSuggestions) {
        return userSuggestions.map(user => {
          return {
            id: String(user.id),
            title: user.email,
          }
        })
      }

      return null;
    }, [userSuggestions]);

    const chatRoomDropdownItems = useMemo(() => {
      if (chatRoomSuggestions) {
        return chatRoomSuggestions.map(chatRoom => {
          return {
            id: String(chatRoom.id),
            title: chatRoom.title,
          }
        })
      }

      return null;
    }, [chatRoomSuggestions]);

    const handleSelectItems = (item: TAutocompleteDropdownItem, field: 'user' | 'chatRoom') => {
      if (!item) {
        return;
      }

      const setFunction = field === 'user' ? setSelectedUserId : setSelectedChatRoomId;

      setFunction(Number(item.id));
    }

    const handleLoadSuggestions = async (text: string, field: 'user' | 'chatRoom') => {
      setErrors(null);

      if (!authenticatedUserId) {
        return;
      }

      if (typeof text !== 'string' || text.length < 3) {
        onClear(field);
        return;
      }

      const filterToken = text.toLowerCase().trim();

      if (field === 'user') {
        await getUsers({ search: filterToken }, undefined, 'userSuggestions' );
      }

      if (field === 'chatRoom') {
        await fetchAvailableChatRooms(authenticatedUserId,{ search: filterToken }, undefined, 'chatRoomSuggestions');
      }
    }

    const onClear = (field: 'user' | 'chatRoom') => {
      const clearList = field === 'user' ? clearUserSuggestions : clearChatRoomSuggestions;
      clearList();
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
              selectItem={(item) => handleSelectItems(item, 'user')}
              onChangeText={(text) => handleLoadSuggestions(text, 'user')}
              onClear={() => onClear('user')}
              loading={loadingUsers.action === 'get' && loadingUsers.loading}
              status={errors?.selectedUserId ? 'error' : undefined}
              helper={errors?.selectedUserId ? errors?.selectedUserId : undefined}
            />
            <AutoComplete
              labelTx={'notificationsScreen.chatRoomAutoComplete.label'}
              placeholderTx={'notificationsScreen.chatRoomAutoComplete.placeholder'}
              dataSet={chatRoomDropdownItems}
              selectItem={(item) => handleSelectItems(item, 'chatRoom')}
              onChangeText={(text) => handleLoadSuggestions(text, 'chatRoom')}
              onClear={() => onClear('chatRoom')}
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
  height: 'calc(100% - 56px)',
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