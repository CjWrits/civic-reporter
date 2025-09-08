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

interface IssueFormProps {
  onSubmit: (issue: Issue) => void;
  userLocation: UserLocation | null;
  className?: string;
}

const categories = [
  'Roads & Potholes',
  'Street Lighting',
  'Sanitation',
  'Public Transportation',
  'Parks & Recreation',
  'Traffic Signals',
  'Sidewalks',
  'Drainage',
  'Other'
];

export const IssueForm: React.FC<IssueFormProps> = ({ onSubmit, userLocation, className }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [customLocation, setCustomLocation] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
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
      address: customLocation.trim() || undefined,
    };

    onSubmit(issue);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setPhoto(null);
    setCustomLocation('');

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
          Report New Issue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              className="glass-dark"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 glass-dark rounded-md border border-border bg-background text-foreground"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description of the issue"
              rows={4}
              className="glass-dark"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Custom Location (optional)</Label>
            <Input
              id="location"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="e.g., Near Central Park entrance"
              className="glass-dark"
            />
          </div>

          <div className="space-y-2">
            <Label>Photo (optional)</Label>
            <PhotoUpload photo={photo} onPhotoChange={setPhoto} />
          </div>

          <Button
            type="submit"
            className="w-full glow-primary"
            disabled={!userLocation}
          >
            <Send className="h-4 w-4 mr-2" />
            Report Issue
          </Button>

          {!userLocation && (
            <p className="text-sm text-muted-foreground text-center">
              Please enable location access to report issues
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};