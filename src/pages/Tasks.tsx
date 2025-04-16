
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
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import TaskCard, { Task } from "@/components/TaskCard";
import { toast } from "@/components/ui/use-toast";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New task form state
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    dueDate: Date | undefined;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    description: "",
    dueDate: undefined,
    priority: "medium",
  });

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

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create a new task object
    const newTaskObj: Task = {
      id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
      title: newTask.title,
      description: newTask.description,
      dueDate: format(newTask.dueDate, "yyyy-MM-dd"),
      status: "not-started",
      progress: 0,
      priority: newTask.priority,
    };

    // Add the new task to the tasks array
    setTasks([...tasks, newTaskObj]);

    // Reset the form
    setNewTask({
      title: "",
      description: "",
      dueDate: undefined,
      priority: "medium",
    });

    // Close the dialog
    setIsDialogOpen(false);

    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-slate-500">Manage and update your assigned tasks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task to add to your list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Task Title*
                </label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date*
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !newTask.dueDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(newTask.dueDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate}
                      onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => 
                    setNewTask({ 
                      ...newTask, 
                      priority: value as "low" | "medium" | "high" 
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
