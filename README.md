# Release Planning Calendar

A modern, interactive release planning calendar application built with React and TypeScript. This application helps teams manage and visualize their release schedules with an intuitive calendar interface.

## Features

- 📅 Interactive calendar view with month and week layouts
- 🔄 Drag-and-drop release rescheduling
- ✨ Real-time status updates
- 🎯 Priority-based release visualization
- 📊 Business commitment tracking
- 🔍 Detailed release information modal
- 🎨 Color-coded status indicators
- 📱 Responsive design

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - FullCalendar
  - TailwindCSS
  - React Hot Toast
  - Lucide React Icons
  - Axios

- **Backend:**
  - Express.js
  - Node.js
  - File-based JSON storage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HarjeetHJ/release-planning.git
cd release-planning
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

### Development

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production

1. Build the frontend:
```bash
npm run build
```

2. Start the production servers using PM2:
```bash
pm2 start ecosystem.config.cjs
```

## Usage

- **View Releases**: Navigate through the calendar using the month/week view toggles
- **Create Release**: Click the "New Release" button to add a new release
- **Edit Release**: Click on any release in the calendar to edit its details
- **Reschedule Release**: Drag and drop releases to different dates
- **Filter View**: Toggle between month and week views using the view buttons

## Release Properties

- Title
- Project
- Engineering Manager
- Release Date
- Repository
- Status (Done/On Track/At Risk/Cancelled)
- Priority (High/Medium/Low)
- Business Commitment
- Business Commitment Date

## Project Structure

```
├── src/
│   ├── components/
│   │   └── ReleaseModal.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── data.ts
├── server/
│   ├── server.ts
│   └── db.json
└── public/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details