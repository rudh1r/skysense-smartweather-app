import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, Zap, Droplets, Thermometer, Bell, ChevronRight, CheckSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";

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

interface DisasterAlertsProps {
  alerts: DisasterAlert[];
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

export function DisasterAlerts({ alerts }: DisasterAlertsProps) {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleChecked = (alertId: string, index: number) => {
    const key = `${alertId}-${index}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (alerts.length === 0) {
    return (
      <Card className="col-span-full bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Bell className="h-5 w-5 text-green-500" />
            <span>Disaster Alerts</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-800">All Clear</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No active weather alerts in your area</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full bg-white/80 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Disaster Alerts</span>
            <Badge variant="destructive" className="animate-pulse">{alerts.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-white/60">
            <Bell className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
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
                    <div className="bg-white/40 rounded-lg p-3 mt-3">
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
      </CardContent>
    </Card>
  );
}