# Sofia - AI Virtual Agent

Sofía es un agente virtual desarrollado bajo arquitectura basada en Model Context Protocol (MCP), diseñado para automatizar y optimizar la gestión de tickets en ServiceDesk Plus (SDP), permitiendo consultar, crear, asignar y notificar incidencias directamente desde lenguaje natural.

## 🚀 Features

- **ServiceDesk Plus Integration**: Create, consult, assign, and update tickets via REST API
- **Microsoft Teams Notifications**: Real-time notifications using Incoming Webhooks
- **Clean Architecture**: Modular design with agent, tools, services, and config layers
- **Async/Await**: Modern asynchronous programming patterns
- **Error Handling**: Comprehensive error handling and logging
- **Environment Configuration**: Secure configuration via environment variables

## 📋 Requirements

- Node.js 18.x or higher (LTS recommended)
- ServiceDesk Plus account with API access
- Microsoft Teams Incoming Webhook URL

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/jeisson333/Sofia.git
cd Sofia
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your credentials:
```env
# ServiceDesk Plus Configuration
SDP_BASE_URL=https://your-sdp-instance.com
SDP_API_KEY=your_sdp_api_key_here
SDP_TECHNICIAN_KEY=your_technician_key_here

# Microsoft Teams Configuration
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/your-webhook-url-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🚀 Usage

### Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`

### API Endpoints

#### Health Check
```bash
GET /health
```

#### Get Agent Information
```bash
GET /api/agent/info
```

#### Create a Ticket
```bash
POST /api/agent/tickets
Content-Type: application/json

{
  "subject": "Server not responding",
  "description": "The production server is not responding to requests",
  "priority": "High",
  "requesterName": "John Doe",
  "requesterEmail": "john.doe@example.com"
}
```

#### Get Ticket by ID
```bash
GET /api/agent/tickets/:ticketId
```

#### Search Tickets
```bash
GET /api/agent/tickets?status=Open&priority=High
```

#### Assign Ticket
```bash
PUT /api/agent/tickets/:ticketId/assign
Content-Type: application/json

{
  "technicianName": "Jane Smith",
  "subject": "Server issue"
}
```

#### Update Ticket Status
```bash
PUT /api/agent/tickets/:ticketId/status
Content-Type: application/json

{
  "status": "Resolved",
  "subject": "Server issue"
}
```

#### Process Custom Request
```bash
POST /api/agent/process
Content-Type: application/json

{
  "action": "createTicket",
  "data": {
    "subject": "Network issue",
    "description": "Unable to connect to network",
    "priority": "Normal"
  }
}
```

## 🏗️ Architecture

```
Sofia/
├── src/
│   ├── agent/          # Agent orchestration layer
│   │   └── sofia.js
│   ├── config/         # Configuration management
│   │   └── index.js
│   ├── routes/         # Express routes
│   │   └── agent.js
│   ├── services/       # External service integrations
│   │   ├── sdpService.js
│   │   └── teamsService.js
│   ├── tools/          # Business logic tools
│   │   └── ticketTools.js
│   └── server.js       # Express server setup
├── index.js            # Application entry point
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── package.json        # Project dependencies
```

## 🔧 Configuration

All configuration is managed through environment variables. See `.env.example` for required variables.

### ServiceDesk Plus API

To obtain your ServiceDesk Plus API credentials:
1. Log in to your ServiceDesk Plus instance
2. Navigate to Admin > API Key
3. Generate or copy your API key and Technician key

### Microsoft Teams Webhook

To create a Teams Incoming Webhook:
1. Open Microsoft Teams
2. Navigate to the channel where you want notifications
3. Click "..." > "Connectors" > "Incoming Webhook"
4. Configure and copy the webhook URL

## 📝 Examples

### Example: Create a high-priority ticket
```javascript
const response = await fetch('http://localhost:3000/api/agent/tickets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'Critical: Database connection error',
    description: 'Production database is unreachable',
    priority: 'High',
    requesterEmail: 'admin@example.com'
  })
});
```

### Example: Assign a ticket to a technician
```javascript
const response = await fetch('http://localhost:3000/api/agent/tickets/12345/assign', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    technicianName: 'Tech Support Team'
  })
});
```

## 🛡️ Error Handling

The application includes comprehensive error handling:
- Service-level error handling with detailed logging
- Tool-level validation and error propagation
- Agent-level error responses
- Teams notifications for critical errors
- Global Express error handler

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
