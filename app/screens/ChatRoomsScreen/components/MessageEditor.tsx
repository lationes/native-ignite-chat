import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"
import { Button, Icon, TextField } from "app/components"
import React, { useEffect, useMemo, useState } from "react"
import { useStores } from "app/models"
import { KeyValueModel } from "app/types/common.types"

interface IProps {
  messageId: number | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  chatRoomId: number;
}

export const MessageEditor = observer(function MessageEditor({
                                                           messageId,
                                                           open,
                                                           setOpen,
                                                           chatRoomId,
                                                         }: IProps) {
  const {
    messageStore: { messages, createMessage, updateMessage },
  } = useStores();

  const [textContent, setTextContent] = useState<string>( '');
  const [errors, setErrors] = useState<KeyValueModel | null>(null);

  const message = useMemo(() => {
    if (messageId && messages?.length) {
      return messages.slice().find(message => message.id === messageId);
    }

    return null;
  }, [messageId, messages]);

  useEffect(() => {
    if (message?.content) {
      setTextContent(message.content);
    }
  }, [message?.content]);

  const handleClose = () => {
    setOpen(false);
    setTextContent('');
    setErrors(null);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleSetTextContent = (text: string) => {
    setErrors(null);
    setTextContent(text);
  }

  const handleMessage = async () => {
    if (!textContent) {
      setErrors({ content: "Message can't be empty"})
      return;
    }

    if (message?.id && chatRoomId) {
      await updateMessage( message.id,{ content: textContent })
    }

    if (!message) {
      await createMessage({ content: textContent, chatRoomId })
    }

    handleClose();
  }

  return (
    <View style={$editorContainer}>
      { !open ? (
        <Button onPress={handleOpen} style={$IconButton}>
          <Icon icon={'chat'} size={16} />
        </Button>
      ) : null}
      { open ? (
        <View style={$editorFieldsContainer}>
          <TextField
            autoFocus
            value={textContent}
            multiline
            onChangeText={handleSetTextContent}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="default"
            placeholderTx="chatRoomScreen.messageEditor.inputPlaceholder"
            helper={errors?.content ? errors.content : ''}
            status={errors?.content ? 'error' : undefined}
          />
          <Button
            testID="message-editor-button"
            tx={"chatRoomScreen.messageEditor.saveButtonTitle"}
            style={$tapButton}
            preset="reversed"
            onPress={handleMessage}
          />
          <Button
            testID="message-editor-cancel-button"
            tx={"common.cancel"}
            style={$tapButton}
            preset="outline"
            onPress={handleClose}
          />
        </View>
      ) : null }
    </View>
  )
})

const $IconButton: ViewStyle = {
  width: 56,
  height: 56,
  backgroundColor: colors.palette.primary500,
  borderRadius: 28,
  marginLeft: "auto",
}

const $editorContainer: ViewStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  position: 'absolute',
  bottom: 0,
  width: '100%',
  paddingHorizontal: spacing.md,
}

const $editorFieldsContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
  backgroundColor: colors.palette.neutral200,
  borderWidth: 1,
  borderColor: colors.palette.neutral500,
  borderRadius: spacing.md,
  padding: spacing.md,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

