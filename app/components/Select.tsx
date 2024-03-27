import React, { FC, useMemo } from "react"
import { View, TextStyle, StyleProp, ViewStyle, Dimensions } from "react-native"
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { observer } from "mobx-react-lite"
import { Text, TextProps } from "app/components"
import { colors, spacing } from "app/theme"
import { translate } from "app/i18n"
import { CommonItemModel } from "app/types/common.types"

interface IProps {
  label?: string;
  labelTx?: TextProps["tx"];
  labelTxOptions?: TextProps["txOptions"];
  placeholder?: string;
  placeholderTx?: TextProps["tx"];
  placeholderTxOptions?: TextProps["txOptions"];
  dataSet: CommonItemModel[] | null;
  selectItem: (item: CommonItemModel) => void;
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

export const Select: FC<IProps> = observer(({
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
                                                    onOpenSuggestionsList,
                                                    loading,
                                                    ...props
                                                  }) => {

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
      <View style={$container}>
        <Text preset={'subheading'}>{labelContent}</Text>
        <SelectDropdown
          data={dataSet || []}
          onSelect={(item) => {
            selectItem(item);
          }}
          defaultButtonText={placeholderContent}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.title;
          }}
          rowTextForSelection={(item, index) => {
            return item.title;
          }}
          buttonStyle={$dropdownBtnStyle}
          buttonTextStyle={dropdownBtnTxtStyle}
          renderDropdownIcon={isOpened => {
            return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
          }}
          dropdownIconPosition={'right'}
          dropdownStyle={dropdownDropdownStyle}
          rowStyle={dropdownRowStyle}
          rowTextStyle={dropdownRowTxtStyle}
          selectedRowStyle={dropdownSelectedRowStyle}
          search
          searchInputStyle={dropdownSearchInputStyleStyle}
          searchPlaceHolder={translate('common.search')}
          searchPlaceHolderColor={colors.textDim}
          renderSearchInputLeftIcon={() => {
            return <FontAwesome name={'search'} color={'#444'} size={18} />;
          }}
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
    </>
  )
})

const $container: StyleProp<ViewStyle> = [
  {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: spacing.sm,
  },
]

const $dropdownBtnStyle: ViewStyle = {
  width: '100%',
  height: 50,
  backgroundColor: colors.background,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colors.border,
}

const dropdownBtnTxtStyle: TextStyle = {
  color: colors.text,
  textAlign: 'left',
};

const dropdownDropdownStyle: ViewStyle =  {
  backgroundColor: colors.background,
  height: Dimensions.get('window').height * 0.4,
  gap: spacing.xs,
  borderRadius: spacing.xs,
};

const dropdownRowStyle: ViewStyle = {
  margin: 0,
  padding: spacing.md,
  backgroundColor: 'inherit',
  borderBottomColor: colors.border,
  height: '100%',
};

const dropdownRowTxtStyle: TextStyle =  {
  color: colors.text,
  textAlign: 'left',
  marginHorizontal: 0,
};

const dropdownSelectedRowStyle: ViewStyle =  {
  backgroundColor: 'rgba(0,0,0,0.1)',
};

const dropdownSearchInputStyleStyle: ViewStyle = {
  backgroundColor: 'inherit',
  borderRadius: 0,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
  outline: 'none',
  paddingHorizontal: spacing.md,
}

const $helperStyle: TextStyle = {
  marginTop: spacing.xs,
}