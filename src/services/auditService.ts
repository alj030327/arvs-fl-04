// ============================================================================
// COMPREHENSIVE AUDIT & COMPLIANCE SYSTEM
// Advanced audit trails, compliance monitoring, and regulatory reporting
// ============================================================================

import { supabase } from '@/integrations/supabase/client';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  action: string;
  resource: string;
  resourceId?: string;
  outcome: 'success' | 'failure' | 'blocked';
  ipAddress: string;
  userAgent: string;
  locationData?: {
    country: string;
    region: string;
    city: string;
  };
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
    fields: string[];
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  metadata: Record<string, any>;
}

export interface ComplianceFramework {
  name: string;
  version: string;
  description: string;
  requirements: ComplianceRequirement[];
  lastAssessment: Date;
  nextAssessment: Date;
  status: 'compliant' | 'partial' | 'non_compliant';
  score: number; // 0-100
}

export interface ComplianceRequirement {
  id: string;
  category: string;
  requirement: string;
  description: string;
  mandatory: boolean;
  status: 'implemented' | 'partial' | 'missing';
  evidence: string[];
  lastVerified: Date;
  responsibleTeam: string;
  remediation?: {
    plan: string;
    deadline: Date;
    assignee: string;
    status: 'planned' | 'in_progress' | 'blocked' | 'completed';
  };
}

export interface DataRetentionPolicy {
  id: string;
  dataType: string;
  description: string;
  retentionPeriod: number; // in days
  purpose: string;
  legalBasis: string;
  automaticDeletion: boolean;
  encryptionRequired: boolean;
  backupRetention: number; // in days
  lastReviewed: Date;
  nextReview: Date;
}

class AuditService {
  private static instance: AuditService;
  private auditBuffer: AuditEvent[] = [];
  private complianceFrameworks: Map<string, ComplianceFramework> = new Map();

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  constructor() {
    this.initializeComplianceFrameworks();
    this.startAuditBufferFlush();
  }

  // Audit Event Management
  async logAuditEvent(event: Partial<AuditEvent>): Promise<void> {
    const auditEvent: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: this.getCurrentSessionId(),
      riskLevel: 'low',
      tags: [],
      metadata: {},
      ...event
    } as AuditEvent;

    // Add to buffer for batch processing
    this.auditBuffer.push(auditEvent);

