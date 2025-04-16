
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, CalendarClock, CheckCircle2, ClipboardList, Clock } from "lucide-react";
import TaskCard, { Task } from "@/components/TaskCard";
import LeaveRequestCard, { LeaveRequest } from "@/components/LeaveRequestCard";
import CircularProgressBar from "@/components/CircularProgressBar";

// Sample data for the employee dashboard
const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Complete quarterly report",
    description: "Prepare and submit Q1 performance report with all metrics",
    dueDate: "2025-04-20",
    status: "in-progress",
    progress: 65,
    priority: "high",
  },
  {
    id: 2,
    title: "Update client presentation",
    description: "Update the slides for next week's client meeting",
    dueDate: "2025-04-25",
    status: "not-started",
    progress: 0,
    priority: "medium",
  },
  {
    id: 3,
    title: "Review team documentation",
    description: "Review and provide feedback on team documentation",
    dueDate: "2025-04-18",
    status: "in-progress",
    progress: 30,
    priority: "low",
  },
];

const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    startDate: "2025-05-10",
    endDate: "2025-05-15",
    reason: "Annual vacation",
    status: "approved",
    createdAt: "2025-04-01",
  },
  {
    id: 2,
    startDate: "2025-04-25",
    endDate: "2025-04-26",
    reason: "Family event",
    status: "pending",
    createdAt: "2025-04-10",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTasks(sampleTasks);
      setLeaveRequests(sampleLeaveRequests);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  // Calculate overall progress across all tasks
  const calculateOverallProgress = () => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };

  // Get count of tasks by status
  const getTaskCountByStatus = (status: string) => {
    return tasks.filter((task) => {
      if (status === "completed") return task.status === "completed";
      if (status === "in-progress") return task.status === "in-progress";
      if (status === "not-started") return task.status === "not-started";
      return false;
    }).length;
  };

  // Get the most urgent task (closest due date that's not completed)
  const getMostUrgentTask = () => {
    const incompleteTasks = tasks.filter(task => task.status !== "completed");
    if (incompleteTasks.length === 0) return null;
    
    return incompleteTasks.reduce((earliest, current) => {
      const earliestDate = new Date(earliest.dueDate);
      const currentDate = new Date(current.dueDate);
      return currentDate < earliestDate ? current : earliest;
    });
  };

  const urgentTask = getMostUrgentTask();

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse w-10 h-10 bg-primary/20 rounded-full mx-auto mb-3"></div>
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-slate-500">Here's an overview of your tasks and requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="text-2xl font-bold">{getTaskCountByStatus("completed")}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-warning/10 p-3">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-2xl font-bold">{getTaskCountByStatus("in-progress")}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <CalendarClock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Leave Requests</p>
              <p className="text-2xl font-bold">{leaveRequests.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Task Progress</CardTitle>
          <CardDescription>Your progress across all assigned tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 p-6">
          <CircularProgressBar
            progress={calculateOverallProgress()}
            size={120}
            strokeWidth={10}
            className="mb-4 sm:mb-0"
            color={
              calculateOverallProgress() === 100
                ? "stroke-success"
                : calculateOverallProgress() > 50
                ? "stroke-primary"
                : calculateOverallProgress() > 20
                ? "stroke-warning"
                : "stroke-slate-400"
            }
          />
          
          <div className="space-y-3 flex-1">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-100 p-3 rounded-md text-center">
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-lg font-bold">{getTaskCountByStatus("completed")}</p>
              </div>
              <div className="bg-slate-100 p-3 rounded-md text-center">
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-lg font-bold">{getTaskCountByStatus("in-progress")}</p>
              </div>
              <div className="bg-slate-100 p-3 rounded-md text-center">
                <p className="text-sm text-slate-500">Not Started</p>
                <p className="text-lg font-bold">{getTaskCountByStatus("not-started")}</p>
              </div>
            </div>
            
            {urgentTask && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-sm font-medium text-yellow-700">Most urgent task:</p>
                <p className="text-sm font-bold text-yellow-800">{urgentTask.title}</p>
                <p className="text-xs text-yellow-700">Due: {new Date(urgentTask.dueDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Tasks</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/tasks">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.slice(0, 3).map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} />
          ))}
        </div>
      </div>

      {/* Leave Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Leave Requests</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/leave">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaveRequests.slice(0, 2).map((request) => (
            <LeaveRequestCard key={request.id} leaveRequest={request} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
