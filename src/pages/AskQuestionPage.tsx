import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { QuestionService, CreateQuestionData } from "@/lib/questionService";
import { ArrowLeft, Send, User, Mail, Tag, MessageSquare } from "lucide-react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const questionCategories = [
  "Health & Medical",
  "Legal",
  "Financial",
  "Automotive",
  "Home & Garden",
  "Pets",
  "Technology",
  "Education",
  "Travel",
  "Food & Dining",
  "Other"
];

export const AskQuestionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateQuestionData>({
    title: "",
    content: "",
    user_name: "",
    user_email: "",
    category: ""
  });

  const handleInputChange = (field: keyof CreateQuestionData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error(t('questions.form.titleRequired'));
      return;
    }
    if (!formData.content.trim()) {
      toast.error(t('questions.form.contentRequired'));
      return;
    }
    if (!formData.user_name.trim()) {
      toast.error(t('questions.form.nameRequired'));
      return;
    }
    if (!formData.user_email.trim()) {
      toast.error(t('questions.form.emailRequired'));
      return;
    }
    if (!formData.category) {
      toast.error(t('questions.form.categoryRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      await QuestionService.createQuestion(formData);
      toast.success(t('questions.form.submitted'));
      navigate('/');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error(t('questions.form.submissionError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yp-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-comfortaa font-bold text-yp-dark mb-2">
              {t('questions.page.subtitle')}
            </h2>
            <p className="text-yp-gray-dark text-sm sm:text-base">
              {t('questions.page.description')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-yp-dark mb-2">
                {t('questions.form.titleLabel')}
              </label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={t('questions.form.titlePlaceholder')}
                className="w-full"
                maxLength={100}
              />
              <p className="text-xs text-yp-gray-dark mt-1">
                {formData.title.length}/100 {t('questions.form.characters')}
              </p>
            </div>

            {/* Question Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-yp-dark mb-2">
                {t('questions.form.contentLabel')}
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder={t('questions.form.contentPlaceholder')}
                className="w-full min-h-[120px]"
                maxLength={1000}
              />
              <p className="text-xs text-yp-gray-dark mt-1">
                {formData.content.length}/1000 {t('questions.form.characters')}
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-yp-dark mb-2">
                {t('questions.form.categoryLabel')}
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yp-blue focus:border-transparent"
                >
                  <option value="">{t('questions.form.selectCategory')}</option>
                  {questionCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Tag className="absolute right-3 top-2.5 h-5 w-5 text-yp-gray-dark" />
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-yp-dark mb-2">
                  {t('questions.form.nameLabel')}
                </label>
                <div className="relative">
                  <Input
                    id="user_name"
                    type="text"
                    value={formData.user_name}
                    onChange={(e) => handleInputChange('user_name', e.target.value)}
                    placeholder={t('questions.form.namePlaceholder')}
                    className="w-full"
                  />
                  <User className="absolute right-3 top-2.5 h-5 w-5 text-yp-gray-dark" />
                </div>
              </div>

              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-yp-dark mb-2">
                  {t('questions.form.emailLabel')}
                </label>
                <div className="relative">
                  <Input
                    id="user_email"
                    type="email"
                    value={formData.user_email}
                    onChange={(e) => handleInputChange('user_email', e.target.value)}
                    placeholder={t('questions.form.emailPlaceholder')}
                    className="w-full"
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-yp-gray-dark" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yp-green hover:bg-yp-green/90 text-white font-roboto font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('questions.form.submitting')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>{t('questions.form.submit')}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-yp-gray-light rounded-lg">
            <h3 className="font-roboto font-semibold text-yp-dark mb-2">
              {t('questions.page.infoTitle')}
            </h3>
            <ul className="text-sm text-yp-gray-dark space-y-1">
              <li>• {t('questions.page.info1')}</li>
              <li>• {t('questions.page.info2')}</li>
              <li>• {t('questions.page.info3')}</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
