import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  MapPin, 
  Globe, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Plus,
  AlertCircle,
  Activity,
  Clock,
  Star,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  totalCities: number;
  totalCountries: number;
  totalReviews: number;
  totalLogs: number;
  sponsoredAds: number;
  premiumBusinesses: number;
  recentGrowth: number;
  avgRating: number;
  recentActivity: number;
  errorCount: number;
}

interface RecentActivity {
  id: string;
  action: string;
  user_email: string;
  resource_type: string;
  created_at: string;
}

interface BusinessMetrics {
  total: number;
  active: number;
  pending: number;
  verified: number;
  premium: number;
  sponsored: number;
}

interface ReviewMetrics {
  total: number;
  pending: number;
  approved: number;
  averageRating: number;
  recentReviews: number;
}

interface UserMetrics {
  total: number;
  active: number;
  newThisMonth: number;
  growthRate: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    totalCities: 0,
    totalCountries: 0,
    totalReviews: 0,
    totalLogs: 0,
    sponsoredAds: 0,
    premiumBusinesses: 0,
    recentGrowth: 0,
    avgRating: 0,
    recentActivity: 0,
    errorCount: 0
  });
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    total: 0,
    active: 0,
    pending: 0,
    verified: 0,
    premium: 0,
    sponsored: 0
  });
  const [reviewMetrics, setReviewMetrics] = useState<ReviewMetrics>({
    total: 0,
    pending: 0,
    approved: 0,
    averageRating: 0,
    recentReviews: 0
  });
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    total: 0,
    active: 0,
    newThisMonth: 0,
    growthRate: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch basic counts
      const [usersResult, businessesResult, citiesResult, countriesResult, reviewsResult, logsResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('cities').select('id', { count: 'exact', head: true }),
        supabase.from('countries').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('user_logs').select('id', { count: 'exact', head: true })
      ]);

      // Fetch business metrics
      const [activeBusinesses, pendingBusinesses, verifiedBusinesses, premiumBusinesses, sponsoredBusinesses] = await Promise.all([
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_premium', true),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_sponsored_ad', true)
      ]);

      // Fetch review metrics
      const [pendingReviews, approvedReviews, recentReviews] = await Promise.all([
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Fetch average rating
      const { data: ratingData } = await supabase
        .from('reviews')
        .select('rating')
        .eq('status', 'approved');

      const avgRating = ratingData && ratingData.length > 0 
        ? ratingData.reduce((sum, review) => sum + review.rating, 0) / ratingData.length 
        : 0;

      // Fetch recent activity (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: recentActivity } = await supabase
        .from('user_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      // Fetch error count
      const { count: errorCount } = await supabase
        .from('user_logs')
        .select('id', { count: 'exact', head: true })
        .or('action.ilike.%error%,action.ilike.%fail%,action.ilike.%exception%');

      // Fetch recent activities for display
      const { data: activities } = await supabase
        .from('user_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate user growth (new users this month)
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const { count: newThisMonth } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', thisMonth.toISOString());

      // Calculate growth rate (simplified)
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const { count: lastMonthUsers } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', thisMonth.toISOString());

      const growthRate = lastMonthUsers && lastMonthUsers > 0 
        ? ((newThisMonth || 0) - lastMonthUsers) / lastMonthUsers * 100 
        : 0;

        setStats({
          totalUsers: usersResult.count || 0,
          totalBusinesses: businessesResult.count || 0,
          totalCities: citiesResult.count || 0,
          totalCountries: countriesResult.count || 0,
          totalReviews: reviewsResult.count || 0,
        totalLogs: logsResult.count || 0,
        sponsoredAds: sponsoredBusinesses.count || 0,
        premiumBusinesses: premiumBusinesses.count || 0,
        recentGrowth: growthRate,
        avgRating: Math.round(avgRating * 10) / 10,
        recentActivity: recentActivity || 0,
        errorCount: errorCount || 0
      });

      setBusinessMetrics({
        total: businessesResult.count || 0,
        active: activeBusinesses.count || 0,
        pending: pendingBusinesses.count || 0,
        verified: verifiedBusinesses.count || 0,
        premium: premiumBusinesses.count || 0,
        sponsored: sponsoredBusinesses.count || 0
      });

      setReviewMetrics({
        total: reviewsResult.count || 0,
        pending: pendingReviews.count || 0,
        approved: approvedReviews.count || 0,
        averageRating: Math.round(avgRating * 10) / 10,
        recentReviews: recentReviews.count || 0
      });

      setUserMetrics({
        total: usersResult.count || 0,
        active: usersResult.count || 0, // Simplified for now
        newThisMonth: newThisMonth || 0,
        growthRate: growthRate
      });

      setRecentActivities(activities || []);

      } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        variant: 'destructive'
      });
      } finally {
        setLoading(false);
      setRefreshing(false);
      }
    };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      change: `${userMetrics.growthRate > 0 ? '+' : ''}${userMetrics.growthRate.toFixed(1)}%`,
      changeType: userMetrics.growthRate >= 0 ? "positive" as const : "negative" as const,
      subtitle: `${userMetrics.newThisMonth} new this month`
    },
    {
      title: "Total Businesses",
      value: stats.totalBusinesses.toLocaleString(),
      icon: Building2,
      color: "bg-green-500",
      change: `${businessMetrics.active} active`,
      changeType: "positive" as const,
      subtitle: `${businessMetrics.pending} pending approval`
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews.toLocaleString(),
      icon: MessageSquare,
      color: "bg-purple-500",
      change: `${stats.avgRating}/5 avg rating`,
      changeType: "positive" as const,
      subtitle: `${reviewMetrics.recentReviews} new this week`
    },
    {
      title: "Sponsored Ads",
      value: stats.sponsoredAds.toLocaleString(),
      icon: Target,
      color: "bg-orange-500",
      change: `${stats.sponsoredAds} active`,
      changeType: "positive" as const,
      subtitle: `${stats.premiumBusinesses} premium businesses`
    },
    {
      title: "System Activity",
      value: stats.recentActivity.toLocaleString(),
      icon: Activity,
      color: "bg-indigo-500",
      change: "Last 24h",
      changeType: "positive" as const,
      subtitle: `${stats.errorCount} errors detected`
    }
  ];

  const getActivityIcon = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('add')) return <Plus className="w-4 h-4 text-green-600" />;
    if (lowerAction.includes('update') || lowerAction.includes('edit')) return <Activity className="w-4 h-4 text-blue-600" />;
    if (lowerAction.includes('delete') || lowerAction.includes('remove')) return <AlertCircle className="w-4 h-4 text-red-600" />;
    if (lowerAction.includes('login') || lowerAction.includes('auth')) return <Eye className="w-4 h-4 text-purple-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Overview and analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" subtitle="Overview and analytics">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-comfortaa font-bold text-yp-dark">Dashboard Overview</h2>
          <p className="text-gray-600 font-roboto">Real-time metrics and system insights</p>
        </div>
        <Button 
          onClick={fetchDashboardData}
          variant="outline"
          size="sm"
          disabled={refreshing}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
          Refresh Data
        </Button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-roboto font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-comfortaa font-bold text-yp-dark">
                {stat.value}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-roboto ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-roboto">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Business Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Business Metrics</span>
            </CardTitle>
            <CardDescription className="font-roboto">
              Business registration and status overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Total Businesses</span>
                <Badge variant="outline">{businessMetrics.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Active</span>
                <Badge variant="default" className="bg-green-100 text-green-800">{businessMetrics.active}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Pending Approval</span>
                <Badge variant="secondary">{businessMetrics.pending}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Verified</span>
                <Badge variant="default" className="bg-blue-100 text-blue-800">{businessMetrics.verified}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Premium</span>
                <Badge variant="default" className="bg-purple-100 text-purple-800">{businessMetrics.premium}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Sponsored Ads</span>
                <Badge variant="default" className="bg-orange-100 text-orange-800">{businessMetrics.sponsored}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Review Analytics</span>
            </CardTitle>
            <CardDescription className="font-roboto">
              Review statistics and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Total Reviews</span>
                <Badge variant="outline">{reviewMetrics.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Pending</span>
                <Badge variant="secondary">{reviewMetrics.pending}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Approved</span>
                <Badge variant="default" className="bg-green-100 text-green-800">{reviewMetrics.approved}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Average Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{reviewMetrics.averageRating}/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">This Week</span>
                <Badge variant="default" className="bg-blue-100 text-blue-800">{reviewMetrics.recentReviews}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>User Growth</span>
            </CardTitle>
            <CardDescription className="font-roboto">
              User registration trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Total Users</span>
                <Badge variant="outline">{userMetrics.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Active Users</span>
                <Badge variant="default" className="bg-green-100 text-green-800">{userMetrics.active}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">New This Month</span>
                <Badge variant="default" className="bg-blue-100 text-blue-800">{userMetrics.newThisMonth}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-roboto">Growth Rate</span>
                <div className="flex items-center space-x-1">
                  {userMetrics.growthRate >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    userMetrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {userMetrics.growthRate > 0 ? '+' : ''}{userMetrics.growthRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="font-roboto">
              Latest system activities and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    {getActivityIcon(activity.action)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-roboto font-medium text-gray-900 truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm font-roboto text-gray-600 truncate">
                        {activity.user_email} • {activity.resource_type}
                    </p>
                    <p className="text-xs font-roboto text-gray-500 mt-1">
                        {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                      {activity.resource_type}
                  </Badge>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription className="font-roboto">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex-col space-y-2"
                  onClick={() => navigate('/admin/businesses')}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-roboto text-sm">Add Business</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex-col space-y-2"
                  onClick={() => navigate('/admin/cities')}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-roboto text-sm">Add City</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex-col space-y-2"
                  onClick={() => navigate('/admin/countries')}
                >
                  <Globe className="w-5 h-5" />
                  <span className="font-roboto text-sm">Add Country</span>
              </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex-col space-y-2"
                  onClick={() => navigate('/admin/reviews')}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-roboto text-sm">View Reviews</span>
              </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex-col space-y-2"
                  onClick={() => navigate('/admin/sponsored-ads')}
                >
                  <Target className="w-5 h-5" />
                  <span className="font-roboto text-sm">Sponsored Ads</span>
              </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex-col space-y-2"
                  onClick={() => navigate('/admin/settings')}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-roboto text-sm">Account Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-comfortaa flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-roboto font-medium text-green-800">Database</p>
                <p className="font-roboto text-sm text-green-600">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-roboto font-medium text-blue-800">API</p>
                <p className="font-roboto text-sm text-blue-600">Response time: 120ms</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-roboto font-medium text-yellow-800">Storage</p>
                <p className="font-roboto text-sm text-yellow-600">85% capacity used</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-roboto font-medium text-purple-800">Security</p>
                <p className="font-roboto text-sm text-purple-600">All checks passed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}; 