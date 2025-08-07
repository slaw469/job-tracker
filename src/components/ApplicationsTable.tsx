import React, { useState, useMemo, useEffect } from 'react';
import { JobApplication } from '../types/application';
import { useTheme } from '../contexts/ThemeContext';
import { getRandomJobMarketQuote } from '../data/jobMarketQuotes';
import { WelcomeModal } from './WelcomeModal';
import {
  Search, Eye, ExternalLink, Calendar, Building2, Bot, Plus, Target, Check, X as XIcon, Mail, Settings, Sun, Moon, LogOut, User, RefreshCw, Inbox, Clock
} from 'lucide-react';

interface User {
  name: string;
  email: string;
}

interface ApplicationsTableProps {
  applications: JobApplication[];
  onSelectApplication: (application: JobApplication) => void;
  onAddApplication: () => void;
  user: User;
  onLogout: () => void;
  onGmailScrape?: (newApplications: JobApplication[]) => void;
  showWelcome?: boolean;
  onWelcomeClose?: () => void;
}

export function ApplicationsTable({ 
  applications, 
  onSelectApplication, 
  onAddApplication, 
  user, 
  onLogout,
  onGmailScrape,
  showWelcome = false,
  onWelcomeClose
}: ApplicationsTableProps) {
  const { isDark, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof JobApplication>('dateAdded');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showSettings, setShowSettings] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(getRandomJobMarketQuote());
  const [isScrapingGmail, setIsScrapingGmail] = useState(false);
  const [lastScrapeTime, setLastScrapeTime] = useState<Date | null>(null);

  useEffect(() => {
    // Change quote every 10 seconds for demo
    const interval = setInterval(() => {
      setDailyQuote(getRandomJobMarketQuote());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Mock Gmail scraping function
  const handleGmailScrape = async () => {
    setIsScrapingGmail(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock scraped applications from Gmail
    const scrapedApplications: JobApplication[] = [
      {
        id: `gmail_${Date.now()}_1`,
        jobTitle: 'Senior Software Engineer',
        company: 'TechFlow Solutions',
        dateApplied: new Date().toISOString().split('T')[0],
        dateAdded: new Date().toISOString(),
        source: 'Gmail',
        jobUrl: 'https://techflow.com/careers/senior-engineer',
        emailSubject: 'Thank you for your application - Senior Software Engineer Position',
        appliedVia: 'Gmail automation',
        hasReferral: false,
        notes: 'Auto-detected from Gmail confirmation email'
      },
      {
        id: `gmail_${Date.now()}_2`,
        jobTitle: 'Product Manager',
        company: 'InnovateCorp',
        dateApplied: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 hours ago
        dateAdded: new Date().toISOString(),
        source: 'Gmail',
        emailSubject: 'Application Received: Product Manager Role at InnovateCorp',
        appliedVia: 'Gmail automation',
        hasReferral: true,
        notes: 'Auto-detected from Gmail confirmation email'
      },
      {
        id: `gmail_${Date.now()}_3`,
        jobTitle: 'UX Designer',
        company: 'DesignStudio Pro',
        dateApplied: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString().split('T')[0], // 8 hours ago
        dateAdded: new Date().toISOString(),
        source: 'Gmail',
        jobUrl: 'https://designstudio.com/jobs/ux-designer',
        emailSubject: 'We received your application for UX Designer position',
        appliedVia: 'Gmail automation',
        hasReferral: false,
        notes: 'Auto-detected from Gmail confirmation email'
      }
    ];

    setLastScrapeTime(new Date());
    setIsScrapingGmail(false);

    // Call the parent function to add these applications
    if (onGmailScrape) {
      onGmailScrape(scrapedApplications);
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.emailSubject && app.emailSubject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'dateApplied' || sortField === 'dateAdded') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      // Handle undefined values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [applications, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof JobApplication) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCasualGreeting = () => {
    const greetings = [
      "You submit any more applications today?",
      "You been applying lately?",
      "How's the job search going?",
      "Ready to crush some more applications?",
      "Find any good opportunities today?",
      "What companies are we targeting today?",
      "Any interviews lined up this week?",
      "How many applications are we at now?",
      "Discovered any dream jobs lately?",
      "Time to update that application list?",
      "Any responses from your recent applications?",
      "What's the job hunting strategy today?",
      "Ready to land that perfect role?",
      "How's your application game been?",
      "Any promising leads to follow up on?"
    ];
    
    // Use user name as seed for consistency per session
    const seed = user.name.length + new Date().getDate();
    return greetings[seed % greetings.length];
  };

  const getQuoteColor = (type: string) => {
    if (isDark) {
      switch (type) {
        case 'ceo_quote': return 'text-blue-400';
        case 'fact': return 'text-red-400';
        case 'prediction': return 'text-purple-400';
        case 'trend': return 'text-green-400';
        default: return 'text-gray-400';
      }
    } else {
      switch (type) {
        case 'ceo_quote': return 'text-blue-600';
        case 'fact': return 'text-red-600';
        case 'prediction': return 'text-purple-600';
        case 'trend': return 'text-green-600';
        default: return 'text-gray-600';
      }
    }
  };

  return (
    <>
      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={onWelcomeClose || (() => {})} 
        userName={user.name} 
      />

      <div className={`min-h-screen transition-colors duration-200 ${
        isDark 
          ? 'bg-[#0a0a0a] text-white' 
          : 'bg-[#fafafa] text-gray-900'
      }`}>
        {/* Main Greeting Section */}
        <div className={`${
          isDark 
            ? 'bg-[#0a0a0a] border-gray-800' 
            : 'bg-white border-gray-200'
        } border-b px-8 py-16 text-center transition-colors duration-200`}>
          <div className="max-w-5xl mx-auto">
            <h1 className={`text-6xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`} 
              style={{ 
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif'
              }}
            >
              {getTimeGreeting()}, {user.name}
            </h1>
            <p className={`text-xl mb-12 font-light ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {getCasualGreeting()}
            </p>

            {/* Premium Gmail Scraper Section */}
            <div className="mb-12">
              <div className="relative inline-block">
                {/* Rainbow glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 via-green-400 via-yellow-400 to-red-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                
                <button
                  onClick={handleGmailScrape}
                  disabled={isScrapingGmail}
                  className={`relative flex items-center gap-4 px-12 py-6 font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    isScrapingGmail
                      ? 'bg-white text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-900 hover:bg-gray-50 shadow-2xl'
                  }`}
                  style={{
                    borderRadius: '12px',
                    boxShadow: isScrapingGmail 
                      ? '0 10px 40px rgba(0,0,0,0.1)' 
                      : '0 20px 60px rgba(0,0,0,0.15), 0 0 40px rgba(147, 51, 234, 0.1)'
                  }}
                >
                  {isScrapingGmail ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                  ) : (
                    <Inbox className="w-6 h-6 text-blue-500" />
                  )}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                    {isScrapingGmail ? 'Scanning Gmail...' : 'Scan Gmail (Last 24hrs)'}
                  </span>
                  <Clock className="w-5 h-5 text-gray-500" />
                  
                  {/* Sparkle effects */}
                  {!isScrapingGmail && (
                    <>
                      <div className="absolute -top-1 -right-1 w-3 h-3">
                        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 bg-yellow-300 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2">
                        <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute inset-0 bg-pink-300 rounded-full"></div>
                      </div>
                    </>
                  )}
                </button>
              </div>
              
              {lastScrapeTime && (
                <p className={`text-sm mt-4 font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  ✨ Last scan: {lastScrapeTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          
          {/* Top Controls */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={toggleTheme}
              className={`p-3 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className={`p-3 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={onLogout}
              className={`p-3 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
            
            <button
              onClick={onAddApplication}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors duration-200 ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Application
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-8">
          {/* App Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 flex items-center justify-center relative">
              {/* Enhanced glow effect background with downward glow */}
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl"></div>
              <div className="absolute top-0 left-0 right-0 bottom-4 bg-white/10 blur-md rounded-2xl"></div>
              <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20"></div>
              
              {/* Logo */}
              <img 
                src="/logo.png" 
                alt="ApplyTrack" 
                className="w-8 h-8 object-contain relative z-10 drop-shadow-lg" 
                style={{
                  filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                }}
              />
            </div>
            <div>
              <h2 className={`text-xl font-semibold italic ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  textShadow: isDark ? '0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.4)' : '0 0 15px rgba(0, 0, 0, 0.3)'
                }}
              >
                ApplyTrack
              </h2>
              <p className={`text-sm italic ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  textShadow: isDark ? '0 0 10px rgba(156, 163, 175, 0.6)' : 'none'
                }}
              >
                Job Application CRM
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className={`w-5 h-5 absolute left-3 top-3 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-white' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-black'
                } focus:outline-none focus:ring-1 ${
                  isDark ? 'focus:ring-white' : 'focus:ring-black'
                }`}
              />
            </div>
          </div>

          {/* Table */}
          {filteredAndSortedApplications.length === 0 ? (
            <div className={`border p-12 text-center transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-200'
            }`}>
              <Bot className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {applications.length === 0 
                  ? 'Start tracking your job applications! Try scanning your Gmail for recent confirmations.'
                  : 'Try adjusting your search.'
                }
              </p>
            </div>
          ) : (
            <div className={`border overflow-hidden transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b transition-colors duration-200 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <tr>
                      <th className={`text-left p-4 border-r transition-colors duration-200 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <button
                          onClick={() => handleSort('jobTitle')}
                          className={`font-medium text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Job Title
                        </button>
                      </th>
                      <th className={`text-left p-4 border-r transition-colors duration-200 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <button
                          onClick={() => handleSort('company')}
                          className={`font-medium text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Company
                        </button>
                      </th>
                      <th className={`text-left p-4 border-r transition-colors duration-200 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <button
                          onClick={() => handleSort('dateApplied')}
                          className={`font-medium text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Date Applied
                        </button>
                      </th>
                      <th className={`text-left p-4 border-r transition-colors duration-200 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <button
                          onClick={() => handleSort('dateAdded')}
                          className={`font-medium text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Date Added
                        </button>
                      </th>
                      <th className={`text-left p-4 border-r transition-colors duration-200 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <button
                          onClick={() => handleSort('source')}
                          className={`font-medium text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Source
                        </button>
                      </th>
                      <th className={`text-left p-4 border-r transition-colors duration-200 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <span className={`font-medium text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Referral
                        </span>
                      </th>
                      <th className={`text-left p-4 border-r transition-colors duration-200 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <span className={`font-medium text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Email
                        </span>
                      </th>
                      <th className="text-left p-4">
                        <span className={`font-medium text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedApplications.map((application, index) => (
                      <tr key={application.id} className={`border-b transition-colors duration-200 ${
                        isDark 
                          ? 'border-gray-800 hover:bg-gray-800/50' 
                          : 'border-gray-100 hover:bg-gray-50'
                      } ${index % 2 === 0 
                        ? (isDark ? 'bg-gray-900' : 'bg-white') 
                        : (isDark ? 'bg-gray-900/50' : 'bg-gray-50/50')
                      }`}>
                        <td className={`p-4 border-r transition-colors duration-200 ${
                          isDark ? 'border-gray-800' : 'border-gray-100'
                        }`}>
                          <div className="flex items-center gap-3">
                            {application.appliedVia === 'Gmail automation' && (
                              <div title="Auto-tracked">
                                <Bot className="w-4 h-4 text-green-500" />
                              </div>
                            )}
                            <div className={`font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {application.jobTitle}
                            </div>
                          </div>
                        </td>
                        <td className={`p-4 border-r transition-colors duration-200 ${
                          isDark ? 'border-gray-800' : 'border-gray-100'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Building2 className={`w-4 h-4 ${
                              isDark ? 'text-gray-500' : 'text-gray-500'
                            }`} />
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>
                              {application.company}
                            </span>
                          </div>
                        </td>
                        <td className={`p-4 border-r transition-colors duration-200 ${
                          isDark ? 'border-gray-800' : 'border-gray-100'
                        }`}>
                          <div className={`flex items-center gap-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <Calendar className={`w-4 h-4 ${
                              isDark ? 'text-gray-500' : 'text-gray-500'
                            }`} />
                            {new Date(application.dateApplied).toLocaleDateString()}
                          </div>
                        </td>
                        <td className={`p-4 border-r transition-colors duration-200 ${
                          isDark ? 'border-gray-800' : 'border-gray-100'
                        }`}>
                          <div className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {new Date(application.dateAdded).toLocaleDateString()}
                          </div>
                        </td>
                        <td className={`p-4 border-r transition-colors duration-200 ${
                          isDark ? 'border-gray-800' : 'border-gray-100'
                        }`}>
                          <div className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {application.source}
                          </div>
                        </td>
                        <td className={`p-4 border-r transition-colors duration-200 ${
                          isDark ? 'border-gray-800' : 'border-gray-100'
                        }`}>
                          <div className="flex items-center">
                            {application.hasReferral ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <Check className="w-4 h-4" />
                                <span className="text-sm font-medium">Yes</span>
                              </div>
                            ) : (
                              <div className={`flex items-center gap-1 ${
                                isDark ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                <XIcon className="w-4 h-4" />
                                <span className="text-sm">No</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className={`p-4 border-r transition-colors duration-200 ${
                          isDark ? 'border-gray-800' : 'border-gray-100'
                        }`}>
                          {application.emailSubject ? (
                            <div className="flex items-center gap-1 text-blue-500">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm font-medium">Yes</span>
                            </div>
                          ) : (
                            <span className={`text-sm ${
                              isDark ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              No
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onSelectApplication(application)}
                              className={`p-2 transition-colors duration-200 ${
                                isDark 
                                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {application.jobUrl && (
                              <a
                                href={application.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 transition-colors duration-200 ${
                                  isDark 
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                title="View Job Posting"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`border shadow-2xl max-w-md w-full transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center justify-between p-6 border-b transition-colors duration-200 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <Settings className={`w-6 h-6 ${
                    isDark ? 'text-white' : 'text-black'
                  }`} />
                  <h2 className={`text-xl font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Settings
                  </h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 transition-colors duration-200 ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <XIcon className={`w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Display
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className={`w-4 h-4 border focus:ring-1 transition-colors duration-200 ${
                          isDark 
                            ? 'text-white bg-gray-800 border-gray-600 focus:ring-white' 
                            : 'text-black bg-white border-gray-300 focus:ring-black'
                        }`}
                      />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Show automation badges
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className={`w-4 h-4 border focus:ring-1 transition-colors duration-200 ${
                          isDark 
                            ? 'text-white bg-gray-800 border-gray-600 focus:ring-white' 
                            : 'text-black bg-white border-gray-300 focus:ring-black'
                        }`}
                      />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Show email indicators
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Account
                  </h3>
                  <div className={`p-3 border transition-colors duration-200 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.name}
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Data
                  </h3>
                  <button className={`w-full p-3 border text-sm font-medium transition-colors duration-200 ${
                    isDark 
                      ? 'bg-red-900/20 text-red-400 border-red-800 hover:bg-red-900/30' 
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}>
                    Clear All Applications
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}