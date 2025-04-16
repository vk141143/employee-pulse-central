
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CalendarIcon, PlusCircle } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import LeaveRequestCard, { LeaveRequest } from "@/components/LeaveRequestCard";

// Sample data for the employee leave requests
const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    startDate: "2025-05-10",
    endDate: "2025-05-15",
    reason: "Annual vacation",
    status: "approved",
    createdAt: "2025-04-01",
    comment: "Approved by manager. Enjoy your vacation!",
  },
  {
    id: 2,
    startDate: "2025-04-25",
    endDate: "2025-04-26",
    reason: "Family event",
    status: "pending",
    createdAt: "2025-04-10",
  },
  {
    id: 3,
    startDate: "2025-03-15",
    endDate: "2025-03-16",
    reason: "Personal appointment",
    status: "rejected",
    createdAt: "2025-03-01",
    comment: "Too many team members are already on leave during this period.",
  },
];

const Leave = () => {
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLeaveRequests(sampleLeaveRequests);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleSubmitRequest = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields to submit your leave request.",
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Date Error",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRequest: LeaveRequest = {
      id: Math.max(0, ...leaveRequests.map((r) => r.id)) + 1,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      reason,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setStartDate(undefined);
    setEndDate(undefined);
    setReason("");
    setIsSubmitting(false);
    setDialogOpen(false);

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse w-10 h-10 bg-primary/20 rounded-full mx-auto mb-3"></div>
          <p className="text-slate-500">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-slate-500">Request and view your leave history</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Leave Request</DialogTitle>
              <DialogDescription>
                Fill in the details below to submit a new leave request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  placeholder="Please provide details about your leave request"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmitRequest} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Balance</CardTitle>
          <CardDescription>Your current leave entitlements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-100 rounded-md p-4 text-center">
              <p className="text-sm text-slate-500">Annual Leave</p>
              <p className="text-2xl font-bold">14 days</p>
              <p className="text-sm text-slate-500">remaining</p>
            </div>
            <div className="bg-slate-100 rounded-md p-4 text-center">
              <p className="text-sm text-slate-500">Sick Leave</p>
              <p className="text-2xl font-bold">7 days</p>
              <p className="text-sm text-slate-500">remaining</p>
            </div>
            <div className="bg-slate-100 rounded-md p-4 text-center">
              <p className="text-sm text-slate-500">Personal Leave</p>
              <p className="text-2xl font-bold">3 days</p>
              <p className="text-sm text-slate-500">remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Request History */}
      <div>
        <h2 className="text-xl font-bold mb-4">Leave Request History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <LeaveRequestCard key={request.id} leaveRequest={request} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-slate-500">No leave requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leave;
