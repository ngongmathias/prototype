import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { useContactMessages, ContactMessage } from "@/hooks/useContactMessages";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Building,
  User,
  Mail as MailIcon
} from "lucide-react";

const ContactUsPage = () => {
  const { t } = useTranslation();
  const { submitContactMessage, loading } = useContactMessages();
  const [formData, setFormData] = useState<ContactMessage>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: keyof ContactMessage, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.first_name.trim() || !formData.last_name.trim() || 
        !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    const success = await submitContactMessage(formData);
    if (success) {
      // Reset form on successful submission
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-yp-blue to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-comfortaa">
              {t('contact.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-roboto">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-comfortaa flex items-center">
                      <MessageCircle className="w-6 h-6 mr-2 text-yp-blue" />
                      {t('contact.form.title')}
                    </CardTitle>
                    <CardDescription className="font-roboto">
                      {t('contact.form.description')}
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                            {t('contact.form.firstName')}
                          </label>
                          <Input 
                            placeholder={t('contact.form.firstNamePlaceholder')}
                            className="font-roboto"
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                            {t('contact.form.lastName')}
                          </label>
                          <Input 
                            placeholder={t('contact.form.lastNamePlaceholder')}
                            className="font-roboto"
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                          {t('contact.form.email')}
                        </label>
                        <Input 
                          type="email"
                          placeholder={t('contact.form.emailPlaceholder')}
                          className="font-roboto"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                          {t('contact.form.phone')}
                        </label>
                        <Input 
                          type="tel"
                          placeholder={t('contact.form.phonePlaceholder')}
                          className="font-roboto"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                          {t('contact.form.subject')}
                        </label>
                        <Input 
                          placeholder={t('contact.form.subjectPlaceholder')}
                          className="font-roboto"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                          {t('contact.form.message')}
                        </label>
                        <Textarea 
                          placeholder={t('contact.form.messagePlaceholder')}
                          rows={5}
                          className="font-roboto"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                        />
                      </div>

                      <Button 
                        type="submit"
                        className="w-full bg-yp-blue hover:bg-yp-blue/90 font-roboto"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t('common.loading')}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {t('contact.form.sendMessage')}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* General Contact */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-comfortaa flex items-center">
                      <Building className="w-5 h-5 mr-2 text-yp-blue" />
                      {t('contact.info.general.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-yp-blue mt-1" />
                      <div>
                        <p className="font-semibold font-roboto">{t('contact.info.general.phone')}</p>
                        <p className="text-gray-600 font-roboto">(+250) 791 568 519</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-yp-blue mt-1" />
                      <div>
                        <p className="font-semibold font-roboto">{t('contact.info.general.email')}</p>
                        <p className="text-gray-600 font-roboto">info@bara.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-yp-blue mt-1" />
                      <div>
                        <p className="font-semibold font-roboto">{t('contact.info.general.address')}</p>
                        <p className="text-gray-600 font-roboto">{t('contact.info.general.addressValue')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-yp-blue mt-1" />
                      <div>
                        <p className="font-semibold font-roboto">{t('contact.info.general.hours')}</p>
                        <p className="text-gray-600 font-roboto">{t('contact.info.general.hoursValue')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Support */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-comfortaa flex items-center">
                      <User className="w-5 h-5 mr-2 text-yp-blue" />
                      {t('contact.info.support.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-yp-blue mt-1" />
                      <div>
                        <p className="font-semibold font-roboto">{t('contact.info.support.phone')}</p>
                        <p className="text-gray-600 font-roboto">(+250) 791 568 519</p>
                        <p className="text-sm text-gray-500 font-roboto">{t('contact.info.support.phoneHours')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MailIcon className="w-5 h-5 text-yp-blue mt-1" />
                      <div>
                        <p className="font-semibold font-roboto">{t('contact.info.support.email')}</p>
                        <p className="text-gray-600 font-roboto">support@bara.com</p>
                        <p className="text-sm text-gray-500 font-roboto">{t('contact.info.support.emailResponse')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Inquiries */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-comfortaa flex items-center">
                      <Building className="w-5 h-5 mr-2 text-yp-blue" />
                      {t('contact.info.business.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MailIcon className="w-5 h-5 text-yp-blue mt-1" />
                      <div>
                        <p className="font-semibold font-roboto">{t('contact.info.business.email')}</p>
                        <p className="text-gray-600 font-roboto">business@bara.com</p>
                        <p className="text-sm text-gray-500 font-roboto">{t('contact.info.business.description')}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full font-roboto">
                      {t('contact.info.business.learnMore')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-comfortaa">
                {t('contact.faq.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-roboto">
                {t('contact.faq.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-comfortaa">
                    {t('contact.faq.question1')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-roboto">{t('contact.faq.answer1')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-comfortaa">
                    {t('contact.faq.question2')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-roboto">{t('contact.faq.answer2')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-comfortaa">
                    {t('contact.faq.question3')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-roboto">{t('contact.faq.answer3')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-comfortaa">
                    {t('contact.faq.question4')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-roboto">{t('contact.faq.answer4')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-yp-blue text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-comfortaa">
              {t('contact.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto font-roboto">
              {t('contact.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-yp-blue hover:bg-gray-100 font-roboto">
                {t('contact.cta.primaryButton')}
              </Button>
              <Button size="lg" className="bg-white text-yp-blue hover:bg-gray-100 font-roboto">
                {t('contact.cta.secondaryButton')}
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactUsPage;
