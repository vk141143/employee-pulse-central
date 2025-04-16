
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
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
    <Card>
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
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={5}
            onValueChange={handleProgressChange}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <CircularProgressBar 
            progress={progress} 
            size={60} 
            strokeWidth={6}
            color={status === "completed" 
              ? "stroke-success" 
              : progress > 0 
                ? "stroke-primary" 
                : "stroke-slate-400"}
          />
          <div className="ml-2">
            <div className="text-sm font-medium">Status</div>
            <div className="text-sm">
              {status === "completed" 
                ? "Completed" 
                : progress > 0 
                  ? "In Progress" 
                  : "Not Started"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpdateTask} 
          disabled={isUpdating || task.progress === progress}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Progress"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
