const ticketTools = require('../tools/ticketTools');
const config = require('../config');

class SofiaAgent {
  constructor() {
    this.name = config.agent.name;
    this.version = config.agent.version;
    this.tools = ticketTools;
  }

  /**
   * Process a natural language request
   * @param {Object} request - The request object
   * @returns {Promise<Object>} Response from the agent
   */
  async processRequest(request) {
    try {
      const { action, data } = request;

      console.log(`[${this.name}] Processing action: ${action}`);

      switch (action) {
        case 'createTicket':
          return await this.handleCreateTicket(data);
        
        case 'getTicket':
          return await this.handleGetTicket(data);
        
        case 'assignTicket':
          return await this.handleAssignTicket(data);
        
        case 'searchTickets':
          return await this.handleSearchTickets(data);
        
        case 'updateTicketStatus':
          return await this.handleUpdateTicketStatus(data);
        
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`[${this.name}] Error processing request:`, error.message);
      return {
        success: false,
        error: error.message,
        agent: this.name,
        version: this.version,
      };
    }
  }

  /**
   * Handle ticket creation
   * @param {Object} data - Ticket data
   * @returns {Promise<Object>} Creation result
   */
  async handleCreateTicket(data) {
    try {
      const result = await this.tools.createTicket(data);
      return {
        success: true,
        action: 'createTicket',
        result: result,
        message: `Ticket created successfully with ID: ${result.ticketId}`,
        agent: this.name,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle get ticket
   * @param {Object} data - Request data with ticketId
   * @returns {Promise<Object>} Ticket information
   */
  async handleGetTicket(data) {
    try {
      const result = await this.tools.getTicket(data.ticketId);
      return {
        success: true,
        action: 'getTicket',
        result: result,
        message: `Ticket ${data.ticketId} retrieved successfully`,
        agent: this.name,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle ticket assignment
   * @param {Object} data - Assignment data
   * @returns {Promise<Object>} Assignment result
   */
  async handleAssignTicket(data) {
    try {
      const result = await this.tools.assignTicket(
        data.ticketId,
        data.technicianName,
        data.subject
      );
      return {
        success: true,
        action: 'assignTicket',
        result: result,
        message: `Ticket ${data.ticketId} assigned to ${data.technicianName}`,
        agent: this.name,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle ticket search
   * @param {Object} data - Search parameters
   * @returns {Promise<Object>} Search results
   */
  async handleSearchTickets(data) {
    try {
      const result = await this.tools.searchTickets(data);
      return {
        success: true,
        action: 'searchTickets',
        result: result,
        message: `Found ${result.count} tickets`,
        agent: this.name,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle ticket status update
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Update result
   */
  async handleUpdateTicketStatus(data) {
    try {
      const result = await this.tools.updateTicketStatus(
        data.ticketId,
        data.status,
        data.subject
      );
      return {
        success: true,
        action: 'updateTicketStatus',
        result: result,
        message: `Ticket ${data.ticketId} status updated to ${data.status}`,
        agent: this.name,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get agent information
   * @returns {Object} Agent information
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      capabilities: [
        'createTicket',
        'getTicket',
        'assignTicket',
        'searchTickets',
        'updateTicketStatus',
      ],
      status: 'ready',
    };
  }
}

module.exports = new SofiaAgent();
