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
    emergencyCall: string;
    cancelRide: string;
    rideHistory: string;
    refer: string;
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
      emergencyCall: 'Emergency Call',
      cancelRide: 'Cancel Ride',
      rideHistory: 'Ride History',
      refer: 'Refer'
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
      shareApp: 'Share App'
    },
    support: {
      helpAndSupport: 'Help & Support',
      contactUs: 'Contact Us',
      faq: 'FAQ',
      reportIssue: 'Report Issue',
      feedback: 'Feedback',
      liveChat: 'Live Chat',
      callSupport: 'Call Support'
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
      emergencyCall: 'आपातकालीन कॉल',
      cancelRide: 'राइड रद्द करें',
      rideHistory: 'राइड इतिहास',
      refer: 'रेफर'
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
      shareApp: 'ऐप शेयर करें'
    },
    support: {
      helpAndSupport: 'सहायता और समर्थन',
      contactUs: 'हमसे संपर्क करें',
      faq: 'सामान्य प्रश्न',
      reportIssue: 'समस्या रिपोर्ट करें',
      feedback: 'प्रतिक्रिया',
      liveChat: 'लाइव चैट',
      callSupport: 'सहायता कॉल करें'
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
      emergencyCall: 'அவசர அழைப்பு',
      cancelRide: 'சவாரியை ரத்து செய்யுங்கள்',
      rideHistory: 'சவாரி வரலாறு',
      refer: 'பரிந்துரை'
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
      shareApp: 'பயன்பாட்டை பகிரவும்'
    },
    support: {
      helpAndSupport: 'உதவி மற்றும் ஆதரவு',
      contactUs: 'எங்களை தொடர்பு கொள்ளுங்கள்',
      faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
      reportIssue: 'சிக்கலை அறிக்கையிடுங்கள்',
      feedback: 'கருத்து',
      liveChat: 'நேரலை அரட்டை',
      callSupport: 'ஆதரவு அழைப்பு'
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
      emergencyCall: 'అత్యవసర కాల్',
      cancelRide: 'రైడ్‌ని రద్దు చేయండి',
      rideHistory: 'రైడ్ చరిత్ర',
      refer: 'రిఫర్'
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
      shareApp: 'యాప్‌ని షేర్ చేయండి'
    },
    support: {
      helpAndSupport: 'సహాయం మరియు మద్దతు',
      contactUs: 'మమ్మల్ని సంప్రదించండి',
      faq: 'తరచుగా అడిగే ప్రశ్నలు',
      reportIssue: 'సమస్యను నివేదించండి',
      feedback: 'అభిప్రాయం',
      liveChat: 'లైవ్ చాట్',
      callSupport: 'మద్దతు కాల్'
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
