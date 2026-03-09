// smart-app-banner restaurant details need to be added 👇 

new SmartBanner({
    daysHidden: 2, // days to hide banner after close button is clicked (defaults to 15)
    daysReminder: 15, // days to hide banner after "VIEW" button is clicked (defaults to 90)
    appStoreLanguage: "us", // language code for the App Store (defaults to user's browser language)
    title: "Chiangmai",
    author: "Zuppler Tech Team",
    button: "DOWNLOAD APP",
    store: {
      ios: "On the App Store",
      android: "In Google Play"
    },
    price: {
      ios: "FREE",
      android: "FREE"
    }
  });