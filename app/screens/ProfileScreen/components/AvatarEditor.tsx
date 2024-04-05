import React, { useMemo } from "react"
import { Image, ImageStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite";
import { colors, spacing } from "app/theme"
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons"

interface IProps {
  imageUrl?: string | null;
  onButtonPress: () => void;
}

const AvatarEditor = observer(({
                                 imageUrl,
                                 onButtonPress,
}: IProps) => {
  const avatar = useMemo(() => {
    if (imageUrl) {
      return { uri: imageUrl};
    }

    return require('../../../../assets/images/avatarPlaceholder.png');
  }, [imageUrl])

  return (
    <View style={$container}>
      <View style={$avatarContainer}>
        <Image
          source={avatar}
          style={$avatarImage}
        />
        <TouchableOpacity style={$editButton} onPress={onButtonPress}>
          <MaterialIcons name={'camera'} color={colors.palette.primary500} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  )
});

const $container: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
}

const $avatarContainer: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
}

const $avatarImage: ImageStyle = {
  borderRadius: 75,
  width: 150,
  height: 150,
  borderColor: colors.palette.secondary100,
  borderWidth: 5,
}

const $editButton: ViewStyle = {
  backgroundColor: colors.palette.secondary200,
  borderRadius: spacing.lg,
  padding: spacing.xs,
  position: 'absolute',
  right: 5,
  bottom: 5,
}


export default AvatarEditor;