const sdpService = require('../services/sdpService');
const teamsService = require('../services/teamsService');

class TicketTools {
  /**
   * Create a new ticket with notification
   * @param {Object} ticketData - Ticket information
   * @returns {Promise<Object>} Result of ticket creation
   */
  async createTicket(ticketData) {
    try {
      // Validate required fields
      if (!ticketData.subject) {
        throw new Error('Ticket subject is required');
      }
      if (!ticketData.description) {
        throw new Error('Ticket description is required');
      }

      // Create ticket in SDP
      const result = await sdpService.createTicket(ticketData);

      // Send notification to Teams
      if (result.success) {
        try {
          await teamsService.notifyTicketCreated({
            ticketId: result.ticketId,
            subject: ticketData.subject,
            priority: ticketData.priority,
            status: ticketData.status,
            requester: ticketData.requesterName || ticketData.requesterEmail,
          });
        } catch (notificationError) {
          console.warn('Failed to send notification:', notificationError.message);
          // Don't fail the entire operation if notification fails
        }
      }

      return result;
    } catch (error) {
      console.error('Error in createTicket tool:', error.message);
      
      // Notify error to Teams
      try {
        await teamsService.notifyError({
          message: error.message,
          operation: 'createTicket',
        });
      } catch (notificationError) {
        console.warn('Failed to send error notification:', notificationError.message);
      }

      throw error;
    }
  }

  /**
   * Get ticket details
   * @param {string} ticketId - The ticket ID
   * @returns {Promise<Object>} Ticket information
   */
  async getTicket(ticketId) {
    try {
      if (!ticketId) {
        throw new Error('Ticket ID is required');
      }

      const result = await sdpService.getTicket(ticketId);
      return result;
    } catch (error) {
      console.error('Error in getTicket tool:', error.message);
      throw error;
    }
  }

  /**
   * Assign a ticket to a technician with notification
   * @param {string} ticketId - The ticket ID
   * @param {string} technicianName - The technician name
   * @param {string} subject - Optional ticket subject for notification
   * @returns {Promise<Object>} Result of assignment
   */
  async assignTicket(ticketId, technicianName, subject = '') {
    try {
      if (!ticketId) {
        throw new Error('Ticket ID is required');
      }
      if (!technicianName) {
        throw new Error('Technician name is required');
      }

      // Assign ticket in SDP
      const result = await sdpService.assignTicket(ticketId, technicianName);

      // Send notification to Teams
      if (result.success) {
        try {
          await teamsService.notifyTicketAssigned({
            ticketId: ticketId,
            technician: technicianName,
            subject: subject || 'Ticket assigned',
          });
        } catch (notificationError) {
          console.warn('Failed to send notification:', notificationError.message);
        }
      }

      return result;
    } catch (error) {
      console.error('Error in assignTicket tool:', error.message);
      
      // Notify error to Teams
      try {
        await teamsService.notifyError({
          message: error.message,
          operation: 'assignTicket',
        });
      } catch (notificationError) {
        console.warn('Failed to send error notification:', notificationError.message);
      }

      throw error;
    }
  }

  /**
   * Search for tickets
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results
   */
  async searchTickets(searchParams = {}) {
    try {
      const result = await sdpService.searchTickets(searchParams);
      return result;
    } catch (error) {
      console.error('Error in searchTickets tool:', error.message);
      throw error;
    }
  }

  /**
   * Update ticket status with notification
   * @param {string} ticketId - The ticket ID
   * @param {string} status - New status
   * @param {string} subject - Optional ticket subject for notification
   * @returns {Promise<Object>} Result of update
   */
  async updateTicketStatus(ticketId, status, subject = '') {
    try {
      if (!ticketId) {
        throw new Error('Ticket ID is required');
      }
      if (!status) {
        throw new Error('Status is required');
      }

      // Update status in SDP
      const result = await sdpService.updateTicketStatus(ticketId, status);

      // Send notification to Teams
      if (result.success) {
        try {
          await teamsService.notifyTicketUpdated({
            ticketId: ticketId,
            status: status,
            subject: subject || 'Ticket updated',
          });
        } catch (notificationError) {
          console.warn('Failed to send notification:', notificationError.message);
        }
      }

      return result;
    } catch (error) {
      console.error('Error in updateTicketStatus tool:', error.message);
      
      // Notify error to Teams
      try {
        await teamsService.notifyError({
          message: error.message,
          operation: 'updateTicketStatus',
        });
      } catch (notificationError) {
        console.warn('Failed to send error notification:', notificationError.message);
      }

      throw error;
    }
  }
}

module.exports = new TicketTools();
