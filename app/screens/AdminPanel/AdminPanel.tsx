import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Screen, Text } from "app/components"
import { spacing } from "app/theme"
import { ChatTabScreenProps } from "app/navigators/ChatNavigator";
import { ListItem, Icon } from '@rneui/themed';
import { BanUser } from "app/screens/AdminPanel/components/BanUser"

const adminActions = [
  {
    name: 'ban',
    title: 'Ban',
    iconName: 'ban',
    expanded: false,
  },
  {
    name: 'unban',
    title: 'Remove ban',
    iconName: 'banckward',
    expanded: false,
  }
]

export const AdminPanel: FC<ChatTabScreenProps<"AdminPanel">> = observer(function AdminPanel(_props) {
  const [accordionState, setAccordionState] = useState(adminActions);

  const handleAccordion = (name: string) => {
    const newAccordionState = [...accordionState];
    const currentAccordionIndex = newAccordionState.findIndex(acc => acc.name === name);
    const currentAccordion = {...newAccordionState[currentAccordionIndex]};

    newAccordionState.splice(currentAccordionIndex, 1, {...currentAccordion, expanded: !currentAccordion.expanded })

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
      {accordionState.map((action) => {
        return (
          <ListItem.Accordion
            content={
              <>
                <Icon name={action.iconName} size={30} />
                <ListItem.Content>
                  <Text preset="subheading" text={action.title} />
                </ListItem.Content>
              </>
            }
            isExpanded={action.expanded}
            onPress={() => {
              handleAccordion(action.name);
            }}
          >
            { action.name === 'ban' || action.name === 'unban' && (
              <BanUser action={action.name} />
            )}
          </ListItem.Accordion>
        )
      })}
    </Screen>
  )
})

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

