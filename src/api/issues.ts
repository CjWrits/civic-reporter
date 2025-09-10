import { Issue } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';

// backend: this is the main api layer that needs to be replaced with real http calls
export class IssuesAPI {
  // replace this with GET /api/issues
  // should return array of all issues from database
  static getAll(): Issue[] {
    //replace with fetch('/api/issues')
    const stored = localStorage.getItem(STORAGE_KEYS.issues);
    return stored ? JSON.parse(stored) : [];
  }

  // replace this with POST /api/issues
  // should save new issue to database and return created issue
  static create(issue: Issue): void {
    //replace with fetch('/api/issues', { method: 'POST', body: JSON.stringify(issue) })
    const issues = this.getAll();
    issues.push(issue);
    localStorage.setItem(STORAGE_KEYS.issues, JSON.stringify(issues));
  }

  // replace this with PUT /api/issues/:id
  // should update existing issue in database
  static update(id: string, updates: Partial<Issue>): void {
    //replace with fetch(`/api/issues/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
    const issues = this.getAll();
    const updatedIssues = issues.map(issue =>
      issue.id === id ? { ...issue, ...updates } : issue
    );
    localStorage.setItem(STORAGE_KEYS.issues, JSON.stringify(updatedIssues));
  }

  //replace this with DELETE /api/issues/:id
  // should remove issue from database
  static delete(id: string): void {
    //replace with fetch(`/api/issues/${id}`, { method: 'DELETE' })
    const issues = this.getAll();
    const filteredIssues = issues.filter(issue => issue.id !== id);
    localStorage.setItem(STORAGE_KEYS.issues, JSON.stringify(filteredIssues));
  }

  // replace this with PATCH /api/issues/:id/status
  // should update only the status field in database
  static updateStatus(id: string, status: Issue['status']): void {
    //replace with fetch(`/api/issues/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
    this.update(id, { status });
  }
}