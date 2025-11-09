import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  User, 
  Settings, 
  Bell, 
  MapPin, 
  LogOut, 
  Crown,
  ChevronDown
} from "lucide-react";
import { useAuth } from "./auth-context";

interface UserProfileDropdownProps {
  onSettingsClick?: () => void;
  onSectionChange?: (section: string) => void;
}

export function UserProfileDropdown({ onSettingsClick, onSectionChange }: UserProfileDropdownProps) {
  const { user, signOut } = useAuth();

  if (!user) return null;
  
  const handleMenuItemClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-2 hover:bg-white/20 dark:hover:bg-slate-800/50"
        >
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-sky-500 to-teal-500 text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">Premium</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50"
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-sky-500 to-teal-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <Badge 
                variant="outline" 
                className="mt-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs"
              >
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => handleMenuItemClick('profile')}
        >
          <User className="h-4 w-4 mr-3 text-muted-foreground" />
          <span>My Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => handleMenuItemClick('saved-locations')}
        >
          <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
          <span>Saved Locations</span>
          <Badge variant="secondary" className="ml-auto text-xs">3</Badge>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => handleMenuItemClick('notifications')}
        >
          <Bell className="h-4 w-4 mr-3 text-muted-foreground" />
          <span>Notifications</span>
          <Badge variant="destructive" className="ml-auto text-xs">2</Badge>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
