import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from '@clerk/clerk-react';
import { UserLogService, AdminUser, UserLog, DatabaseUser, PaginatedUsers, PaginatedUserLogs } from '@/lib/userLogService';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Activity, 
  Shield, 
  Mail, 
  Calendar, 
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Download,
  Printer,
  Database,
  User,
  Building2,
  Globe,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AdminUsers = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [databaseUsers, setDatabaseUsers] = useState<DatabaseUser[]>([]);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [userType, setUserType] = useState<'all' | 'admin' | 'database'>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sortField, sortDirection, userType]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        setCurrentPage(1);
        setFilterLoading(true);
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFilterLoading(true);
      
      let usersData: PaginatedUsers;
      
      if (userType === 'admin') {
        usersData = await UserLogService.getAdminUsers(currentPage, pageSize, searchTerm);
      } else if (userType === 'database') {
        usersData = await UserLogService.getDatabaseUsers(currentPage, pageSize, searchTerm);
      } else {
        usersData = await UserLogService.getCombinedUsers(currentPage, pageSize, searchTerm);
      }

      // Get user logs for the activity tab
      const logsData = await UserLogService.getUserLogsPaginated(1, 100, searchTerm);
      
      // Filter users by type
      const adminUsersData = usersData.users.filter(u => 'role' in u && u.role) as AdminUser[];
      const databaseUsersData = usersData.users.filter(u => !('role' in u && u.role)) as DatabaseUser[];
      
      setAdminUsers(adminUsersData);
      setDatabaseUsers(databaseUsersData);
      setUserLogs(logsData.users);
      setTotalCount(usersData.total);
      setTotalPages(usersData.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setFilterLoading(true);
    fetchData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilterLoading(true);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
    setFilterLoading(true);
  };

  const handleUserTypeChange = (type: string) => {
    setUserType(type as 'all' | 'admin' | 'database');
    setCurrentPage(1);
    setFilterLoading(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'super_admin') return 'destructive';
    if (role === 'admin') return 'default';
    if (role === 'user') return 'secondary';
    return 'outline';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Users Management Report</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .header { text-align: center; margin-bottom: 20px; }
                .stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
                .stat-item { text-align: center; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Users Management Report</h1>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
              </div>
              <div class="stats">
                <div class="stat-item">
                  <h3>Total Users</h3>
                  <p>${totalCount}</p>
                </div>
                <div class="stat-item">
                  <h3>Admin Users</h3>
                  <p>${adminUsers.length}</p>
                </div>
                <div class="stat-item">
                  <h3>Database Users</h3>
                  <p>${databaseUsers.length}</p>
                </div>

              </div>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const exportToCSV = () => {
    const allUsers = [...adminUsers, ...databaseUsers];
    const csvContent = UserLogService.exportUsersToCSV(allUsers);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <AdminLayout title={t('admin.pages.users')} subtitle={t('admin.pages.usersSubtitle')}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t('admin.pages.users')} subtitle={t('admin.pages.usersSubtitle')}>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-roboto text-gray-600">Total Users</p>
                  <p className="text-2xl font-comfortaa font-bold text-gray-900">{totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-roboto text-gray-600">Admin Users</p>
                  <p className="text-2xl font-comfortaa font-bold text-gray-900">{adminUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-roboto text-gray-600">Database Users</p>
                  <p className="text-2xl font-comfortaa font-bold text-gray-900">{databaseUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-roboto text-gray-600">Activity Logs</p>
                  <p className="text-2xl font-comfortaa font-bold text-gray-900">{userLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          

        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t('admin.users.title')}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('admin.common.refresh')}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('admin.users.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
              <Select value={userType} onValueChange={handleUserTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admin Users</SelectItem>
                  <SelectItem value="database">Database Users</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(parseInt(value)); setCurrentPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setUserType("all");
                  setCurrentPage(1);
                  setFilterLoading(true);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{t('admin.users.tabs.users')}</span>
              <Badge variant="secondary">{totalCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>{t('admin.users.tabs.logs')}</span>
              <Badge variant="secondary">{userLogs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div ref={printRef}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>{t('admin.users.adminUsers')}</span>
                </CardTitle>
              </CardHeader>
                <CardContent className="p-0">
                  {filterLoading && (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                  )}
                  {!filterLoading && (
                <Table>
                  <TableHeader>
                    <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort('email')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>User Info</span>
                              {sortField === 'email' && (
                                sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Role & Permissions</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort('created_at')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Created</span>
                              {sortField === 'created_at' && (
                                sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </TableHead>
                          {/* <TableHead>Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                        {[...adminUsers, ...databaseUsers].map((user) => (
                          <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  {('avatar_url' in user && user.avatar_url) ? (
                                    <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full" />
                                  ) : (
                                    <User className="w-5 h-5 text-gray-500" />
                                  )}
                                </div>
                          <div>
                            <div className="font-medium">
                                    {('full_name' in user && user.full_name) || 
                                     ('first_name' in user && user.last_name ? `${user.first_name} ${user.last_name}` : user.email.split('@')[0])}
                            </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  <div className="text-xs text-gray-400">ID: {user.id}</div>
                          </div>
                          </div>
                        </TableCell>
                        <TableCell>
                              <div className="space-y-2">
                                <Badge variant={getRoleBadgeVariant('role' in user ? user.role : 'user')}>
                                  {'role' in user ? user.role : 'user'}
                          </Badge>
                                {'permissions' in user && user.permissions && (
                          <div className="flex flex-wrap gap-1">
                                    {user.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            {/* <TableCell>
                              <div className="space-y-1">
                                {('phone' in user && user.phone) && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{user.phone}</span>
                                  </div>
                                )}
                                {('country' in user && user.country) && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span>{user.country}</span>
                                  </div>
                                )}
                                {('city' in user && user.city) && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{user.city}</span>
                                  </div>
                                )}
                          </div>
                        </TableCell> */}
                        <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
                                  {formatDate(user.created_at)}
                                </div>
                                {('last_login' in user && user.last_login) && (
                                  <div className="text-xs text-gray-500">
                                    Last login: {formatDate(user.last_login)}
                            </div>
                          )}
                              </div>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} users
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNum)}
                                isActive={currentPage === pageNum}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>{t('admin.users.activityLogs')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.users.table.user')}</TableHead>
                      <TableHead>{t('admin.users.table.action')}</TableHead>
                      <TableHead>{t('admin.users.table.resource')}</TableHead>
                      {/* <TableHead>{t('admin.users.table.details')}</TableHead> */}
                      <TableHead>{t('admin.users.table.timestamp')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.user_email}</div>
                            <div className="text-sm text-gray-500">ID: {log.user_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.resource_type}</div>
                            {log.resource_id && (
                              <div className="text-sm text-gray-500">ID: {log.resource_id}</div>
                            )}
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          {log.details ? (
                            <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          ) : (
                            <span className="text-sm text-gray-500">No details</span>
                          )}
                        </TableCell> */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{formatDate(log.created_at || '')}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
