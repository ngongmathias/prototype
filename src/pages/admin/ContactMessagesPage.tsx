import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContactMessages, ContactMessage } from "@/hooks/useContactMessages";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  MessageSquare, 
  Archive,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  User,
  Calendar,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const ContactMessagesPage = () => {
  const { t } = useTranslation();
  const { getContactMessages, updateContactMessageStatus, deleteContactMessage } = useContactMessages();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (messageId: string, newStatus: string) => {
    try {
      const success = await updateContactMessageStatus(messageId, newStatus);
      if (success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, status: newStatus } : msg
          )
        );
        toast.success('Status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const success = await deleteContactMessage(messageId);
        if (success) {
          setMessages(prev => prev.filter(msg => msg.id !== messageId));
          toast.success('Message deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: "bg-blue-100 text-blue-800", icon: <Clock className="w-3 h-3" /> },
      read: { color: "bg-yellow-100 text-yellow-800", icon: <Eye className="w-3 h-3" /> },
      replied: { color: "bg-green-100 text-green-800", icon: <MessageSquare className="w-3 h-3" /> },
      closed: { color: "bg-gray-100 text-gray-800", icon: <Archive className="w-3 h-3" /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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

  return (
    <AdminLayout 
      title="Contact Messages" 
      subtitle="Manage and respond to customer inquiries"
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={fetchMessages}
            variant="outline"
            size="sm"
            className="font-roboto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        {/* Filters and Search */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-comfortaa">Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-roboto"
                  />
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yp-blue focus:border-transparent font-roboto"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600 font-roboto">
                  {filteredMessages.length} of {messages.length} messages
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-comfortaa">Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue mx-auto"></div>
                <p className="text-gray-600 mt-2 font-roboto">Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-roboto">No messages found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-roboto">Contact Info</TableHead>
                      <TableHead className="font-roboto">Subject</TableHead>
                      <TableHead className="font-roboto">Message Preview</TableHead>
                      <TableHead className="font-roboto">Status</TableHead>
                      <TableHead className="font-roboto">Date</TableHead>
                      <TableHead className="font-roboto">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium font-roboto">
                                {message.first_name} {message.last_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 font-roboto">
                                {message.email}
                              </span>
                            </div>
                            {message.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600 font-roboto">
                                  {message.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 font-roboto truncate">
                              {message.subject}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-600 font-roboto line-clamp-2">
                              {message.message}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(message.status || 'new')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 font-roboto">
                              {formatDate(message.created_at || '')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMessage(message);
                                  setShowMessageModal(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(message.id!, 'read')}
                                className="cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Read
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(message.id!, 'replied')}
                                className="cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Mark as Replied
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(message.id!, 'closed')}
                                className="cursor-pointer"
                              >
                                <Archive className="w-4 h-4 mr-2" />
                                Mark as Closed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteMessage(message.id!)}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-comfortaa">
                  Message Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMessageModal(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">
                      First Name
                    </label>
                    <p className="text-gray-900 font-roboto">{selectedMessage.first_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">
                      Last Name
                    </label>
                    <p className="text-gray-900 font-roboto">{selectedMessage.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">
                      Email
                    </label>
                    <p className="text-gray-900 font-roboto">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">
                      Phone
                    </label>
                    <p className="text-gray-900 font-roboto">
                      {selectedMessage.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">
                    Subject
                  </label>
                  <p className="text-gray-900 font-roboto">{selectedMessage.subject}</p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">
                    Message
                  </label>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-900 font-roboto whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Status and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">
                      Status
                    </label>
                    {getStatusBadge(selectedMessage.status || 'new')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-roboto">
                      Received
                    </label>
                    <p className="text-gray-900 font-roboto">
                      {formatDate(selectedMessage.created_at || '')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedMessage.id!, 'read');
                      setShowMessageModal(false);
                    }}
                    variant="outline"
                    className="font-roboto"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedMessage.id!, 'replied');
                      setShowMessageModal(false);
                    }}
                    variant="outline"
                    className="font-roboto"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Mark as Replied
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedMessage.id!, 'closed');
                      setShowMessageModal(false);
                    }}
                    variant="outline"
                    className="font-roboto"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Mark as Closed
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeleteMessage(selectedMessage.id!);
                      setShowMessageModal(false);
                    }}
                    variant="destructive"
                    className="font-roboto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContactMessagesPage;
