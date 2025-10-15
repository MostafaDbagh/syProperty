const fs = require('fs');
const path = require('path');

class SecurityMonitor {
  constructor() {
    this.logFile = path.join(__dirname, 'logs', 'security.log');
    this.suspiciousActivities = [];
    this.blockedIPs = new Set();
    this.failedAttempts = new Map();
    
    // Ensure logs directory exists
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  logSecurityEvent(event) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      ...event
    };

    // Write to log file
    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');

    // Store in memory for analysis
    this.suspiciousActivities.push(logEntry);

    // Keep only last 1000 entries in memory
    if (this.suspiciousActivities.length > 1000) {
      this.suspiciousActivities = this.suspiciousActivities.slice(-1000);
    }

    console.log(`Security Event: ${event.type} - ${event.message}`);
  }

  trackFailedLogin(ip, email) {
    const key = `${ip}:${email}`;
    const attempts = this.failedAttempts.get(key) || 0;
    this.failedAttempts.set(key, attempts + 1);

    if (attempts + 1 >= 5) {
      this.blockedIPs.add(ip);
      this.logSecurityEvent({
        type: 'BRUTE_FORCE_ATTEMPT',
        message: `IP ${ip} blocked due to multiple failed login attempts`,
        ip,
        email,
        attempts: attempts + 1
      });
    }
  }

  trackSuspiciousActivity(req, reason) {
    this.logSecurityEvent({
      type: 'SUSPICIOUS_ACTIVITY',
      message: reason,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      headers: req.headers
    });
  }

  isIPBlocked(ip) {
    return this.blockedIPs.has(ip);
  }

  analyzePatterns() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    // Analyze recent activities
    const recentActivities = this.suspiciousActivities.filter(
      activity => new Date(activity.timestamp).getTime() > oneHourAgo
    );

    // Count activities by IP
    const ipCounts = {};
    recentActivities.forEach(activity => {
      if (activity.ip) {
        ipCounts[activity.ip] = (ipCounts[activity.ip] || 0) + 1;
      }
    });

    // Block IPs with too many suspicious activities
    Object.entries(ipCounts).forEach(([ip, count]) => {
      if (count > 20) {
        this.blockedIPs.add(ip);
        this.logSecurityEvent({
          type: 'AUTO_BLOCK',
          message: `IP ${ip} automatically blocked due to suspicious activity pattern`,
          ip,
          activityCount: count
        });
      }
    });
  }

  generateSecurityReport() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentActivities = this.suspiciousActivities.filter(
      activity => new Date(activity.timestamp) > oneDayAgo
    );

    const report = {
      timestamp: now.toISOString(),
      totalActivities: recentActivities.length,
      blockedIPs: this.blockedIPs.size,
      activityTypes: {},
      topSuspiciousIPs: {},
      recommendations: []
    };

    // Count activity types
    recentActivities.forEach(activity => {
      report.activityTypes[activity.type] = (report.activityTypes[activity.type] || 0) + 1;
      
      if (activity.ip) {
        report.topSuspiciousIPs[activity.ip] = (report.topSuspiciousIPs[activity.ip] || 0) + 1;
      }
    });

    // Generate recommendations
    if (report.activityTypes.BRUTE_FORCE_ATTEMPT > 10) {
      report.recommendations.push('Consider implementing CAPTCHA for login attempts');
    }

    if (report.activityTypes.SUSPICIOUS_ACTIVITY > 50) {
      report.recommendations.push('Review and tighten input validation rules');
    }

    if (Object.keys(report.topSuspiciousIPs).length > 5) {
      report.recommendations.push('Consider implementing IP whitelisting for sensitive endpoints');
    }

    return report;
  }

  // Clean up old logs (run this periodically)
  cleanupOldLogs() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    this.suspiciousActivities = this.suspiciousActivities.filter(
      activity => new Date(activity.timestamp) > oneWeekAgo
    );

    // Clean up log file (keep last 10000 lines)
    if (fs.existsSync(this.logFile)) {
      const lines = fs.readFileSync(this.logFile, 'utf8').split('\n');
      if (lines.length > 10000) {
        const recentLines = lines.slice(-10000);
        fs.writeFileSync(this.logFile, recentLines.join('\n'));
      }
    }
  }
}

// Create global instance
const securityMonitor = new SecurityMonitor();

// Run analysis every hour
setInterval(() => {
  securityMonitor.analyzePatterns();
}, 60 * 60 * 1000);

// Clean up old logs daily
setInterval(() => {
  securityMonitor.cleanupOldLogs();
}, 24 * 60 * 60 * 1000);

module.exports = securityMonitor;
