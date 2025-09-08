import { Issue } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';

export class IssuesAPI {
  static getAll(): Issue[] {
    const stored = localStorage.getItem(STORAGE_KEYS.issues);
    return stored ? JSON.parse(stored) : [];
  }

  static create(issue: Issue): void {
    const issues = this.getAll();
    issues.push(issue);
    localStorage.setItem(STORAGE_KEYS.issues, JSON.stringify(issues));
  }

  static update(id: string, updates: Partial<Issue>): void {
    const issues = this.getAll();
    const updatedIssues = issues.map(issue =>
      issue.id === id ? { ...issue, ...updates } : issue
    );
    localStorage.setItem(STORAGE_KEYS.issues, JSON.stringify(updatedIssues));
  }

  static delete(id: string): void {
    const issues = this.getAll();
    const filteredIssues = issues.filter(issue => issue.id !== id);
    localStorage.setItem(STORAGE_KEYS.issues, JSON.stringify(filteredIssues));
  }

  static updateStatus(id: string, status: Issue['status']): void {
    this.update(id, { status });
  }
}