import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IssueForm } from '@/components/IssueForm';
import { IssuesList } from '@/components/IssuesList';
import { Map } from '@/components/Map';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Issue } from '@/types';
import { 
  MapPin, 
  Plus, 
  List, 
  Map as MapIcon, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  LogOut,
  Sun,
  Moon,
  Languages
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';

interface IndexProps {
  onLogout?: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  const { location, error, loading } = useGeolocation();
  const { issues, saveIssue, deleteIssue } = useLocalStorage();
  const [activeTab, setActiveTab] = useState('map');
  const [focusedIssue, setFocusedIssue] = useState<Issue | null>(null);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleSubmitIssue = (issue: Issue) => {
    saveIssue(issue);
    setActiveTab('map');
    setFocusedIssue(issue);
  };

  const handleDeleteIssue = (id: string) => {
    deleteIssue(id);
    toast({
      title: "Issue Deleted",
      description: "The issue has been removed from your reports.",
    });
  };

  const handleFocusIssue = (issue: Issue) => {
    setFocusedIssue(issue);
    setActiveTab('map');
  };

  const handleRefreshLocation = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-dark border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center glow-primary">
                <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">{t('appName')}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {t('appDescription')}
                </p>
              </div>
            </div>
            
            {/* Location Status */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Languages className="h-4 w-4" />
                <span className="ml-1 text-xs">{language === 'en' ? 'हि' : 'EN'}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              {onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t('logout')}</span>
                </Button>
              )}
              <div className="flex items-center gap-1 sm:gap-2">
              {loading && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="hidden sm:inline">{t('gettingLocation')}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                  <span className="text-xs sm:text-sm text-destructive hidden sm:inline">{t('locationError')}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshLocation}
                  >
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              )}
              {location && location.accuracy && location.accuracy > 1000 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                  <span className="text-xs sm:text-sm text-yellow-600 hidden sm:inline">{t('lowAccuracy')} ({Math.round(location.accuracy)}m)</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full glow-primary"></div>
                  <span className="hidden sm:inline">{t('locationActive')}</span>
                  <span className="sm:hidden">{t('gps')}</span>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 glass-dark h-12 sm:h-10">
            <TabsTrigger value="map" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <MapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('mapView')}</span>
              <span className="sm:hidden">{t('map')}</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('reportIssue')}</span>
              <span className="sm:hidden">{t('report')}</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">{t('myIssues')} ({issues.length})</span>
              <span className="sm:hidden">{t('issues')} ({issues.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Map View */}
          <TabsContent value="map" className="space-y-0">
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]">
              <div className="lg:col-span-3 h-64 sm:h-80 lg:h-full">
                <Map
                  issues={issues}
                  userLocation={location}
                  focusedIssue={focusedIssue}
                  className="h-full"
                />
              </div>
              <div className="lg:col-span-1 flex-1 lg:h-full">
                <IssuesList
                  issues={issues}
                  onDeleteIssue={handleDeleteIssue}
                  onFocusIssue={handleFocusIssue}
                  className="h-full max-h-64 lg:max-h-none"
                />
              </div>
            </div>
          </TabsContent>

          {/* Report Issue */}
          <TabsContent value="report">
            <div className="space-y-6">
              <IssueForm
                onSubmit={handleSubmitIssue}
                userLocation={location}
              />
              <Card className="glass-dark border-border lg:hidden">
                <CardContent className="p-4">
                  <h3 className="text-base font-semibold mb-3">{t('quickTips')}</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">📝</span>
                      <span>{t('beSpecific')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">📸</span>
                      <span>{t('addPhotos')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">📍</span>
                      <span>{t('enableLocation')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">⚠️</span>
                      <span>{t('staySafe')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Issues List */}
          <TabsContent value="issues">
            <div className="max-w-6xl mx-auto">
              <IssuesList
                issues={issues}
                onDeleteIssue={handleDeleteIssue}
                onFocusIssue={handleFocusIssue}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;