import { Issue, UserLocation } from '@/types';
import { IssuesAPI } from '@/api/issues';
import { ISSUE_STATUSES } from '@/config/constants';

export class IssueService {
  static createIssue(data: {
    title: string;
    description: string;
    category: string;
    photo?: string;
    userLocation: UserLocation;
    address?: string;
  }): Issue {
    const issue: Issue = {
      id: Date.now().toString(),
      title: data.title.trim(),
      description: data.description.trim(),
      photo: data.photo,
      coordinates: data.userLocation,
      status: ISSUE_STATUSES.SUBMITTED,
      category: data.category,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      address: data.address?.trim(),
    };

    IssuesAPI.create(issue);
    return issue;
  }

  static getAllIssues(): Issue[] {
    return IssuesAPI.getAll();
  }

  static updateIssueStatus(id: string, status: Issue['status']): void {
    IssuesAPI.updateStatus(id, status);
  }

  static deleteIssue(id: string): void {
    IssuesAPI.delete(id);
  }

  static getIssuesByStatus(status: Issue['status']): Issue[] {
    return this.getAllIssues().filter(issue => issue.status === status);
  }

  static getStatusCounts() {
    const issues = this.getAllIssues();
    return {
      submitted: issues.filter(i => i.status === ISSUE_STATUSES.SUBMITTED).length,
      in_progress: issues.filter(i => i.status === ISSUE_STATUSES.IN_PROGRESS).length,
      completed: issues.filter(i => i.status === ISSUE_STATUSES.COMPLETED).length,
    };
  }

  static getNextStatus(currentStatus: Issue['status']): Issue['status'] {
    switch (currentStatus) {
      case ISSUE_STATUSES.SUBMITTED:
        return ISSUE_STATUSES.IN_PROGRESS;
      case ISSUE_STATUSES.IN_PROGRESS:
        return ISSUE_STATUSES.COMPLETED;
      default:
        return currentStatus;
    }
  }
}