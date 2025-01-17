import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import './BhubaneswarStreetLightDashboard.css'; // Optional CSS file for styling

const BhubaneswarStreetLightDashboard = () => {
  // State for street light data
  const [streetLights, setStreetLights] = useState({
    totalLights: 500,
    totalEnergy: 1200, // in kWh
    alerts: 15,
  });

  // State for selected zone and street
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedStreet, setSelectedStreet] = useState('all');

  const zones = [
    { value: 'all', label: 'All Zones' },
    { value: 'north', label: 'North Bhubaneswar' },
    { value: 'south', label: 'South Bhubaneswar' },
    { value: 'central', label: 'Central Bhubaneswar' },
    { value: 'old_town', label: 'Old Town' },
    { value: 'chandrasekharpur', label: 'Chandrasekharpur' },
  ];

  // Sample data for charts
  const zoneStatusData = [
    { name: 'North Bhubaneswar', operational: 80, maintenance: 5 },
    { name: 'South Bhubaneswar', operational: 75, maintenance: 10 },
    { name: 'Central Bhubaneswar', operational: 90, maintenance: 3 },
  ];

  const uptimeData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    uptime: Math.floor(Math.random() * 2) + 98,
  }));

  return (
    <div className="dashboard-container">
      <h1>Bhubaneswar Street Light Monitoring Dashboard</h1>

      {/* Filters */}
      <div className="filters">
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
        >
          {zones.map((zone) => (
            <option key={zone.value} value={zone.value}>
              {zone.label}
            </option>
          ))}
        </select>

        <select
          value={selectedStreet}
          onChange={(e) => setSelectedStreet(e.target.value)}
        >
          <option value="all">All Streets</option>
          {/* Add more street options dynamically */}
        </select>
      </div>

      {/* Display Summary Data */}
      <div className="summary">
        <h2>Total Lights: {streetLights.totalLights}</h2>
        <h2>Total Energy (kWh): {streetLights.totalEnergy}</h2>
        <h2>Maintenance Alerts: {streetLights.alerts}</h2>
      </div>

      {/* Charts */}
      <div className="charts">
        <BarChart width={500} height={300} data={zoneStatusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="operational" fill="#4CAF50" />
          <Bar dataKey="maintenance" fill="#FF9800" />
        </BarChart>

        <LineChart width={500} height={300} data={uptimeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis domain={[95, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="uptime" stroke="#2196F3" />
        </LineChart>
      </div>
    </div>
  );
};

export default BhubaneswarStreetLightDashboard;
