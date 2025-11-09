import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Trash2,
  Settings,
  BellOff,
  Clock,
  Filter,
  Zap,
  Droplets,
  Thermometer,
  ChevronRight,
  CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "alert" | "info" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
  timestamp: Date;
}

interface DisasterAlert {
  id: string;
  type: 'storm' | 'flood' | 'heatwave' | 'earthquake';
  severity: 'watch' | 'warning' | 'emergency';
  title: string;
  description: string;
  timeIssued: string;
  expiresAt: string;
  area: string;
}

interface NotificationsSectionProps {
  notifications?: Notification[];
  disasterAlerts?: DisasterAlert[];
  onNotificationClick?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
}

const alertIcons = {
  storm: Zap,
  flood: Droplets,
  heatwave: Thermometer,
  earthquake: AlertTriangle
};

const severityColors = {
  watch: "bg-yellow-500/20 border-yellow-500/40 text-yellow-800",
  warning: "bg-orange-500/20 border-orange-500/40 text-orange-800", 
  emergency: "bg-red-500/20 border-red-500/40 text-red-800"
};

const emergencyChecklist = {
  storm: [
    "Secure outdoor furniture and objects",
    "Charge all electronic devices",
    "Stock up on water and non-perishable food",
    "Review evacuation routes",
    "Keep flashlights and batteries ready"
  ],
  flood: [
    "Move to higher ground immediately",
    "Avoid walking or driving through flood water",
    "Turn off utilities if instructed",
    "Keep emergency supplies accessible",
    "Monitor local emergency broadcasts"
  ],
  heatwave: [
    "Stay indoors during peak hours (10 AM - 6 PM)",
    "Drink water regularly, avoid alcohol",
    "Wear light-colored, loose clothing",
    "Check on elderly neighbors and pets",
    "Never leave anyone in a parked vehicle"
  ],
  earthquake: [
    "Secure heavy furniture and objects",
    "Identify safe spots in each room",
    "Keep emergency kit accessible",
    "Practice 'Drop, Cover, Hold On'",
    "Know how to turn off gas, water, electricity"
  ]
};

