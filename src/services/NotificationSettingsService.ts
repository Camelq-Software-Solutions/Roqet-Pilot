import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  // General notification settings
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  
  // Ride-specific notification settings
  rideRequests: boolean;
  rideUpdates: boolean;
  rideCompleted: boolean;
  paymentReceived: boolean;
  
  // System notification settings
  systemNotifications: boolean;
  offlineReminders: boolean;
  pickupReminders: boolean;
  
  // Advanced settings
  quietHoursEnabled: boolean;
  quietHoursStart: string; // Format: "HH:mm"
  quietHoursEnd: string; // Format: "HH:mm"
  priorityOnly: boolean; // Only show high priority notifications
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  // General settings - enabled by default for drivers
  notificationsEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  
  // Ride-specific settings - all enabled by default for drivers
  rideRequests: true,
  rideUpdates: true,
  rideCompleted: true,
  paymentReceived: true,
  
  // System settings - enabled by default for drivers
  systemNotifications: true,
  offlineReminders: true,
  pickupReminders: true,
  
  // Advanced settings - disabled by default
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  priorityOnly: false,
};

class NotificationSettingsService {
  private static instance: NotificationSettingsService;
  private settings: NotificationSettings = DEFAULT_NOTIFICATION_SETTINGS;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NotificationSettingsService {
    if (!NotificationSettingsService.instance) {
      NotificationSettingsService.instance = new NotificationSettingsService();
    }
    return NotificationSettingsService.instance;
  }

  /**
   * Initialize notification settings
   */
  public async initialize(): Promise<void> {
    try {
      await this.loadSettings();
      this.isInitialized = true;
      console.log('✅ Notification settings initialized with defaults');
    } catch (error) {
      console.error('❌ Error initializing notification settings:', error);
      // Use default settings if loading fails
      this.settings = { ...DEFAULT_NOTIFICATION_SETTINGS };
    }
  }

  /**
   * Load settings from AsyncStorage
   */
  private async loadSettings(): Promise<void> {
    try {
      const storedSettings = await AsyncStorage.getItem('notificationSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Merge with defaults to ensure all properties exist
        this.settings = { ...DEFAULT_NOTIFICATION_SETTINGS, ...parsedSettings };
      } else {
        // First time setup - use defaults
        this.settings = { ...DEFAULT_NOTIFICATION_SETTINGS };
        await this.saveSettings();
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      this.settings = { ...DEFAULT_NOTIFICATION_SETTINGS };
    }
  }

  /**
   * Save settings to AsyncStorage
   */
  private async saveSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  /**
   * Get current settings
   */
  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Update specific setting
   */
  public async updateSetting<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ): Promise<void> {
    this.settings[key] = value;
    await this.saveSettings();
  }

  /**
   * Update multiple settings at once
   */
  public async updateSettings(updates: Partial<NotificationSettings>): Promise<void> {
    this.settings = { ...this.settings, ...updates };
    await this.saveSettings();
  }

  /**
   * Reset to default settings
   */
  public async resetToDefaults(): Promise<void> {
    this.settings = { ...DEFAULT_NOTIFICATION_SETTINGS };
    await this.saveSettings();
  }

  /**
   * Check if notifications are enabled for a specific type
   */
  public isNotificationEnabled(type: keyof NotificationSettings): boolean {
    // First check if notifications are globally enabled
    if (!this.settings.notificationsEnabled) {
      return false;
    }

    // Check quiet hours
    if (this.settings.quietHoursEnabled && this.isInQuietHours()) {
      // During quiet hours, only show priority notifications
      if (this.settings.priorityOnly) {
        return type === 'rideRequests' || type === 'paymentReceived';
      }
      return false;
    }

    // Check specific setting
    return this.settings[type] as boolean;
  }

  /**
   * Check if we're currently in quiet hours
   */
  private isInQuietHours(): boolean {
    if (!this.settings.quietHoursEnabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const startTime = this.parseTimeString(this.settings.quietHoursStart);
    const endTime = this.parseTimeString(this.settings.quietHoursEnd);
    
    if (startTime <= endTime) {
      // Same day quiet hours (e.g., 22:00 to 07:00)
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      // Overnight quiet hours (e.g., 22:00 to 07:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Parse time string to minutes
   */
  private parseTimeString(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Get notification sound setting
   */
  public shouldPlaySound(): boolean {
    return this.settings.soundEnabled;
  }

  /**
   * Get notification vibration setting
   */
  public shouldVibrate(): boolean {
    return this.settings.vibrationEnabled;
  }

  /**
   * Check if the service is initialized
   */
  public getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get settings for specific notification types
   */
  public getRideRequestSettings(): { enabled: boolean; sound: boolean; vibration: boolean } {
    return {
      enabled: this.isNotificationEnabled('rideRequests'),
      sound: this.settings.soundEnabled,
      vibration: this.settings.vibrationEnabled,
    };
  }

  public getRideUpdateSettings(): { enabled: boolean; sound: boolean; vibration: boolean } {
    return {
      enabled: this.isNotificationEnabled('rideUpdates'),
      sound: this.settings.soundEnabled,
      vibration: this.settings.vibrationEnabled,
    };
  }

  public getPaymentSettings(): { enabled: boolean; sound: boolean; vibration: boolean } {
    return {
      enabled: this.isNotificationEnabled('paymentReceived'),
      sound: this.settings.soundEnabled,
      vibration: this.settings.vibrationEnabled,
    };
  }

  public getSystemSettings(): { enabled: boolean; sound: boolean; vibration: boolean } {
    return {
      enabled: this.isNotificationEnabled('systemNotifications'),
      sound: this.settings.soundEnabled,
      vibration: this.settings.vibrationEnabled,
    };
  }
}

export default NotificationSettingsService;
