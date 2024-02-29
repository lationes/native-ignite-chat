import { observer } from "mobx-react-lite"
import { Message } from "app/models/Message"
import { View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"
import { Button, Icon, TextField } from "app/components"
import React, { useEffect, useState } from "react"
import { useStores } from "app/models"

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

  useEffect(() => {
    if (message) {
      setTextContent(message.content);
    }
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    setTextContent('');
  }

  const handleEditorButton = () => {
    const isOpen = !open;

    setOpen(isOpen);

    if (!isOpen) {
      setTextContent('');
    }
  }

  const handleMessage = async () => {
    if (message?.id && chatRoomId) {
      await updateMessage({ content: textContent })
    }

    if (!message) {
      await createMessage({ chatRoomId, content: textContent })
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
            onChangeText={setTextContent}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="default"
            placeholderTx="chatRoomScreen.messageEditor.inputPlaceholder"
            helper={!textContent ? "Message can't be empty" : ''}
            status={!textContent ? 'error' : undefined}
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

