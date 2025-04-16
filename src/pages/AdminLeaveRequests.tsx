
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import LeaveRequestCard, { LeaveRequest } from "@/components/LeaveRequestCard";
import { Search } from "lucide-react";

// Sample leave request data
const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    startDate: "2025-05-10",
    endDate: "2025-05-15",
    reason: "Annual vacation",
    status: "pending",
    createdAt: "2025-04-01",
    employeeName: "John Employee",
    employeeId: 1,
  },
  {
    id: 2,
    startDate: "2025-04-25",
    endDate: "2025-04-26",
    reason: "Family event",
    status: "pending",
    createdAt: "2025-04-10",
    employeeName: "Jane Smith",
    employeeId: 2,
  },
  {
    id: 3,
    startDate: "2025-04-18",
    endDate: "2025-04-19",
    reason: "Medical appointment",
    status: "approved",
    createdAt: "2025-04-05",
    comment: "Approved. Get well soon.",
    employeeName: "Robert Johnson",
    employeeId: 3,
  },
  {
    id: 4,
    startDate: "2025-05-01",
    endDate: "2025-05-02",
    reason: "Personal leave",
    status: "rejected",
    createdAt: "2025-04-15",
    comment: "Denied due to high workload during this period.",
    employeeName: "Emily Davis",
    employeeId: 4,
  },
  {
    id: 5,
    startDate: "2025-06-10",
    endDate: "2025-06-15",
    reason: "Family vacation",
    status: "pending",
    createdAt: "2025-04-20",
    employeeName: "Michael Wilson",
    employeeId: 5,
  },
];

const AdminLeaveRequests = () => {
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLeaveRequests(sampleLeaveRequests);
      setFilteredRequests(sampleLeaveRequests);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter leave requests when filters change
  useEffect(() => {
    let filtered = [...leaveRequests];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.employeeName?.toLowerCase().includes(query) ||
          req.reason.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  }, [leaveRequests, searchQuery, statusFilter]);

  const handleApproveLeave = (id: number) => {
    const updatedRequests = leaveRequests.map((request) =>
      request.id === id
        ? { ...request, status: "approved", comment: "Request approved." }
        : request
    );
    
    setLeaveRequests(updatedRequests);
    
    toast({
      title: "Leave Request Approved",
      description: "The leave request has been approved successfully.",
    });
  };

  const handleRejectLeave = (id: number) => {
    const updatedRequests = leaveRequests.map((request) =>
      request.id === id
        ? {
            ...request,
            status: "rejected",
            comment: "Request rejected due to scheduling conflicts.",
          }
        : request
    );
    
    setLeaveRequests(updatedRequests);
    
    toast({
      title: "Leave Request Rejected",
      description: "The leave request has been rejected.",
    });
  };

  // Calculate statistics
  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const approvedRequests = leaveRequests.filter(
    (req) => req.status === "approved"
  ).length;
  const rejectedRequests = leaveRequests.filter(
    (req) => req.status === "rejected"
  ).length;

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leave Requests</h1>
        <p className="text-slate-500">Review and manage employee leave requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-slate-500">Total Requests</p>
            <p className="text-2xl font-bold">{totalRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-warning-500">{pendingRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-slate-500">Approved</p>
            <p className="text-2xl font-bold text-success-500">{approvedRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-slate-500">Rejected</p>
            <p className="text-2xl font-bold text-destructive-500">{rejectedRequests}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by employee or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <LeaveRequestCard
              key={request.id}
              leaveRequest={{
                ...request,
                // Add employee name to the display
                reason: (
                  <span>
                    <span className="font-medium">{request.employeeName}: </span>
                    {request.reason}
                  </span>
                ) as unknown as string,
              }}
              isAdmin={true}
              onApprove={handleApproveLeave}
              onReject={handleRejectLeave}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-slate-500">No leave requests match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaveRequests;
