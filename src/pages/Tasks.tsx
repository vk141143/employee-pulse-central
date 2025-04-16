
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import TaskCard, { Task } from "@/components/TaskCard";

// Sample data for the employee tasks
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
  {
    id: 4,
    title: "Prepare for weekly meeting",
    description: "Prepare agenda and materials for weekly team meeting",
    dueDate: "2025-04-17",
    status: "completed",
    progress: 100,
    priority: "medium",
  },
  {
    id: 5,
    title: "Research new technologies",
    description: "Research and compile report on emerging technologies in the industry",
    dueDate: "2025-04-30",
    status: "not-started",
    progress: 0,
    priority: "low",
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTasks(sampleTasks);
      setFilteredTasks(sampleTasks);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter tasks when filter options change
  useEffect(() => {
    let result = tasks;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(result);
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse w-10 h-10 bg-primary/20 rounded-full mx-auto mb-3"></div>
          <p className="text-slate-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-slate-500">Manage and update your assigned tasks</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-slate-500">No tasks match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
