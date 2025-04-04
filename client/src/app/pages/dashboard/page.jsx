"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar,  PieChart, Pie, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Cell,} from "recharts";
import { FaTasks, FaBell, FaRegClock,} from "react-icons/fa";
import { getDashboardRevisionAndTodoList, getDashboardStats, getDashboardStudyProgressChart,} from "@/app/services/dashboard";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState("30_days");
  const [statsData, setStatsData] = useState([]);
  const [revisionAndTodosData, setRevisionAndTodosData] = useState([]);
  const [studyProgressChartData, setStudyProgressChartData] = useState([]);

  const efficiencyData = [
    { name: "Productive", value: 75 },
    { name: "Neutral", value: 15 },
    { name: "Distracted", value: 10 },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  const getStatsData = () => {
    getDashboardStats("")
      .then((response) => {

        const statusArrayTemp = [
          { key: "Notebooks Created", value: response?.data.createdNotebooks },
          { key: "Notes Created", value: response?.data.createdNotes },
          { key: "Todos Created", value: response?.data.todosCreated },
          { key: "Todos Completed", value: response?.data.todosCompleted },
          { key: "Scheduled Revisions", value: response?.data.revisionsScheduled },
          { key: "Completed Revisions", value: response?.data.revisionsDone },
          { key: "Missed Revisions", value: response?.data.revisionMissed },
          { key: "Total Notebooks", value: response?.data.totalNotebooks },
          { key: "Total Notes", value: response?.data.totalNotes },
          { key: "Total Todos", value: response?.data.totalTodos },
        ];
        setStatsData(statusArrayTemp);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRevisionAndTodosData = () => {
    getDashboardRevisionAndTodoList("")
      .then((response) => {
        setRevisionAndTodosData(response?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStudyProgressChartData = () => {
    getDashboardStudyProgressChart("")
      .then((response) => {
        setStudyProgressChartData(response?.studyProgress);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getStatsData();
    getRevisionAndTodosData();
    getStudyProgressChartData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50">
      {/* Header Section */}
      <div className="col-span-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Study Dashboard</h2>
          <p className="text-sm text-gray-500">
            Last Updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          className="border p-2 rounded-md bg-white shadow-sm"
        >
          <option value="7_days">Last 7 Days</option>
          <option value="30_days">Last 30 Days</option>
          <option value="1_year">Last 1 Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="col-span-4 grid grid-cols-2 md:grid-cols-6 gap-4">
        {statsData?.map((item, key) => (
          <div
            key={key}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 capitalize">
                  {item.key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaRegClock className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Tasks Section */}
      <div className="col-span-4 grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          {/* Header */}
          <h3 className="px-4 pt-4 text-lg font-semibold mb-4 flex items-center text-gray-800">
            <FaBell className="text-purple-600 mr-2" />
            Today's Revisions
          </h3>
          <div className="space-y-4 h-[500px] overflow-y-auto">
          {revisionAndTodosData?.scheduledRevisions?.map(
              (revision, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg  shadow-xs mx-4  border border-gray-100 flex items-center justify-between"
                >
                  {/* Left Information Section */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-800">
                        {revision.title}
                      </h3>
                      {revision.notebook !== "No Notebook" && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <i className="fas fa-book-open text-xs mr-1"></i>
                          {revision.notebook}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <p className="font-semibold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                        <span>Revise Done</span>
                        <span className="">
                          {
                            revision.previousReminders.filter(
                              (r) => r.isRevisionDone
                            ).length
                          }
                        </span>
                      </p>

                      <p className="font-semibold flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        <span>Revisions schaduled</span>

                        <span className=" ">
                          {revision.previousReminders.length}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Revise Button */}
                  <button className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-md transition-colors"
                  onClick={()=>{ router.push(`/pages/notes/read/${revision.id}`)  }}   >
                    <i className="fas fa-play"></i>
                    <span className="text-sm font-medium">Revise</span>
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <h3 className="px-4 pt-4 text-lg font-semibold mb-4 flex items-center text-gray-800">
        <FaTasks className="text-green-600 mr-2" />
            Today's Tasks
          </h3>
          <div className="space-y-2 h-[500px] overflow-y-auto">
          {revisionAndTodosData?.pendingTodos?.map((item, index) => (
              <div
                key={index}
                className={`p-3 bg-gray-50 rounded-lg  shadow-xs mx-4 `}
              >
                {/* Task Name */}
                <p className="text-gray-700 font-medium">{item.task}</p>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-gray-500">
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Due: {new Date(item.endDate).toLocaleDateString()}
                  </span>

                  <span className="text-sm text-gray-500">
                    Status: {item?.status}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold w-fit  ${
                      item.priority === "high"
                        ? "bg-red-500 text-white"
                        : item.priority === "medium"
                        ? "bg-yellow-400 text-black"
                        : "bg-green-400 text-black"
                    }`}
                  >
                    {item.priority.charAt(0).toUpperCase() +
                      item.priority.slice(1)}
                  </span>
                </div>

                {/* Status & Priority */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Charts Section */}
      <div className="col-span-4 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-4 bg-white shadow-lg p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Study Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyProgressChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" /> {/* use 'week' instead of 'name' */}
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="notebooks" fill="#6366F1" />{" "}
                {/* match lowercase key */}
                <Bar dataKey="notes" fill="#10B981" />
                <Bar dataKey="revised" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
{/* 
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Focus Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={efficiencyData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>

      {/* Additional Insights */}
      {/* <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Study Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Most Productive Time</p>
            <p className="text-xl font-bold text-gray-800">Morning (9-11 AM)</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Best Subject</p>
            <p className="text-xl font-bold text-gray-800">JavaScript</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Completion Rate</p>
            <p className="text-xl font-bold text-gray-800">82%</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
