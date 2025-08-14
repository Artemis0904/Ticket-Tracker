import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, BarChart3Icon, TrendingUpIcon, DollarSignIcon, PackageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockReportData, getMaterialRequestStats } from '@/data/storeManagerData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatsCard from '@/components/StatsCard';

const Reports = () => {
  const navigate = useNavigate();
  const stats = getMaterialRequestStats();

  const costData = mockReportData.map(item => ({
    month: item.month,
    cost: item.totalCost
  }));

  const requestTrendData = mockReportData.map(item => ({
    month: item.month,
    requests: item.materialRequests,
    approved: item.approved,
    rejected: item.rejected,
    delivered: item.delivered
  }));

  const totalCost = mockReportData.reduce((sum, item) => sum + item.totalCost, 0);
  const totalRequests = mockReportData.reduce((sum, item) => sum + item.materialRequests, 0);
  const avgApprovalRate = Math.round((mockReportData.reduce((sum, item) => sum + (item.approved / item.materialRequests), 0) / mockReportData.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/store-manager/dashboard')}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for material request management.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Cost (4M)"
          value={totalCost}
          icon={DollarSignIcon}
          description={`$${totalCost.toLocaleString()}`}
        />
        <StatsCard
          title="Total Requests (4M)"
          value={totalRequests}
          icon={PackageIcon}
          description="Last 4 months"
        />
        <StatsCard
          title="Approval Rate"
          value={avgApprovalRate}
          icon={TrendingUpIcon}
          description="Average percentage"
        />
        <StatsCard
          title="Current Month"
          value={stats.total}
          icon={BarChart3Icon}
          description="January requests"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Material Requests Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5" />
              Material Requests Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="hsl(263 70% 50%)" name="Total Requests" />
                <Bar dataKey="approved" fill="hsl(142 71% 45%)" name="Approved" />
                <Bar dataKey="rejected" fill="hsl(0 84% 60%)" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSignIcon className="h-5 w-5" />
              Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="hsl(263 70% 50%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(263 70% 50%)', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockReportData.map((data) => (
              <div key={data.month} className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">{data.month} 2024</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Requests:</span>
                    <span className="font-medium">{data.materialRequests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved:</span>
                    <span className="font-medium text-green-600">{data.approved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rejected:</span>
                    <span className="font-medium text-red-600">{data.rejected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivered:</span>
                    <span className="font-medium text-blue-600">{data.delivered}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Total Cost:</span>
                    <span className="font-medium">${data.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval Rate:</span>
                    <span className="font-medium">{Math.round((data.approved / data.materialRequests) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;