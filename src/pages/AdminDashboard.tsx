import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Map } from '@/components/Map';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Issue } from '@/types';
import { 
  MapPin, 
  List, 
  Map as MapIcon, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  LogOut,
  CheckCircle,
  Clock,
  Play,
  Sun,
  Moon,
  Languages,
  Search,
  X,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { location, error, loading } = useGeolocation();
  const { issues, updateIssueStatus, deleteIssue } = useLocalStorage();
  const [activeTab, setActiveTab] = useState('map');
  const [focusedIssue, setFocusedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  // Filter issues based on search query
  const filteredIssues = useMemo(() => {
    if (!searchQuery.trim()) return issues;
    
    return issues.filter(issue => 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.address && issue.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [issues, searchQuery]);

  const handleStatusUpdate = (issueId: string, newStatus: Issue['status']) => {
    updateIssueStatus(issueId, newStatus);
    toast({
      title: "Status Updated",
      description: `Issue status changed to ${newStatus.replace('_', ' ')}`,
    });
  };

  const handleDeleteIssue = (issueId: string) => {
    if (confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      deleteIssue(issueId);
      toast({
        title: "Issue Deleted",
        description: "The issue has been permanently deleted.",
      });
    }
  };

  const handleFocusIssue = (issue: Issue) => {
    setFocusedIssue(issue);
    setActiveTab('map');
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextStatus = (currentStatus: Issue['status']) => {
    switch (currentStatus) {
      case 'submitted': return 'in_progress';
      case 'in_progress': return 'completed';
      default: return currentStatus;
    }
  };

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'submitted': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const statusCounts = {
    submitted: filteredIssues.filter(i => i.status === 'submitted').length,
    in_progress: filteredIssues.filter(i => i.status === 'in_progress').length,
    completed: filteredIssues.filter(i => i.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-dark border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center glow-primary">
                <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">{t('adminDashboard')}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {t('issueManagement')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Location Status */}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('gettingLocation')}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">{t('locationError')}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full glow-primary"></div>
                  {t('locationActive')}
                </div>
              )}
              
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Languages className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1 text-xs">{language === 'en' ? 'हि' : 'EN'}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="glass-dark border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('submitted')}</p>
                  <p className="text-xl sm:text-2xl font-bold">{statusCounts.submitted}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('inProgress')}</p>
                  <p className="text-xl sm:text-2xl font-bold">{statusCounts.in_progress}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('completed')}</p>
                  <p className="text-xl sm:text-2xl font-bold">{statusCounts.completed}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 glass-dark">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              {t('mapView')}
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              {t('allIssues')} ({filteredIssues.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-0">
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-3 sm:gap-6 h-[calc(100vh-280px)] sm:h-[calc(100vh-300px)]">
              <div className="lg:col-span-3 h-64 sm:h-80 lg:h-full">
                <Map
                  issues={filteredIssues}
                  userLocation={location}
                  focusedIssue={focusedIssue}
                  className="h-full"
                />
              </div>
              <div className="lg:col-span-1 h-64 lg:h-full">
                <Card className="glass-dark border-border h-full">
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">
                      {searchQuery ? `Search Results (${filteredIssues.length})` : 'Recent Issues'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3 overflow-y-auto max-h-48 lg:max-h-none">
                    {filteredIssues.slice(0, 5).map((issue) => (
                      <div
                        key={issue.id}
                        className="p-2 sm:p-3 rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => handleFocusIssue(issue)}
                      >
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <Badge className={`${getStatusColor(issue.status)} text-white text-xs`}>
                            {issue.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {issue.photo && (
                          <img 
                            src={issue.photo} 
                            alt="Issue preview" 
                            className="w-full h-12 sm:h-16 object-cover rounded mb-1 sm:mb-2 border border-border"
                          />
                        )}
                        <h4 className="font-medium text-xs sm:text-sm">{issue.title}</h4>
                        <p className="text-xs text-muted-foreground">{issue.category}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="issues">
            {/* Search Bar - Only in Issues Tab */}
            <div className="relative max-w-md mb-4 sm:mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 glass-dark border-border text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {searchQuery && (
              <div className="mb-4 p-3 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredIssues.length} result{filteredIssues.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              </div>
            )}
            <div className="space-y-3 sm:space-y-4">
              {filteredIssues.map((issue) => (
                <Card key={issue.id} className="glass-dark border-border">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <Badge className={`${getStatusColor(issue.status)} text-white flex items-center gap-1 text-xs`}>
                            {getStatusIcon(issue.status)}
                            {issue.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs sm:text-sm text-muted-foreground">{issue.category}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{issue.description}</p>
                        {issue.photo && (
                          <div className="mb-2 sm:mb-3">
                            <img 
                              src={issue.photo} 
                              alt="Issue photo" 
                              className="w-full max-w-xs h-24 sm:h-32 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setSelectedImage(issue.photo!)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Click to view full size</p>
                          </div>
                        )}
                        {issue.address && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            Address: {issue.address}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Reported: {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFocusIssue(issue)}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <MapIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">{t('viewOnMap')}</span>
                          <span className="sm:hidden">Map</span>
                        </Button>
                        {issue.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(issue.id, getNextStatus(issue.status))}
                            className="flex-1 sm:flex-none text-xs sm:text-sm"
                          >
                            <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">{issue.status === 'submitted' ? 'Start Progress' : 'Mark Complete'}</span>
                            <span className="sm:hidden">{issue.status === 'submitted' ? 'Start' : 'Complete'}</span>
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteIssue(issue.id)}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">Del</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredIssues.length === 0 && (
                <Card className="glass-dark border-border">
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery ? 'No Matching Issues Found' : 'No Issues Found'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? `No issues match your search for "${searchQuery}". Try different keywords.`
                        : 'No community issues have been reported yet.'
                      }
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery('')}
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Full size issue photo" 
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;