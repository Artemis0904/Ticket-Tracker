import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngineerLayout from '@/components/EngineerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { engineerWorkReports } from '@/data/engineerData';
import { ArrowLeft, FileText, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EngineerReports = () => {
  const navigate = useNavigate();
  const [filterPeriod, setFilterPeriod] = useState('month');

  const getStatusBadge = (status: string) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Prepare chart data
  const chartData = [
    { month: 'Jan', hoursWorked: 45, tasksCompleted: 8 },
    { month: 'Feb', hoursWorked: 52, tasksCompleted: 10 },
    { month: 'Mar', hoursWorked: 38, tasksCompleted: 6 },
    { month: 'Apr', hoursWorked: 48, tasksCompleted: 9 }
  ];

  const statusData = [
    { name: 'Completed', value: engineerWorkReports.filter(r => r.status === 'completed').length, color: 'hsl(142 76% 36%)' },
    { name: 'In Progress', value: engineerWorkReports.filter(r => r.status === 'in-progress').length, color: 'hsl(220 100% 60%)' },
    { name: 'Pending', value: engineerWorkReports.filter(r => r.status === 'pending').length, color: 'hsl(45 93% 47%)' }
  ];

  const totalHours = engineerWorkReports.reduce((sum, report) => sum + report.hoursWorked, 0);
  const completedTasks = engineerWorkReports.filter(report => report.status === 'completed').length;

  return (
    <EngineerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/engineer-dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Work Reports</h1>
              <p className="text-muted-foreground">View detailed reports of all work completed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
                  <p className="text-2xl font-bold">{completedTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                  <p className="text-2xl font-bold">
                    {engineerWorkReports.filter(r => r.status === 'in-progress').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Hours/Task</p>
                  <p className="text-2xl font-bold">
                    {(totalHours / engineerWorkReports.length).toFixed(1)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Work Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hoursWorked" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Work Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Work Reports - {filterPeriod.charAt(0).toUpperCase() + filterPeriod.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engineerWorkReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{report.taskName}</div>
                    </TableCell>
                    <TableCell>{format(new Date(report.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{report.hoursWorked}h</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        {getStatusBadge(report.status)}
                      </div>
                    </TableCell>
                    <TableCell>{report.ticketId}</TableCell>
                    <TableCell>{report.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </EngineerLayout>
  );
};

export default EngineerReports;