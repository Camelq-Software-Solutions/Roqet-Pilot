export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Translations {
  // Common
  common: {
    next: string;
    back: string;
    skip: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    loading: string;
    error: string;
    success: string;
    retry: string;
    close: string;
    done: string;
    continue: string;
    step: string;
    of: string;
    or: string;
  };

  // Auth
  auth: {
    login: string;
    signup: string;
    logout: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    resetPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sendOTP: string;
    verifyOTP: string;
    resendOTP: string;
    enterOTP: string;
    otpSentTo: string;
    resendOTPIn: string;
    verifyAndContinue: string;
    termsOfService: string;
    privacyPolicy: string;
    agreeToTerms: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    signInWith: string;
    signUpWith: string;
    whatsYourName: string;
    letsGetToKnowYou: string;
  };

  // Onboarding
  onboarding: {
    welcomeToRoqet: string;
    startJourney: string;
    rideSmartEarnMore: string;
    maximizeEarnings: string;
    beYourOwnBoss: string;
    driveOnYourTerms: string;
    growingCommunity: string;
    joinThousands: string;
    getStarted: string;
  };

  // Home
  home: {
    home: string;
    profile: string;
    wallet: string;
    settings: string;
    support: string;
    menu: string;
    online: string;
    offline: string;
    goOffline: string;
    swipeToGoOffline: string;
    youreOnline: string;
    youWontReceiveNewRideRequests: string;
    swipeBarBelowToConfirm: string;
    emergencyCall: string;
    cancelRide: string;
    rideHistory: string;
    refer: string;
    referAndEarn: string;
    professionalDriver: string;
    logout: string;
    appVersion: string;
  };

  // Profile
  profile: {
    personalDetails: string;
    performanceOverview: string;
    quickActions: string;
    achievements: string;
    completedRides: string;
    cancelledRides: string;
    averageRating: string;
    totalDistance: string;
    earnings: string;
    memberSince: string;
    professionalDriver: string;
  };

  // Wallet
  wallet: {
    balance: string;
    addMoney: string;
    sendMoney: string;
    paymentMethods: string;
    transactionHistory: string;
    addPaymentMethod: string;
    viewAll: string;
  };

  // Settings
  settings: {
    settings: string;
    notifications: string;
    privacy: string;
    security: string;
    language: string;
    about: string;
    help: string;
    rateApp: string;
    shareApp: string;
    account: string;
    preferences: string;
    support: string;
    legal: string;
    personalInformation: string;
    updateProfileDetails: string;
    privacySecurity: string;
    managePrivacySettings: string;
    pushNotifications: string;
    receiveRideUpdates: string;
    autoPayment: string;
    automaticallyPayForRides: string;
    choosePreferredLanguage: string;
    helpCenter: string;
    getHelpWithAccount: string;
    shareFeedback: string;
    termsOfService: string;
    readTermsAndConditions: string;
    sound: string;
    vibration: string;
    rideRequests: string;
    rideUpdates: string;
    paymentNotifications: string;
    resetToDefaults: string;
  };

  // Support
  support: {
    helpAndSupport: string;
    contactUs: string;
    faq: string;
    reportIssue: string;
    feedback: string;
    liveChat: string;
    callSupport: string;
    rideIssues: string;
    paymentsAndRefunds: string;
    accountIssues: string;
    otherIssues: string;
    privacyPolicy: string;
    termsAndConditions: string;
  };

  // Notifications
  notifications: {
    newRideRequest: string;
    rideCompleted: string;
    paymentReceived: string;
    passengerPickedUp: string;
    rideStatusUpdate: string;
    pickupReminder: string;
    youreOffline: string;
    goBackOnline: string;
    pickup: string;
    distance: string;
    time: string;
    fare: string;
    earned: string;
    addedToWallet: string;
    dontForgetPickup: string;
    rideInProgress: string;
    toDestination: string;
    testNotification: string;
    sendTestNotification: string;
    testNotificationMessage: string;
    // Surge notifications
    surgePricing: string;
    surgePricingBody: string;
    surgePricingDefault: string;
    morningSurge: string;
    morningSurgeBody: string;
    eveningSurge: string;
    eveningSurgeBody: string;
  };

  // Ride
  ride: {
    navigateToPickup: string;
    navigateToDropoff: string;
    fullRoute: string;
    pickupToDropoff: string;
    chatWithCustomer: string;
    arrivedAtPickup: string;
    cancelRide: string;
    cancellingRide: string;
    rideCancelled: string;
    cancellationFailed: string;
    pickupLocation: string;
    dropoffLocation: string;
    routeLocationsNotAvailable: string;
    mapLoadingError: string;
    unableToLoadRoute: string;
    googleMapsNotInstalled: string;
    couldNotOpenGoogleMaps: string;
    pickupLocationNotAvailable: string;
    dropoffLocationNotAvailable: string;
    customer: string;
    ok: string;
    home: string;
    endRide: string;
  };
  
  // Chat
  chat: {
    imHere: string;
    runningLate: string;
    canYouWait: string;
    thankYou: string;
    typeMessage: string;
    send: string;
  };
}

export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳'
  }
];