export function NotificationsSection({ 
  notifications: externalNotifications,
  disasterAlerts = [],
  onNotificationClick: externalOnClick,
  onMarkAllRead: externalMarkAllRead,
  onClearAll: externalClearAll
}: NotificationsSectionProps) {
  const [notifications, setNotifications] = useState(externalNotifications || []);

  const [filterType, setFilterType] = useState<"all" | "unread" | "alert" | "info" | "success">("all");
  const [showSettings, setShowSettings] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  
  // Notification settings
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [dailyForecasts, setDailyForecasts] = useState(true);
  const [severeWeather, setSevereWeather] = useState(true);
  const [airQuality, setAirQuality] = useState(true);

  const toggleChecked = (alertId: string, index: number) => {
    const key = `${alertId}-${index}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNotificationClick = (id: string) => {
    if (externalOnClick) {
      externalOnClick(id);
    } else {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  const handleDeleteNotification = (id: string, title: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success(`"${title}" deleted`);
  };

  const handleMarkAllRead = () => {
    if (externalMarkAllRead) {
      externalMarkAllRead();
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    if (externalClearAll) {
      externalClearAll();
    } else {
      setNotifications([]);
    }
    toast.success("All notifications cleared");
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === "all") return true;
    if (filterType === "unread") return !n.read;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "alert":
        return "from-red-50/80 to-orange-50/80 dark:from-red-950/30 dark:to-orange-950/30 border-red-200/30 dark:border-red-800/30";
      case "info":
        return "from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200/30 dark:border-blue-800/30";
      case "success":
        return "from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/30 dark:border-green-800/30";
      default:
        return "from-gray-50/80 to-slate-50/80 dark:from-gray-950/30 dark:to-slate-950/30 border-gray-200/30 dark:border-gray-800/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-br from-white/90 to-sky-50/80 dark:from-slate-900/90 dark:to-sky-950/50 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Notifications</h2>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            {unreadCount > 0 && (
              <Button 
                onClick={handleMarkAllRead}
                className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Settings Card */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-sky-500" />
                Notification Settings
              </h3>
              <Separator className="mb-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-notifications">Enable Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive all weather notifications</p>
                  </div>
                  <Switch
                    id="enable-notifications"
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="weather-alerts">Weather Alerts</Label>
                    <p className="text-xs text-muted-foreground">Important weather updates</p>
                  </div>
                  <Switch
                    id="weather-alerts"
                    checked={weatherAlerts}
                    onCheckedChange={setWeatherAlerts}
                    disabled={!enableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="daily-forecasts">Daily Forecasts</Label>
                    <p className="text-xs text-muted-foreground">Morning weather summaries</p>
                  </div>
                  <Switch
                    id="daily-forecasts"
                    checked={dailyForecasts}
                    onCheckedChange={setDailyForecasts}
                    disabled={!enableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="severe-weather">Severe Weather Warnings</Label>
                    <p className="text-xs text-muted-foreground">Critical weather alerts</p>
                  </div>
                  <Switch
                    id="severe-weather"
                    checked={severeWeather}
                    onCheckedChange={setSevereWeather}
                    disabled={!enableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="air-quality">Air Quality Alerts</Label>
                    <p className="text-xs text-muted-foreground">Air quality notifications</p>
                  </div>
                  <Switch
                    id="air-quality"
                    checked={airQuality}
                    onCheckedChange={setAirQuality}
                    disabled={!enableNotifications}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Buttons */}
      <Card className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            size="sm"
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className={filterType === "all" ? "bg-gradient-to-r from-sky-500 to-teal-500" : ""}
          >
            All ({notifications.length})
          </Button>
          <Button
            size="sm"
            variant={filterType === "unread" ? "default" : "outline"}
            onClick={() => setFilterType("unread")}
            className={filterType === "unread" ? "bg-gradient-to-r from-sky-500 to-teal-500" : ""}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            size="sm"
            variant={filterType === "alert" ? "default" : "outline"}
            onClick={() => setFilterType("alert")}
            className={filterType === "alert" ? "bg-gradient-to-r from-red-500 to-orange-500" : ""}
          >
            Alerts
          </Button>
          <Button
            size="sm"
            variant={filterType === "info" ? "default" : "outline"}
            onClick={() => setFilterType("info")}
            className={filterType === "info" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
          >
            Info
          </Button>
          <Button
            size="sm"
            variant={filterType === "success" ? "default" : "outline"}
            onClick={() => setFilterType("success")}
            className={filterType === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""}
          >
            Success
          </Button>
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleClearAll}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </Card>

      {/* Disaster Alerts Section */}
      {disasterAlerts.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-red-50/90 to-orange-50/80 dark:from-red-950/30 dark:to-orange-950/30 backdrop-blur-xl border-red-200/50 dark:border-red-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg animate-pulse">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Disaster Alerts</h3>
                <p className="text-sm text-muted-foreground">{disasterAlerts.length} active alert{disasterAlerts.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <Badge variant="destructive" className="animate-pulse">{disasterAlerts.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {disasterAlerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              const isExpanded = expandedAlert === alert.id;
              const checklist = emergencyChecklist[alert.type];
              
              return (
                <Collapsible key={alert.id} open={isExpanded} onOpenChange={() => setExpandedAlert(isExpanded ? null : alert.id)}>
                  <Alert className={`${severityColors[alert.severity]} border-l-4`}>
                    <Icon className="h-4 w-4" />
                    <AlertDescription className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-sm">{alert.title}</p>
                            <Badge variant="outline" className="text-xs">{alert.severity.toUpperCase()}</Badge>
                          </div>
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>Area: {alert.area}</span>
                            <span>•</span>
                            <span>Expires: {alert.expiresAt}</span>
                          </div>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-2 p-1">
                            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent className="space-y-3">
                        <div className="bg-white/40 dark:bg-slate-900/40 rounded-lg p-3 mt-3">
                          <h4 className="font-semibold text-sm mb-2 flex items-center space-x-2">
                            <CheckSquare className="h-4 w-4" />
                            <span>Emergency Checklist</span>
                          </h4>
                          <div className="space-y-2">
                            {checklist.map((item, index) => {
                              const key = `${alert.id}-${index}`;
                              const isChecked = checkedItems[key] || false;
                              
                              return (
                                <div key={index} className="flex items-start space-x-2">
                                  <button
                                    onClick={() => toggleChecked(alert.id, index)}
                                    className={`mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                                      isChecked 
                                        ? 'bg-green-500 border-green-500 text-white' 
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                  >
                                    {isChecked && <CheckSquare className="h-3 w-3" />}
                                  </button>
                                  <span className={`text-sm flex-1 ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                    {item}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </AlertDescription>
                  </Alert>
                </Collapsible>
              );
            })}
          </div>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 && disasterAlerts.length > 0 && (
          <Card className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
            <h3 className="font-semibold text-sm text-muted-foreground">General Notifications</h3>
          </Card>
        )}
        
        <AnimatePresence>
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card 
                className={`p-4 bg-gradient-to-br backdrop-blur-xl cursor-pointer hover:shadow-lg transition-all ${
                  getNotificationColor(notification.type)
                } ${!notification.read ? 'border-l-4' : ''}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <Badge className="bg-sky-500 text-white text-xs flex-shrink-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id, notification.title);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <Card className="p-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
          <div className="text-center">
            <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filterType === "all" 
                ? "You're all caught up! Check back later for updates."
                : `No ${filterType} notifications found.`}
            </p>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
