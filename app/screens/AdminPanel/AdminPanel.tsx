import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { ListView, Screen, Text } from "app/components"
import { spacing } from "app/theme"
import { ChatTabScreenProps } from "app/navigators/ChatNavigator";
import { ListItem, Icon } from '@rneui/themed';
import { BanUser } from "app/screens/AdminPanel/components/BanUser"
import SeparatorLine from "app/components/SeparatorLine"

interface AdminActionModel {
  name: string,
  title: string,
  iconName: string,
  iconType: string,
  expanded: boolean,
}

const adminActions: AdminActionModel[] = [
  {
    name: 'ban',
    title: 'Ban',
    iconName: 'ban',
    iconType: 'font-awesome',
    expanded: false,
  },
  {
    name: 'unban',
    title: 'Remove ban',
    iconName: 'reiterate',
    iconType: 'material-community',
    expanded: false,
  }
]

export const AdminPanel: FC<ChatTabScreenProps<"AdminPanel">> = observer(function AdminPanel(_props) {
  const [accordionState, setAccordionState] = useState<typeof adminActions>(adminActions);

  const handleAccordion = (name: string, isExpanded?: boolean) => {
    const newAccordionState = [...accordionState];
    const currentAccordionIndex = newAccordionState.findIndex(acc => acc.name === name);
    const currentAccordion = {...newAccordionState[currentAccordionIndex]};

    newAccordionState.splice(currentAccordionIndex, 1, {...currentAccordion, expanded: isExpanded || !currentAccordion.expanded })

    setAccordionState(newAccordionState);
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top"]}
    >
      <View style={$heading}>
        <Text preset="heading" tx="adminPanel.title" />
      </View>
      <ListView<AdminActionModel>
        data={accordionState || []}
        ItemSeparatorComponent={() =>
          <View style={$separator}>
            <SeparatorLine />
          </View>
        }
        renderItem={({ item }) => (
          <ListItem.Accordion
            style={$accordionStyle}
            containerStyle={{ width: '100%'}}
            content={
              <ListItem.Content style={$accordionContentStyle}>
                <Icon type={item.iconType} name={item.iconName} size={30} />
                <Text preset="subheading" text={item.title} />
              </ListItem.Content>
            }
            isExpanded={item.expanded}
            onPress={() => {
              handleAccordion(item.name);
            }}
          >
            <View style={$accordionInnerContent}>
              { (item.name === 'ban' || item.name === 'unban') && (
                <BanUser closeAccordion={() => handleAccordion(item.name, false)} action={item.name} />
              )}
            </View>
          </ListItem.Accordion>
        )}
      />
    </Screen>
  )
})

const $separator: ViewStyle = {
  marginVertical: spacing.sm,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  gap: spacing.md,
  flexDirection: 'column',
}

const $heading: ViewStyle = {
  alignSelf: 'center',
  marginBottom: spacing.md,
}

const $accordionStyle: ViewStyle = {
  borderRadius: 4,
  flexDirection: 'row',
  alignItems: "center",
}

const $accordionInnerContent: ViewStyle = {
  padding: spacing.sm,
}

const $accordionContentStyle: ViewStyle = {
  display: 'flex',
  gap: 8,
  flexDirection: 'row',
  alignItems: "center",
  justifyContent: 'flex-start',
}

