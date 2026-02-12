const axios = require('axios');
const config = require('../config');

class TeamsService {
  constructor() {
    this.webhookUrl = config.teams.webhookUrl;
  }

  /**
   * Send a notification to Microsoft Teams
   * @param {Object} notification - Notification data
   * @returns {Promise<Object>} Response from Teams
   */
  async sendNotification(notification) {
    try {
      const card = this.createAdaptiveCard(notification);
      
      const response = await axios.post(this.webhookUrl, card, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        message: 'Notification sent successfully',
        status: response.status,
      };
    } catch (error) {
      console.error('Error sending Teams notification:', error.message);
      throw new Error(`Failed to send Teams notification: ${error.message}`);
    }
  }

  /**
   * Send ticket creation notification
   * @param {Object} ticketData - Ticket information
   * @returns {Promise<Object>} Response from Teams
   */
  async notifyTicketCreated(ticketData) {
    const notification = {
      title: '🎫 New Ticket Created',
      summary: `Ticket ${ticketData.ticketId} has been created`,
      color: 'good',
      facts: [
        { name: 'Ticket ID', value: ticketData.ticketId || 'N/A' },
        { name: 'Subject', value: ticketData.subject || 'N/A' },
        { name: 'Priority', value: ticketData.priority || 'Normal' },
        { name: 'Status', value: ticketData.status || 'Open' },
        { name: 'Requester', value: ticketData.requester || 'N/A' },
      ],
    };

    return await this.sendNotification(notification);
  }

  /**
   * Send ticket assignment notification
   * @param {Object} assignmentData - Assignment information
   * @returns {Promise<Object>} Response from Teams
   */
  async notifyTicketAssigned(assignmentData) {
    const notification = {
      title: '👤 Ticket Assigned',
      summary: `Ticket ${assignmentData.ticketId} has been assigned`,
      color: 'accent',
      facts: [
        { name: 'Ticket ID', value: assignmentData.ticketId || 'N/A' },
        { name: 'Assigned To', value: assignmentData.technician || 'N/A' },
        { name: 'Subject', value: assignmentData.subject || 'N/A' },
      ],
    };

    return await this.sendNotification(notification);
  }

  /**
   * Send ticket status update notification
   * @param {Object} updateData - Update information
   * @returns {Promise<Object>} Response from Teams
   */
  async notifyTicketUpdated(updateData) {
    const notification = {
      title: '🔄 Ticket Status Updated',
      summary: `Ticket ${updateData.ticketId} status has been updated`,
      color: 'warning',
      facts: [
        { name: 'Ticket ID', value: updateData.ticketId || 'N/A' },
        { name: 'New Status', value: updateData.status || 'N/A' },
        { name: 'Subject', value: updateData.subject || 'N/A' },
      ],
    };

    return await this.sendNotification(notification);
  }

  /**
   * Send error notification
   * @param {Object} errorData - Error information
   * @returns {Promise<Object>} Response from Teams
   */
  async notifyError(errorData) {
    const notification = {
      title: '❌ Error Occurred',
      summary: 'An error occurred in Sofia Agent',
      color: 'attention',
      facts: [
        { name: 'Error', value: errorData.message || 'Unknown error' },
        { name: 'Operation', value: errorData.operation || 'N/A' },
        { name: 'Timestamp', value: new Date().toISOString() },
      ],
    };

    return await this.sendNotification(notification);
  }

  /**
   * Create an Adaptive Card for Teams
   * @param {Object} notification - Notification data
   * @returns {Object} Adaptive card
   */
  createAdaptiveCard(notification) {
    return {
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          content: {
            type: 'AdaptiveCard',
            version: '1.4',
            body: [
              {
                type: 'TextBlock',
                text: notification.title,
                weight: 'bolder',
                size: 'large',
                color: notification.color === 'attention' ? 'attention' : 'default',
              },
              {
                type: 'TextBlock',
                text: notification.summary,
                wrap: true,
                spacing: 'small',
              },
              {
                type: 'FactSet',
                facts: notification.facts.map(fact => ({
                  title: fact.name,
                  value: String(fact.value),
                })),
                spacing: 'medium',
              },
            ],
          },
        },
      ],
    };
  }
}

module.exports = new TeamsService();
