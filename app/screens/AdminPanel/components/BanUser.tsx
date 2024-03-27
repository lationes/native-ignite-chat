import { observer } from "mobx-react-lite"
import React, { FC, useMemo, useState } from "react"
import {
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { useStores } from "app/models"
import { colors, spacing } from "app/theme"
import { CommonItemModel, KeyValueModel } from "app/types/common.types"
import { Button, Text, TextField } from "app/components"
import { Select } from "app/components/Select"
interface IProps {
  action: 'ban' | 'unban';
}


export const BanUser: FC<IProps> = observer(
  function BanUser({ action }) {
    const {
      authenticationStore: { authenticatedUserId },
      userStore: { userSuggestions, banUser, unBanUser, error, setError, loading },
    } = useStores();

    const userSuggestionsProxy = userSuggestions.slice();

    const userDropdownItems = useMemo(() => {
      if (userSuggestionsProxy) {
        return userSuggestionsProxy.map(user => {
          return {
            id: user.id,
            title: user.email,
          }
        }).filter(user => user.id !== authenticatedUserId)
      }

      return null;
    }, [userSuggestionsProxy, authenticatedUserId]);

    const [userId, setUserId] = useState<number | null>(null);
    const [reason, setReason] = useState<string>('');
    const [errors, setErrors] = useState<KeyValueModel | null>(null);

    const handleSelectItem = (item: CommonItemModel) => {
      if (!item) {
        return;
      }

      const newErrors = { ...errors };

      if (newErrors.userId) {
        delete newErrors.userId;
      }

      setError(undefined);
      setErrors(newErrors);

      setUserId(Number(item.id));
    }

    const handleChangeReason = (value: string) => {
      const newErrors = { ...errors };

      if (newErrors.reason) {
        delete newErrors.reason;
      }

      setErrors(newErrors);
      setReason(value);
    }

    const handleAction = async () => {
      let errors = {};

      if (!userId) {
        errors = { ...errors, userId: "Please specify user you want to ban!"};
      }

      if (!reason && action === 'ban') {
        errors = { ...errors, reason: "Please specify ban reason!"};
      }

      if (Object.values(errors).length) {
        setErrors(errors);
        return;
      }

      if (userId && reason && action === 'ban') {
        await banUser(userId, { reason });
      }

      if (userId && reason && action === 'unban') {
        await unBanUser(userId);
      }
    }

    return (
      <>
        <View style={$pageContent}>
          {error && <Text text={error} size="sm" weight="light" style={$hint} />}
          <View style={$inputContainers}>
            <Select
              labelTx={'adminPanel.userToBanSelect.label'}
              placeholderTx={'adminPanel.userToBanSelect.placeholder'}
              dataSet={userDropdownItems}
              selectItem={handleSelectItem}
              loading={loading.action === 'get' && loading.loading}
              status={errors?.userId ? 'error' : undefined}
              helper={errors?.userId ? errors?.userId : undefined}
            />
            { action === 'ban' &&
              <TextField
                value={reason}
                onChangeText={handleChangeReason}
                containerStyle={$textField}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="default"
                labelTx="adminPanel.reasonTextField.title"
                placeholderTx="adminPanel.reasonTextField.placeholder"
                helper={errors?.reason || ''}
                status={errors?.reason ? 'error' : undefined}
              />
            }
          </View>
          <View style={$buttonContainer}>
            <Button
              testID="message-editor-button"
              tx={`adminPanel.actions.${action}`}
              preset="reversed"
              onPress={handleAction}
            />
          </View>
        </View>
      </>
    )
  },
)

// #region Styles
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

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

// #endregion