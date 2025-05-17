import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import Navigation from "./components/Navigation";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const BT_LABELS = ["BT 1 - Remember", "BT 2 - Understand", "BT 3 - Apply", "BT 4 - Analyze", "BT 5 - Evaluate", "BT 6 - Create"];
const BT_COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE", "#EFF6FF"];

type BTDataItem = {
  year: string;
  course_code: string;
  BT_level: number;
  count: number;
};

type BTDistribution = {
  [key: string]: number;
};

const API_BASE = "http://localhost:8000";

const Bloom: React.FC = () => {
  const [allData, setAllData] = useState<BTDataItem[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [btDistribution, setBtDistribution] = useState<BTDistribution>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/bt_level_distribution_all`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        const items: BTDataItem[] = data.bt_level_distribution_per_year_course;
        const uniqueYears = Array.from(new Set(items.map(item => item.year))).sort();
        
        setAllData(items);
        setYears(uniqueYears);
        setSelectedYear(uniqueYears[0] || "");
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedYear || allData.length === 0) return;

    const distribution = allData
      .filter(item => item.year === selectedYear)
      .reduce((acc, item) => {
        const level = item.BT_level.toString();
        acc[level] = (acc[level] || 0) + item.count;
        return acc;
      }, {} as BTDistribution);

    const fullDistribution: BTDistribution = {};
    for (let i = 1; i <= 6; i++) {
      fullDistribution[i.toString()] = distribution[i.toString()] || 0;
    }

    setBtDistribution(fullDistribution);
  }, [selectedYear, allData]);

  const chartData = {
    labels: BT_LABELS,
    datasets: [{
      label: "Number of Questions",
      data: BT_LABELS.map((_, i) => btDistribution[(i + 1).toString()] || 0),
      backgroundColor: BT_COLORS,
      borderWidth: 1,
    }],
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Bloom's Taxonomy Distribution</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={loading || years.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-4">
              <span className="text-gray-500">Loading data...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6">
              {years.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No data available
                </div>
              ) : (
                <div className="relative h-96">
                  <Pie
                    data={chartData}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: `Distribution for ${selectedYear}`,
                          font: { size: 16 }
                        },
                        legend: {
                          position: "bottom",
                          labels: {
                            boxWidth: 20,
                            padding: 15
                          }
                        }
                      },
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Bloom;
