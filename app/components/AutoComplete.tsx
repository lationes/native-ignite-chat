import React, { FC, useMemo, useRef } from "react"
import { Dimensions, View, Platform, TextStyle } from "react-native"
import {
  AutocompleteDropdown,
  AutocompleteDropdownProps,
  TAutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown"
import { observer } from "mobx-react-lite"
import { Text, TextProps } from "app/components"
import { colors, spacing } from "app/theme"
import { translate } from "app/i18n"

interface IProps extends AutocompleteDropdownProps {
  label?: string;
  labelTx?: TextProps["tx"];
  labelTxOptions?: TextProps["txOptions"];
  placeholder?: string;
  placeholderTx?: TextProps["tx"];
  placeholderTxOptions?: TextProps["txOptions"];
  dataSet: TAutocompleteDropdownItem[] | null;
  selectItem: (item: TAutocompleteDropdownItem) => void;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onOpenSuggestionsList?: (isOpened: boolean) => void;
  loading?: boolean;
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"]
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"]
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps;
  /**
   * A style modifier for different input states.
   */
  status?: "error";
}

export const AutoComplete: FC<IProps> = observer(({
                                                    label,
                                                    labelTx,
                                                    labelTxOptions,
                                                    placeholder,
                                                    placeholderTx,
                                                    placeholderTxOptions,
                                                    helper,
                                                    helperTx,
                                                    helperTxOptions,
                                                    HelperTextProps,
                                                    status,
                                                    dataSet,
                                                    selectItem,
                                                    onChangeText,
                                                    onClear,
                                                    onOpenSuggestionsList,
                                                    loading,
                                                    ...props
                                                  }) => {
  const dropdownController = useRef(null);
  const searchRef = useRef(null);

  const labelContent = useMemo(() => {
    if (label) {
      return label;
    }

    if (labelTx) {
      return translate(labelTx, labelTxOptions);
    }

    return '';
  }, [label, labelTx, labelTxOptions]);

  const placeholderContent = useMemo(() => {
    if (placeholder) {
      return placeholder;
    }

    if (placeholderTx) {
      return translate(placeholderTx, placeholderTxOptions);
    }

    return '';
  }, [placeholder, placeholderTx, placeholderTxOptions]);

  const $helperStyles = [
    $helperStyle,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]

  return (
    <>
      <View style={[
        { flex: 1, flexDirection: 'column', justifyContent: 'center', gap: spacing.sm },
        Platform.select({ ios: { zIndex: 1 } }),
      ]}>
        <Text preset={'subheading'}>{labelContent}</Text>
        <View
          style={[
            { flex: 1, flexDirection: 'row', alignItems: 'center' },
            Platform.select({ ios: { zIndex: 1 } }),
          ]}>
          <AutocompleteDropdown
            ref={searchRef}
            controller={controller => {
              dropdownController.current = controller
            }}
            // initialValue={'1'}
            direction={Platform.select({ ios: 'down' })}
            dataSet={dataSet}
            onChangeText={onChangeText}
            onSelectItem={selectItem}
            debounce={600}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
            onClear={onClear}
            //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
            onOpenSuggestionsList={onOpenSuggestionsList}
            loading={loading}
            useFilter={false} // set false to prevent rerender twice
            containerStyle={{
              flexGrow: 1,
              flexShrink: 1,
              borderRadius: spacing.xxs,
              backgroundColor: colors.palette.neutral100,
              borderWidth: 1,
              borderColor: status === "error" ? colors.error : colors.palette.neutral400,
            }}
            textInputProps={{
              placeholder: placeholderContent,
              placeholderTextColor: colors.textDim,
              autoCorrect: false,
              autoCapitalize: 'none',
              style: {
                outline: 'none',
                borderRadius: 0,
                borderWidth: 0,
                backgroundColor: 'none',
                color: colors.text,
                paddingLeft: spacing.md,
                width: '100%',
                paddingRight: 0,
              },
            }}
            rightButtonsContainerStyle={{
              flex: '1 1 max-content',
              right: spacing.sm,
              height: 30,
              alignSelf: 'center',
              backgroundColor: colors.palette.neutral100,
            }}
            inputContainerStyle={{
              backgroundColor: 'inherit',
            }}
            suggestionsListContainerStyle={{
              backgroundColor: '#383b42',
            }}
            renderItem={(item, text) => <Text size={'md'} style={{ color: '#fff', padding: spacing.md }}>{item.title}</Text>}
            inputHeight={spacing.xxl}
            showChevron={false}
            closeOnBlur={false}
            showClear
            clearOnFocus={false}
            {...(props || {})}
          />
          {!!(helper || helperTx) && (
            <Text
              preset="formHelper"
              text={helper}
              tx={helperTx}
              txOptions={helperTxOptions}
              {...HelperTextProps}
              style={$helperStyles}
            />
          )}
        </View>
      </View>
    </>
  )
})

const $helperStyle: TextStyle = {
  marginTop: spacing.xs,
}