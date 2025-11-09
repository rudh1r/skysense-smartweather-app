import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { 
  MapPin, 
  Plus, 
  Clock, 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow,
  Wind,
  Thermometer,
  Users,
  MessageCircle,
  TrendingUp,
  LogIn,
  UserPlus,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import {
  getCrowdsourceReports,
  createCrowdsourceReport,
  deleteCrowdsourceReport,
  voteOnReport,
  removeVote,
} from "@/lib/db-operations";
import { toast } from "sonner";

interface WeatherReport {
  id: string;
  userId: string | null;
  username: string | null;
  location: string;
  condition: string;
  description: string | null;
  timestamp: string;
  coordinates: { lat: number; lng: number };
  upvotes: number;
  downvotes: number;
  isVerified: boolean;
  userVote?: 'up' | 'down' | null;
}

interface MicroclimateCrowdsourcingProps {
  onSignInClick?: () => void;
}

const conditionIcons = {
  'sunny': Sun,
  'cloudy': Cloud,
  'rainy': CloudRain,
  'snowy': CloudSnow,
  'windy': Wind,
  'stormy': CloudRain,
  'foggy': Cloud,
  'hot': Thermometer,
  'cold': Thermometer,
  'temperature': Thermometer,
  'precipitation': CloudRain,
  'visibility': Cloud,
  'other': Cloud
};

const conditionColors = {
  'sunny': 'text-yellow-500 bg-yellow-500/20',
  'cloudy': 'text-gray-500 bg-gray-500/20',
  'rainy': 'text-blue-500 bg-blue-500/20',
  'snowy': 'text-blue-200 bg-blue-200/20',
  'windy': 'text-gray-600 bg-gray-600/20',
  'stormy': 'text-purple-600 bg-purple-600/20',
  'foggy': 'text-gray-400 bg-gray-400/20',
  'hot': 'text-red-500 bg-red-500/20',
  'cold': 'text-blue-600 bg-blue-600/20',
  'temperature': 'text-orange-500 bg-orange-500/20',
  'precipitation': 'text-blue-500 bg-blue-500/20',
  'visibility': 'text-gray-500 bg-gray-500/20',
  'other': 'text-gray-500 bg-gray-500/20'
};

const REPORTS_PER_PAGE = 10;

export function MicroclimateCrowdsourcing({ onSignInClick }: MicroclimateCrowdsourcingProps) {
  const { user, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newReport, setNewReport] = useState({
    condition: '',
    description: '',
    location: ''
  });

  // Load reports from database or mock data
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // Fetch reports, passing the user's ID to get their vote status
        const fetchedReports = await getCrowdsourceReports(user?.id);
        setReports(fetchedReports);
      } catch (error) {
        console.error("Failed to load community reports:", error);
        toast.error("Failed to load community reports.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [user?.id]);

  const handleReportButtonClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    } else {
      setIsReportDialogOpen(true);
    }
  };

  const handleSubmitReport = async () => {
    if (!newReport.condition || !newReport.description || !newReport.location) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user) {
      toast.error('Please sign in to submit a report');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdReport = await createCrowdsourceReport({
        ...newReport,
        userId: user.id,
        username: user.name,
        coordinates: { lat: 37.7749, lng: -122.4194 }, // Mock coordinates
      });
      setReports(prev => [createdReport, ...prev]);
      toast.success('Weather report submitted successfully!');
      
      setNewReport({ condition: '', description: '', location: '' });
      setIsReportDialogOpen(false);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteCrowdsourceReport(reportId, user!.id);
      setReports(prevReports => prevReports.filter(r => r.id !== reportId));
      toast.success('Report deleted successfully');
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const handleVote = async (reportId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to vote');
      setShowAuthPrompt(true);
      return;
    }

    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      setReports(prev => prev.map(r => {
        if (r.id === reportId) {
          if (r.userVote === voteType) {
            // Remove vote
            return {
              ...r,
              upvotes: voteType === 'up' ? r.upvotes - 1 : r.upvotes,
              downvotes: voteType === 'down' ? r.downvotes - 1 : r.downvotes,
              userVote: null
            };
          } else {
            // Add or change vote
            const wasUpvote = r.userVote === 'up';
            const wasDownvote = r.userVote === 'down';
            
            return {
              ...r,
              upvotes: voteType === 'up' 
                ? (wasDownvote ? r.upvotes + 1 : r.upvotes + 1)
                : (wasUpvote ? r.upvotes - 1 : r.upvotes),
              downvotes: voteType === 'down'
                ? (wasUpvote ? r.downvotes + 1 : r.downvotes + 1)
                : (wasDownvote ? r.downvotes - 1 : r.downvotes),
              userVote: voteType
            };
          }
        }
        return r;
      }));
      toast.success(report.userVote === voteType ? 'Vote removed' : (voteType === 'up' ? 'Upvoted' : 'Downvoted'));
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const reportTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - reportTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Pagination
  const totalPages = Math.ceil(reports.length / REPORTS_PER_PAGE);
  const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
  const endIndex = startIndex + REPORTS_PER_PAGE;
  const currentReports = reports.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <>
      <Card className="col-span-full bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Community Weather Reports</span>
              <Badge variant="outline" className="bg-white/60">{reports.length}</Badge>
            </div>
            
            <Button 
              size="sm" 
              className="bg-blue-500 hover:bg-blue-600 text-white" 
              onClick={handleReportButtonClick}
            >
              <Plus className="h-4 w-4 mr-1" />
              Report
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading community reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-sm text-muted-foreground">No community reports yet</p>
              <p className="text-xs text-muted-foreground">Be the first to share weather conditions in your area!</p>
            </div>
          ) : (
            <>
              {/* Reports List */}
              <div className="space-y-3">
                {currentReports.map((report) => {
                  const Icon = conditionIcons[report.condition as keyof typeof conditionIcons] || Cloud;
                  const colorClass = conditionColors[report.condition as keyof typeof conditionColors] || 'text-gray-500 bg-gray-500/20';
                  const isOwner = user?.id === report.userId;
                  const netVotes = report.upvotes - report.downvotes;
                  
                  return (
                    <div key={report.id} className="bg-white/40 rounded-lg p-4 hover:bg-white/60 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1 flex-wrap">
                            <p className="font-medium text-sm">{report.username}</p>
                            <Badge variant="outline" className="text-xs">{report.condition}</Badge>
                            {report.isVerified && (
                              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-800">✓ Verified</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                          
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{report.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{getTimeAgo(report.timestamp)}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* Vote buttons */}
                              <div className="flex items-center gap-1 bg-white/60 rounded-lg p-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-7 px-2 ${report.userVote === 'up' ? 'bg-green-100 text-green-700' : ''}`}
                                  onClick={() => handleVote(report.id, 'up')}
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  <span className="text-xs">{report.upvotes}</span>
                                </Button>
                                
                                <span className={`text-xs font-medium px-1 ${
                                  netVotes > 0 ? 'text-green-600' : netVotes < 0 ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                  {netVotes > 0 ? '+' : ''}{netVotes}
                                </span>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-7 px-2 ${report.userVote === 'down' ? 'bg-red-100 text-red-700' : ''}`}
                                  onClick={() => handleVote(report.id, 'down')}
                                >
                                  <ThumbsDown className="h-3 w-3 mr-1" />
                                  <span className="text-xs">{report.downvotes}</span>
                                </Button>
                              </div>
                              
                              {/* Delete button (only for owner) */}
                              {isOwner && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setReportToDelete(report.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, reports.length)} of {reports.length} reports
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Summary stats */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Community Insights</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-800 dark:text-blue-300">
                    {reports.length} active reports
                  </Badge>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                  Help improve local weather accuracy by sharing real-time observations
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Weather Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReportToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reportToDelete && handleDeleteReport(reportToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Auth Prompt Dialog */}
      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
            <DialogDescription>
              To submit weather reports and vote on community contributions, please sign in or create an account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg border border-sky-200 dark:border-sky-800">
              <h4 className="text-sm font-medium text-sky-900 dark:text-sky-100 mb-2">Why sign in?</h4>
              <ul className="text-xs text-sky-700 dark:text-sky-300 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 dark:text-sky-400">•</span>
                  <span>Share real-time weather observations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 dark:text-sky-400">•</span>
                  <span>Vote on community reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 dark:text-sky-400">•</span>
                  <span>Build your contributor reputation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 dark:text-sky-400">•</span>
                  <span>Help your local community stay informed</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={onSignInClick}
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onSignInClick}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setShowAuthPrompt(false)}
                className="w-full"
              >
                Continue Browsing as Guest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Current Conditions</DialogTitle>
            <DialogDescription>
              Help your community by sharing real-time weather conditions in your area
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="e.g., Downtown, Near Central Park..."
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Weather Condition</label>
              <Select value={newReport.condition} onValueChange={(value) => setNewReport({ ...newReport, condition: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current conditions..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">☀️ Sunny</SelectItem>
                  <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                  <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                  <SelectItem value="snowy">❄️ Snowy</SelectItem>
                  <SelectItem value="windy">💨 Windy</SelectItem>
                  <SelectItem value="stormy">⛈️ Stormy</SelectItem>
                  <SelectItem value="foggy">🌫️ Foggy</SelectItem>
                  <SelectItem value="hot">🌡️ Unusually Hot</SelectItem>
                  <SelectItem value="cold">🧊 Unusually Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe what you're seeing... (e.g., 'Heavy rain just started', 'Dust storm approaching from west')"
                value={newReport.description}
                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                className="min-h-24"
              />
            </div>

            <Button 
              onClick={handleSubmitReport} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!newReport.condition || !newReport.description || !newReport.location || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Weather Report'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}