    // Immediate processing for high-risk events
    if (auditEvent.riskLevel === 'high' || auditEvent.riskLevel === 'critical') {
      await this.processHighRiskEvent(auditEvent);
    }
  }

  private getCurrentSessionId(): string {
    // In production, this would get the actual session ID
    return `session_${Date.now()}`;
  }

  private async processHighRiskEvent(event: AuditEvent): Promise<void> {
    // Immediate alerting for high-risk events
    console.log(`High-risk audit event: ${event.action} on ${event.resource}`);
    
    // Send to security team
    await supabase.functions.invoke('send-email', {
      body: {
        to: 'security@company.com',
        subject: `High-Risk Audit Event: ${event.action}`,
        template: 'audit-alert',
        data: { event }
      }
    });
  }

  // Audit Search and Reporting
  async searchAuditEvents(criteria: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    riskLevel?: string[];
    limit?: number;
  }): Promise<AuditEvent[]> {
    // In production, this would query the actual audit database
    return this.auditBuffer.filter(event => {
      if (criteria.userId && event.userId !== criteria.userId) return false;
      if (criteria.action && !event.action.includes(criteria.action)) return false;
      if (criteria.resource && event.resource !== criteria.resource) return false;
      if (criteria.startDate && event.timestamp < criteria.startDate) return false;
      if (criteria.endDate && event.timestamp > criteria.endDate) return false;
      if (criteria.riskLevel && !criteria.riskLevel.includes(event.riskLevel)) return false;
      return true;
    }).slice(0, criteria.limit || 100);
  }

  async generateAuditReport(timeframe: '24h' | '7d' | '30d' | '90d' | '1y'): Promise<any> {
    const endDate = new Date();
    const startDate = this.calculateStartDate(endDate, timeframe);
    
    const events = await this.searchAuditEvents({
      startDate,
      endDate,
      limit: 10000
    });

    return {
      summary: {
        totalEvents: events.length,
        uniqueUsers: new Set(events.map(e => e.userId).filter(Boolean)).size,
        riskDistribution: this.calculateRiskDistribution(events),
        topActions: this.getTopActions(events),
        failureRate: this.calculateFailureRate(events)
      },
      trends: this.calculateTrends(events),
      anomalies: this.detectAnomalies(events),
      recommendations: this.generateAuditRecommendations(events)
    };
  }

  private calculateStartDate(endDate: Date, timeframe: string): Date {
    const days = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[timeframe] || 30;

    return new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
  }

  private calculateRiskDistribution(events: AuditEvent[]): Record<string, number> {
    const distribution = { low: 0, medium: 0, high: 0, critical: 0 };
    events.forEach(event => {
      distribution[event.riskLevel]++;
    });
    return distribution;
  }

  private getTopActions(events: AuditEvent[]): Array<{ action: string; count: number }> {
    const actionCounts = new Map<string, number>();
    events.forEach(event => {
      actionCounts.set(event.action, (actionCounts.get(event.action) || 0) + 1);
    });

    return Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateFailureRate(events: AuditEvent[]): number {
    const failures = events.filter(e => e.outcome === 'failure').length;
    return events.length > 0 ? (failures / events.length) * 100 : 0;
  }

  private calculateTrends(events: AuditEvent[]): any {
    // Group events by day
    const dailyEvents = new Map<string, number>();
    events.forEach(event => {
      const day = event.timestamp.toISOString().split('T')[0];
      dailyEvents.set(day, (dailyEvents.get(day) || 0) + 1);
    });

    return Array.from(dailyEvents.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private detectAnomalies(events: AuditEvent[]): string[] {
    const anomalies: string[] = [];

    // Check for unusual login patterns
    const loginEvents = events.filter(e => e.action === 'user_login');
    const hourlyLogins = new Map<number, number>();
    loginEvents.forEach(event => {
      const hour = event.timestamp.getHours();
      hourlyLogins.set(hour, (hourlyLogins.get(hour) || 0) + 1);
    });

    // Detect off-hours activity (assuming business hours 8-18)
    const offHoursLogins = Array.from(hourlyLogins.entries())
      .filter(([hour, count]) => (hour < 8 || hour > 18) && count > 5);
    
    if (offHoursLogins.length > 0) {
      anomalies.push('Unusual off-hours login activity detected');
    }

    // Check for repeated failures
    const failureEvents = events.filter(e => e.outcome === 'failure');
    const userFailures = new Map<string, number>();
    failureEvents.forEach(event => {
      if (event.userId) {
        userFailures.set(event.userId, (userFailures.get(event.userId) || 0) + 1);
      }
    });

    const suspiciousUsers = Array.from(userFailures.entries())
      .filter(([, count]) => count > 10);
    
    if (suspiciousUsers.length > 0) {
      anomalies.push(`${suspiciousUsers.length} users with excessive failure rates`);
    }

    return anomalies;
  }

  private generateAuditRecommendations(events: AuditEvent[]): string[] {
    const recommendations: string[] = [];

    const highRiskEvents = events.filter(e => e.riskLevel === 'high' || e.riskLevel === 'critical');
    if (highRiskEvents.length > 0) {
      recommendations.push('Review and investigate all high-risk events');
    }

    const failureRate = this.calculateFailureRate(events);
    if (failureRate > 5) {
      recommendations.push('Investigate high failure rate and improve system reliability');
    }

    const uniqueIPs = new Set(events.map(e => e.ipAddress)).size;
    const uniqueUsers = new Set(events.map(e => e.userId).filter(Boolean)).size;
    if (uniqueIPs > uniqueUsers * 3) {
      recommendations.push('Review unusual IP distribution for potential security concerns');
    }

    return recommendations;
  }

  // Compliance Management
  private initializeComplianceFrameworks(): void {
    // GDPR Compliance Framework
    this.complianceFrameworks.set('gdpr', {
      name: 'General Data Protection Regulation',
      version: '2018',
      description: 'EU data protection and privacy regulation',
      requirements: [
        {
          id: 'gdpr_001',
          category: 'Data Processing',
          requirement: 'Lawful basis for processing',
          description: 'All personal data processing must have a lawful basis',
          mandatory: true,
          status: 'implemented',
          evidence: ['privacy_policy', 'consent_management_system'],
          lastVerified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          responsibleTeam: 'Legal & Compliance'
        },
        {
          id: 'gdpr_002',
          category: 'Data Subject Rights',
          requirement: 'Right to be forgotten',
          description: 'Users must be able to request deletion of their data',
          mandatory: true,
          status: 'implemented',
          evidence: ['data_deletion_process', 'user_interface'],
          lastVerified: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          responsibleTeam: 'Engineering'
        }
      ],
      lastAssessment: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: 'compliant',
      score: 94
    });

    // PCI DSS Compliance Framework
    this.complianceFrameworks.set('pci_dss', {
      name: 'Payment Card Industry Data Security Standard',
      version: '4.0',
      description: 'Security standards for organizations handling credit card data',
      requirements: [
        {
          id: 'pci_001',
          category: 'Secure Network',
          requirement: 'Install and maintain firewall configuration',
          description: 'Firewalls must protect cardholder data environment',
          mandatory: true,
          status: 'implemented',
          evidence: ['firewall_rules', 'network_diagrams'],
          lastVerified: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          responsibleTeam: 'Infrastructure'
        }
      ],
      lastAssessment: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      nextAssessment: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      status: 'compliant',
      score: 97
    });
  }

  async getComplianceStatus(framework?: string): Promise<ComplianceFramework[]> {
    if (framework) {
      const fw = this.complianceFrameworks.get(framework);
      return fw ? [fw] : [];
    }
    return Array.from(this.complianceFrameworks.values());
  }

  async updateComplianceRequirement(
    framework: string,
    requirementId: string,
    updates: Partial<ComplianceRequirement>
  ): Promise<boolean> {
    const fw = this.complianceFrameworks.get(framework);
    if (!fw) return false;

    const requirement = fw.requirements.find(r => r.id === requirementId);
    if (!requirement) return false;

    Object.assign(requirement, updates);
    requirement.lastVerified = new Date();

    // Recalculate framework score
    fw.score = this.calculateComplianceScore(fw);

    return true;
  }

  private calculateComplianceScore(framework: ComplianceFramework): number {
    const requirements = framework.requirements;
    const totalWeight = requirements.length * 100;
    
    const score = requirements.reduce((sum, req) => {
      switch (req.status) {
        case 'implemented': return sum + 100;
        case 'partial': return sum + 50;
        case 'missing': return sum + 0;
        default: return sum;
      }
    }, 0);

    return Math.round(score / requirements.length);
  }

  // Data Retention Management
  async getDataRetentionPolicies(): Promise<DataRetentionPolicy[]> {
    return [
      {
        id: 'drp_001',
        dataType: 'Customer Personal Data',
        description: 'Personal data collected during account creation and service usage',
        retentionPeriod: 2555, // 7 years
        purpose: 'Service provision and legal compliance',
        legalBasis: 'Contract performance and legal obligation',
        automaticDeletion: true,
        encryptionRequired: true,
        backupRetention: 30,
        lastReviewed: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'drp_002',
        dataType: 'Transaction Logs',
        description: 'Logs of all financial transactions and system interactions',
        retentionPeriod: 2920, // 8 years
        purpose: 'Audit trail and regulatory compliance',
        legalBasis: 'Legal obligation',
        automaticDeletion: true,
        encryptionRequired: true,
        backupRetention: 90,
        lastReviewed: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  async scheduleDataDeletion(dataType: string, criteria: Record<string, any>): Promise<string> {
    const deletionId = `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Scheduling data deletion: ${dataType}`, criteria);
    
    // In production, this would:
    // 1. Create a deletion job in the queue
    // 2. Verify the data meets retention criteria
    // 3. Schedule the deletion with proper audit logging
    
    return deletionId;
  }

  // Audit Buffer Management
  private startAuditBufferFlush(): void {
    setInterval(() => {
      this.flushAuditBuffer();
    }, 30000); // Flush every 30 seconds
  }

  private async flushAuditBuffer(): Promise<void> {
    if (this.auditBuffer.length === 0) return;

    const eventsToFlush = [...this.auditBuffer];
    this.auditBuffer = [];

    try {
      // In production, this would batch insert to the audit database
      console.log(`Flushing ${eventsToFlush.length} audit events to database`);
      
      // Store in Supabase or dedicated audit database
      for (const event of eventsToFlush) {
        await this.storeAuditEvent(event);
      }
    } catch (error) {
      console.error('Failed to flush audit buffer:', error);
      // Re-add events to buffer for retry
      this.auditBuffer.unshift(...eventsToFlush);
    }
  }

  private async storeAuditEvent(event: AuditEvent): Promise<void> {
    // In production, store in secure, immutable audit database
    console.log('Storing audit event:', {
      id: event.id,
      action: event.action,
      resource: event.resource,
      outcome: event.outcome
    });
  }

  // Compliance Reporting
  async generateComplianceReport(framework: string): Promise<any> {
    const fw = this.complianceFrameworks.get(framework);
    if (!fw) throw new Error(`Unknown compliance framework: ${framework}`);

    const implementedReqs = fw.requirements.filter(r => r.status === 'implemented').length;
    const partialReqs = fw.requirements.filter(r => r.status === 'partial').length;
    const missingReqs = fw.requirements.filter(r => r.status === 'missing').length;

    return {
      framework: fw.name,
      version: fw.version,
      assessmentDate: new Date(),
      overallStatus: fw.status,
      score: fw.score,
      summary: {
        totalRequirements: fw.requirements.length,
        implemented: implementedReqs,
        partial: partialReqs,
        missing: missingReqs,
        compliancePercentage: Math.round((implementedReqs / fw.requirements.length) * 100)
      },
      requirements: fw.requirements.map(req => ({
        id: req.id,
        category: req.category,
        requirement: req.requirement,
        status: req.status,
        lastVerified: req.lastVerified,
        evidence: req.evidence
      })),
      nextActions: fw.requirements
        .filter(req => req.status !== 'implemented')
        .map(req => ({
          requirement: req.requirement,
          remediation: req.remediation,
          priority: req.mandatory ? 'high' : 'medium'
        }))
    };
  }
}

export default AuditService.getInstance();