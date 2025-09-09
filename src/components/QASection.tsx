import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle, Lightbulb } from "lucide-react";

const popularTopics = [
  { name: "Dentists", category: "Health & Medical" },
  { name: "Family Law", category: "Legal" },
  { name: "Insurance", category: "Financial" },
  { name: "Auto Repair", category: "Automotive" },
  { name: "Home Improvement", category: "Home & Garden" },
  { name: "Dogs", category: "Pets" },
  { name: "Plumbing", category: "Home & Garden" }
];

export const QASection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTopicClick = (topic: string) => {
    console.log(`Clicked on topic: ${topic}`);
    // Navigation logic would be implemented here
  };

  return (
    <section className="py-6 sm:py-8 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Left Side - Q&A Feature */}
          <div className="text-center md:text-left order-2 md:order-1">
            <div className="flex items-center justify-center md:justify-start mb-3 sm:mb-4 md:mb-6">
              <div className="flex space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yp-blue rounded-full flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yp-green rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yp-yellow rounded-full flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yp-dark" />
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
              <p className="font-roboto text-sm sm:text-base md:text-lg text-yp-dark leading-relaxed">
                {t('qa.askQuestions')}
              </p>
              <p className="font-roboto text-sm sm:text-base md:text-lg text-yp-dark leading-relaxed">
                {t('qa.shareKnowledge')}
              </p>
              <p className="font-roboto text-sm sm:text-base md:text-lg text-yp-dark leading-relaxed">
                {t('qa.findAnswers')}
              </p>
            </div>

            <Button 
              onClick={() => navigate('/ask-question')}
              className="w-full md:w-auto bg-yp-green hover:bg-yp-green/90 text-white font-roboto font-semibold text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 h-auto rounded-lg"
            >
              {t('qa.askQuestion')}
            </Button>
          </div>

          {/* Right Side - Popular Topics */}
          <div className="order-1 md:order-2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-comfortaa font-bold text-yp-dark mb-3 sm:mb-4 md:mb-6 text-center md:text-left leading-tight">
              {t('qa.browsePopular')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {popularTopics.map((topic) => (
                <button
                  key={topic.name}
                  onClick={() => handleTopicClick(topic.name)}
                  className="text-left p-2 sm:p-3 md:p-4 bg-white border border-yp-gray-medium rounded-lg hover:border-[#4e3c28] hover:bg-yp-gray-light transition-all duration-200 group touch-manipulation"
                >
                  <h4 className="font-roboto font-semibold text-[#e64600] group-hover:text-[#4e3c28] text-xs sm:text-sm md:text-base leading-tight">
                    {topic.name}
                  </h4>
                  <p className="font-roboto text-xs md:text-sm text-yp-gray-dark mt-1 leading-relaxed">
                    {topic.category}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};