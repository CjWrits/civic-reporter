import { useState, useEffect } from 'react';
import { Issue } from '@/types';
import { AuthService } from '@/auth/authService';

const STORAGE_KEY = 'civic-issues';

export const useLocalStorage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedIssues = JSON.parse(stored);
        // Migrate old issues without userId
        const migratedIssues = parsedIssues.map((issue: any) => {
          if (!issue.userId) {
            // Assign old issues to a default user or current user
            const currentUser = AuthService.getCurrentUser();
            return {
              ...issue,
              userId: currentUser?.id || 'legacy_user'
            };
          }
          return issue;
        });
        setIssues(migratedIssues);
        // Save migrated data back
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedIssues));
      } catch (error) {
        console.error('Failed to parse stored issues:', error);
      }
    }
  }, []);

  const saveIssue = (issue: Issue) => {
    const updatedIssues = [...issues, issue];
    setIssues(updatedIssues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    const updatedIssues = issues.map(issue =>
      issue.id === id ? { ...issue, ...updates } : issue
    );
    setIssues(updatedIssues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
  };

  const deleteIssue = (id: string) => {
    const updatedIssues = issues.filter(issue => issue.id !== id);
    setIssues(updatedIssues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
  };

  const updateIssueStatus = (id: string, status: Issue['status']) => {
    updateIssue(id, { status });
  };

  // Get issues for current user only
  const getMyIssues = () => {
    const currentUser = AuthService.getCurrentUser();
    console.log('useLocalStorage: Current user:', currentUser);
    console.log('useLocalStorage: All issues:', issues);
    
    if (!currentUser) {
      console.log('useLocalStorage: No current user, returning empty array');
      return [];
    }
    
    const userIssues = issues.filter(issue => {
      console.log(`useLocalStorage: Checking issue ${issue.id}, userId: ${issue.userId}, currentUser.id: ${currentUser.id}`);
      return issue.userId === currentUser.id;
    });
    
    console.log('useLocalStorage: User issues found:', userIssues);
    return userIssues;
  };

  // Check if user can modify issue
  const canModifyIssue = (issueId: string) => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return false;
    
    const issue = issues.find(i => i.id === issueId);
    return issue?.userId === currentUser.id || currentUser.type === 'admin';
  };

  return { 
    issues,           // All issues (for admin)
    myIssues: getMyIssues(), // User's issues only
    saveIssue, 
    updateIssue, 
    deleteIssue, 
    updateIssueStatus,
    canModifyIssue
  };
};