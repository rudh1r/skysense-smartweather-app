import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { useSettings } from "./settings-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "./auth-context";
import { 
  User, 
  Mail, 
  Camera, 
  Crown,
  Shield,
  Calendar,
  MapPin,
  Bell,
  Save,
  X,
  Upload,
  Link as LinkIcon,
  Settings,
  Thermometer,
  Smartphone,
  Sun,
  Moon,
  LogOut,
  AlertTriangle,
  Download,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Wind,
  Gauge,
  CloudRain,
  Globe,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Zap,
  Activity,
  Monitor,
  Layers,
  Timer,
  RefreshCw
} from "lucide-react";
import {
  getProfile,
  updateProfile,
  getUserPreferences,
  updateUserPreferences,
} from "../lib/db-operations";
import { motion } from "motion/react";
import { toast } from "sonner";

interface MyProfileSectionProps {
  onLocationChange?: (location: string) => void;
  currentLocation?: string;
  user: any; // The authenticated user object from useAuth
  onSignInClick?: () => void;
}

export function MyProfileSection({ onLocationChange, currentLocation, user, onSignInClick }: MyProfileSectionProps) {
  const { signOut } = useAuth();
  const { units, setUnits } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [defaultLocation, setDefaultLocation] = useState(currentLocation || "San Francisco, CA");
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    weatherAlerts: true,
    severeDanger: true,
    dailyForecast: false,
    healthAdvisory: true,
    communityReports: false,
    precipitationAlerts: true,
    temperatureAlerts: false,
  });
  // Data & Performance Settings
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState([15]); // minutes
  const [lowDataMode, setLowDataMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState([50]); // percentage

  // Alert Settings
  const [alertSound, setAlertSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [extremeWeatherOnly, setExtremeWeatherOnly] = useState(false);

  // Privacy Settings
  const [shareLocation, setShareLocation] = useState(true);
  const [shareReports, setShareReports] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  // Display Settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [dateFormat, setDateFormat] = useState<'mdy' | 'dmy' | 'ymd'>('mdy');


  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const userProfile = await getProfile(user.id);
        const userPrefs = await getUserPreferences(user.id);

        if (userProfile) {
          setProfile(userProfile);
          setEditedName(userProfile.full_name || user.name);
          setEditedEmail(userProfile.email || user.email);
          setAvatarPreview(userProfile.avatar_url || user.avatar);
        }

        if (userPrefs) {
          setTimeFormat(userPrefs.time_format || '12h');
          setTheme(userPrefs.theme || 'auto');
          setUnits({
            temperature: userPrefs.temperature_unit || 'celsius',
            windSpeed: userPrefs.wind_speed_unit || 'kmh',
            pressure: userPrefs.pressure_unit || 'hpa',
            precipitation: userPrefs.precipitation_unit || 'mm',
            visibility: userPrefs.visibility_unit || 'km',
          });
          setNotifications(prev => ({
            ...prev,
            weatherAlerts: userPrefs.notifications_enabled ?? true,
            severeDanger: userPrefs.severe_weather_alerts ?? true,
          }));
        }
      }
    };

    fetchUserData();
  }, [user]);

  const isAuthenticated = !!user;

  const displayUser = user || {
    name: "Guest User",
    email: "Sign in to see your email",
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Guest`,
  };

  const initials = displayUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'G';


  const handleSaveProfile = async () => {
    if (!user) return;
    setIsEditing(false);
    try {
      await updateProfile(user.id, {
        full_name: editedName,
        email: editedEmail,
        // avatar_url: avatarPreview, // You'd handle file uploads separately
      });
      await updateUserPreferences(user.id, {
        temperature_unit: units.temperature,
        wind_speed_unit: units.windSpeed,
        pressure_unit: units.pressure,
        precipitation_unit: units.precipitation,
        visibility_unit: units.visibility,
        theme,
      });
      toast.success("Profile and preferences saved!");
    } catch (error) {
      toast.error("Failed to save profile.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || "");
    setEditedEmail(user?.email || "");
    setIsEditing(false);
  };

  const accountAge = "3 months";
  const memberSince = "August 2024";

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      // In a real app, you would upload this file to Supabase Storage and get a URL
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setShowPhotoDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUrl = () => {
    if (photoUrl) {
      // In a real app, you would save this URL to the user's profile
      setAvatarPreview(photoUrl);
      setShowPhotoDialog(false);
      setPhotoUrl("");
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    // This would also be saved in updateUserPreferences
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const requestLocationPermission = () => {
    // Location permission requested
    toast.info("Requesting location permission...");
  };

  const handleExportData = () => {
    // Data export initiated
    toast.info("Data export initiated. Check your email.");
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    // Add Supabase logic to delete user account
    toast.warning("Account deletion initiated.");
  };

  const handleChangePassword = () => {
    setShowPasswordDialog(true);
  };

  const savePasswordChange = () => {
    // Add Supabase logic to change password
    setShowPasswordDialog(false);
  };

  const activeNotifications = Object.values(notifications).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Header Card */}
      <Card className="p-6 bg-gradient-to-br from-white/90 to-sky-50/80 dark:from-slate-900/90 dark:to-sky-950/50 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl" onClick={() => isAuthenticated && setShowPhotoDialog(true)}>
              <AvatarImage src={avatarPreview || displayUser.avatar} alt={displayUser.name} />
              <AvatarFallback className="bg-gradient-to-br from-sky-500 to-teal-500 text-white text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button 
              className="absolute bottom-0 right-0 bg-gradient-to-br from-sky-500 to-teal-500 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowPhotoDialog(true)}
              disabled={!isAuthenticated}
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h2 className="text-2xl truncate">{displayUser.name}</h2>
              {isAuthenticated && (
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 w-fit mx-auto md:mx-0"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Premium Member
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-4 truncate">{displayUser.email}</p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Member since {memberSince}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Verified Account</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            {!isAuthenticated ? (
              <Button 
                onClick={onSignInClick}
                className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
              >
                Sign In
              </Button>
            ) : !isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs for Profile and Settings */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="weather" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
            <Thermometer className="h-4 w-4 mr-2" />
            Weather
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab Content */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          {/* Personal Information Card */}
          <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
            <h3 className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-sky-500" />
              Personal Information
            </h3>
            <Separator className="mb-6" />
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    disabled={!isEditing || !isAuthenticated}
                    className={!isEditing ? "bg-gray-50 dark:bg-slate-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    disabled={!isEditing || !isAuthenticated}
                    className={!isEditing ? "bg-gray-50 dark:bg-slate-800" : ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Default Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={defaultLocation}
                    onChange={(e) => setDefaultLocation(e.target.value)}
                    disabled={!isEditing || !isAuthenticated}
                    className={!isEditing ? "bg-gray-50 dark:bg-slate-800" : ""}
                  />
                  <Button
                    variant="outline"
                    disabled={!isEditing || !isAuthenticated}
                    onClick={() => {}}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">This location will be used when you open the app</p>
              </div>
            </div>
          </Card>

          {isAuthenticated ? (
            <>
              {/* Account Stats Card */}
              <Card className="p-6 bg-gradient-to-br from-sky-50/80 to-teal-50/80 dark:from-sky-950/30 dark:to-teal-950/30 backdrop-blur-xl border-sky-200/30 dark:border-sky-800/30">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-sky-500" />
                  <h3>Account Statistics</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-slate-900/60">
                    <div className="text-2xl text-sky-600">156</div>
                    <div className="text-xs text-muted-foreground mt-1">Weather Checks</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-slate-900/60">
                    <div className="text-2xl text-teal-600">3</div>
                    <div className="text-xs text-muted-foreground mt-1">Saved Locations</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-slate-900/60">
                    <div className="text-2xl text-amber-600">12</div>
                    <div className="text-xs text-muted-foreground mt-1">Reports Submitted</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-slate-900/60">
                    <div className="text-2xl text-purple-600">89</div>
                    <div className="text-xs text-muted-foreground mt-1">Days Active</div>
                  </div>
                </div>
              </Card>

              {/* Sign Out Card */}
              <Card className="p-6 bg-gradient-to-br from-red-50/80 to-orange-50/80 dark:from-red-950/30 dark:to-orange-950/30 backdrop-blur-xl border-red-200/30 dark:border-red-800/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 dark:text-white mb-1">Sign Out</h3>
                      <p className="text-muted-foreground">
                        Sign out of your SkySense account. You can continue using the app as a guest.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={signOut}
                    variant="destructive"
                    className="flex-shrink-0"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </Card>
            </>
          ) : null}
        </TabsContent>

        {/* Weather Settings Tab */}
        <TabsContent value="weather" className="space-y-6 mt-6">
          {/* Unit Preferences */}
          <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-6">
              <Thermometer className="h-5 w-5 text-sky-500" />
              <h3>Unit Preferences</h3>
            </div>
            
            <div className="space-y-6">
              {/* Temperature */}
              <div className="space-y-3">
                <Label>Temperature Unit</Label>
                <div className="flex gap-2">
                  <Button
                    variant={units.temperature === 'celsius' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setUnits(u => ({ ...u, temperature: 'celsius' }));
                    }}
                  >
                    Celsius (°C)
                  </Button>
                  <Button
                    variant={units.temperature === 'fahrenheit' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setUnits(u => ({ ...u, temperature: 'fahrenheit' }));
                    }}
                  >
                    Fahrenheit (°F)
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Wind Speed */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Wind className="h-4 w-4" />
                  Wind Speed Unit
                </Label>
                <Select value={units.windSpeed} onValueChange={(value: any) => setUnits(u => ({ ...u, windSpeed: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kmh">Kilometers per hour (km/h)</SelectItem>
                    <SelectItem value="mph">Miles per hour (mph)</SelectItem>
                    <SelectItem value="ms">Meters per second (m/s)</SelectItem>
                    <SelectItem value="knots">Knots</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Pressure */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Pressure Unit
                </Label>
                <Select value={units.pressure} onValueChange={(value: any) => setUnits(u => ({ ...u, pressure: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hpa">Hectopascals (hPa)</SelectItem>
                    <SelectItem value="inhg">Inches of mercury (inHg)</SelectItem>
                    <SelectItem value="mmhg">Millimeters of mercury (mmHg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Precipitation */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4" />
                  Precipitation Unit
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={units.precipitation === 'mm' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setUnits(u => ({ ...u, precipitation: 'mm' }));
                      toast.success('Precipitation unit set to Millimeters');
                    }}
                  >
                    Millimeters (mm)
                  </Button>
                  <Button
                    variant={units.precipitation === 'inches' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setUnits(u => ({ ...u, precipitation: 'inches' }));
                      toast.success('Precipitation unit set to Inches');
                    }}
                  >
                    Inches (in)
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Visibility */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visibility Unit
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={units.visibility === 'km' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setUnits(u => ({ ...u, visibility: 'km' }));
                      toast.success('Visibility unit set to Kilometers');
                    }}
                  >
                    Kilometers (km)
                  </Button>
                  <Button
                    variant={units.visibility === 'miles' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setUnits(u => ({ ...u, visibility: 'miles' }));
                      toast.success('Visibility unit set to Miles');
                    }}
                  >
                    Miles (mi)
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab Content */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          {/* Display Preferences Section */}
          <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-6">
              <Monitor className="h-5 w-5 text-sky-500" />
              <h3>Display Preferences</h3>
            </div>

            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Theme
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setTheme('light');
                      toast.success('Theme set to Light');
                    }}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setTheme('dark');
                      toast.success('Theme set to Dark');
                    }}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'auto' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setTheme('auto');
                      toast.success('Theme set to Auto');
                    }}
                  >
                    Auto
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Time Format */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time Format
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={timeFormat === '12h' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setTimeFormat('12h');
                      toast.success('Time format set to 12-hour');
                    }}
                  >
                    12-hour (AM/PM)
                  </Button>
                  <Button
                    variant={timeFormat === '24h' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setTimeFormat('24h');
                      toast.success('Time format set to 24-hour');
                    }}
                  >
                    24-hour
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Date Format */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Format
                </Label>
                <Select value={dateFormat} onValueChange={(value: any) => {
                  setDateFormat(value);
                  toast.success(`Date format changed`);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY (Europe)</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD (ISO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Animation Speed */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Map Animation Speed: {animationSpeed[0]}%
                </Label>
                <Slider
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <p className="text-muted-foreground">Adjust radar and map animation speed</p>
              </div>
            </div>
          </Card>

          {/* Data & Performance */}
          <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-6">
              <RefreshCw className="h-5 w-5 text-sky-500" />
              <h3>Data & Performance</h3>
            </div>

            <div className="space-y-6">
              {/* Auto Refresh */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-gray-900 dark:text-white">Auto Refresh</p>
                    <p className="text-muted-foreground">Automatically update weather data</p>
                  </div>
                </div>
                <Switch 
                  checked={autoRefresh}
                  onCheckedChange={(checked) => {
                    setAutoRefresh(checked);
                    toast.success(`Auto refresh ${checked ? 'enabled' : 'disabled'}`);
                  }}
                />
              </div>

              {autoRefresh && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Refresh Interval: {refreshInterval[0]} minutes
                    </Label>
                    <Slider
                      value={refreshInterval}
                      onValueChange={setRefreshInterval}
                      min={5}
                      max={60}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-muted-foreground">How often to refresh weather data</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Low Data Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <WifiOff className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-gray-900 dark:text-white">Low Data Mode</p>
                    <p className="text-muted-foreground">Reduce data usage</p>
                  </div>
                </div>
                <Switch 
                  checked={lowDataMode}
                  onCheckedChange={(checked) => {
                    setLowDataMode(checked);
                    toast.success(`Low data mode ${checked ? 'enabled' : 'disabled'}`);
                  }}
                />
              </div>

              <Separator />

              {/* Offline Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-gray-900 dark:text-white">Offline Mode</p>
                    <p className="text-muted-foreground">Use cached data when offline</p>
                  </div>
                </div>
                <Switch 
                  checked={offlineMode}
                  onCheckedChange={(checked) => {
                    setOfflineMode(checked);
                    toast.success(`Offline mode ${checked ? 'enabled' : 'disabled'}`);
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Location Settings */}
          <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-sky-500" />
              <h3>Location Settings</h3>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/60 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200/30 dark:border-green-800/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Current Location</p>
                    <p className="text-muted-foreground mt-1">
                      Weather data for your current area
                    </p>
                  </div>
                  <Badge className="bg-green-100/80 dark:bg-green-900/60 text-green-700 dark:text-green-300 border-green-300/50 dark:border-green-700/50">
                    Active
                  </Badge>
                </div>
                
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/30 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <p className="text-gray-900 dark:text-white">{currentLocation || defaultLocation}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={requestLocationPermission}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Update Location Automatically
                </Button>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-sky-500" />
              <h3>Security</h3>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={handleChangePassword}
                variant="outline"
                className="w-full justify-start"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button 
                onClick={handleExportData}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-sky-500" />
              <h3>Privacy Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50/80 dark:from-blue-950/30 border border-blue-200/30 dark:border-blue-800/30">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-gray-900 dark:text-white">Share Location Data</p>
                    <p className="text-muted-foreground">Allow location-based features</p>
                  </div>
                </div>
                <Switch 
                  checked={shareLocation}
                  onCheckedChange={(checked) => {
                    setShareLocation(checked);
                    toast.success(`Location sharing ${checked ? 'enabled' : 'disabled'}`);
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50/80 dark:from-purple-950/30 border border-purple-200/30 dark:border-purple-800/30">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-gray-900 dark:text-white">Share Weather Reports</p>
                    <p className="text-muted-foreground">Make your reports public</p>
                  </div>
                </div>
                <Switch 
                  checked={shareReports}
                  onCheckedChange={(checked) => {
                    setShareReports(checked);
                    toast.success(`Report sharing ${checked ? 'enabled' : 'disabled'}`);
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50/80 dark:from-amber-950/30 border border-amber-200/30 dark:border-amber-800/30">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-gray-900 dark:text-white">Analytics</p>
                    <p className="text-muted-foreground">Help improve the app</p>
                  </div>
                </div>
                <Switch 
                  checked={analyticsEnabled}
                  onCheckedChange={(checked) => {
                    setAnalyticsEnabled(checked);
                    toast.success(`Analytics ${checked ? 'enabled' : 'disabled'}`);
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 bg-gradient-to-br from-red-50/80 to-red-100/80 dark:from-red-950/30 dark:to-red-900/30 backdrop-blur-xl border-red-200/30 dark:border-red-800/30">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-red-900 dark:text-red-300">Danger Zone</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/60 dark:bg-slate-900/60 rounded-lg">
                <h4 className="text-gray-900 dark:text-white mb-2">Delete Account</h4>
                <p className="text-muted-foreground mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button 
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Photo Upload Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new photo or provide a URL for your profile picture
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="url">Use URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg hover:from-sky-600 hover:to-teal-600 transition-colors">
                    <Upload className="h-4 w-4" />
                    Choose File
                  </div>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </Label>
                <p className="text-xs text-muted-foreground text-center">
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="photo-url">Image URL</Label>
                  <Input
                    id="photo-url"
                    placeholder="https://example.com/photo.jpg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handlePhotoUrl}
                  className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Use This URL
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={savePasswordChange}
              className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
            >
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Profile information</li>
                <li>Saved locations</li>
                <li>Weather reports</li>
                <li>Preferences and settings</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Delete My Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}