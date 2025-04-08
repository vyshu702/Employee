import React, { useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  LineChart, Line,
  ScatterChart, Scatter,
  Legend, ResponsiveContainer
} from "recharts";
import './Dashboard.css';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard({ data }) {
  const defaultFilters = {
    city: "",
    gender: "",
    education: "",
    tier: "",
    benched: "",
    age: "",
    joiningYear: "",
    experience: ""
  };

  const [filters, setFilters] = useState(defaultFilters);

  const handleClick = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value
    }));
  };

  const applyFilters = (data) => {
    return data.filter((d) =>
      (!filters.city || d.City === filters.city) &&
      (!filters.gender || d.Gender === filters.gender) &&
      (!filters.education || d.Education === filters.education) &&
      (!filters.tier || String(d.PaymentTier) === filters.tier) &&
      (!filters.benched || d.EverBenched === filters.benched) &&
      (!filters.age || String(d.Age) === String(filters.age)) &&
      (!filters.joiningYear || String(d.JoiningYear) === String(filters.joiningYear)) &&
      (!filters.experience || String(d.ExperienceInCurrentDomain) === String(filters.experience))
    );
  };

  const filtered = applyFilters(data);
  const unique = (key) => [...new Set(data.map((d) => d[key]))];

  const groupBy = (key) => {
    const map = {};
    filtered.forEach((item) => {
      const value = item[key];
      map[value] = (map[value] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
  };

  const expAgeData = filtered.map((d, i) => ({
    x: d.Age,
    y: d.ExperienceInCurrentDomain,
    z: d.PaymentTier,
    id: i,
  }));

  const tierAgeExpData = [...new Set(filtered.map((d) => d.PaymentTier))].map((tier) => {
    const filteredTier = filtered.filter((d) => d.PaymentTier === tier);
    const avgAge = filteredTier.reduce((sum, d) => sum + d.Age, 0) / filteredTier.length;
    const avgExp = filteredTier.reduce((sum, d) => sum + d.ExperienceInCurrentDomain, 0) / filteredTier.length;
    return { tier: `Tier ${tier}`, avgAge, avgExp };
  });

  const joiningTrend = groupBy("JoiningYear").sort((a, b) => a.name - b.name);
  const genderData = groupBy("Gender");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="dashboard-filters" style={{ textAlign: "center" }}>
        <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
          <option value="">All Cities</option>
          {unique("City").map((val) => <option key={val}>{val}</option>)}
        </select>
        <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
          <option value="">All Genders</option>
          {unique("Gender").map((val) => <option key={val}>{val}</option>)}
        </select>
        <select value={filters.education} onChange={(e) => setFilters({ ...filters, education: e.target.value })}>
          <option value="">All Education</option>
          {unique("Education").map((val) => <option key={val}>{val}</option>)}
        </select>
        <select value={filters.tier} onChange={(e) => setFilters({ ...filters, tier: e.target.value })}>
          <option value="">All Tiers</option>
          {unique("PaymentTier").map((val) => <option key={val}>{val}</option>)}
        </select>
        <select value={filters.benched} onChange={(e) => setFilters({ ...filters, benched: e.target.value })}>
          <option value="">Benched?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <select value={filters.joiningYear} onChange={(e) => setFilters({ ...filters, joiningYear: e.target.value })}>
          <option value="">All Years</option>
          {unique("JoiningYear").map((val) => <option key={val}>{val}</option>)}
        </select>
        <select value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })}>
          <option value="">All Experience</option>
          {unique("ExperienceInCurrentDomain").sort((a, b) => a - b).map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>
      </div>

      <button className="reset-button" onClick={() => setFilters(defaultFilters)}>Reset Filters</button>

      <div className="dashboard-grid">
        <div className="chart-card"><h3>Total Employees</h3><p>{filtered.length}</p></div>
        <div className="chart-card"><h3>Average Age</h3><p>{(filtered.reduce((sum, d) => sum + d.Age, 0) / filtered.length || 0).toFixed(1)}</p></div>
        <div className="chart-card"><h3>Avg Experience</h3><p>{(filtered.reduce((sum, d) => sum + d.ExperienceInCurrentDomain, 0) / filtered.length || 0).toFixed(1)}</p></div>
        <div className="chart-card"><h3>Benched Employees</h3><p>{filtered.filter((d) => d.EverBenched === "Yes").length}</p></div>
      </div>

      <div className="charts-wrapper">
        <div className="chart-card">
          <h2>Employee Attendance and Leaves</h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: "Present", value: filtered.filter(d => d.EverBenched === "No").length },
                  { name: "Leave", value: filtered.filter(d => d.EverBenched === "Yes").length }
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                <Cell fill="#00C49F" onClick={() => handleClick("benched", "No")} style={{ cursor: "pointer" }} />
                <Cell fill="#FF8042" onClick={() => handleClick("benched", "Yes")} style={{ cursor: "pointer" }} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Employee Education Distribution</h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={groupBy("Education")} dataKey="value" nameKey="name" outerRadius={80} label>
                {groupBy("Education").map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} onClick={() => handleClick("education", entry.name)} style={{ cursor: "pointer" }} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Employee Experience and Age Distribution</h2>
          <ResponsiveContainer>
            <ScatterChart
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload.length) {
                  const { x, y } = e.activePayload[0].payload;
                  setFilters((prev) => ({
                    ...prev,
                    age: String(x),
                    experience: String(y),
                  }));
                }
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="x" name="Age" />
              <YAxis dataKey="y" name="Experience" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Employees" data={expAgeData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Avg Age & Exp by Tier</h2>
          <ResponsiveContainer>
            <BarChart
              data={tierAgeExpData}
              onClick={(e) => {
                if (e && e.activeLabel) {
                  const selectedTier = e.activeLabel.split(" ")[1]; // Extracts number from "Tier 1", "Tier 2", etc.
                  setFilters((prev) => ({
                    ...prev,
                    tier: selectedTier
                  }));
                }
              }}
            >
              <XAxis dataKey="tier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgAge" fill="#82ca9d" name="Avg Age" />
              <Bar dataKey="avgExp" fill="#8884d8" name="Avg Exp" />
            </BarChart>
          </ResponsiveContainer>
        </div>


        <div className="chart-card">
          <h2>Joining Year Trend</h2>
          <ResponsiveContainer>
            <LineChart
              data={joiningTrend}
              onClick={(e) => {
                if (e && e.activeLabel) {
                  handleClick("joiningYear", String(e.activeLabel));
                }
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Gender Distribution</h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>
                {genderData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} onClick={() => handleClick("gender", entry.name)} style={{ cursor: "pointer" }} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
