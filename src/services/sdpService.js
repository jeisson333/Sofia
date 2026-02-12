const axios = require('axios');
const config = require('../config');

class SDPService {
  constructor() {
    this.baseUrl = config.sdp.baseUrl;
    this.apiKey = config.sdp.apiKey;
    this.technicianKey = config.sdp.technicianKey;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'TECHNICIAN_KEY': this.technicianKey,
      },
    });
  }

  /**
   * Create a new ticket in ServiceDesk Plus
   * @param {Object} ticketData - The ticket data
   * @returns {Promise<Object>} Created ticket information
   */
  async createTicket(ticketData) {
    try {
      const requestData = {
        request: {
          subject: ticketData.subject,
          description: ticketData.description,
          requester: {
            name: ticketData.requesterName || 'Sofia Agent',
            email_id: ticketData.requesterEmail,
          },
          priority: {
            name: ticketData.priority || 'Normal',
          },
          status: {
            name: ticketData.status || 'Open',
          },
        },
      };

      const response = await this.client.post('/api/v3/requests', {
        input_data: JSON.stringify(requestData),
      });

      return {
        success: true,
        data: response.data,
        ticketId: response.data?.request?.id,
      };
    } catch (error) {
      console.error('Error creating ticket:', error.message);
      throw new Error(`Failed to create ticket: ${error.message}`);
    }
  }

  /**
   * Get ticket details by ID
   * @param {string} ticketId - The ticket ID
   * @returns {Promise<Object>} Ticket information
   */
  async getTicket(ticketId) {
    try {
      const response = await this.client.get(`/api/v3/requests/${ticketId}`);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error getting ticket:', error.message);
      throw new Error(`Failed to get ticket ${ticketId}: ${error.message}`);
    }
  }

  /**
   * Assign a ticket to a technician
   * @param {string} ticketId - The ticket ID
   * @param {string} technicianName - The technician name
   * @returns {Promise<Object>} Updated ticket information
   */
  async assignTicket(ticketId, technicianName) {
    try {
      const requestData = {
        request: {
          technician: {
            name: technicianName,
          },
        },
      };

      const response = await this.client.put(`/api/v3/requests/${ticketId}`, {
        input_data: JSON.stringify(requestData),
      });

      return {
        success: true,
        data: response.data,
        message: `Ticket ${ticketId} assigned to ${technicianName}`,
      };
    } catch (error) {
      console.error('Error assigning ticket:', error.message);
      throw new Error(`Failed to assign ticket ${ticketId}: ${error.message}`);
    }
  }

  /**
   * Search tickets based on criteria
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} List of tickets
   */
  async searchTickets(searchParams = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.status) {
        queryParams.append('status', searchParams.status);
      }
      if (searchParams.priority) {
        queryParams.append('priority', searchParams.priority);
      }
      if (searchParams.requester) {
        queryParams.append('requester', searchParams.requester);
      }

      const response = await this.client.get(`/api/v3/requests?${queryParams.toString()}`);
      
      return {
        success: true,
        data: response.data,
        count: response.data?.requests?.length || 0,
      };
    } catch (error) {
      console.error('Error searching tickets:', error.message);
      throw new Error(`Failed to search tickets: ${error.message}`);
    }
  }

  /**
   * Update ticket status
   * @param {string} ticketId - The ticket ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated ticket information
   */
  async updateTicketStatus(ticketId, status) {
    try {
      const requestData = {
        request: {
          status: {
            name: status,
          },
        },
      };

      const response = await this.client.put(`/api/v3/requests/${ticketId}`, {
        input_data: JSON.stringify(requestData),
      });

      return {
        success: true,
        data: response.data,
        message: `Ticket ${ticketId} status updated to ${status}`,
      };
    } catch (error) {
      console.error('Error updating ticket status:', error.message);
      throw new Error(`Failed to update ticket status: ${error.message}`);
    }
  }
}

module.exports = new SDPService();
