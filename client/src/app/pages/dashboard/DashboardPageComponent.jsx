"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { FaTasks, FaBell, FaRegClock } from "react-icons/fa";
import {
  getDashboardRevisionAndTodoList,
  getDashboardStats,
  getDashboardStudyProgressChart,
} from "@/app/services/dashboard";
import { useRouter } from "next/navigation";

// Reusable StatCard Component
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 capitalize">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="text-blue-600 text-xl" />
      </div>
    </div>
  </div>
);

// Reusable ListItem Component
const ListItem = ({ title, notebook, reminders, onClick }) => (
  <div className="p-3 bg-gray-50 rounded-lg shadow-xs border border-gray-100 flex items-center justify-between">
    <div className="flex-1">
      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {notebook && (
          <span className="text-sm text-gray-500 flex items-center">
            {notebook}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <p className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
          Revise Done {reminders.filter((r) => r.isRevisionDone).length}
        </p>
        <p className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
          Revisions scheduled {reminders.length}
        </p>
      </div>
    </div>
    <button
      className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-md transition-colors"
      onClick={onClick}
    >
      Revise
    </button>
  </div>
);

const DashboardPageComponent = () => {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState("30_days");
  const [statsData, setStatsData] = useState([]);
  const [revisionAndTodosData, setRevisionAndTodosData] = useState([]);
  const [studyProgressChartData, setStudyProgressChartData] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingRevisions, setLoadingRevisions] = useState(false);
  const [loadingStudyProgress, setLoadingStudyProgress] = useState(false);

  // Filters & sorting
  const [revisionNotebookFilter, setRevisionNotebookFilter] = useState("");
  const [revisionSortByCount, setRevisionSortByCount] = useState(false);
  const [taskPriorityFilter, setTaskPriorityFilter] = useState("");
  const [taskSortAsc, setTaskSortAsc] = useState(true);

  // Fetch Stats Data
  const getStatsData = async () => {
    setLoadingStats(true);
    try {
      const response = await getDashboardStats("");
      const statusArrayTemp = [
        { key: "Notebooks Created", value: response?.data.createdNotebooks },
        { key: "Notes Created", value: response?.data.createdNotes },
        { key: "Todos Created", value: response?.data.todosCreated },
        { key: "Todos Completed", value: response?.data.todosCompleted },
        {
          key: "Scheduled Revisions",
          value: response?.data.revisionsScheduled,
        },
        { key: "Completed Revisions", value: response?.data.revisionsDone },
        { key: "Missed Revisions", value: response?.data.revisionMissed },
        { key: "Total Notebooks", value: response?.data.totalNotebooks },
        { key: "Total Notes", value: response?.data.totalNotes },
        { key: "Total Todos", value: response?.data.totalTodos },
      ];
      setStatsData(statusArrayTemp);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Revisions and Todos Data
  const getRevisionAndTodosData = async () => {
    setLoadingRevisions(true);
    try {
      const response = await getDashboardRevisionAndTodoList("");
      setRevisionAndTodosData(response?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRevisions(false);
    }
  };

  // Fetch Study Progress Chart Data
  const getStudyProgressChartData = async () => {
    setLoadingStudyProgress(true);
    try {
      const response = await getDashboardStudyProgressChart("");
      setStudyProgressChartData(response?.studyProgress);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStudyProgress(false);
    }
  };

  useEffect(() => {
    getStatsData();
    getRevisionAndTodosData();
    getStudyProgressChartData();
  }, []);

  const filteredSortedRevisions = revisionAndTodosData?.scheduledRevisions
    ?.filter((rev) =>
      revisionNotebookFilter ? rev.notebook === revisionNotebookFilter : true
    )
    ?.sort((a, b) =>
      revisionSortByCount
        ? b.previousReminders.length - a.previousReminders.length
        : 0
    );

  const filteredSortedTasks = revisionAndTodosData?.pendingTodos
    ?.filter((todo) =>
      taskPriorityFilter ? todo.priority === taskPriorityFilter : true
    )
    ?.sort((a, b) => {
      const dateA = new Date(a.endDate);
      const dateB = new Date(b.endDate);
      return taskSortAsc ? dateA - dateB : dateB - dateA;
    });

  const filteredAndSortedTodos = revisionAndTodosData?.pendingTodos
    ?.filter((item) => {
      if (!taskPriorityFilter) return true;
      return item.priority === taskPriorityFilter;
    })
    ?.sort((a, b) => {
      return taskSortAsc
        ? new Date(a.endDate) - new Date(b.endDate)
        : new Date(b.endDate) - new Date(a.endDate);
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50">
      {/* Header */}
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

      {/* Stats */}
      <div className="col-span-4 grid grid-cols-2 md:grid-cols-6 gap-4">
        {loadingStats ? (
          <p className="col-span-6 text-center text-gray-500">
            Loading stats...
          </p>
        ) : (
          statsData.map((item, key) => (
            <StatCard
              key={key}
              title={item.key.replace(/([A-Z])/g, " $1")}
              value={item.value}
              icon={FaRegClock}
            />
          ))
        )}
      </div>

      {/* Tasks & Revisions */}
      <div className="col-span-4 grid md:grid-cols-2 gap-6">
        {/* Revisions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center px-4 pt-4 mb-4 ">
            <h3 className="text-lg font-semibold inline-flex items-center text-gray-800">
              <FaBell className="text-purple-600 mr-2" /> Today's Revisions
            </h3>
            <div className="flex gap-2">
              <select
                onChange={(e) => setRevisionNotebookFilter(e.target.value)}
                className="border border-neutral-400 rounded px-3 py-2 text-sm bg-white shadow-sm"
              >
                <option value="">Select Notebook</option>
                {[
                  ...new Set(
                    revisionAndTodosData?.scheduledRevisions?.map(
                      (r) => r.notebook
                    )
                  ),
                ].map((nb, i) => (
                  <option key={i} value={nb}>
                    {nb}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4 h-[500px] overflow-y-auto px-4">
            {loadingRevisions ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              filteredSortedRevisions?.map((revision, index) => (
                <ListItem
                  key={index}
                  title={revision.title}
                  notebook={revision.notebook}
                  reminders={revision.previousReminders}
                  onClick={() =>
                    router.push(`/pages/notes/read/${revision.id}`)
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center px-4 pt-4 mb-4 ">
            <h3 className="text-lg font-semibold inline-flex items-center text-gray-800">
              <FaTasks className="text-green-600 mr-2" /> Today's Tasks
            </h3>

            <div className="flex justify-end items-center gap-4">
              {/* Priority Filter */}
              <select
                onChange={(e) => setTaskPriorityFilter(e.target.value)}
                className="border border-neutral-400 rounded px-3 py-2 text-sm bg-white shadow-sm"
                value={taskPriorityFilter}
              >
                <option value="">Select Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              {/* Sort by Due Date */}
              <select
                onChange={(e) => setTaskSortAsc(e.target.value === "asc")}
                className="border border-neutral-400 rounded px-3 py-2 text-sm bg-white shadow-sm"
                value={taskSortAsc ? "asc" : "desc"}
              >
                <option value="asc">Sort from New to Old</option>
                <option value="desc">Sort from Old to New</option>
              </select>
            </div>
          </div>
          <div className="space-y-2 h-[500px] overflow-y-auto px-4">
            {loadingRevisions ? (
              <p className="text-center text-gray-500">Loading tasks...</p>
            ) : (
              filteredSortedTasks?.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg shadow-xs"
                >
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
                      className={`text-xs px-2 py-1 rounded-full font-semibold w-fit ${
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Study Progress Chart */}
      <div className="col-span-4 bg-white shadow-lg p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Study Progress</h3>
        <div className="h-80">
          {loadingStudyProgress ? (
            <p className="text-center text-gray-500">
              Loading study progress...
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyProgressChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="notebooks" fill="#6366F1" />
                <Bar dataKey="notes" fill="#10B981" />
                <Bar dataKey="revised" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPageComponent;
