import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Crown,
  MessageSquare,
  User,
  Building2,
  Flag,
  Printer,
  Download,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_id: string;
  user_email?: string;
  business_id: string;
  business_name?: string;
  business_category?: string;
  city_name?: string;
  country_name?: string;
  is_flagged: boolean;
  flag_reason?: string;
}

export const AdminReviews = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const printRef = useRef<HTMLDivElement>(null);
  const recordsPerPage = 15;

  useEffect(() => {
    fetchReviews();
  }, [currentPage, sortField, sortDirection, statusFilter, ratingFilter, searchTerm]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        setCurrentPage(1);
        setFilterLoading(true);
        fetchReviews();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Build the query
      let query = db
        .reviews()
        .select(`
          *,
          users!inner(email),
          businesses!inner(name, categories!inner(name, slug), cities!inner(name, countries!inner(name)))
        `);

      // Apply filters
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      if (ratingFilter !== "all") {
        query = query.eq('rating', parseInt(ratingFilter));
      }

      // Apply search filter
      if (searchTerm.trim() !== "") {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      // Get total count for pagination - using a separate count query
      const { count, error: countError } = await db
        .reviews()
        .select('id', { count: 'exact', head: true });
      if (countError) throw countError;
      
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / recordsPerPage));

      // Apply sorting and pagination
      const { data, error } = await query
        .order(sortField, { ascending: sortDirection === "asc" })
        .range((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage - 1);

      if (error) throw error;
      
      const reviewsWithDetails = data?.map(review => ({
        ...review,
        user_email: review.users?.email,
        business_name: review.businesses?.name,
        business_category: review.businesses?.categories?.name,
        city_name: review.businesses?.cities?.name,
        country_name: review.businesses?.cities?.countries?.name
      })) || [];
      
      setReviews(reviewsWithDetails);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const { error } = await db
        .reviews()
        .update({ status: newStatus })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Review status updated to ${newStatus}`,
      });

      fetchReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive"
      });
    }
  };

  const handleFlagReview = async (reviewId: string, reason: string) => {
    try {
      const { error } = await db
        .reviews()
        .update({ 
          is_flagged: true, 
          flag_reason: reason 
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review flagged successfully",
      });

      fetchReviews();
    } catch (error) {
      console.error('Error flagging review:', error);
      toast({
        title: "Error",
        description: "Failed to flag review",
        variant: "destructive"
      });
    }
  };

  const openViewDialog = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilterLoading(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Crown
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Reviews Report</title>
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
                <h1>Reviews Management Report</h1>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
              </div>
              <div class="stats">
                <div class="stat-item">
                  <h3>Total Reviews</h3>
                  <p>${totalCount}</p>
                </div>
                <div class="stat-item">
                  <h3>Pending</h3>
                  <p>${reviews.filter(r => r.status === 'pending').length}</p>
                </div>
                <div class="stat-item">
                  <h3>Approved</h3>
                  <p>${reviews.filter(r => r.status === 'approved').length}</p>
                </div>
                <div class="stat-item">
                  <h3>Flagged</h3>
                  <p>${reviews.filter(r => r.is_flagged).length}</p>
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
    const headers = ['ID', 'Title', 'Rating', 'Status', 'User Email', 'Business Name', 'Category', 'City', 'Country', 'Created Date', 'Flagged'];
    const csvContent = [
      headers.join(','),
      ...reviews.map(review => [
        review.id,
        `"${review.title?.replace(/"/g, '""')}"`,
        review.rating,
        review.status,
        review.user_email,
        `"${review.business_name?.replace(/"/g, '""')}"`,
        review.business_category,
        review.city_name,
        review.country_name,
        new Date(review.created_at).toLocaleDateString(),
        review.is_flagged ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <AdminLayout title="Reviews Management" subtitle="Moderate and manage user reviews">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Reviews Management" subtitle="Moderate and manage user reviews">
      {/* Header Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-roboto text-gray-600">Total Reviews</p>
                <p className="text-2xl font-comfortaa font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-roboto text-gray-600">Pending</p>
                <p className="text-2xl font-comfortaa font-bold text-gray-900">
                  {reviews.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-roboto text-gray-600">Approved</p>
                <p className="text-2xl font-comfortaa font-bold text-gray-900">
                  {reviews.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flag className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-roboto text-gray-600">Flagged</p>
                <p className="text-2xl font-comfortaa font-bold text-gray-900">
                  {reviews.filter(r => r.is_flagged).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Search, Filters, and Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-roboto"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => { 
              setStatusFilter(value); 
              setCurrentPage(1); 
              setFilterLoading(true);
            }}>
              <SelectTrigger className="font-roboto">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-roboto">All Statuses</SelectItem>
                <SelectItem value="pending" className="font-roboto">Pending</SelectItem>
                <SelectItem value="approved" className="font-roboto">Approved</SelectItem>
                <SelectItem value="rejected" className="font-roboto">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={(value) => { 
              setRatingFilter(value); 
              setCurrentPage(1); 
              setFilterLoading(true);
            }}>
              <SelectTrigger className="font-roboto">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-roboto">All Ratings</SelectItem>
                <SelectItem value="5" className="font-roboto">5 Crowns</SelectItem>
                <SelectItem value="4" className="font-roboto">4 Crowns</SelectItem>
                <SelectItem value="3" className="font-roboto">3 Crowns</SelectItem>
                <SelectItem value="2" className="font-roboto">2 Crowns</SelectItem>
                <SelectItem value="1" className="font-roboto">1 Crown</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="font-roboto"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="font-roboto"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setRatingFilter("all");
                setCurrentPage(1);
                setFilterLoading(true);
              }}
              className="font-roboto"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <div ref={printRef}>
        <Card className="mb-6">
          <CardContent className="p-0">
            {filterLoading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yp-blue"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            )}
            {!filterLoading && (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Rating</span>
                      {sortField === 'rating' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      {sortField === 'title' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {sortField === 'created_at' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-gray-50">
                    <TableCell>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {review.title}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate" title={review.content}>
                        {review.content}
                      </div>
                    </TableCell>
                    <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`font-roboto ${getStatusColor(review.status)}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(review.status)}
                        <span className="capitalize">{review.status}</span>
                      </div>
                    </Badge>
                    {review.is_flagged && (
                        <Badge variant="destructive" className="ml-2 font-roboto">
                        <Flag className="w-3 h-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={review.user_email}>
                      {review.user_email}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <div className="font-medium truncate" title={review.business_name}>
                          {review.business_name}
                  </div>
                        <div className="text-sm text-gray-500 truncate">
                          {review.business_category}
                    </div>
                        <div className="text-xs text-gray-400 truncate">
                          {review.city_name}, {review.country_name}
                    </div>
                  </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(review.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewDialog(review)}
                          className="font-roboto text-xs"
                  >
                          <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  
                  {review.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(review.id, 'approved')}
                              className="text-green-600 border-green-200 hover:bg-green-50 font-roboto text-xs"
                      >
                              <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                              className="text-red-600 border-red-200 hover:bg-red-50 font-roboto text-xs"
                      >
                              <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {!review.is_flagged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagReview(review.id, 'Inappropriate content')}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50 font-roboto text-xs"
                    >
                            <Flag className="w-3 h-3 mr-1" />
                      Flag
                    </Button>
                  )}
                </div>
                    </TableCell>
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
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-roboto">
                Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, totalCount)} of {totalCount} reviews
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

      {/* No Results */}
      {reviews.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-comfortaa font-semibold text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600 font-roboto">
              Try adjusting your filters or search terms.
            </p>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}; 