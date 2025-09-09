import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  Info,
  Shield,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { UserLogService, UserLog } from '@/lib/userLogService';
import { cn } from '@/lib/utils';

interface SystemStats {
  totalUsers: number;
  totalBusinesses: number;
  totalReviews: number;
  totalLogs: number;
  recentActivity: number;
  errorCount: number;
}

interface LogFilter {
  action: string;
  resourceType: string;
  dateRange: string;
  userEmail: string;
}

export const AdminReports = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    totalReviews: 0,
    totalLogs: 0,
    recentActivity: 0,
    errorCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [filter, setFilter] = useState<LogFilter>({
    action: '',
    resourceType: '',
    dateRange: '7d',
    userEmail: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalLogs, setTotalLogs] = useState(0);

  // Fetch system statistics
  const fetchSystemStats = async () => {
    try {
      // Fetch counts from different tables
      const [usersResult, businessesResult, reviewsResult, logsResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('user_logs').select('id', { count: 'exact', head: true })
      ]);

      // Fetch recent activity (logs from last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: recentActivity } = await supabase
        .from('user_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      // Fetch error count (logs with error-related actions)
      const { count: errorCount } = await supabase
        .from('user_logs')
        .select('id', { count: 'exact', head: true })
        .or('action.ilike.%error%,action.ilike.%fail%,action.ilike.%exception%');

      setSystemStats({
        totalUsers: usersResult.count || 0,
        totalBusinesses: businessesResult.count || 0,
        totalReviews: reviewsResult.count || 0,
        totalLogs: logsResult.count || 0,
        recentActivity: recentActivity || 0,
        errorCount: errorCount || 0
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  // Fetch user logs with filtering and pagination
  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      
      let query = supabase
        .from('user_logs')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter.action) {
        query = query.ilike('action', `%${filter.action}%`);
      }
      
      if (filter.resourceType) {
        query = query.eq('resource_type', filter.resourceType);
      }
      
      if (filter.userEmail) {
        query = query.ilike('user_email', `%${filter.userEmail}%`);
      }

      // Apply date range filter
      if (filter.dateRange) {
        const now = new Date();
        let startDate = new Date();
        
        switch (filter.dateRange) {
          case '1d':
            startDate.setDate(now.getDate() - 1);
            break;
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(now.getDate() - 90);
            break;
          default:
            startDate = new Date(0); // All time
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      // Get total count for pagination
      const { count } = await query.select('id', { count: 'exact', head: true });
      setTotalLogs(count || 0);

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const { data, error } = await query
        .range(startIndex, startIndex + itemsPerPage - 1);

      if (error) {
        console.error('Error fetching logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch system logs',
          variant: 'destructive'
        });
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch system logs',
        variant: 'destructive'
      });
    } finally {
      setLogsLoading(false);
    }
  };

  // Download logs as CSV
  const downloadLogsData = () => {
    const csvData = [
      ['User Email', 'Action', 'Resource Type', 'Resource ID', 'IP Address', 'User Agent', 'Created At'],
      ...logs.map(log => [
        log.user_email,
        log.action,
        log.resource_type,
        log.resource_id || '',
        log.ip_address || '',
        log.user_agent || '',
        new Date(log.created_at).toLocaleString()
      ])
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `system-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get action badge variant
  const getActionBadgeVariant = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('error') || lowerAction.includes('fail')) return 'destructive';
    if (lowerAction.includes('create') || lowerAction.includes('add')) return 'default';
    if (lowerAction.includes('update') || lowerAction.includes('edit')) return 'secondary';
    if (lowerAction.includes('delete') || lowerAction.includes('remove')) return 'outline';
    return 'secondary';
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('error') || lowerAction.includes('fail')) return <AlertTriangle className="w-4 h-4" />;
    if (lowerAction.includes('login') || lowerAction.includes('auth')) return <Shield className="w-4 h-4" />;
    if (lowerAction.includes('create') || lowerAction.includes('add')) return <Activity className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalLogs / itemsPerPage);

  useEffect(() => {
    fetchSystemStats();
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filter, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return (
      <AdminLayout title="System Reports & Logs" subtitle="Monitor system activity and user actions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="System Reports & Logs" subtitle="Monitor system activity and user actions">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-comfortaa font-bold text-yp-dark">System Reports</h2>
          <p className="text-gray-600 font-roboto">Monitor system activity and user actions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => {
              fetchSystemStats();
              fetchLogs();
            }}
            variant="outline"
            size="sm"
            disabled={logsLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", logsLoading && "animate-spin")} />
            Refresh
          </Button>
          
          <Button 
            onClick={downloadLogsData}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-yp-dark">
                  {systemStats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                <p className="text-2xl font-bold text-yp-dark">
                  {systemStats.totalBusinesses.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-yp-dark">
                  {systemStats.totalReviews.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-yp-dark">
                  {systemStats.totalLogs.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity (24h)</p>
                <p className="text-2xl font-bold text-yp-dark">
                  {systemStats.recentActivity.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Error Count</p>
                <p className="text-2xl font-bold text-yp-dark">
                  {systemStats.errorCount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-gray-700">Filter Logs</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Action</label>
              <Input
                placeholder="Filter by action..."
                value={filter.action}
                onChange={(e) => setFilter(prev => ({ ...prev, action: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Resource Type</label>
              <Select value={filter.resourceType} onValueChange={(value) => setFilter(prev => ({ ...prev, resourceType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All resources</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Date Range</label>
              <Select value={filter.dateRange} onValueChange={(value) => setFilter(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">User Email</label>
              <Input
                placeholder="Filter by user email..."
                value={filter.userEmail}
                onChange={(e) => setFilter(prev => ({ ...prev, userEmail: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-4">
        {logsLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue mx-auto mb-4"></div>
              <p className="text-gray-500">Loading logs...</p>
            </CardContent>
          </Card>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No logs found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {logs.map((log) => (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getActionIcon(log.action)}
                        <h3 className="text-lg font-semibold text-yp-dark">
                          {log.action}
                        </h3>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.resource_type}
                        </Badge>
                        {log.resource_id && (
                          <Badge variant="outline" className="text-xs">
                            ID: {log.resource_id}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">User</p>
                          <p className="text-sm text-gray-900">{log.user_email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">IP Address</p>
                          <p className="text-sm text-gray-900">
                            {log.ip_address || 'Not available'}
                          </p>
                        </div>
                      </div>
                      
                      {log.details && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">Details</p>
                          <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="text-xs text-gray-500 text-right">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(log.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-gray-400">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalLogs)} of {totalLogs.toLocaleString()} logs
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};