export const translations: Record<string, Translations> = {
  en: {
         common: {
       next: 'Next',
       back: 'Back',
       skip: 'Skip',
       cancel: 'Cancel',
       confirm: 'Confirm',
       save: 'Save',
       edit: 'Edit',
       delete: 'Delete',
       loading: 'Loading...',
       error: 'Error',
       success: 'Success',
       retry: 'Retry',
       close: 'Close',
       done: 'Done',
       continue: 'Continue',
       step: 'Step',
       of: 'of',
       or: 'or'
     },
         auth: {
       login: 'Login',
       signup: 'Sign Up',
       logout: 'Logout',
       email: 'Email',
       password: 'Password',
       confirmPassword: 'Confirm Password',
       forgotPassword: 'Forgot Password?',
       resetPassword: 'Reset Password',
       firstName: 'First Name',
       lastName: 'Last Name',
       phoneNumber: 'Phone Number',
       sendOTP: 'Send OTP',
       verifyOTP: 'Verify OTP',
       resendOTP: 'Resend OTP',
       enterOTP: 'Enter 6-digit verification code',
       otpSentTo: "We've sent a 6-digit code to",
       resendOTPIn: 'Resend OTP in',
       verifyAndContinue: 'Verify & Continue',
       termsOfService: 'Terms of Service',
       privacyPolicy: 'Privacy Policy',
       agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
       alreadyHaveAccount: 'Already have an account?',
       dontHaveAccount: "Don't have an account?",
       signInWith: 'Sign in with',
       signUpWith: 'Sign up with',
       whatsYourName: "What's your name?",
       letsGetToKnowYou: "Let's get to know you better"
     },
    onboarding: {
      welcomeToRoqet: 'Welcome to ROQET',
      startJourney: "Start your journey with ease. ROQET makes booking bike taxis simple, fast, and reliable.",
      rideSmartEarnMore: 'Ride Smart Earn More',
      maximizeEarnings: "Maximize your earnings with every ride. Flexible hours and smarter routes help you grow your income.",
      beYourOwnBoss: 'Be your own boss with ROQET',
      driveOnYourTerms: "Drive on your terms, set your schedule, and earn at your convenience—all with full support from ROQET.",
      growingCommunity: "You're a part of the growing community",
      joinThousands: 'Join thousands of drivers moving the city forward. Drive with pride and be part of something bigger.',
      getStarted: 'Get Started'
    },
    home: {
      home: 'Home',
      profile: 'Profile',
      wallet: 'Wallet',
      settings: 'Settings',
      support: 'Support',
      menu: 'Menu',
      online: 'Online',
      offline: 'Offline',
      goOffline: 'Go Offline',
      swipeToGoOffline: 'Swipe to go offline',
      youreOnline: "You're online",
      youWontReceiveNewRideRequests: "You won't receive new ride requests",
      swipeBarBelowToConfirm: 'Swipe the bar below to confirm',
      emergencyCall: 'Emergency Call',
      cancelRide: 'Cancel Ride',
      rideHistory: 'Ride History',
      refer: 'Refer',
      referAndEarn: 'Refer & Earn',
      professionalDriver: 'Professional Driver',
      logout: 'Logout',
      appVersion: 'RiderSony Driver App v1.0.0'
    },
    profile: {
      personalDetails: 'Personal Details',
      performanceOverview: 'Performance Overview',
      quickActions: 'Quick Actions',
      achievements: 'Achievements',
      completedRides: 'Completed Rides',
      cancelledRides: 'Cancelled Rides',
      averageRating: 'Average Rating',
      totalDistance: 'Total Distance',
      earnings: 'Earnings',
      memberSince: 'Member since',
      professionalDriver: 'Professional Driver'
    },
    wallet: {
      balance: 'Balance',
      addMoney: 'Add Money',
      sendMoney: 'Send Money',
      paymentMethods: 'Payment Methods',
      transactionHistory: 'Transaction History',
      addPaymentMethod: 'Add Payment Method',
      viewAll: 'View All'
    },
    settings: {
      settings: 'Settings',
      notifications: 'Notifications',
      privacy: 'Privacy',
      security: 'Security',
      language: 'Language',
      about: 'About',
      help: 'Help',
      rateApp: 'Rate App',
      shareApp: 'Share App',
      account: 'Account',
      preferences: 'Preferences',
      support: 'Support',
      legal: 'Legal',
      personalInformation: 'Personal Information',
      updateProfileDetails: 'Update your profile details',
      privacySecurity: 'Privacy & Security',
      managePrivacySettings: 'Manage your privacy settings',
      pushNotifications: 'Push Notifications',
      receiveRideUpdates: 'Receive ride updates and offers',
      autoPayment: 'Auto Payment',
      automaticallyPayForRides: 'Automatically pay for rides',
      choosePreferredLanguage: 'Choose your preferred language',
      helpCenter: 'Help Center',
      getHelpWithAccount: 'Get help with your account',
      shareFeedback: 'Share your feedback',
      termsOfService: 'Terms of Service',
      readTermsAndConditions: 'Read our terms and conditions',
      sound: 'Sound',
      vibration: 'Vibration',
      rideRequests: 'Ride Requests',
      rideUpdates: 'Ride Updates',
      paymentNotifications: 'Payment Notifications',
      resetToDefaults: 'Reset to Defaults'
    },
    support: {
      helpAndSupport: 'Help & Support',
      contactUs: 'Contact Us',
      faq: 'FAQ',
      reportIssue: 'Report Issue',
      feedback: 'Feedback',
      liveChat: 'Live Chat',
      callSupport: 'Call Support',
      rideIssues: 'Ride Issues',
      paymentsAndRefunds: 'Payments and Refunds',
      accountIssues: 'Account related issues',
      otherIssues: 'Other Issues',
      privacyPolicy: 'Privacy Policy',
      termsAndConditions: 'Terms and conditions'
    },

    // Notifications
    notifications: {
      newRideRequest: 'New Ride Request! 🚗',
      rideCompleted: 'Ride Completed Successfully! 🎉',
      paymentReceived: 'Payment Received! 💰',
      passengerPickedUp: 'Passenger Picked Up! ✅',
      rideStatusUpdate: 'Ride Status Update',
      pickupReminder: 'Pickup Reminder ⏰',
      youreOffline: 'You\'re Offline 📱',
      goBackOnline: 'Tap to go back online and start receiving ride requests',
      pickup: 'Pickup',
      distance: 'Distance',
      time: 'Time',
      fare: 'Fare',
      earned: 'You\'ve earned',
      addedToWallet: 'has been added to your wallet',
      dontForgetPickup: 'Don\'t forget to pick up your passenger at',
      rideInProgress: 'Ride in progress',
      toDestination: 'to destination',
      testNotification: 'Test Notification',
      sendTestNotification: 'Send a test push notification',
      testNotificationMessage: 'This is a test push notification from your driver app!',
      // Surge notifications
      surgePricing: '🚀 Surge Pricing Active!',
      surgePricingBody: 'Demand is high! Go online now to earn {multiplier}x more! 💰',
      surgePricingDefault: 'High demand detected! Go online now to earn more! 💰',
      morningSurge: '🌅 Morning Rush Hour!',
      morningSurgeBody: 'Traffic is high and demand is surging! Go online to maximize your earnings! 💰',
      eveningSurge: '🌆 Evening Rush Hour!',
      eveningSurgeBody: 'Peak hours are here! High demand means higher earnings. Go online now! 💰',
    },

    // Ride
    ride: {
      navigateToPickup: 'Navigate to Pickup',
      navigateToDropoff: 'Navigate to Dropoff',
      fullRoute: 'Full Route (Pickup → Dropoff)',
      pickupToDropoff: 'Pickup → Dropoff',
      chatWithCustomer: 'Chat with Customer',
      arrivedAtPickup: 'Arrived at Pickup',
      cancelRide: 'Cancel Ride',
      cancellingRide: 'Cancelling Ride',
      rideCancelled: 'Ride Cancelled',
      cancellationFailed: 'Cancellation Failed',
      pickupLocation: 'Pickup Location',
      dropoffLocation: 'Dropoff Location',
      routeLocationsNotAvailable: 'Route locations not available',
      mapLoadingError: 'Map Loading Error',
      unableToLoadRoute: 'Unable to load route details, but ride acceptance was successful. You can still navigate manually.',
      googleMapsNotInstalled: 'Google Maps is not installed on this device',
      couldNotOpenGoogleMaps: 'Could not open Google Maps',
      pickupLocationNotAvailable: 'Pickup location not available',
      dropoffLocationNotAvailable: 'Dropoff location not available',
      customer: 'Customer',
      ok: 'OK',
      home: 'Home',
      endRide: 'End Ride',
    },

    // Chat
    chat: {
      imHere: 'I\'m here',
      runningLate: 'Running 2 mins late',
      canYouWait: 'Can you wait?',
      thankYou: 'Thank you',
      typeMessage: 'Type a message...',
      send: 'Send',
    }
  },
  hi: {
         common: {
       next: 'अगला',
       back: 'वापस',
       skip: 'छोड़ें',
       cancel: 'रद्द करें',
       confirm: 'पुष्टि करें',
       save: 'सहेजें',
       edit: 'संपादित करें',
       delete: 'हटाएं',
       loading: 'लोड हो रहा है...',
       error: 'त्रुटि',
       success: 'सफलता',
       retry: 'पुनः प्रयास करें',
       close: 'बंद करें',
       done: 'हो गया',
       continue: 'जारी रखें',
       step: 'चरण',
       of: 'का',
       or: 'या'
     },
         auth: {
       login: 'लॉगिन',
       signup: 'साइन अप',
       logout: 'लॉगआउट',
       email: 'ईमेल',
       password: 'पासवर्ड',
       confirmPassword: 'पासवर्ड की पुष्टि करें',
       forgotPassword: 'पासवर्ड भूल गए?',
       resetPassword: 'पासवर्ड रीसेट करें',
       firstName: 'पहला नाम',
       lastName: 'अंतिम नाम',
       phoneNumber: 'फोन नंबर',
       sendOTP: 'OTP भेजें',
       verifyOTP: 'OTP सत्यापित करें',
       resendOTP: 'OTP पुनः भेजें',
       enterOTP: '6-अंकीय सत्यापन कोड दर्ज करें',
       otpSentTo: 'हमने 6-अंकीय कोड भेजा है',
       resendOTPIn: 'OTP पुनः भेजें',
       verifyAndContinue: 'सत्यापित करें और जारी रखें',
       termsOfService: 'सेवा की शर्तें',
       privacyPolicy: 'गोपनीयता नीति',
       agreeToTerms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं',
       alreadyHaveAccount: 'क्या आपके पास पहले से खाता है?',
       dontHaveAccount: 'खाता नहीं है?',
       signInWith: 'साइन इन करें',
       signUpWith: 'साइन अप करें',
       whatsYourName: 'आपका नाम क्या है?',
       letsGetToKnowYou: 'आइए आपको बेहतर जानें'
     },
    onboarding: {
      welcomeToRoqet: 'ROQET में आपका स्वागत है',
      startJourney: 'आसानी से अपनी यात्रा शुरू करें। ROQET बाइक टैक्सी बुकिंग को सरल, तेज़ और विश्वसनीय बनाता है।',
      rideSmartEarnMore: 'स्मार्ट राइड करें, अधिक कमाएं',
      maximizeEarnings: 'हर राइड के साथ अपनी कमाई को अधिकतम करें। लचीले घंटे और स्मार्ट रूट आपकी आय बढ़ाने में मदद करते हैं।',
      beYourOwnBoss: 'ROQET के साथ अपने मालिक बनें',
      driveOnYourTerms: 'अपनी शर्तों पर ड्राइव करें, अपना शेड्यूल तय करें, और अपनी सुविधा के अनुसार कमाएं—ROQET के पूर्ण समर्थन के साथ।',
      growingCommunity: 'आप बढ़ते समुदाय का हिस्सा हैं',
      joinThousands: 'हजारों ड्राइवरों में शामिल हों जो शहर को आगे बढ़ा रहे हैं। गर्व के साथ ड्राइव करें और कुछ बड़ा का हिस्सा बनें।',
      getStarted: 'शुरू करें'
    },
    home: {
      home: 'होम',
      profile: 'प्रोफाइल',
      wallet: 'वॉलेट',
      settings: 'सेटिंग्स',
      support: 'सहायता',
      menu: 'मेनू',
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन',
      goOffline: 'ऑफलाइन जाएं',
      swipeToGoOffline: 'ऑफलाइन जाने के लिए स्वाइप करें',
      youreOnline: 'आप ऑनलाइन हैं',
      youWontReceiveNewRideRequests: 'आपको नए राइड अनुरोध नहीं मिलेंगे',
      swipeBarBelowToConfirm: 'पुष्टि करने के लिए नीचे बार स्वाइप करें',
      emergencyCall: 'आपातकालीन कॉल',
      cancelRide: 'राइड रद्द करें',
      rideHistory: 'राइड इतिहास',
      refer: 'रेफर',
      referAndEarn: 'रेफर और कमाएं',
      professionalDriver: 'पेशेवर ड्राइवर',
      logout: 'लॉगआउट',
      appVersion: 'राइडरसोनी ड्राइवर ऐप v1.0.0'
    },
    profile: {
      personalDetails: 'व्यक्तिगत विवरण',
      performanceOverview: 'प्रदर्शन अवलोकन',
      quickActions: 'त्वरित कार्य',
      achievements: 'उपलब्धियां',
      completedRides: 'पूर्ण राइड्स',
      cancelledRides: 'रद्द राइड्स',
      averageRating: 'औसत रेटिंग',
      totalDistance: 'कुल दूरी',
      earnings: 'कमाई',
      memberSince: 'सदस्यता से',
      professionalDriver: 'पेशेवर ड्राइवर'
    },
    wallet: {
      balance: 'बैलेंस',
      addMoney: 'पैसा जोड़ें',
      sendMoney: 'पैसा भेजें',
      paymentMethods: 'भुगतान विधियां',
      transactionHistory: 'लेन-देन इतिहास',
      addPaymentMethod: 'भुगतान विधि जोड़ें',
      viewAll: 'सभी देखें'
    },
    settings: {
      settings: 'सेटिंग्स',
      notifications: 'सूचनाएं',
      privacy: 'गोपनीयता',
      security: 'सुरक्षा',
      language: 'भाषा',
      about: 'के बारे में',
      help: 'सहायता',
      rateApp: 'ऐप रेट करें',
      shareApp: 'ऐप शेयर करें',
      account: 'खाता',
      preferences: 'प्राथमिकताएं',
      support: 'सहायता',
      legal: 'कानूनी',
      personalInformation: 'व्यक्तिगत जानकारी',
      updateProfileDetails: 'अपनी प्रोफाइल जानकारी अपडेट करें',
      privacySecurity: 'गोपनीयता और सुरक्षा',
      managePrivacySettings: 'अपनी गोपनीयता सेटिंग्स प्रबंधित करें',
      pushNotifications: 'पुश नोटिफिकेशन',
      receiveRideUpdates: 'राइड अपडेट और ऑफर प्राप्त करें',
      autoPayment: 'स्वचालित भुगतान',
      automaticallyPayForRides: 'राइड के लिए स्वचालित रूप से भुगतान करें',
      choosePreferredLanguage: 'अपनी पसंदीदा भाषा चुनें',
      helpCenter: 'सहायता केंद्र',
      getHelpWithAccount: 'अपने खाते के साथ सहायता प्राप्त करें',
      shareFeedback: 'अपनी प्रतिक्रिया साझा करें',
      termsOfService: 'सेवा की शर्तें',
      readTermsAndConditions: 'हमारी शर्तें और नियम पढ़ें',
      sound: 'ध्वनि',
      vibration: 'कंपन',
      rideRequests: 'राइड अनुरोध',
      rideUpdates: 'राइड अपडेट',
      paymentNotifications: 'भुगतान सूचनाएं',
      resetToDefaults: 'डिफ़ॉल्ट पर रीसेट करें'
    },
    support: {
      helpAndSupport: 'सहायता और समर्थन',
      contactUs: 'हमसे संपर्क करें',
      faq: 'सामान्य प्रश्न',
      reportIssue: 'समस्या रिपोर्ट करें',
      feedback: 'प्रतिक्रिया',
      liveChat: 'लाइव चैट',
      callSupport: 'सहायता कॉल करें',
      rideIssues: 'राइड की समस्याएं',
      paymentsAndRefunds: 'भुगतान और धनवापसी',
      accountIssues: 'खाते से संबंधित समस्याएं',
      otherIssues: 'अन्य समस्याएं',
      privacyPolicy: 'गोपनीयता नीति',
      termsAndConditions: 'नियम और शर्तें'
    },

    // Notifications
    notifications: {
      newRideRequest: 'नया राइड अनुरोध! 🚗',
      rideCompleted: 'राइड सफलतापूर्वक पूरा हुआ! 🎉',
      paymentReceived: 'भुगतान प्राप्त हुआ! 💰',
      passengerPickedUp: 'यात्री को उठा लिया गया! ✅',
      rideStatusUpdate: 'राइड स्थिति अपडेट',
      pickupReminder: 'पिकअप रिमाइंडर ⏰',
      youreOffline: 'आप ऑफलाइन हैं 📱',
      goBackOnline: 'ऑनलाइन वापस जाने और राइड अनुरोध प्राप्त करने के लिए टैप करें',
      pickup: 'पिकअप',
      distance: 'दूरी',
      time: 'समय',
      fare: 'किराया',
      earned: 'आपने कमाया',
      addedToWallet: 'आपके वॉलेट में जोड़ा गया',
      dontForgetPickup: 'अपने यात्री को पिकअप करना न भूलें',
      rideInProgress: 'राइड जारी है',
      toDestination: 'गंतव्य तक',
      testNotification: 'टेस्ट नोटिफिकेशन',
      sendTestNotification: 'एक टेस्ट पुश नोटिफिकेशन भेजें',
      testNotificationMessage: 'यह आपके ड्राइवर ऐप से एक टेस्ट पुश नोटिफिकेशन है!',
      // Surge notifications
      surgePricing: '🚀 सर्ज प्राइसिंग सक्रिय!',
      surgePricingBody: 'मांग अधिक है! अधिक कमाने के लिए अभी ऑनलाइन जाएं {multiplier}x! 💰',
      surgePricingDefault: 'उच्च मांग का पता चला! अधिक कमाने के लिए अभी ऑनलाइन जाएं! 💰',
      morningSurge: '🌅 सुबह का रश आवर!',
      morningSurgeBody: 'ट्रैफिक अधिक है और मांग बढ़ रही है! अपनी कमाई को अधिकतम करने के लिए ऑनलाइन जाएं! 💰',
      eveningSurge: '🌆 शाम का रश आवर!',
      eveningSurgeBody: 'पीक आवर्स यहां हैं! उच्च मांग का मतलब अधिक कमाई। अभी ऑनलाइन जाएं! 💰',
    },

    // Ride
    ride: {
      navigateToPickup: 'पिकअप के लिए नेविगेट करें',
      navigateToDropoff: 'ड्रॉपऑफ के लिए नेविगेट करें',
      fullRoute: 'पूरा रूट (पिकअप → ड्रॉपऑफ)',
      pickupToDropoff: 'पिकअप → ड्रॉपऑफ',
      chatWithCustomer: 'ग्राहक से चैट करें',
      arrivedAtPickup: 'पिकअप पर पहुंच गए',
      cancelRide: 'राइड रद्द करें',
      cancellingRide: 'राइड रद्द हो रही है',
      rideCancelled: 'राइड रद्द हो गई',
      cancellationFailed: 'रद्दीकरण विफल',
      pickupLocation: 'पिकअप स्थान',
      dropoffLocation: 'ड्रॉपऑफ स्थान',
      routeLocationsNotAvailable: 'रूट स्थान उपलब्ध नहीं हैं',
      mapLoadingError: 'मैप लोडिंग त्रुटि',
      unableToLoadRoute: 'रूट विवरण लोड करने में असमर्थ, लेकिन राइड स्वीकृति सफल थी। आप अभी भी मैन्युअल रूप से नेविगेट कर सकते हैं।',
      googleMapsNotInstalled: 'इस डिवाइस पर Google Maps इंस्टॉल नहीं है',
      couldNotOpenGoogleMaps: 'Could not open Google Maps',
      pickupLocationNotAvailable: 'Pickup location not available',
      dropoffLocationNotAvailable: 'Dropoff location not available',
      customer: 'ग्राहक',
      ok: 'ठीक है',
      home: 'होम',
      endRide: 'राइड समाप्त करें',
    },

    // Chat
    chat: {
      imHere: 'मैं यहाँ हूँ',
      runningLate: '2 मिनट देरी से आ रहा हूँ',
      canYouWait: 'क्या आप इंतज़ार कर सकते हैं?',
      thankYou: 'धन्यवाद',
      typeMessage: 'संदेश लिखें...',
      send: 'भेजें',
    }
  },
  ta: {
    common: {
      next: 'அடுத்து',
      back: 'பின்செல்',
      skip: 'தவிர்க்கவும்',
      cancel: 'ரத்து',
      confirm: 'உறுதிப்படுத்து',
      save: 'சேமி',
      edit: 'திருத்து',
      delete: 'அழி',
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      retry: 'மீண்டும் முயற்சிக்கவும்',
      close: 'மூடு',
      done: 'முடிந்தது',
      continue: 'தொடரவும்',
      step: 'படி',
      of: 'இன்',
      or: 'அல்லது'
    },
    auth: {
      login: 'உள்நுழைவு',
      signup: 'பதிவு',
      logout: 'வெளியேறு',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      confirmPassword: 'கடவுச்சொலை உறுதிப்படுத்து',
      forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
      resetPassword: 'கடவுச்சொலை மீட்டமைக்கவும்',
      firstName: 'முதல் பெயர்',
      lastName: 'கடைசி பெயர்',
      phoneNumber: 'தொலைபேசி எண்',
      sendOTP: 'OTP அனுப்பு',
      verifyOTP: 'OTP சரிபார்க்கவும்',
      resendOTP: 'OTP மீண்டும் அனுப்பு',
      enterOTP: '6-இலக்க சரிபார்ப்பு குறியீட்டை உள்ளிடவும்',
      otpSentTo: 'நாங்கள் 6-இலக்க குறியீட்டை அனுப்பியுள்ளோம்',
      resendOTPIn: 'OTP மீண்டும் அனுப்பு',
      verifyAndContinue: 'சரிபார்த்து தொடரவும்',
      termsOfService: 'சேவை விதிமுறைகள்',
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
      agreeToTerms: 'நான் சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஒப்புக்கொள்கிறேன்',
      alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
      dontHaveAccount: 'கணக்கு இல்லையா?',
      signInWith: 'உள்நுழைவு',
      signUpWith: 'பதிவு',
      whatsYourName: 'உங்கள் பெயர் என்ன?',
      letsGetToKnowYou: 'உங்களை நன்றாக அறிந்துகொள்வோம்'
    },
    onboarding: {
      welcomeToRoqet: 'ROQET க்கு வரவேற்கிறோம்',
      startJourney: 'எளிதாக உங்கள் பயணத்தைத் தொடங்குங்கள். ROQET பைக் டாக்ஸி பதிவை எளிமையாக, வேகமாக மற்றும் நம்பகமாக ஆக்குகிறது.',
      rideSmartEarnMore: 'ஸ்மார்ட் ரைட், மேலும் சம்பாதிக்கவும்',
      maximizeEarnings: 'ஒவ்வொரு சவாரியுடனும் உங்கள் வருவாயை அதிகப்படுத்துங்கள். நெகிழ்வான மணிநேரங்கள் மற்றும் ஸ்மார்ட் பாதைகள் உங்கள் வருமானத்தை வளர்க்க உதவுகின்றன.',
      beYourOwnBoss: 'ROQET உடன் உங்கள் சொந்த முதலாளியாக இருங்கள்',
      driveOnYourTerms: 'உங்கள் விதிமுறைகளின்படி ஓட்டுங்கள், உங்கள் அட்டவணையை அமைக்கவும், மற்றும் உங்கள் வசதிக்கேற்ப சம்பாதிக்கவும்—ROQET இன் முழு ஆதரவுடன்.',
      growingCommunity: 'நீங்கள் வளர்ந்து வரும் சமூகத்தின் ஒரு பகுதி',
      joinThousands: 'நகரத்தை முன்னோக்கி நகர்த்தும் ஆயிரக்கணக்கான ஓட்டுநர்களில் சேர்ந்து கொள்ளுங்கள். பெருமையுடன் ஓட்டுங்கள் மற்றும் பெரிய ஒன்றின் பகுதியாக இருங்கள்.',
      getStarted: 'தொடங்குங்கள்'
    },
    home: {
      home: 'முகப்பு',
      profile: 'சுயவிவரம்',
      wallet: 'பணப்பை',
      settings: 'அமைப்புகள்',
      support: 'ஆதரவு',
      menu: 'மெனு',
      online: 'ஆன்லைன்',
      offline: 'ஆஃப்லைன்',
      goOffline: 'ஆஃப்லைனுக்கு செல்லுங்கள்',
      swipeToGoOffline: 'ஆஃப்லைனுக்கு செல்ல ஸ்வைப் செய்யுங்கள்',
      youreOnline: 'நீங்கள் ஆன்லைனில் இருக்கிறீர்கள்',
      youWontReceiveNewRideRequests: 'நீங்கள் புதிய சவாரி கோரிக்கைகளைப் பெற மாட்டீர்கள்',
      swipeBarBelowToConfirm: 'உறுதிப்படுத்த கீழே உள்ள பட்டையை ஸ்வைப் செய்யுங்கள்',
      emergencyCall: 'அவசர அழைப்பு',
      cancelRide: 'சவாரியை ரத்து செய்யுங்கள்',
      rideHistory: 'சவாரி வரலாறு',
      refer: 'பரிந்துரை',
      referAndEarn: 'பரிந்துரை மற்றும் சம்பாதிக்கவும்',
      professionalDriver: 'தொழில்முறை ஓட்டுநர்',
      logout: 'வெளியேறு',
      appVersion: 'ரைடர்சோனி டிரைவர் ஆப் v1.0.0'
    },
    profile: {
      personalDetails: 'தனிப்பட்ட விவரங்கள்',
      performanceOverview: 'செயல்திறன் கண்ணோட்டம்',
      quickActions: 'விரைவு செயல்கள்',
      achievements: 'சாதனைகள்',
      completedRides: 'முடிந்த சவாரிகள்',
      cancelledRides: 'ரத்து செய்யப்பட்ட சவாரிகள்',
      averageRating: 'சராசரி மதிப்பீடு',
      totalDistance: 'மொத்த தூரம்',
      earnings: 'சம்பாதிப்பு',
      memberSince: 'உறுப்பினர் முதல்',
      professionalDriver: 'தொழில்முறை ஓட்டுநர்'
    },
    wallet: {
      balance: 'இருப்பு',
      addMoney: 'பணம் சேர்க்கவும்',
      sendMoney: 'பணம் அனுப்பவும்',
      paymentMethods: 'பணம் செலுத்தும் முறைகள்',
      transactionHistory: 'பரிவர்த்தனை வரலாறு',
      addPaymentMethod: 'பணம் செலுத்தும் முறையை சேர்க்கவும்',
      viewAll: 'அனைத்தையும் காண்க'
    },
    settings: {
      settings: 'அமைப்புகள்',
      notifications: 'அறிவிப்புகள்',
      privacy: 'தனியுரிமை',
      security: 'பாதுகாப்பு',
      language: 'மொழி',
      about: 'பற்றி',
      help: 'உதவி',
      rateApp: 'பயன்பாட்டை மதிப்பிடுங்கள்',
      shareApp: 'பயன்பாட்டை பகிரவும்',
      account: 'கணக்கு',
      preferences: 'விருப்பங்கள்',
      support: 'ஆதரவு',
      legal: 'சட்ட',
      personalInformation: 'தனிப்பட்ட தகவல்',
      updateProfileDetails: 'உங்கள் சுயவிவர விவரங்களை புதுப்பிக்கவும்',
      privacySecurity: 'தனியுரிமை மற்றும் பாதுகாப்பு',
      managePrivacySettings: 'உங்கள் தனியுரிமை அமைப்புகளை நிர்வகிக்கவும்',
      pushNotifications: 'புஷ் அறிவிப்புகள்',
      receiveRideUpdates: 'சவாரி புதுப்பிப்புகள் மற்றும் சலுகைகளைப் பெறவும்',
      autoPayment: 'தானியங்கி கட்டணம்',
      automaticallyPayForRides: 'சவாரிகளுக்கு தானாக கட்டணம் செலுத்தவும்',
      choosePreferredLanguage: 'உங்கள் விரும்பிய மொழியைத் தேர்ந்தெடுக்கவும்',
      helpCenter: 'உதவி மையம்',
      getHelpWithAccount: 'உங்கள் கணக்குடன் உதவி பெறவும்',
      shareFeedback: 'உங்கள் கருத்தை பகிரவும்',
      termsOfService: 'சேவை விதிமுறைகள்',
      readTermsAndConditions: 'எங்கள் விதிமுறைகள் மற்றும் நிபந்தனைகளைப் படிக்கவும்',
      sound: 'ஒலி',
      vibration: 'அதிர்வு',
      rideRequests: 'சவாரி கோரிக்கைகள்',
      rideUpdates: 'சவாரி புதுப்பிப்புகள்',
      paymentNotifications: 'கட்டண அறிவிப்புகள்',
      resetToDefaults: 'இயல்புநிலைக்கு மீட்டமைக்கவும்'
    },
    support: {
      helpAndSupport: 'உதவி மற்றும் ஆதரவு',
      contactUs: 'எங்களை தொடர்பு கொள்ளுங்கள்',
      faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
      reportIssue: 'சிக்கலை அறிக்கையிடுங்கள்',
      feedback: 'கருத்து',
      liveChat: 'நேரலை அரட்டை',
      callSupport: 'ஆதரவு அழைப்பு',
      rideIssues: 'சவாரி சிக்கல்கள்',
      paymentsAndRefunds: 'கட்டணம் மற்றும் பணத்திருப்பம்',
      accountIssues: 'கணக்கு தொடர்பான சிக்கல்கள்',
      otherIssues: 'பிற சிக்கல்கள்',
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
      termsAndConditions: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்'
    },

    // Notifications
    notifications: {
      newRideRequest: 'புதிய சவாரி கோரிக்கை! 🚗',
      rideCompleted: 'சவாரி வெற்றிகரமாக முடிந்தது! 🎉',
      paymentReceived: 'பணம் பெறப்பட்டது! 💰',
      passengerPickedUp: 'பயணி எடுக்கப்பட்டார்! ✅',
      rideStatusUpdate: 'சவாரி நிலை புதுப்பிப்பு',
      pickupReminder: 'பிக்-அப் நினைவூட்டல் ⏰',
      youreOffline: 'நீங்கள் ஆஃப்லைனில் இருக்கிறீர்கள் 📱',
      goBackOnline: 'ஆன்லைனுக்கு திரும்பிச் சென்று சவாரி கோரிக்கைகளைப் பெற டேப் செய்யவும்',
      pickup: 'பிக்-அப்',
      distance: 'தூரம்',
      time: 'நேரம்',
      fare: 'கட்டணம்',
      earned: 'நீங்கள் சம்பாதித்துள்ளீர்கள்',
      addedToWallet: 'உங்கள் பணப்பையில் சேர்க்கப்பட்டது',
      dontForgetPickup: 'உங்கள் பயணியை எடுப்பதை மறக்க வேண்டாம்',
      rideInProgress: 'சவாரி நடைபெறுகிறது',
      toDestination: 'இலக்குக்கு',
      testNotification: 'சோதனை அறிவிப்பு',
      sendTestNotification: 'ஒரு சோதனை புஷ் அறிவிப்பை அனுப்பவும்',
      testNotificationMessage: 'இது உங்கள் டிரைவர் செயலியிலிருந்து ஒரு சோதனை புஷ் அறிவிப்பு!',
      // Surge notifications
      surgePricing: '🚀 சர்ஜ் பிரைசிங் செயலில்!',
      surgePricingBody: 'தேவை அதிகம்! மேலும் சம்பாதிக்க ஆன்லைனில் செல்லுங்கள் {multiplier}x! 💰',
      surgePricingDefault: 'அதிக தேவை கண்டறியப்பட்டது! மேலும் சம்பாதிக்க ஆன்லைனில் செல்லுங்கள்! 💰',
      morningSurge: '🌅 காலை ரஷ் அவர்!',
      morningSurgeBody: 'போக்குவரத்து அதிகம் மற்றும் தேவை அதிகரிக்கிறது! உங்கள் வருவாயை அதிகரிக்க ஆன்லைனில் செல்லுங்கள்! 💰',
      eveningSurge: '🌆 மாலை ரஷ் அவர்!',
      eveningSurgeBody: 'பீக் மணிகள் இங்கே! அதிக தேவை என்பது அதிக வருவாய். இப்போது ஆன்லைனில் செல்லுங்கள்! 💰',
    },

    // Ride
    ride: {
      navigateToPickup: 'பிக்-அப்புக்கு செல்லுங்கள்',
      navigateToDropoff: 'டிராப்-ஆஃப்புக்கு செல்லுங்கள்',
      fullRoute: 'முழு பாதை (பிக்-அப் → டிராப்-ஆஃப்)',
      pickupToDropoff: 'பிக்-அப் → டிராப்-ஆஃப்',
      chatWithCustomer: 'வாடிக்கையாளருடன் அரட்டையடிக்கவும்',
      arrivedAtPickup: 'பிக்-அப்பில் வந்தடைந்தார்',
      cancelRide: 'சவாரியை ரத்து செய்யுங்கள்',
      cancellingRide: 'சவாரி ரத்து செய்யப்படுகிறது',
      rideCancelled: 'சவாரி ரத்து செய்யப்பட்டது',
      cancellationFailed: 'ரத்து செய்தல் தோல்வி',
      pickupLocation: 'பிக்-அப் இடம்',
      dropoffLocation: 'டிராப்-ஆஃப் இடம்',
      routeLocationsNotAvailable: 'பாதை இடங்கள் கிடைக்கவில்லை',
      mapLoadingError: 'வரைபட ஏற்றும் பிழை',
      unableToLoadRoute: 'பாதை விவரங்களை ஏற்ற முடியவில்லை, ஆனால் சவாரி ஏற்றுக்கொள்ளுதல் வெற்றிகரமாக இருந்தது. நீங்கள் இன்னும் கைமுறையாக செல்லலாம்.',
      googleMapsNotInstalled: 'இந்த சாதனத்தில் Google Maps நிறுவப்படவில்லை',
      couldNotOpenGoogleMaps: 'Google Maps திறக்க முடியவில்லை',
      pickupLocationNotAvailable: 'பிக்-அப் இடம் கிடைக்கவில்லை',
      dropoffLocationNotAvailable: 'டிராப்-ஆஃப் இடம் கிடைக்கவில்லை',
      customer: 'வாடிக்கையாளர்',
      ok: 'சரி',
      home: 'முகப்பு',
      endRide: 'சவாரியை முடிக்கவும்',
    },

    // Chat
    chat: {
      imHere: 'நான் இங்கே இருக்கிறேன்',
      runningLate: '2 நிமிடம் தாமதமாக வருகிறேன்',
      canYouWait: 'நீங்கள் காத்திருக்க முடியுமா?',
      thankYou: 'நன்றி',
      typeMessage: 'செய்தியை தட்டச்சு செய்யவும்...',
      send: 'அனுப்பு',
    }
  },
  te: {
    common: {
      next: 'తదుపరి',
      back: 'వెనుకకు',
      skip: 'దాటవేయి',
      cancel: 'రద్దు',
      confirm: 'నిర్ధారించండి',
      save: 'సేవ్',
      edit: 'సవరించు',
      delete: 'తొలగించు',
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      success: 'విజయం',
      retry: 'మళ్లీ ప్రయత్నించండి',
      close: 'మూసివేయి',
      done: 'పూర్తయింది',
      continue: 'కొనసాగించు',
      step: 'దశ',
      of: 'యొక్క',
      or: 'లేదా'
    },
    auth: {
      login: 'లాగిన్',
      signup: 'సైన్ అప్',
      logout: 'లాగ్అవుట్',
      email: 'ఇమెయిల్',
      password: 'పాస్‌వర్డ్',
      confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
      forgotPassword: 'పాస్‌వర్డ్ మరచిపోయారా?',
      resetPassword: 'పాస్‌వర్డ్ రీసెట్',
      firstName: 'మొదటి పేరు',
      lastName: 'చివరి పేరు',
      phoneNumber: 'ఫోన్ నంబర్',
      sendOTP: 'OTP పంపండి',
      verifyOTP: 'OTP ధృవీకరించండి',
      resendOTP: 'OTP మళ్లీ పంపండి',
      enterOTP: '6-అంకెల ధృవీకరణ కోడ్‌ని నమోదు చేయండి',
      otpSentTo: 'మేము 6-అంకెల కోడ్‌ని పంపాము',
      resendOTPIn: 'OTP మళ్లీ పంపండి',
      verifyAndContinue: 'ధృవీకరించి కొనసాగించండి',
      termsOfService: 'సేవా నిబంధనలు',
      privacyPolicy: 'గోప్యతా విధానం',
      agreeToTerms: 'నేను సేవా నిబంధనలు మరియు గోప్యతా విధానాన్ని అంగీకరిస్తున్నాను',
      alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
      dontHaveAccount: 'ఖాతా లేదా?',
      signInWith: 'లాగిన్',
      signUpWith: 'సైన్ అప్',
      whatsYourName: 'మీ పేరు ఏమిటి?',
      letsGetToKnowYou: 'మిమ్మల్ని బాగా తెలుసుకుందాం'
    },
    onboarding: {
      welcomeToRoqet: 'ROQET కి స్వాగతం',
      startJourney: 'సులభంగా మీ ప్రయాణాన్ని ప్రారంభించండి. ROQET బైక్ టాక్సీ బుకింగ్‌ని సరళంగా, వేగవంతంగా మరియు నమ్మదగినదిగా చేస్తుంది.',
      rideSmartEarnMore: 'స్మార్ట్ రైడ్, మరింత సంపాదించండి',
      maximizeEarnings: 'ప్రతి రైడ్‌తో మీ ఆదాయాన్ని గరిష్టీకరించండి. వశ్యమైన గంటలు మరియు స్మార్ట్ మార్గాలు మీ ఆదాయాన్ని పెంచడానికి సహాయపడతాయి.',
      beYourOwnBoss: 'ROQET తో మీ స్వంత బాస్‌గా ఉండండి',
      driveOnYourTerms: 'మీ నిబంధనల ప్రకారం డ్రైవ్ చేయండి, మీ షెడ్యూల్‌ని సెట్ చేయండి, మరియు మీ సౌలభ్యం ప్రకారం సంపాదించండి—ROQET నుండి పూర్తి మద్దతుతో.',
      growingCommunity: 'మీరు పెరుగుతున్న కమ్యూనిటీలో భాగం',
      joinThousands: 'నగరాన్ని ముందుకు నడిపే వేలాది డ్రైవర్లలో చేరండి. గర్వంతో డ్రైవ్ చేయండి మరియు పెద్దదైన దానిలో భాగం అవ్వండి.',
      getStarted: 'ప్రారంభించండి'
    },
    home: {
      home: 'హోమ్',
      profile: 'ప్రొఫైల్',
      wallet: 'వాలెట్',
      settings: 'సెట్టింగ్‌లు',
      support: 'మద్దతు',
      menu: 'మెనూ',
      online: 'ఆన్‌లైన్',
      offline: 'ఆఫ్‌లైన్',
      goOffline: 'ఆఫ్‌లైన్‌కి వెళ్లండి',
      swipeToGoOffline: 'ఆఫ్‌లైన్‌కి వెళ్లడానికి స్వైప్ చేయండి',
      youreOnline: 'మీరు ఆన్‌లైన్‌లో ఉన్నారు',
      youWontReceiveNewRideRequests: 'మీకు కొత్త రైడ్ అభ్యర్థనలు రావు',
      swipeBarBelowToConfirm: 'నిర్ధారించడానికి క్రింద బార్‌ని స్వైప్ చేయండి',
      emergencyCall: 'అత్యవసర కాల్',
      cancelRide: 'రైడ్‌ని రద్దు చేయండి',
      rideHistory: 'రైడ్ చరిత్ర',
      refer: 'రిఫర్',
      referAndEarn: 'రిఫర్ మరియు సంపాదించండి',
      professionalDriver: 'వృత్తిపరమైన డ్రైవర్',
      logout: 'లాగ్అవుట్',
      appVersion: 'రైడర్‌సోనీ డ్రైవర్ యాప్ v1.0.0'
    },
    profile: {
      personalDetails: 'వ్యక్తిగత వివరాలు',
      performanceOverview: 'పనితీరు అవలోకనం',
      quickActions: 'త్వరిత చర్యలు',
      achievements: 'సాధనలు',
      completedRides: 'పూర్తయిన రైడ్‌లు',
      cancelledRides: 'రద్దు చేయబడిన రైడ్‌లు',
      averageRating: 'సగటు రేటింగ్',
      totalDistance: 'మొత్తం దూరం',
      earnings: 'సంపాదన',
      memberSince: 'సభ్యుడు నుండి',
      professionalDriver: 'వృత్తిపరమైన డ్రైవర్'
    },
    wallet: {
      balance: 'బ్యాలెన్స్',
      addMoney: 'డబ్బు జోడించండి',
      sendMoney: 'డబ్బు పంపండి',
      paymentMethods: 'చెల్లింపు పద్ధతులు',
      transactionHistory: 'లావాదేవీ చరిత్ర',
      addPaymentMethod: 'చెల్లింపు పద్ధతిని జోడించండి',
      viewAll: 'అన్నీ చూడండి'
    },
    settings: {
      settings: 'సెట్టింగ్‌లు',
      notifications: 'నోటిఫికేషన్‌లు',
      privacy: 'గోప్యత',
      security: 'భద్రత',
      language: 'భాష',
      about: 'గురించి',
      help: 'సహాయం',
      rateApp: 'యాప్‌ని రేట్ చేయండి',
      shareApp: 'యాప్‌ని షేర్ చేయండి',
      account: 'ఖాతా',
      preferences: 'అభిరుచులు',
      support: 'మద్దతు',
      legal: 'చట్టపరమైన',
      personalInformation: 'వ్యక్తిగత సమాచారం',
      updateProfileDetails: 'మీ ప్రొఫైల్ వివరాలను నవీకరించండి',
      privacySecurity: 'గోప్యత మరియు భద్రత',
      managePrivacySettings: 'మీ గోప్యతా సెట్టింగ్‌లను నిర్వహించండి',
      pushNotifications: 'పుష్ నోటిఫికేషన్‌లు',
      receiveRideUpdates: 'రైడ్ అప్‌డేట్‌లు మరియు ఆఫర్‌లను స్వీకరించండి',
      autoPayment: 'ఆటో పేమెంట్',
      automaticallyPayForRides: 'రైడ్‌ల కోసం స్వయంచాలకంగా చెల్లించండి',
      choosePreferredLanguage: 'మీ ఇష్టమైన భాషను ఎంచుకోండి',
      helpCenter: 'సహాయ కేంద్రం',
      getHelpWithAccount: 'మీ ఖాతాతో సహాయం పొందండి',
      shareFeedback: 'మీ అభిప్రాయాన్ని షేర్ చేయండి',
      termsOfService: 'సేవా నిబంధనలు',
      readTermsAndConditions: 'మా నిబంధనలు మరియు షరతులను చదవండి',
      sound: 'ధ్వని',
      vibration: 'వైబ్రేషన్',
      rideRequests: 'రైడ్ అభ్యర్థనలు',
      rideUpdates: 'రైడ్ అప్‌డేట్‌లు',
      paymentNotifications: 'చెల్లింపు నోటిఫికేషన్‌లు',
      resetToDefaults: 'డిఫాల్ట్‌లకు రీసెట్ చేయండి'
    },
    support: {
      helpAndSupport: 'సహాయం మరియు మద్దతు',
      contactUs: 'మమ్మల్ని సంప్రదించండి',
      faq: 'తరచుగా అడిగే ప్రశ్నలు',
      reportIssue: 'సమస్యను నివేదించండి',
      feedback: 'అభిప్రాయం',
      liveChat: 'లైవ్ చాట్',
      callSupport: 'మద్దతు కాల్',
      rideIssues: 'రైడ్ సమస్యలు',
      paymentsAndRefunds: 'చెల్లింపులు మరియు రీఫండ్‌లు',
      accountIssues: 'ఖాతా సంబంధిత సమస్యలు',
      otherIssues: 'ఇతర సమస్యలు',
      privacyPolicy: 'గోప్యతా విధానం',
      termsAndConditions: 'నిబంధనలు మరియు షరతులు'
    },

    // Notifications
    notifications: {
      newRideRequest: 'కొత్త రైడ్ అభ్యర్థన! 🚗',
      rideCompleted: 'రైడ్ విజయవంతంగా పూర్తయింది! 🎉',
      paymentReceived: 'చెల్లింపు అందింది! 💰',
      passengerPickedUp: 'ప్రయాణికుడిని తీసుకున్నారు! ✅',
      rideStatusUpdate: 'రైడ్ స్థితి నవీకరణ',
      pickupReminder: 'పికప్ రిమైండర్ ⏰',
      youreOffline: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు 📱',
      goBackOnline: 'ఆన్‌లైన్‌కి తిరిగి వెళ్లి రైడ్ అభ్యర్థనలను స్వీకరించడానికి ట్యాప్ చేయండి',
      pickup: 'పికప్',
      distance: 'దూరం',
      time: 'సమయం',
      fare: 'ఛార్జ్',
      earned: 'మీరు సంపాదించారు',
      addedToWallet: 'మీ వాలెట్‌లో జోడించబడింది',
      dontForgetPickup: 'మీ ప్రయాణికుడిని తీసుకోవడం మరచిపోవద్దు',
      rideInProgress: 'రైడ్ జరుగుతోంది',
      toDestination: 'గమ్యస్థానానికి',
      testNotification: 'పరీక్ష నోటిఫికేషన్',
      sendTestNotification: 'ఒక పరీక్ష పుష్ నోటిఫికేషన్ పంపండి',
      testNotificationMessage: 'ఇది మీ డ్రైవర్ యాప్ నుండి ఒక పరీక్ష పుష్ నోటిఫికేషన్!',
      // Surge notifications
      surgePricing: '🚀 సర్జ్ ప్రైసింగ్ చురుకుగా ఉంది!',
      surgePricingBody: 'డిమాండ్ ఎక్కువ! మరింత సంపాదించడానికి ఇప్పుడు ఆన్‌లైన్‌లోకి వెళ్లండి {multiplier}x! 💰',
      surgePricingDefault: 'అధిక డిమాండ్ గుర్తించబడింది! మరింత సంపాదించడానికి ఇప్పుడు ఆన్‌లైన్‌లోకి వెళ్లండి! 💰',
      morningSurge: '🌅 ఉదయం రష్ అవర్!',
      morningSurgeBody: 'ట్రాఫిక్ ఎక్కువ మరియు డిమాండ్ పెరుగుతోంది! మీ ఆదాయాన్ని పెంచడానికి ఆన్‌లైన్‌లోకి వెళ్లండి! 💰',
      eveningSurge: '🌆 సాయంత్రం రష్ అవర్!',
      eveningSurgeBody: 'పీక్ అవర్స్ ఇక్కడ ఉన్నాయి! అధిక డిమాండ్ అంటే అధిక ఆదాయం. ఇప్పుడు ఆన్‌లైన్‌లోకి వెళ్లండి! 💰',
    },

    // Ride
    ride: {
      navigateToPickup: 'పికప్‌కి నావిగేట్ చేయండి',
      navigateToDropoff: 'డ్రాప్‌ఆఫ్‌కి నావిగేట్ చేయండి',
      fullRoute: 'పూర్తి మార్గం (పికప్ → డ్రాప్‌ఆఫ్)',
      pickupToDropoff: 'పికప్ → డ్రాప్‌ఆఫ్',
      chatWithCustomer: 'కస్టమర్‌తో చాట్ చేయండి',
      arrivedAtPickup: 'పికప్‌లో 도착했습니다',
      cancelRide: 'రైడ్‌ని రద్దు చేయండి',
      cancellingRide: 'రైడ్ రద్దు చేయబడుతోంది',
      rideCancelled: 'రైడ్ రద్దు చేయబడింది',
      cancellationFailed: 'రద్దు చేయడం విఫలమైంది',
      pickupLocation: 'పికప్ స్థానం',
      dropoffLocation: 'డ్రాప్‌ఆఫ్ స్థానం',
      routeLocationsNotAvailable: 'మార్గ స్థానాలు అందుబాటులో లేవు',
      mapLoadingError: 'మ్యాప్ లోడింగ్ లోపం',
      unableToLoadRoute: 'మార్గ వివరాలను లోడ్ చేయలేకపోయాము, కానీ రైడ్ అంగీకారం విజయవంతమైంది. మీరు ఇంకా మాన్యువల్‌గా నావిగేట్ చేయవచ్చు.',
      googleMapsNotInstalled: 'ఈ పరికరంపై Google Maps ఇన్‌స్టాల్ చేయబడలేదు',
      couldNotOpenGoogleMaps: 'Google Maps తెరవలేకపోయాము',
      pickupLocationNotAvailable: 'పికప్ స్థానం అందుబాటులో లేదు',
      dropoffLocationNotAvailable: 'డ్రాప్‌ఆఫ్ స్థానం అందుబాటులో లేదు',
      customer: 'కస్టమర్',
      ok: 'సరే',
      home: 'హోమ్',
      endRide: 'రైడ్ ముగించండి',
    },

    // Chat
    chat: {
      imHere: 'నేను ఇక్కడ ఉన్నాను',
      runningLate: '2 నిమిషాలు ఆలస్యంగా వస్తున్నాను',
      canYouWait: 'మీరు వేచి ఉండగలరా?',
      thankYou: 'ధన్యవాదాలు',
      typeMessage: 'సందేశం టైప్ చేయండి...',
      send: 'పంపండి',
    }
  }
};

// Add more languages as needed...
export const getTranslation = (languageCode: string, key: string): string => {
  const lang = translations[languageCode] || translations.en;
  const keys = key.split('.');
  let value: any = lang;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || key;
};

export const getCurrentLanguage = (): string => {
  // This should be replaced with actual language detection logic
  return 'en';
};
