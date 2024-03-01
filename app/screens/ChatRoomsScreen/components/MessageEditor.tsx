import { observer } from "mobx-react-lite"
import { Message } from "app/models/Message"
import { View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"
import { Button, Icon, TextField } from "app/components"
import React, { useEffect, useState } from "react"
import { useStores } from "app/models"
import { KeyValueModel } from "app/types/common.types"

interface IProps {
  message: Message | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  chatRoomId: number;
}

export const MessageEditor = observer(function MessageEditor({
                                                           message,
                                                           open,
                                                           setOpen,
                                                           chatRoomId,
                                                         }: IProps) {
  const {
    messageStore: { createMessage, updateMessage },
  } = useStores();

  const [textContent, setTextContent] = useState<string>(message?.content || '');
  const [errors, setErrors] = useState<KeyValueModel | null>(null);

  useEffect(() => {
    if (message) {
      setTextContent(message.content);
    }
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    setTextContent('');
    setErrors(null);
  }

  const handleEditorButton = () => {
    const isOpen = !open;

    setOpen(isOpen);

    if (!isOpen) {
      setTextContent('');
      setErrors(null);
    }
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
      await createMessage({ content: textContent })
    }

    handleClose();
  }

  return (
    <View style={$editorContainer}>
      <Button onPress={handleEditorButton} style={$IconButton}>
        <Icon icon={open ? 'x' : 'chat'} size={16} />
      </Button>
      { open ? (
        <View>
          <TextField
            autoFocus={true}
            value={textContent}
            onChangeText={handleSetTextContent}
            containerStyle={$textField}
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
            tx={"chatRoomScreen.messageEditor.buttonTitle"}
            style={$tapButton}
            preset="reversed"
            onPress={handleMessage}
          />
        </View>
      ) : null }
    </View>
  )
})

const $IconButton: ViewStyle = {
  width: 24,
  height: 24,
  backgroundColor: colors.palette.primary500,
  borderRadius: 50,
  marginLeft: "auto",
}

const $editorContainer: ViewStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  position: 'absolute',
  bottom: 0,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

