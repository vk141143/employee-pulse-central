
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CircularProgressBar from "@/components/CircularProgressBar";
import { Search } from "lucide-react";

// Sample employee data
const sampleEmployees = [
  {
    id: 1,
    name: "John Employee",
    email: "john@example.com",
    position: "Marketing Specialist",
    department: "Marketing",
    taskCompletion: 75,
    status: "active",
    pendingLeaves: 1,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    position: "UX Designer",
    department: "Design",
    taskCompletion: 60,
    status: "active",
    pendingLeaves: 0,
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    position: "Software Developer",
    department: "Engineering",
    taskCompletion: 90,
    status: "active",
    pendingLeaves: 0,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    position: "Content Writer",
    department: "Marketing",
    taskCompletion: 45,
    status: "on-leave",
    pendingLeaves: 0,
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael@example.com",
    position: "Product Manager",
    department: "Product",
    taskCompletion: 80,
    status: "active",
    pendingLeaves: 1,
  },
  {
    id: 6,
    name: "Sarah Brown",
    email: "sarah@example.com",
    position: "HR Specialist",
    department: "Human Resources",
    taskCompletion: 65,
    status: "active",
    pendingLeaves: 0,
  },
];

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmployees(sampleEmployees);
      setFilteredEmployees(sampleEmployees);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter employees when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.position.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    }
  }, [employees, searchQuery]);

  // Render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success">Active</Badge>;
      case "on-leave":
        return <Badge className="bg-warning">On Leave</Badge>;
      case "inactive":
        return <Badge className="bg-destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse w-10 h-10 bg-primary/20 rounded-full mx-auto mb-3"></div>
          <p className="text-slate-500">Loading employees...</p>
        </div>
      </div>
    );
  }

  // Calculate department statistics
  const departmentStats = {};
  employees.forEach((emp) => {
    if (!departmentStats[emp.department]) {
      departmentStats[emp.department] = {
        count: 0,
        totalCompletion: 0,
      };
    }
    departmentStats[emp.department].count += 1;
    departmentStats[emp.department].totalCompletion += emp.taskCompletion;
  });

  // Convert to array and calculate average
  const departmentArray = Object.keys(departmentStats).map((dept) => ({
    name: dept,
    count: departmentStats[dept].count,
    avgCompletion:
      departmentStats[dept].totalCompletion / departmentStats[dept].count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
        <p className="text-slate-500">Manage and view employee information</p>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departmentArray.map((dept) => (
          <Card key={dept.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{dept.name}</h3>
                <CircularProgressBar
                  progress={Math.round(dept.avgCompletion)}
                  size={40}
                  strokeWidth={4}
                  color={
                    dept.avgCompletion >= 80
                      ? "stroke-success"
                      : dept.avgCompletion >= 50
                      ? "stroke-primary"
                      : "stroke-warning"
                  }
                />
              </div>
              <p className="text-sm text-slate-500">
                {dept.count} employee{dept.count !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-slate-500">
                Avg. Task Completion: {Math.round(dept.avgCompletion)}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, position or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Task Completion</TableHead>
                <TableHead>Pending Leaves</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.name}
                      <div className="text-xs text-slate-500">
                        {employee.email}
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      {renderStatusBadge(employee.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 hidden md:block">
                          <div className="h-2 bg-slate-100 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                employee.taskCompletion >= 80
                                  ? "bg-success"
                                  : employee.taskCompletion >= 50
                                  ? "bg-primary"
                                  : "bg-warning"
                              }`}
                              style={{ width: `${employee.taskCompletion}%` }}
                            ></div>
                          </div>
                        </div>
                        <span>{employee.taskCompletion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {employee.pendingLeaves > 0 ? (
                        <Badge variant="outline" className="bg-warning text-warning-foreground">
                          {employee.pendingLeaves}
                        </Badge>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No employees found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmployees;
