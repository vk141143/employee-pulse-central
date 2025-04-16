
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
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
import CircularProgressBar from "./CircularProgressBar";

export type TaskStatus = "not-started" | "in-progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  progress: number;
  priority: "low" | "medium" | "high";
}

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}

const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [progress, setProgress] = useState(task.progress);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
    
    // Automatically update status based on progress
    if (value[0] === 100) {
      setStatus("completed");
    } else if (value[0] > 0) {
      setStatus("in-progress");
    } else {
      setStatus("not-started");
    }
  };

  const handleUpdateTask = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedTask = {
        ...task,
        progress,
        status,
      };
      
      onUpdate(updatedTask);
      setIsUpdating(false);
      setIsDialogOpen(false);
      setNotes("");
      
      toast({
        title: "Task updated",
        description: "Your task progress has been updated successfully.",
      });
    }, 500);
  };

  // Get the appropriate color for priority badge
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
      case "medium":
        return "bg-warning text-warning-foreground hover:bg-warning/80";
      case "low":
        return "bg-success text-success-foreground hover:bg-success/80";
      default:
        return "";
    }
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">{task.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          <span className={`font-medium ${daysRemaining < 0 ? 'text-destructive' : daysRemaining <= 2 ? 'text-warning' : ''}`}>
            {daysRemaining < 0 
              ? `${Math.abs(daysRemaining)} days overdue` 
              : daysRemaining === 0 
                ? 'Due today'
                : `${daysRemaining} days left`}
          </span>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{task.progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                task.status === "completed" 
                  ? "bg-success" 
                  : "bg-primary"
              }`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <CircularProgressBar 
            progress={task.progress} 
            size={60} 
            strokeWidth={6}
            color={task.status === "completed" 
              ? "stroke-success" 
              : task.progress > 0 
                ? "stroke-primary" 
                : "stroke-slate-400"}
          />
          <div className="ml-2">
            <div className="text-sm font-medium">Status</div>
            <div className="text-sm">
              {task.status === "completed" 
                ? "Completed" 
                : task.progress > 0 
                  ? "In Progress" 
                  : "Not Started"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full"
              disabled={isUpdating}
            >
              Update Progress
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Task Progress</DialogTitle>
              <DialogDescription>
                Update the progress for "{task.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Current Progress: {task.progress}%</h4>
                <p className="text-sm text-slate-500">
                  Adjust the slider to update your progress on this task.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>New Progress</span>
                  <span>{progress}%</span>
                </div>
                <Slider
                  value={[progress]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={handleProgressChange}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Progress Notes (Optional)
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add details about your progress..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center p-3 bg-slate-50 rounded-md">
                <div className="w-10 h-10 mr-3">
                  <CircularProgressBar 
                    progress={progress} 
                    size={40} 
                    strokeWidth={4}
                    color={progress === 100 
                      ? "stroke-success" 
                      : progress > 0 
                        ? "stroke-primary" 
                        : "stroke-slate-400"}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">New Status</p>
                  <p className="text-sm">
                    {progress === 100 
                      ? "Completed" 
                      : progress > 0 
                        ? "In Progress" 
                        : "Not Started"}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setProgress(task.progress);
                  setStatus(task.status);
                  setIsDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateTask} 
                disabled={isUpdating || task.progress === progress}
              >
                {isUpdating ? "Updating..." : "Update Progress"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
