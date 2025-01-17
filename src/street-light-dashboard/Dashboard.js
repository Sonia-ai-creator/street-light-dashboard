import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Chip, IconButton, Snackbar, Alert, Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CSVLink } from 'react-csv';

export default function StreetLightDashboard() {
  const [streetData, setStreetData] = useState([]);
  const [summary, setSummary] = useState({ totalLights: 0, alerts: 0, zones: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Fetch data periodically
  useEffect(() => {
    const fetchData = () => {
      axios.get('https://api.example.com/street-lights') // Replace with your API
        .then(response => {
          setStreetData(response.data);
          calculateSummary(response.data);
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Calculate summary
  const calculateSummary = (data) => {
    const totalLights = data.length;
    const alerts = data.filter(light => light.status === 'Needs Maintenance').length;
    const zones = new Set(data.map(light => light.zone)).size;
    setSummary({ totalLights, alerts, zones });

    if (alerts > 5) setShowAlert(true);
  };

  // Filtered data based on search
  const filteredData = streetData.filter(light =>
    light.street.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusChip = (status) => {
    let color = 'default';
    if (status === 'Operational') color = 'success';
    else if (status === 'Under Maintenance') color = 'warning';
    else if (status === 'Needs Maintenance') color = 'error';

    return <Chip label={status} color={color} />;
  };

  return (
    <div style={{ padding: 20, backgroundColor: darkMode ? '#121212' : '#fff', color: darkMode ? '#fff' : '#000' }}>
      {/* Dark Mode Toggle */}
      <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: 20 }}>
        <Typography variant="h4">Street Light Monitoring Dashboard</Typography>
        <IconButton onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Grid>

      {/* Summary */}
      <Grid container spacing={4} style={{ marginBottom: 20 }}>
        <Grid item xs={4}>
          <Typography variant="h6">Total Lights: {summary.totalLights}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">Alerts: {summary.alerts}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">Zones: {summary.zones}</Typography>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item xs={12}>
          <TextField
            label="Search by Street Name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Export Button */}
      <Grid container justifyContent="flex-end" style={{ marginBottom: 20 }}>
        <CSVLink data={streetData} filename="street-lights-data.csv">
          <Button variant="contained" color="primary">Export to CSV</Button>
        </CSVLink>
      </Grid>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Street</TableCell>
            <TableCell>Zone</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Power (kWh)</TableCell>
            <TableCell>Uptime (hrs)</TableCell>
            <TableCell>Next Repair (days)</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((light, index) => (
            <TableRow key={index}>
              <TableCell>{light.id}</TableCell>
              <TableCell>{light.street}</TableCell>
              <TableCell>{light.zone}</TableCell>
              <TableCell>{getStatusChip(light.status)}</TableCell>
              <TableCell>{light.energy}</TableCell>
              <TableCell>{light.uptime}</TableCell>
              <TableCell>{light.nextRepair}</TableCell>
              <TableCell>{light.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Charts */}
      <Grid container spacing={4} style={{ marginTop: 20 }}>
        <Grid item xs={6}>
          <Typography variant="h6">Street Lights by Zone</Typography>
          <BarChart width={500} height={300} data={summary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="lights" fill="#4CAF50" animationDuration={800} />
          </BarChart>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Uptime vs. Energy Consumption</Typography>
          <LineChart width={500} height={300} data={streetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="street" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="uptime" stroke="#2196F3" animationDuration={800} />
            <Line type="monotone" dataKey="energy" stroke="#FF5722" animationDuration={800} />
          </LineChart>
        </Grid>
      </Grid>

      {/* Snackbar Alert */}
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={() => setShowAlert(false)}>
        <Alert onClose={() => setShowAlert(false)} severity="warning" variant="filled">
          High number of maintenance alerts detected!
        </Alert>
      </Snackbar>
    </div>
  );
}
