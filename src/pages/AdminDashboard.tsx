
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import CircularProgressBar from "@/components/CircularProgressBar";
import { ArrowRight, CalendarClock, CheckSquare, Clock, Users, AlertCircle } from "lucide-react";
import LeaveRequestCard, { LeaveRequest } from "@/components/LeaveRequestCard";
import { useToast } from "@/components/ui/use-toast";

// Sample data for the admin dashboard
const sampleEmployees = [
  { id: 2, name: "John Employee", position: "Marketing Specialist", taskCompletion: 75 },
  { id: 3, name: "Jane Smith", position: "UX Designer", taskCompletion: 60 },
  { id: 4, name: "Robert Johnson", position: "Software Developer", taskCompletion: 90 },
  { id: 5, name: "Emily Davis", position: "Content Writer", taskCompletion: 45 },
];

const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    startDate: "2025-05-10",
    endDate: "2025-05-15",
    reason: "Annual vacation",
    status: "pending",
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmployees(sampleEmployees);
      setLeaveRequests(sampleLeaveRequests);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleApproveLeave = (id: number) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id
          ? { ...request, status: "approved", comment: "Approved by admin" }
          : request
      )
    );

    toast({
      title: "Leave Request Approved",
      description: "The leave request has been approved successfully.",
    });
  };

  const handleRejectLeave = (id: number) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "rejected",
              comment: "Rejected due to staff shortage",
            }
          : request
      )
    );

    toast({
      title: "Leave Request Rejected",
      description: "The leave request has been rejected.",
    });
  };

  // Calculate statistics
  const totalEmployees = employees.length;
  const averageCompletion = employees.length
    ? employees.reduce((acc, emp) => acc + emp.taskCompletion, 0) / employees.length
    : 0;
  const pendingLeaveRequests = leaveRequests.filter(
    (req) => req.status === "pending"
  ).length;

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
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500">Manage your team and monitor their progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Employees</p>
              <p className="text-2xl font-bold">{totalEmployees}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-success/10 p-3">
              <CheckSquare className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Task Completion</p>
              <p className="text-2xl font-bold">{Math.round(averageCompletion)}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-warning/10 p-3">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Leave Requests</p>
              <p className="text-2xl font-bold">{pendingLeaveRequests}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Team Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">{employee.name}</h3>
                  <p className="text-sm text-slate-500">{employee.position}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-40 hidden md:block">
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${employee.taskCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                  <CircularProgressBar
                    progress={employee.taskCompletion}
                    size={50}
                    strokeWidth={5}
                    color={
                      employee.taskCompletion >= 80
                        ? "stroke-success"
                        : employee.taskCompletion >= 50
                        ? "stroke-primary"
                        : "stroke-warning"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Leave Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Pending Leave Requests</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/leave-requests">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaveRequests.filter(r => r.status === "pending").length > 0 ? (
            leaveRequests
              .filter(r => r.status === "pending")
              .map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  leaveRequest={request}
                  isAdmin={true}
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                />
              ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-slate-500">No pending leave requests.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
