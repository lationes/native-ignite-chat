const en = {
  common: {
    ok: "OK!",
    accept: 'Accept!',
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
    updatedAt: 'Updated at: {{date}}',
    createdAt: 'Created at: {{date}}',
    edit: 'Edit',
    remove: 'Remove',
    search: 'Search',
    save: 'Save',
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    signIn: "Sign In",
    signUp: 'Sign Up',
    loginEnterDetails:
      "Enter your credentials to enter our best chat app.",
    registrationEnterDetails: "Please fill all required fields to finish registration in our best chat app",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    tapToSignIn: "Tap to sign in!",
    tapToSignUp: "Tap to sign up!",
    hint: "Hint: check if you have your Caps Lock button on :)",
  },
  profileScreen: {
    avatarEditorTitle: 'Profile avatar',
    deleteAvatarConfirmationModelTitle: 'A you sure you want to delete your avatar?'
  },
  chatNavigator: {
    chatRoomsTab: "Chat Rooms",
    notificationsTab: "Notifications",
    profileTab: 'Profile',
    adminTab: 'Admin Panel',
  },
  chatRoomScreen: {
    title: '{{title}}',
    drawerTitle: 'Available chat rooms',
    noMessagesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No messages have been added yet. Send message to see it in chat!",
    },
    noChatRoomEmptyState: {
      heading: "This looks a bit empty",
      content:
        "There is no chat room created yet. Please create new one and enjoy chatting :)",
    },
    noChatRoomAccessEmptyState: {
      heading: "You don't have access for this :(",
      content:
        "You have no access for this chat room. Please join it first and start chatting shortly :)",
      button: "Join room",
    },
    joinChatRoomButton: {
      title: 'Join',
    },
    createChatRoomButton: {
      title: 'Create chat room',
    },
    chatRoomEditorPage: {
      title: 'Create chat room',
      chatRoomTitleLabel: 'Chat room title',
      chatRoomTitleInputPlaceholder: 'Please enter chat room title here',
      saveChatRoomInfoButtonTitle: 'Save',
    },
    messageEditor: {
      inputPlaceholder: 'Insert your message here',
      saveButtonTitle: 'Save',
    },
    deleteConfirmation: {
      title: "A you sure you want to delete this message?",
    }
  },
  notificationsScreen: {
    title: 'Notifications',
    addRequestEditorTitle: 'Create add request',
    notificationsEmptyState: {
      heading: "No notifications for now :(",
      content: "There are no new notifications for you. When there will be some we will notify you immediately!",
    },
    navigateTo: "Create add request",
    userAutoComplete: {
      label: 'User',
      placeholder: 'Select user'
    },
    chatRoomAutoComplete: {
      label: 'Chat room',
      placeholder: 'Select chat room.'
    }
  },
  adminPanel: {
    title: 'Admin Panel',
    accordionListTitle: 'Actions',
    actions: {
      ban: 'Ban',
      unban: 'Remove ban',
    },
    userToBanSelect: {
      label: 'User to ban',
      placeholder: 'Select user'
    },
    reasonTextField: {
      title: 'Reason',
      placeholder: 'Specify ban reason',
    },
  },
  imageEditor: {
    camera: 'Camera',
    gallery: 'Gallery',
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative: "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Components to jump start your project!",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "ChatRoomPage not favorited",
      unfavoriteIcon: "ChatRoomPage favorited",
      publishLabel: "Published {{date}}",
      durationLabel: "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },
}

export default en
export type Translations = typeof en
