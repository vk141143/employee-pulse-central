
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  comment?: string;
}

interface LeaveRequestCardProps {
  leaveRequest: LeaveRequest;
  isAdmin?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const LeaveRequestCard = ({
  leaveRequest,
  isAdmin = false,
  onApprove,
  onReject,
}: LeaveRequestCardProps) => {
  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-warning">Pending</Badge>;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const end = new Date(endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${start} - ${end}`;
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Leave Request
          </CardTitle>
          {getStatusBadge(leaveRequest.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm font-medium text-slate-500">Date Range</div>
          <div className="text-sm">
            {formatDateRange(leaveRequest.startDate, leaveRequest.endDate)}
            <span className="ml-2 text-slate-500">
              ({calculateDays(leaveRequest.startDate, leaveRequest.endDate)} days)
            </span>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-slate-500">Reason</div>
          <div className="text-sm">{leaveRequest.reason}</div>
        </div>
        
        {leaveRequest.comment && (
          <div>
            <div className="text-sm font-medium text-slate-500">Comment</div>
            <div className="text-sm">{leaveRequest.comment}</div>
          </div>
        )}
        
        <div>
          <div className="text-sm font-medium text-slate-500">Requested on</div>
          <div className="text-sm">
            {new Date(leaveRequest.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
      
      {isAdmin && leaveRequest.status === "pending" && (
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onReject && onReject(leaveRequest.id)}
          >
            Reject
          </Button>
          <Button
            className="flex-1 bg-success hover:bg-success/90"
            onClick={() => onApprove && onApprove(leaveRequest.id)}
          >
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LeaveRequestCard;
