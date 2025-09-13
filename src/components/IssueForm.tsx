import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhotoUpload } from './PhotoUpload';
import { MapPin, Send } from 'lucide-react';
import { Issue, UserLocation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface IssueFormProps {
  onSubmit: (issue: Issue) => void;
  userLocation: UserLocation | null;
  className?: string;
}

export const IssueForm: React.FC<IssueFormProps> = ({ onSubmit, userLocation, className }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const categories = [
    { value: 'Roads & Potholes', label: t('roadsAndPotholes') },
    { value: 'Street Lighting', label: t('streetLighting') },
    { value: 'Sanitation', label: t('sanitation') },
    { value: 'Public Transportation', label: t('publicTransportation') },
    { value: 'Parks & Recreation', label: t('parksAndRecreation') },
    { value: 'Traffic Signals', label: t('trafficSignals') },
    { value: 'Sidewalks', label: t('sidewalks') },
    { value: 'Drainage', label: t('drainage') },
    { value: 'Other', label: t('other') }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category || !address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including address",
        variant: "destructive",
      });
      return;
    }

    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location access to report an issue",
        variant: "destructive",
      });
      return;
    }

    const issue: Issue = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      photo,
      coordinates: userLocation,
      status: 'submitted',
      category,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      address: address.trim(),
    };

    onSubmit(issue);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setPhoto(null);
    setAddress('');

    toast({
      title: "Issue Reported",
      description: "Your issue has been successfully reported!",
    });
  };

  return (
    <Card className={`glass-dark border-border ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {t('reportIssue')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('issueTitle')} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('issueTitle')}
              className="glass-dark"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('category')} *</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 glass-dark rounded-md border border-border bg-background text-foreground"
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')} *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('issueDescription')}
              rows={4}
              className="glass-dark"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('address')} *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter the full address of the issue location"
              className="glass-dark"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('photo')} (optional)</Label>
            <PhotoUpload photo={photo} onPhotoChange={setPhoto} />
          </div>

          <Button
            type="submit"
            className="w-full glow-primary"
            disabled={!userLocation}
          >
            <Send className="h-4 w-4 mr-2" />
            {t('submitIssue')}
          </Button>

          {!userLocation && (
            <p className="text-sm text-muted-foreground text-center">
              {t('enableLocation')}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};