import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, Bell, Target, Award, Zap, Brain, Globe } from 'lucide-react';

// Lazy load heavy components
const TaskAutomationComponent = lazy(() => Promise.resolve({
  default: memo(({ clientName, clientPersona }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Zap className="mr-2 text-blue-600" size={24} />
        AI Task Automation
      </h3>
      <div className="space-y-4">
        {AUTOMATION_TASKS.map((item, i) => {
          const color = COLOR_MAP[item.status];
          const desc = item.getDesc(clientName, clientPersona);
          return (
            <div key={i} className={`flex items-center justify-between p-3 ${color.bg} rounded-lg border ${color.border}`}>
              <div>
                <p className={`font-medium ${color.text}`}>{item.title}</p>
                <p className={`text-sm ${color.desc}`}>{desc}</p>
              </div>
              <button
                className={`${color.btn} ${color.btnText} px-3 py-1 rounded text-sm transition-colors`}
                onClick={() => alert(item.title + ' - Action coming soon!')}
              >
                {item.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  ))
}));

// Constants moved outside component
const AUTOMATION_TASKS = [
  {
    status: 'green',
    title: 'Auto-generated proposal ready',
    getDesc: (name, persona) => name ? `Customized for ${name} (${persona})` : 'Waiting for client details',
    action: 'Review'
  },
  {
    status: 'blue',
    title: 'Salesforce updated with call notes',
    getDesc: () => '3 opportunities automatically synced',
    action: 'View'
  },
  {
    status: 'yellow',
    title: 'Pricing quote generated',
    getDesc: (_, persona) => {
      if (persona === 'CFO') return 'Cost-focused messaging applied';
      if (persona === 'CIO') return 'ROI calculations included';
      return persona ? 'Persona-specific pricing' : 'Standard enterprise pricing';
    },
    action: 'Send'
  }
];

// Constants - moved outside component to prevent recreation
const PERSONA_DATA = {
  CIO: {
    painPoints: ["Budget constraints", "Legacy system integration", "Digital transformation pressure"],
    solutions: ["IBM Cloud cost optimization", "Red Hat hybrid cloud strategy", "Modernization roadmap"],
    messaging: ["Reduce IT spend by 30%", "Accelerate digital initiatives", "Future-proof infrastructure"],
    keywords: ["ROI", "scalability", "integration", "security"],
    products: [
      {
        name: "Red Hat OpenShift",
        description: "Enterprise Kubernetes platform",
        alignment: "Modernizes legacy applications with containers",
        differentiators: [
          "vs VMware Tanzu: 40% lower TCO with integrated developer tools",
          "vs AWS EKS: Multi-cloud portability, no vendor lock-in",
          "vs Azure AKS: On-premise support with consistent experience"
        ]
      },
      {
        name: "IBM Cloud Pak for Integration",
        description: "Hybrid integration platform",
        alignment: "Connects legacy systems with modern cloud services",
        differentiators: [
          "vs MuleSoft: 65% faster deployment with pre-built connectors",
          "vs Dell Boomi: AI-powered mapping reduces integration time by 50%",
          "vs Informatica: Unified platform eliminates tool sprawl"
        ]
      },
      {
        name: "IBM Turbonomic",
        description: "AI-powered application resource management",
        alignment: "Optimizes cloud costs automatically",
        differentiators: [
          "vs CloudHealth: Real-time actions vs just recommendations",
          "vs AWS Cost Explorer: Multi-cloud support with workload automation",
          "vs Flexera: Application-aware optimization, not just infrastructure"
        ]
      }
    ]
  },
  CISO: {
    painPoints: ["Security threats", "Compliance requirements", "Risk management"],
    solutions: ["IBM Security suite", "Zero-trust architecture", "Threat intelligence"],
    messaging: ["Enhanced security posture", "Automated threat detection", "Compliance automation"],
    keywords: ["security", "compliance", "risk", "threats"],
    products: [
      {
        name: "IBM Security QRadar SIEM",
        description: "AI-powered threat detection and response",
        alignment: "Identifies and responds to threats in real-time",
        differentiators: [
          "vs Splunk: 60% faster threat detection with AI insights",
          "vs Microsoft Sentinel: On-premise option for sensitive data",
          "vs CrowdStrike: Integrated SOAR capabilities included"
        ]
      },
      {
        name: "IBM Security Guardium",
        description: "Data security and protection platform",
        alignment: "Ensures compliance and protects sensitive data",
        differentiators: [
          "vs Imperva: Automated compliance reporting for 50+ regulations",
          "vs Oracle Data Safe: Multi-database support including NoSQL",
          "vs Varonis: Real-time data activity monitoring with AI"
        ]
      },
      {
        name: "Red Hat Advanced Cluster Security",
        description: "Kubernetes-native security platform",
        alignment: "Secures containerized applications end-to-end",
        differentiators: [
          "vs Prisma Cloud: Native Kubernetes integration, no agents",
          "vs Aqua Security: Built-in compliance for PCI, HIPAA, SOC2",
          "vs Sysdig: Integrated with OpenShift, single pane of glass"
        ]
      }
    ]
  },
  "Dev Lead": {
    painPoints: ["Development velocity", "Tool fragmentation", "Deployment complexity"],
    solutions: ["Red Hat OpenShift", "DevOps automation", "Container orchestration"],
    messaging: ["Faster deployment cycles", "Streamlined development", "Developer productivity"],
    keywords: ["containers", "automation", "CI/CD", "productivity"],
    products: [
      {
        name: "Red Hat OpenShift",
        description: "Enterprise Kubernetes platform",
        alignment: "Accelerates application delivery with built-in CI/CD",
        differentiators: [
          "vs vanilla Kubernetes: Developer-friendly with integrated tools",
          "vs Docker Enterprise: Source-to-image builds save 70% time",
          "vs Rancher: Enterprise support and security hardening"
        ]
      },
      {
        name: "Red Hat Ansible Automation",
        description: "IT automation platform",
        alignment: "Automates repetitive tasks and deployments",
        differentiators: [
          "vs Terraform: Agentless architecture, no infrastructure overhead",
          "vs Puppet: Human-readable YAML, 50% faster adoption",
          "vs Chef: 5000+ pre-built modules vs custom coding"
        ]
      },
      {
        name: "IBM Cloud Code Engine",
        description: "Serverless platform for containers",
        alignment: "Simplifies deployment without managing infrastructure",
        differentiators: [
          "vs AWS Lambda: Supports full containers, not just functions",
          "vs Google Cloud Run: Integrated with Red Hat ecosystem",
          "vs Azure Container Instances: Auto-scaling with zero idle costs"
        ]
      }
    ]
  },
  CFO: {
    painPoints: ["Cost optimization", "Budget visibility", "ROI measurement"],
    solutions: ["Cloud cost management", "Predictable pricing", "Usage analytics"],
    messaging: ["Reduce operational costs", "Predictable IT spending", "Measurable business value"],
    keywords: ["cost", "savings", "budget", "value"],
    products: [
      {
        name: "IBM Turbonomic",
        description: "AI-powered application resource management",
        alignment: "Reduces cloud waste by up to 40%",
        differentiators: [
          "vs Manual optimization: Automated 24/7 cost optimization",
          "vs CloudCheckr: Application performance aware, not just cost",
          "vs Spot.io: Works across hybrid cloud, not just public"
        ]
      },
      {
        name: "Red Hat Insights",
        description: "Predictive analytics platform",
        alignment: "Prevents costly outages and optimizes resources",
        differentiators: [
          "vs Datadog: Included with Red Hat subscription at no extra cost",
          "vs New Relic: Predictive analytics prevent issues before they occur",
          "vs AppDynamics: 80% lower cost with comparable features"
        ]
      },
      {
        name: "IBM Cloud Pak for Data",
        description: "Data and AI platform",
        alignment: "Delivers measurable ROI through data monetization",
        differentiators: [
          "vs Snowflake: Run anywhere - cloud, on-premise, or edge",
          "vs Databricks: Integrated governance reduces compliance costs",
          "vs AWS Redshift: 50% faster time to value with AutoAI"
        ]
      }
    ]
  }
};

const DEFAULT_PERSONA = {
  painPoints: ["Budget optimization", "Technology modernization", "Operational efficiency"],
  solutions: ["IBM Cloud solutions", "Red Hat automation", "Hybrid cloud strategy"],
  messaging: ["Reduce costs", "Improve efficiency", "Future-proof technology"],
  keywords: ["ROI", "efficiency", "modernization", "scalability"],
  products: [
    {
      name: "IBM Cloud",
      description: "Hybrid cloud platform",
      alignment: "Provides flexible, secure cloud infrastructure",
      differentiators: [
        "vs AWS: Superior hybrid cloud capabilities with Red Hat",
        "vs Azure: Better support for regulated industries",
        "vs Google Cloud: Stronger enterprise features and support"
      ]
    },
    {
      name: "Red Hat Enterprise Linux",
      description: "Enterprise operating system",
      alignment: "Stable, secure foundation for all workloads",
      differentiators: [
        "vs Ubuntu: 10+ year support lifecycle vs 5 years",
        "vs SUSE: Larger ecosystem and ISV support",
        "vs Windows Server: 50% lower TCO with no licensing complexity"
      ]
    }
  ]
};

// Static data constants
const STATIC_METRICS = {
  name: "Fred A",
  quota: "$5.0M",
  achieved: "$2.3M",
  quotaAttainment: 46,
  dealsWon: 8,
  avgDealSize: "$225K",
  activePipeline: 15
};

const DEAL_PIPELINE = [
  { stage: 'Prospecting', count: 5, value: 1.2 },
  { stage: 'Qualified', count: 4, value: 1.8 },
  { stage: 'Proposal', count: 3, value: 1.4 },
  { stage: 'Negotiation', count: 2, value: 0.8 },
  { stage: 'Won', count: 1, value: 0.5 }
];

const TOP_OPPORTUNITIES = [
  {
    id: 1,
    company: "TechCorp Industries",
    contact: "David Kim, CTO", 
    value: "$450K",
    stage: "Proposal",
    probability: 75,
    aiInsights: [
      "Recent news: Expanding cloud infrastructure budget by 40%",
      "Pain point: Legacy systems slowing digital transformation",
      "Win theme: Red Hat OpenShift modernization strategy"
    ],
    nextAction: "Schedule technical workshop",
    lastActivity: "1 day ago",
    closeDate: "2025-08-15",
    products: ["Red Hat OpenShift", "IBM Cloud Pak for Integration"]
  },
  {
    id: 2,
    company: "Global Finance Ltd",
    contact: "Maria Rodriguez, CISO",
    value: "$320K", 
    stage: "Negotiation",
    probability: 85,
    aiInsights: [
      "Compliance deadline driving urgency",
      "Security budget increased for Q4", 
      "IBM Security aligns with their framework"
    ],
    nextAction: "Final pricing discussion",
    lastActivity: "3 hours ago",
    closeDate: "2025-07-30",
    products: ["IBM Security QRadar", "IBM Security Guardium"]
  }
];

const NEWS_ALERTS = [
  {
    headline: "Enterprise AI Adoption Accelerating in 2025",
    relevance: "High",
    source: "Industry Report",
    impact: "Watson AI positioning opportunity",
    time: "2 hours ago"
  },
  {
    headline: "New Cybersecurity Regulations Announced",
    relevance: "High",
    source: "Government News",
    impact: "IBM Security compliance angle",
    time: "4 hours ago"
  },
  {
    headline: "Red Hat OpenShift 5.0 Performance Benchmarks Released",
    relevance: "Medium",
    source: "Red Hat",
    impact: "Container modernization selling point",
    time: "1 day ago"
  }
];

const SALES_STAGES = ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Won'];

// Optimized components
const TabButton = React.memo(({ id, label, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
));

const MetricCard = React.memo(({ icon: Icon, title, value, change, color = "blue" }) => {
  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' }
  };

  const { bg, text } = colorClasses[color];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={16} className="mr-1" />
              {change > 0 ? '+' : ''}{change}% vs last quarter
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full ${bg}`}>
          <Icon className={text} size={32} />
        </div>
      </div>
    </div>
  );
});

// Enhanced components for brand and licensing visualization
const BrandBreakdownCard = React.memo(({ data }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
      <Award className="mr-2 text-blue-600" size={24} />
      Pipeline by Brand
    </h3>
    <div className="space-y-4">
      {Object.entries(data).map(([brand, stats]) => (
        <div key={brand} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${
              brand === BRANDS.SOFTWARE ? 'bg-blue-500' : 'bg-green-500'
            }`}></div>
            <div>
              <p className="font-medium text-gray-800">{brand}</p>
              <p className="text-sm text-gray-600">{stats.count} deals • ${stats.value}M</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800">{stats.percentage}%</p>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  brand === BRANDS.SOFTWARE ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

const LicensingBreakdownCard = React.memo(({ data }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
      <DollarSign className="mr-2 text-purple-600" size={24} />
      Pipeline by Licensing Type
    </h3>
    <div className="space-y-4">
      {Object.entries(data).map(([type, stats]) => (
        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${
              type === LICENSING_TYPES.PERPETUAL ? 'bg-purple-500' :
              type === LICENSING_TYPES.SAAS ? 'bg-orange-500' : 'bg-green-500'
            }`}></div>
            <div>
              <p className="font-medium text-gray-800">{type}</p>
              <p className="text-sm text-gray-600">{stats.count} deals • ${stats.value}M</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800">{stats.percentage}%</p>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  type === LICENSING_TYPES.PERPETUAL ? 'bg-purple-500' :
                  type === LICENSING_TYPES.SAAS ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

const EnhancedProductCard = React.memo(({ product }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-800 text-lg">{product.name}</h4>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.brand === BRANDS.SOFTWARE 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {product.brand}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.licensingType === LICENSING_TYPES.PERPETUAL ? 'bg-purple-100 text-purple-800' :
            product.licensingType === LICENSING_TYPES.SAAS ? 'bg-orange-100 text-orange-800' :
            'bg-green-100 text-green-800'
          }`}>
            {product.licensingType}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600">{product.description}</p>
    </div>
    
    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
      <p className="text-sm font-medium text-blue-800">Why it fits:</p>
      <p className="text-sm text-blue-700 mt-1">{product.alignment}</p>
    </div>
    
    {/* Pricing Information */}
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-800 mb-2">Pricing Options:</p>
      <div className="space-y-1">
        {product.pricing.perpetual && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Perpetual:</span> {product.pricing.perpetual}
          </p>
        )}
        {product.pricing.saas && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">SaaS:</span> {product.pricing.saas}
          </p>
        )}
        {product.pricing.subscription && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Subscription:</span> {product.pricing.subscription}
          </p>
        )}
      </div>
    </div>
    
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Competitive Advantages:</p>
      {product.differentiators.map((diff, i) => (
        <div key={i} className="flex items-start">
          <span className="text-green-500 mr-2 mt-0.5">→</span>
          <p className="text-xs text-gray-600">{diff}</p>
        </div>
      ))}
    </div>
  </div>
));

// Mock function to simulate fetching news and financials
const fetchCompanyIntelligence = (company) => {
  if (!company) return { news: [], briefings: [], financials: [] };
  // In a real app, replace this with API calls to NewsAPI, Alpha Vantage, Yahoo Finance, etc.
  return {
    news: [
      {
        headline: `"${company}" launches new AI-powered product line`,
        source: "TechCrunch",
        date: "2025-06-10",
        url: "#"
      },
      {
        headline: `"${company}" Q2 earnings beat analyst expectations`,
        source: "Reuters",
        date: "2025-05-28",
        url: "#"
      },
      {
        headline: `"${company}" partners with IBM for hybrid cloud expansion`,
        source: "IBM Newsroom",
        date: "2025-05-15",
        url: "#"
      }
    ],
    briefings: [
      {
        title: `Investor Day 2025 Highlights`,
        summary: `"${company}" announced a 20% increase in R&D investment and a new focus on AI-driven solutions.`,
        date: "2025-04-20"
      }
    ],
    financials: [
      {
        metric: "Revenue (Q2 2025)",
        value: "$2.1B",
        change: "+8% YoY"
      },
      {
        metric: "Net Income (Q2 2025)",
        value: "$320M",
        change: "+12% YoY"
      },
      {
        metric: "EPS (Q2 2025)",
        value: "$1.45",
        change: "+10% YoY"
      }
    ]
  };
};

// Helper to extract insights from company intelligence
const extractInsightsFromIntelligence = (companyIntelligence) => {
  // Simple keyword-based extraction for demo purposes
  const painPoints = [];
  const solutions = [];
  const messaging = [];

  // Analyze news headlines
  companyIntelligence.news.forEach(news => {
    const text = news.headline.toLowerCase();
    if (text.includes('earnings') || text.includes('revenue')) {
      painPoints.push('Revenue growth pressure');
      messaging.push('Drive top-line growth with digital solutions');
    }
    if (text.includes('ai') || text.includes('automation')) {
      solutions.push('AI-powered automation');
      messaging.push('Accelerate innovation with AI');
    }
    if (text.includes('cloud')) {
      painPoints.push('Cloud migration challenges');
      solutions.push('Hybrid cloud strategy');
      messaging.push('Seamless hybrid cloud adoption');
    }
    if (text.includes('partner') || text.includes('expansion')) {
      solutions.push('Strategic partnerships');
    }
  });

  // Analyze investor briefings
  companyIntelligence.briefings.forEach(brief => {
    const text = (brief.title + ' ' + brief.summary).toLowerCase();
    if (text.includes('r&d') || text.includes('innovation')) {
      solutions.push('Increased R&D investment');
      messaging.push('Lead the market with innovation');
    }
    if (text.includes('ai')) {
      solutions.push('AI-driven solutions');
      painPoints.push('Need for digital transformation');
    }
  });

  // Analyze financials
  companyIntelligence.financials.forEach(fin => {
    if (fin.metric.toLowerCase().includes('revenue') && fin.change.includes('-')) {
      painPoints.push('Declining revenue');
      messaging.push('Reverse revenue decline with new offerings');
    }
    if (fin.metric.toLowerCase().includes('net income') && fin.change.includes('-')) {
      painPoints.push('Profitability concerns');
      solutions.push('Cost optimization');
    }
  });

  // Remove duplicates
  return {
    painPoints: [...new Set(painPoints)],
    solutions: [...new Set(solutions)],
    messaging: [...new Set(messaging)]
  };
};

// Helper to extract company strategy from intelligence
const extractCompanyStrategy = (companyIntelligence) => {
  // Simple keyword-based logic for demo
  let strategy = [];
  companyIntelligence.news.forEach(news => {
    const text = news.headline.toLowerCase();
    if (text.includes('ai')) strategy.push('Investing in AI-driven innovation');
    if (text.includes('cloud')) strategy.push('Expanding hybrid cloud capabilities');
    if (text.includes('partner')) strategy.push('Forming strategic partnerships');
    if (text.includes('earnings') || text.includes('revenue')) strategy.push('Focusing on revenue growth');
  });
  companyIntelligence.briefings.forEach(brief => {
    const text = (brief.title + ' ' + brief.summary).toLowerCase();
    if (text.includes('r&d')) strategy.push('Increasing R&D investment');
    if (text.includes('ai')) strategy.push('AI as a core business pillar');
  });
  companyIntelligence.financials.forEach(fin => {
    if (fin.metric.toLowerCase().includes('revenue') && fin.change.includes('+')) strategy.push('Driving top-line growth');
    if (fin.metric.toLowerCase().includes('net income') && fin.change.includes('+')) strategy.push('Improving profitability');
  });
  if (strategy.length === 0) strategy.push('No clear strategy identified from recent news/briefings.');
  return [...new Set(strategy)];
};

// Color mapping for Tailwind classes
const COLOR_MAP = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    btn: 'bg-green-600 hover:bg-green-700',
    btnText: 'text-white',
    desc: 'text-green-600',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    btn: 'bg-blue-600 hover:bg-blue-700',
    btnText: 'text-white',
    desc: 'text-blue-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    btn: 'bg-yellow-600 hover:bg-yellow-700',
    btnText: 'text-white',
    desc: 'text-yellow-600',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    btn: 'bg-purple-600 hover:bg-purple-700',
    btnText: 'text-white',
    desc: 'text-purple-600',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    btn: 'bg-orange-600 hover:bg-orange-700',
    btnText: 'text-white',
    desc: 'text-orange-600',
  },
};

// Daily inspiration quotes for sellers
const DAILY_QUOTES = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Every sale has five basic obstacles: no need, no money, no hurry, no desire, no trust. - Zig Ziglar",
  "The best salespeople don't sell products, they sell solutions. - Unknown",
  "Your attitude, not your aptitude, will determine your altitude. - Zig Ziglar",
  "The difference between try and triumph is just a little umph! - Marvin Phillips",
  "Sales are contingent upon the attitude of the salesperson, not the attitude of the prospect. - W. Clement Stone",
  "The goal of a salesperson is to help customers buy, not to sell to customers. - Unknown",
  "Success in sales requires training and discipline and hard work. But if you're not frightened by these things, the opportunities are just as great today as they ever were. - David Rockefeller",
  "The most important single ingredient in the formula of success is knowing how to get along with people. - Theodore Roosevelt"
];

// Get a quote based on the current date (changes daily)
const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
};

// Brand and Licensing Type Constants
const BRANDS = {
  SOFTWARE: 'Software',
  STORAGE: 'Storage',
  POWER: 'Power',
  Z: 'Z'
};

const LICENSING_TYPES = {
  PERPETUAL: 'SW trans',
  SAAS: 'SaaS ACV',
  SUBSCRIPTION: 'Subscription',
  STORAGE_TRANS: 'Storage trans',
  POWER_TRANS: 'Power trans',
  Z_TRANS: 'Z trans'
};

// Move these above renderPipeline so they are in scope
const BRAND_QUOTA_TARGETS = {
  Software: 1400000, // $1.4M
  Storage: 1100000,  // $1.1M
  Power: 900000,     // $0.9M
  Z: 1600000         // $1.6M
};
const LICENSING_QUOTA_TARGETS = {
  'SW trans': 700000,        // $0.7M
  'SaaS ACV': 1100000,       // $1.1M
  'Subscription': 900000,    // $0.9M
  'Storage trans': 800000,   // $0.8M
  'Power trans': 700000,     // $0.7M
  'Z trans': 800000          // $0.8M
};

// Enhanced product data with brands and licensing types
const ENHANCED_PRODUCTS = {
  CIO: [
    {
      name: "Red Hat OpenShift",
      description: "Enterprise Kubernetes platform",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Modernizes legacy applications with containers",
      differentiators: [
        "vs VMware Tanzu: 40% lower TCO with integrated developer tools",
        "vs AWS EKS: Multi-cloud portability, no vendor lock-in",
        "vs Azure AKS: On-premise support with consistent experience"
      ],
      pricing: {
        perpetual: null,
        saas: "$0.25/hour per core",
        subscription: "$2,500/year per core"
      }
    },
    {
      name: "IBM Cloud Pak for Integration",
      description: "Hybrid integration platform",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Connects legacy systems with modern cloud services",
      differentiators: [
        "vs MuleSoft: 65% faster deployment with pre-built connectors",
        "vs Dell Boomi: AI-powered mapping reduces integration time by 50%",
        "vs Informatica: Unified platform eliminates tool sprawl"
      ],
      pricing: {
        perpetual: "$50,000/CPU",
        saas: "$1,200/month per core",
        subscription: "$15,000/year per core"
      }
    },
    {
      name: "IBM Turbonomic",
      description: "AI-powered application resource management",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Optimizes cloud costs automatically",
      differentiators: [
        "vs CloudHealth: Real-time actions vs just recommendations",
        "vs AWS Cost Explorer: Multi-cloud support with workload automation",
        "vs Flexera: Application-aware optimization, not just infrastructure"
      ],
      pricing: {
        perpetual: null,
        saas: "$0.15/hour per core",
        subscription: "$1,800/year per core"
      }
    }
  ],
  CISO: [
    {
      name: "IBM Security QRadar SIEM",
      description: "AI-powered threat detection and response",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Identifies and responds to threats in real-time",
      differentiators: [
        "vs Splunk: 60% faster threat detection with AI insights",
        "vs Microsoft Sentinel: On-premise option for sensitive data",
        "vs CrowdStrike: Integrated SOAR capabilities included"
      ],
      pricing: {
        perpetual: "$75,000/CPU",
        saas: "$2,500/month per core",
        subscription: "$30,000/year per core"
      }
    },
    {
      name: "IBM Security Guardium",
      description: "Data security and protection platform",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.PERPETUAL,
      alignment: "Ensures compliance and protects sensitive data",
      differentiators: [
        "vs Imperva: Automated compliance reporting for 50+ regulations",
        "vs Oracle Data Safe: Multi-database support including NoSQL",
        "vs Varonis: Real-time data activity monitoring with AI"
      ],
      pricing: {
        perpetual: "$45,000/CPU",
        saas: null,
        subscription: "$5,400/year per core"
      }
    },
    {
      name: "Red Hat Advanced Cluster Security",
      description: "Kubernetes-native security platform",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Secures containerized applications end-to-end",
      differentiators: [
        "vs Prisma Cloud: Native Kubernetes integration, no agents",
        "vs Aqua Security: Built-in compliance for PCI, HIPAA, SOC2",
        "vs Sysdig: Integrated with OpenShift, single pane of glass"
      ],
      pricing: {
        perpetual: null,
        saas: "$0.20/hour per core",
        subscription: "$2,400/year per core"
      }
    }
  ],
  "Dev Lead": [
    {
      name: "Red Hat OpenShift",
      description: "Enterprise Kubernetes platform",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Accelerates application delivery with built-in CI/CD",
      differentiators: [
        "vs vanilla Kubernetes: Developer-friendly with integrated tools",
        "vs Docker Enterprise: Source-to-image builds save 70% time",
        "vs Rancher: Enterprise support and security hardening"
      ],
      pricing: {
        perpetual: null,
        saas: "$0.25/hour per core",
        subscription: "$2,500/year per core"
      }
    },
    {
      name: "Red Hat Ansible Automation",
      description: "IT automation platform",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Automates repetitive tasks and deployments",
      differentiators: [
        "vs Terraform: Agentless architecture, no infrastructure overhead",
        "vs Puppet: Human-readable YAML, 50% faster adoption",
        "vs Chef: 5000+ pre-built modules vs custom coding"
      ],
      pricing: {
        perpetual: null,
        saas: "$0.10/hour per core",
        subscription: "$1,200/year per core"
      }
    },
    {
      name: "IBM Cloud Code Engine",
      description: "Serverless platform for containers",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SAAS,
      alignment: "Simplifies deployment without managing infrastructure",
      differentiators: [
        "vs AWS Lambda: Supports full containers, not just functions",
        "vs Google Cloud Run: Integrated with Red Hat ecosystem",
        "vs Azure Container Instances: Auto-scaling with zero idle costs"
      ],
      pricing: {
        perpetual: null,
        saas: "$0.30/hour per core",
        subscription: null
      }
    }
  ],
  CFO: [
    {
      name: "IBM Turbonomic",
      description: "AI-powered application resource management",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Reduces cloud waste by up to 40%",
      differentiators: [
        "vs Manual optimization: Automated 24/7 cost optimization",
        "vs CloudCheckr: Application performance aware, not just cost",
        "vs Spot.io: Works across hybrid cloud, not just public"
      ],
      pricing: {
        perpetual: null,
        saas: "$0.15/hour per core",
        subscription: "$1,800/year per core"
      }
    },
    {
      name: "Red Hat Insights",
      description: "Predictive analytics platform",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Prevents costly outages and optimizes resources",
      differentiators: [
        "vs Datadog: Included with Red Hat subscription at no extra cost",
        "vs New Relic: Predictive analytics prevent issues before they occur",
        "vs AppDynamics: 80% lower cost with comparable features"
      ],
      pricing: {
        perpetual: null,
        saas: null,
        subscription: "Included with Red Hat subscription"
      }
    },
    {
      name: "IBM Cloud Pak for Data",
      description: "Data and AI platform",
      brand: BRANDS.SOFTWARE,
      licensingType: LICENSING_TYPES.SUBSCRIPTION,
      alignment: "Delivers measurable ROI through data monetization",
      differentiators: [
        "vs Snowflake: Run anywhere - cloud, on-premise, or edge",
        "vs Databricks: Integrated governance reduces compliance costs",
        "vs AWS Redshift: 50% faster time to value with AutoAI"
      ],
      pricing: {
        perpetual: "$100,000/CPU",
        saas: "$3,000/month per core",
        subscription: "$36,000/year per core"
      }
    }
  ]
};

// Enhanced pipeline data with brand and licensing type breakdown
const ENHANCED_PIPELINE_DATA = {
  byBrand: {
    [BRANDS.SOFTWARE]: { count: 9, value: 2.3, percentage: 30, attainment: 55 }, // Software strong
    [BRANDS.STORAGE]: { count: 6, value: 1.7, percentage: 22, attainment: 65 }, // Storage healthy
    [BRANDS.POWER]: { count: 5, value: 1.3, percentage: 18, attainment: 48 }, // Power moderate
    [BRANDS.Z]: { count: 4, value: 2.3, percentage: 30, attainment: 80 } // Z strong
  },
  byLicensingType: {
    [LICENSING_TYPES.PERPETUAL]: { count: 4, value: 1.0, percentage: 13, attainment: 50 }, // SW trans
    [LICENSING_TYPES.SAAS]: { count: 8, value: 1.6, percentage: 21, attainment: 60 }, // SaaS ACV
    [LICENSING_TYPES.SUBSCRIPTION]: { count: 8, value: 1.4, percentage: 18, attainment: 52 }, // Subscription
    [LICENSING_TYPES.STORAGE_TRANS]: { count: 4, value: 1.2, percentage: 16, attainment: 70 }, // Storage trans
    [LICENSING_TYPES.POWER_TRANS]: { count: 3, value: 0.9, percentage: 12, attainment: 45 }, // Power trans
    [LICENSING_TYPES.Z_TRANS]: { count: 3, value: 1.5, percentage: 20, attainment: 85 } // Z trans
  },
  byStage: {
    'Prospecting': { count: 8, value: 2.1, software: 0.6, storage: 0.6, power: 0.3, z: 0.6 },
    'Qualified': { count: 7, value: 1.7, software: 0.5, storage: 0.5, power: 0.3, z: 0.4 },
    'Proposal': { count: 6, value: 1.5, software: 0.5, storage: 0.3, power: 0.3, z: 0.4 },
    'Negotiation': { count: 4, value: 1.2, software: 0.4, storage: 0.2, power: 0.2, z: 0.4 },
    'Won': { count: 2, value: 1.1, software: 0.3, storage: 0.1, power: 0.2, z: 0.5 }
  }
};

// Enhanced opportunities with brand and licensing details
const ENHANCED_OPPORTUNITIES = [
  {
    id: 1,
    company: "TechCorp Industries",
    contact: "David Kim, CTO", 
    value: "$450K",
    stage: "Proposal",
    probability: 75,
    brand: BRANDS.SOFTWARE,
    licensingType: LICENSING_TYPES.SUBSCRIPTION,
    aiInsights: [
      "Recent news: Expanding cloud infrastructure budget by 40%",
      "Pain point: Legacy systems slowing digital transformation",
      "Win theme: Red Hat OpenShift modernization strategy"
    ],
    nextAction: "Schedule technical workshop",
    lastActivity: "1 day ago",
    closeDate: "2025-08-15",
    products: [
      { name: "Red Hat OpenShift", brand: BRANDS.SOFTWARE, licensingType: LICENSING_TYPES.SUBSCRIPTION },
      { name: "IBM Cloud Pak for Integration", brand: BRANDS.SOFTWARE, licensingType: LICENSING_TYPES.SUBSCRIPTION }
    ]
  },
  {
    id: 2,
    company: "Global Finance Ltd",
    contact: "Maria Rodriguez, CISO",
    value: "$320K", 
    stage: "Negotiation",
    probability: 85,
    brand: BRANDS.SOFTWARE,
    licensingType: LICENSING_TYPES.PERPETUAL,
    aiInsights: [
      "Compliance deadline driving urgency",
      "Security budget increased for Q4", 
      "IBM Security aligns with their framework"
    ],
    nextAction: "Final pricing discussion",
    lastActivity: "3 hours ago",
    closeDate: "2025-07-30",
    products: [
      { name: "IBM Security QRadar", brand: BRANDS.SOFTWARE, licensingType: LICENSING_TYPES.SUBSCRIPTION },
      { name: "IBM Security Guardium", brand: BRANDS.SOFTWARE, licensingType: LICENSING_TYPES.PERPETUAL }
    ]
  },
  {
    id: 3,
    company: "CloudStart Solutions",
    contact: "Alex Chen, Dev Lead",
    value: "$280K",
    stage: "Qualified",
    probability: 65,
    brand: BRANDS.SOFTWARE,
    licensingType: LICENSING_TYPES.SAAS,
    aiInsights: [
      "Startup scaling rapidly, needs flexible pricing",
      "Team prefers cloud-native solutions",
      "Competing with AWS native services"
    ],
    nextAction: "Technical proof of concept",
    lastActivity: "2 days ago",
    closeDate: "2025-09-15",
    products: [
      { name: "IBM Cloud Code Engine", brand: BRANDS.SOFTWARE, licensingType: LICENSING_TYPES.SAAS },
      { name: "Red Hat Ansible Automation", brand: BRANDS.SOFTWARE, licensingType: LICENSING_TYPES.SUBSCRIPTION }
    ]
  }
];

// Main Dashboard Component
const SalesProductivityDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [notifications] = useState(5);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clientName, setClientName] = useState('');
  const [clientPersona, setClientPersona] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [opportunityNotes, setOpportunityNotes] = useState({});
  const [editingNote, setEditingNote] = useState(null);
  const [personaName, setPersonaName] = useState('');
  const [insights, setInsights] = useState(null);

  // Clock timer with cleanup
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoized personalized content
  const personalizedContent = useMemo(() => {
    if (!clientName || !clientPersona) return null;
    const persona = PERSONA_DATA[clientPersona] || DEFAULT_PERSONA;
    return {
      company: clientName,
      persona: clientPersona,
      ...persona
    };
  }, [clientName, clientPersona]);

  // Callbacks
  const handleStageChange = useCallback((oppId, newStage) => {
    console.log(`Updating opportunity ${oppId} to stage ${newStage}`);
  }, []);

  const handleNoteChange = useCallback((oppId, value) => {
    setOpportunityNotes(prev => ({ ...prev, [oppId]: value }));
  }, []);

  const handleNoteSubmit = useCallback((oppId) => {
    setEditingNote(null);
  }, []);

  const toggleClientForm = useCallback(() => {
    setShowClientForm(prev => !prev);
  }, []);

  // Mocked insight fetcher
  const fetchPersonaInsights = (name) => {
    if (!name) return null;
    // In a real app, replace with API calls to LinkedIn, Twitter, News, etc.
    return {
      linkedin: {
        headline: `VP of IT at Acme Corp. | Cloud Transformation Leader | Speaker`,
        summary: `${name} is a recognized leader in cloud transformation, frequent industry speaker, and passionate about digital innovation and team development.`,
        url: `https://www.linkedin.com/in/${name.toLowerCase().replace(/ /g, '')}`,
        // Use a placeholder image service with initials as fallback
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`
      },
      news: [
        {
          headline: `${name} quoted on AI adoption in Forbes`,
          date: '2025-06-01',
          url: '#'
        },
        {
          headline: `${name} joins panel on cybersecurity at TechSummit`,
          date: '2025-05-20',
          url: '#'
        }
      ],
      social: [
        {
          platform: 'Twitter',
          content: `Excited to share our team's latest success in cloud migration! #cloud #leadership`,
          date: '2025-06-08',
          url: '#'
        },
        {
          platform: 'LinkedIn',
          content: `Honored to be recognized as a Top 50 IT Leader by CIO Magazine.`,
          date: '2025-05-30',
          url: '#'
        }
      ],
      talkingPoints: [
        `Congratulate ${name} on recent industry recognition`,
        `Ask about their experience leading cloud transformation`,
        `Discuss AI adoption trends in their sector`
      ]
    };
  };

  // Render functions
  const renderOverview = useCallback(() => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={DollarSign} title="Pipeline Value" value="$3.2M" change={15} color="green" />
          <MetricCard icon={Target} title="Quota Attainment" value={`${STATIC_METRICS.quotaAttainment}%`} change={8} color="blue" />
          <MetricCard icon={Award} title="Deals Won" value={STATIC_METRICS.dealsWon.toString()} change={12} color="purple" />
          <MetricCard icon={Clock} title="Avg Deal Size" value={STATIC_METRICS.avgDealSize} change={-5} color="yellow" />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Individual Performance</h3>
            <div className="text-right">
              <p className="text-sm text-gray-600">Quota Progress</p>
              <p className="text-lg font-bold text-blue-600">{STATIC_METRICS.achieved} / {STATIC_METRICS.quota}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${STATIC_METRICS.quotaAttainment}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">{STATIC_METRICS.activePipeline}</p>
              <p className="text-sm text-gray-600">Active Opportunities</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{STATIC_METRICS.dealsWon}</p>
              <p className="text-sm text-gray-600">Deals Closed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{STATIC_METRICS.avgDealSize}</p>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Bell className="mr-2 text-red-500" size={20} />
            Smart Alerts
          </h3>
          <div className="space-y-3">
            {NEWS_ALERTS.map((alert, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 text-sm">{alert.headline}</h4>
                <p className="text-xs text-gray-600 mt-1">{alert.impact}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.relevance === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.relevance}
                  </span>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ), []);

  const renderPipeline = useCallback(() => {
    // Pipeline gap analysis logic
    const quota = parseFloat(STATIC_METRICS.quota.replace(/[$,]/g, ''));
    const achieved = parseFloat(STATIC_METRICS.achieved.replace(/[$,]/g, ''));
    const winRate = 0.68; // 68% as decimal, could be dynamic
    const gap = Math.max(0, quota - achieved);
    const requiredPipeline = gap > 0 ? (gap / winRate) : 0;

    return (
      <>
        {/* Pipeline Gap Analysis Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center">
            <Target className="mr-2 text-blue-600" size={24} />
            Pipeline Gap Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-700 text-sm mb-1">Quota: <span className="font-semibold">{STATIC_METRICS.quota}</span></p>
              <p className="text-gray-700 text-sm mb-1">Achieved: <span className="font-semibold">{STATIC_METRICS.achieved}</span></p>
              <p className="text-gray-700 text-sm mb-1">Historical Win Rate: <span className="font-semibold">{(winRate * 100).toFixed(0)}%</span></p>
              <p className="text-gray-700 text-sm mb-1">Gap to Quota: <span className="font-semibold">${gap.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></p>
              <p className="text-blue-700 font-bold text-lg mt-2">Required Additional Pipeline: <span className="text-blue-900">${requiredPipeline.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></p>
              <p className="text-xs text-gray-500 mt-1">Based on your historical win rate, you need this much more pipeline to hit your quota.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (achieved / quota) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">Quota Attainment Progress</p>
            </div>
          </div>
        </div>

        {/* Enhanced Pipeline Gap Analysis by Brand and Licensing Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gap Analysis by Brand */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <Award className="mr-2 text-blue-600" size={24} />
              Gap Analysis by Brand
            </h3>
            <div className="space-y-4">
              {Object.entries(ENHANCED_PIPELINE_DATA.byBrand).map(([brand, stats]) => {
                const brandQuota = BRAND_QUOTA_TARGETS[brand] || 0;
                const brandAchieved = stats.value * 1000000;
                const brandGap = Math.max(0, brandQuota - brandAchieved);
                const brandRequiredPipeline = brandGap > 0 ? (brandGap / winRate) : 0;
                const isOnTrack = brandAchieved >= brandQuota;
                const attainmentPercentage = brandQuota > 0 ? (brandAchieved / brandQuota) * 100 : 0;
                return (
                  <div key={brand} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-800">{brand}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isOnTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isOnTrack ? '✓ On Track' : '⚠ Off Track'}
                        </span>
                        <span className={`text-sm font-medium ${
                          isOnTrack ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {attainmentPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Quota Target:</span>
                        <span className="font-medium">${(brandQuota / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Achieved (Pipeline):</span>
                        <span className="font-medium">${stats.value}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gap to Quota:</span>
                        <span className={`font-medium ${
                          brandGap > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          ${(brandGap / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Required Pipeline:</span>
                        <span className="font-medium">${(brandRequiredPipeline / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div 
                        className={`h-3 rounded-full ${
                          brand === BRANDS.SOFTWARE ? 'bg-blue-500' : brand === BRANDS.STORAGE ? 'bg-green-500' : brand === BRANDS.POWER ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min(100, attainmentPercentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gap Analysis by Licensing Type */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              <DollarSign className="mr-2 text-purple-600" size={24} />
              Gap Analysis by Licensing Type
            </h3>
            <div className="space-y-4">
              {Object.entries(ENHANCED_PIPELINE_DATA.byLicensingType).map(([type, stats]) => {
                const typeQuota = LICENSING_QUOTA_TARGETS[type] || 0;
                const typeAchieved = stats.value * 1000000;
                const typeGap = Math.max(0, typeQuota - typeAchieved);
                const typeRequiredPipeline = typeGap > 0 ? (typeGap / winRate) : 0;
                const isOnTrack = typeAchieved >= typeQuota;
                const attainmentPercentage = typeQuota > 0 ? (typeAchieved / typeQuota) * 100 : 0;
                return (
                  <div key={type} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-800">{type}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isOnTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isOnTrack ? '✓ On Track' : '⚠ Off Track'}
                        </span>
                        <span className={`text-sm font-medium ${
                          isOnTrack ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {attainmentPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Quota Target:</span>
                        <span className="font-medium">${(typeQuota / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Achieved (Pipeline):</span>
                        <span className="font-medium">${stats.value}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gap to Quota:</span>
                        <span className={`font-medium ${
                          typeGap > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          ${(typeGap / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Required Pipeline:</span>
                        <span className="font-medium">${(typeRequiredPipeline / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div 
                        className={`h-3 rounded-full ${
                          type === LICENSING_TYPES.PERPETUAL ? 'bg-purple-500' :
                          type === LICENSING_TYPES.SAAS ? 'bg-orange-500' :
                          type === LICENSING_TYPES.SUBSCRIPTION ? 'bg-green-500' :
                          type === LICENSING_TYPES.STORAGE_TRANS ? 'bg-blue-500' :
                          type === LICENSING_TYPES.POWER_TRANS ? 'bg-yellow-500' :
                          'bg-pink-500'
                        }`}
                        style={{ width: `${Math.min(100, attainmentPercentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>



        {/* Strategic Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200">
          <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
            <Zap className="mr-2 text-yellow-600" size={24} />
            Strategic Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Focus Areas</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>Software:</strong> Focus on security and integration deals</li>
                <li>• <strong>Infrastructure:</strong> Target cloud migration opportunities</li>
                <li>• <strong>Perpetual:</strong> Large enterprise deals with CAPEX budgets</li>
                <li>• <strong>SaaS:</strong> Startup and cloud-native companies</li>
                <li>• <strong>Subscription:</strong> Mid-market hybrid cloud customers</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Quick Wins</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upsell existing SaaS customers to subscription</li>
                <li>• Cross-sell infrastructure to software clients</li>
                <li>• Convert perpetual prospects to subscription</li>
                <li>• Target companies with mixed licensing needs</li>
                <li>• Focus on deals with highest probability to close</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Brand and Licensing Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BrandBreakdownCard data={ENHANCED_PIPELINE_DATA.byBrand} />
          <LicensingBreakdownCard data={ENHANCED_PIPELINE_DATA.byLicensingType} />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Sales Stage Overview</h3>
          <div className="flex items-center justify-between mb-6">
            {SALES_STAGES.map((stage, index) => (
              <div key={stage} className="flex-1 relative">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    index < 4 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                  }`}>
                    {DEAL_PIPELINE.find(d => d.stage === stage)?.count || 0}
                  </div>
                  {index < SALES_STAGES.length - 1 && (
                    <div className="flex-1 h-1 bg-gray-200 mx-2">
                      <div className={`h-full ${index < 3 ? 'bg-blue-600' : 'bg-gray-200'}`} 
                           style={{width: index < 3 ? '100%' : '0%'}}></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">{stage}</p>
                <p className="text-xs font-bold text-gray-800">
                  ${DEAL_PIPELINE.find(d => d.stage === stage)?.value || 0}M
                </p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">$7.6M</p>
              <p className="text-sm text-gray-600">Total Pipeline</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">15</p>
              <p className="text-sm text-gray-600">Active Deals</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">68%</p>
              <p className="text-sm text-gray-600">Win Rate</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Top Opportunities</h3>
          {ENHANCED_OPPORTUNITIES.map((opp) => (
            <div key={opp.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{opp.company}</h4>
                    <p className="text-gray-600">{opp.contact}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-2xl font-bold text-green-600">{opp.value}</p>
                      <span className="text-sm text-gray-500">Close: {new Date(opp.closeDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        opp.brand === BRANDS.SOFTWARE 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {opp.brand}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        opp.licensingType === LICENSING_TYPES.PERPETUAL ? 'bg-purple-100 text-purple-800' :
                        opp.licensingType === LICENSING_TYPES.SAAS ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {opp.licensingType}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <select 
                      value={opp.stage}
                      onChange={(e) => handleStageChange(opp.id, e.target.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer ${
                        opp.stage === 'Negotiation' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        opp.stage === 'Proposal' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}
                    >
                      {SALES_STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">{opp.probability}% probability</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.products.map((product, i) => (
                    <div key={i} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      <span>{product.name}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        product.brand === BRANDS.SOFTWARE ? 'bg-blue-500' : 'bg-green-500'
                      }`}></span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                      <Brain className="mr-2" size={18} />
                      AI Insights
                    </h5>
                    <ul className="space-y-2">
                      {opp.aiInsights.map((insight, i) => (
                        <li key={i} className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                      <Clock className="mr-2" size={18} />
                      Client Notes
                    </h5>
                    {editingNote === opp.id ? (
                      <div className="space-y-2">
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows="4"
                          placeholder="Add notes about this opportunity..."
                          value={opportunityNotes[opp.id] || ''}
                          onChange={(e) => handleNoteChange(opp.id, e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleNoteSubmit(opp.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingNote(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {opportunityNotes[opp.id] ? (
                          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                            {opportunityNotes[opp.id]}
                            <button 
                              onClick={() => setEditingNote(opp.id)}
                              className="block mt-2 text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Edit note
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setEditingNote(opp.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            + Add note
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">
                      <strong>Next:</strong> {opp.nextAction}
                    </p>
                    <span className="text-xs text-gray-500">Last activity: {opp.lastActivity}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Update in Salesforce
                    </button>
                    <button 
                      onClick={() => setSelectedOpportunity(opp)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedOpportunity && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOpportunity(null)}
          >
            <div 
              className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white flex-shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedOpportunity.company}</h2>
                    <p className="text-gray-600">{selectedOpportunity.contact}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOpportunity(null)}
                    className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Opportunity Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-semibold text-green-600">{selectedOpportunity.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stage:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedOpportunity.stage === 'Negotiation' ? 'bg-yellow-100 text-yellow-800' :
                          selectedOpportunity.stage === 'Proposal' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>{selectedOpportunity.stage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Probability:</span>
                        <span className="font-semibold">{selectedOpportunity.probability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Close Date:</span>
                        <span className="font-semibold">{new Date(selectedOpportunity.closeDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Products</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.products.map((product, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">AI Insights</h3>
                  <div className="space-y-2">
                    {selectedOpportunity.aiInsights.map((insight, i) => (
                      <div key={i} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{opportunityNotes[selectedOpportunity.id] || 'No notes added yet.'}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setSelectedOpportunity(null)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Open in Salesforce
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }, [opportunityNotes, editingNote, selectedOpportunity, handleStageChange, handleNoteChange, handleNoteSubmit]);

  const renderClientIntelligence = useCallback(() => {
    // Fetch company intelligence if a company is selected
    const companyIntelligence = personalizedContent ? fetchCompanyIntelligence(personalizedContent.company) : { news: [], briefings: [], financials: [] };
    const dynamicInsights = extractInsightsFromIntelligence(companyIntelligence);
    const companyStrategy = extractCompanyStrategy(companyIntelligence);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Target className="mr-2 text-blue-600" size={24} />
                Client Profile
              </h3>
              <button 
                onClick={toggleClientForm}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                {showClientForm ? 'Hide Form' : 'Enter Client Details'}
              </button>
            </div>
            
            {showClientForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Company
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Enter company name (e.g., Microsoft, Amazon)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Persona
                    </label>
                    <input
                      type="text"
                      value={clientPersona}
                      onChange={(e) => setClientPersona(e.target.value)}
                      placeholder="Enter role (e.g., CIO, CISO, Dev Lead, CFO)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supported personas: CIO, CISO, Dev Lead, CFO</p>
                  </div>
                </div>
              </div>
            )}
            
            {personalizedContent ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 text-lg">Current Target</h4>
                  <p className="text-gray-700 mt-1">Company: <span className="font-semibold">{personalizedContent.company}</span></p>
                  <p className="text-gray-700">Persona: <span className="font-semibold">{personalizedContent.persona}</span></p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No client selected</p>
                <p className="text-sm mt-1">Click "Enter Client Details" to get started</p>
              </div>
            )}
          </div>

          {personalizedContent && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="mr-2 text-purple-600" size={24} />
                AI-Generated Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800">Conversation Starters</h4>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm text-gray-700">• "How is {personalizedContent.company} handling {personalizedContent.painPoints[0].toLowerCase()}?"</li>
                    <li className="text-sm text-gray-700">• "What's your current approach to {personalizedContent.painPoints[1].toLowerCase()}?"</li>
                    <li className="text-sm text-gray-700">• "Have you considered {personalizedContent.solutions[0].toLowerCase()} for your team?"</li>
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800">Power Words for {personalizedContent.persona}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {personalizedContent.keywords.map((keyword, i) => (
                      <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                {/* New: Company Strategy Section */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Company Strategy</h4>
                  <ul className="space-y-1">
                    {companyStrategy.map((strat, i) => (
                      <li key={i} className="text-sm text-gray-700">• {strat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {personalizedContent && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced: Key Pain Points */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-red-600 font-bold">!</span>
                  </span>
                  Key Pain Points
                </h4>
                <ul className="space-y-2">
                  {/* Show dynamic insights if available, else fallback */}
                  {dynamicInsights.painPoints.length > 0 ? (
                    dynamicInsights.painPoints.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-sm text-gray-700">{point}</span>
                      </li>
                    ))
                  ) : (
                    personalizedContent.painPoints.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-sm text-gray-700">{point}</span>
                      </li>
                    ))
                  )}
                </ul>
                {dynamicInsights.painPoints.length > 0 && (
                  <div className="text-xs text-blue-500 mt-2">Based on recent news & briefings</div>
                )}
              </div>
              {/* Enhanced: Recommended Solutions */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 font-bold">✓</span>
                  </span>
                  Recommended Solutions
                </h4>
                <ul className="space-y-2">
                  {dynamicInsights.solutions.length > 0 ? (
                    dynamicInsights.solutions.map((solution, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span className="text-sm text-gray-700">{solution}</span>
                      </li>
                    ))
                  ) : (
                    personalizedContent.solutions.map((solution, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span className="text-sm text-gray-700">{solution}</span>
                      </li>
                    ))
                  )}
                </ul>
                {dynamicInsights.solutions.length > 0 && (
                  <div className="text-xs text-blue-500 mt-2">Based on recent news & briefings</div>
                )}
              </div>
              {/* Enhanced: Key Messaging */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-blue-600 font-bold">💬</span>
                  </span>
                  Key Messaging
                </h4>
                <ul className="space-y-2">
                  {dynamicInsights.messaging.length > 0 ? (
                    dynamicInsights.messaging.map((message, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-sm text-gray-700">{message}</span>
                      </li>
                    ))
                  ) : (
                    personalizedContent.messaging.map((message, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-sm text-gray-700">{message}</span>
                      </li>
                    ))
                  )}
                </ul>
                {dynamicInsights.messaging.length > 0 && (
                  <div className="text-xs text-blue-500 mt-2">Based on recent news & briefings</div>
                )}
              </div>
            </div>

            {/* Move Company Intelligence section here, before products */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Globe className="mr-2 text-blue-600" size={24} />
                Company Intelligence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent News */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Recent News</h4>
                  <ul className="space-y-2">
                    {companyIntelligence.news.length === 0 && <li className="text-gray-400 text-sm">No news found.</li>}
                    {companyIntelligence.news.map((item, i) => (
                      <li key={i} className="text-sm">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">{item.headline}</a>
                        <div className="text-xs text-gray-500">{item.source} &middot; {item.date}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Investor Briefings */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Investor Briefings</h4>
                  <ul className="space-y-2">
                    {companyIntelligence.briefings.length === 0 && <li className="text-gray-400 text-sm">No briefings found.</li>}
                    {companyIntelligence.briefings.map((item, i) => (
                      <li key={i} className="text-sm">
                        <div className="font-medium text-purple-800">{item.title}</div>
                        <div className="text-xs text-gray-500 mb-1">{item.date}</div>
                        <div className="text-gray-700 text-xs">{item.summary}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Financial Reporting */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Financial Reporting</h4>
                  <ul className="space-y-2">
                    {companyIntelligence.financials.length === 0 && <li className="text-gray-400 text-sm">No financials found.</li>}
                    {companyIntelligence.financials.map((item, i) => (
                      <li key={i} className="text-sm flex justify-between">
                        <span className="font-medium text-gray-800">{item.metric}</span>
                        <span className="text-gray-700">{item.value}</span>
                        <span className="text-xs ml-2 font-semibold text-green-600">{item.change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommended IBM & Red Hat Products section remains below */}
            {personalizedContent && ENHANCED_PRODUCTS[personalizedContent.persona] && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Award className="mr-2 text-blue-600" size={24} />
                  Recommended IBM & Red Hat Products
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {ENHANCED_PRODUCTS[personalizedContent.persona].map((product, index) => (
                    <EnhancedProductCard key={index} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* Restore AI Task Automation and Quick Actions below products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Suspense fallback={<div>Loading...</div>}>
                <TaskAutomationComponent clientName={clientName} clientPersona={clientPersona} />
              </Suspense>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Zap className="mr-2 text-yellow-600" size={24} />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { color: 'blue', title: 'Generate Email', desc: `Create personalized outreach for ${personalizedContent.company}` },
                    { color: 'green', title: 'Build Proposal', desc: `Custom proposal for ${personalizedContent.persona}` },
                    { color: 'purple', title: 'Meeting Prep', desc: 'Get talking points and agenda' },
                    { color: 'orange', title: 'Create Salesforce Record', desc: `Add ${personalizedContent.company} opportunity to CRM` }
                  ].map((action, i) => {
                    const color = COLOR_MAP[action.color];
                    return (
                      <button
                        key={i}
                        className={`p-4 ${color.bg} border ${color.border} rounded-lg hover:${color.bg.replace('50', '100')} transition-colors text-left mb-2`}
                        onClick={() => alert(action.title + ' - Action coming soon!')}
                      >
                        <h5 className={`font-medium ${color.text}`}>{action.title}</h5>
                        <p className={`text-sm ${color.desc} mt-1`}>{action.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }, [showClientForm, clientName, clientPersona, personalizedContent, toggleClientForm]);

  const renderBrandAnalytics = useCallback(() => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Award className="mr-2 text-blue-600" size={24} />
            Brand Performance Summary
          </h3>
          <div className="space-y-4">
            {Object.entries(ENHANCED_PIPELINE_DATA.byBrand).map(([brand, stats]) => (
              <div key={brand} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">{brand}</h4>
                  <span className="text-lg font-bold text-green-600">${stats.value}M</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{stats.count} active deals</span>
                  <span>{stats.percentage}% of pipeline</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      brand === BRANDS.SOFTWARE ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <DollarSign className="mr-2 text-purple-600" size={24} />
            Licensing Type Performance
          </h3>
          <div className="space-y-4">
            {Object.entries(ENHANCED_PIPELINE_DATA.byLicensingType).map(([type, stats]) => (
              <div key={type} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">{type}</h4>
                  <span className="text-lg font-bold text-green-600">${stats.value}M</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{stats.count} active deals</span>
                  <span>{stats.percentage}% of pipeline</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      type === LICENSING_TYPES.PERPETUAL ? 'bg-purple-500' :
                      type === LICENSING_TYPES.SAAS ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Target className="mr-2 text-green-600" size={24} />
          Cross-Sell Opportunities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Software → Infrastructure</h4>
            <p className="text-sm text-blue-700 mb-2">Clients with IBM Software often need Red Hat Infrastructure</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Security clients → OpenShift for container security</li>
              <li>• Integration clients → Ansible for deployment automation</li>
              <li>• Data clients → Red Hat Insights for monitoring</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Infrastructure → Software</h4>
            <p className="text-sm text-green-700 mb-2">Red Hat clients can benefit from IBM Software solutions</p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• OpenShift clients → Cloud Pak for Data</li>
              <li>• Ansible clients → Turbonomic for optimization</li>
              <li>• RHEL clients → Security Guardium for compliance</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200">
        <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
          <Zap className="mr-2 text-yellow-600" size={24} />
          Licensing Strategy Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800">Perpetual</h4>
            <p className="text-sm text-yellow-700 mt-1">Best for: Large enterprises with CAPEX budgets</p>
            <p className="text-xs text-yellow-600 mt-2">Higher upfront, lower long-term cost</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <h4 className="font-semibold text-orange-800">SaaS</h4>
            <p className="text-sm text-orange-700 mt-1">Best for: Startups and cloud-native companies</p>
            <p className="text-xs text-orange-600 mt-2">Pay-as-you-go, rapid deployment</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800">Subscription</h4>
            <p className="text-sm text-green-700 mt-1">Best for: Mid-market and hybrid cloud</p>
            <p className="text-xs text-green-600 mt-2">Balanced approach, predictable costs</p>
          </div>
        </div>
      </div>
    </div>
  ), []);

  const renderInsights = useCallback(() => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Globe className="mr-2 text-blue-600" size={24} />
            Market Intelligence
          </h3>
          <div className="space-y-4">
            {/* Granular market trends */}
            {[
              { gradient: 'from-blue-50 to-purple-50', border: 'blue', title: 'Cloud Infrastructure Market', desc: 'Growing at 15.2% CAGR - emphasize scalability in proposals', takeaway: 'Highlight multi-cloud and hybrid capabilities.' },
              { gradient: 'from-green-50 to-blue-50', border: 'green', title: 'AI/ML Adoption', desc: '78% of enterprises planning AI projects - Watson positioning opportunity', takeaway: 'Lead with AI-powered automation and analytics.' },
              { gradient: 'from-yellow-50 to-orange-50', border: 'yellow', title: 'Security Concerns', desc: 'Data breaches up 32% - IBM Security solutions highly relevant', takeaway: 'Stress compliance and zero-trust architectures.' },
              { gradient: 'from-pink-50 to-red-50', border: 'purple', title: 'Edge Computing', desc: 'Edge deployments up 40% YoY - latency and data sovereignty are key', takeaway: 'Discuss Red Hat OpenShift for edge.' }
            ].map((item, i) => (
              <div key={i} className={`p-4 bg-gradient-to-r ${item.gradient} rounded-lg border border-${item.border}-200 mb-2`}>
                <h4 className={`font-medium text-${item.border}-800`}>{item.title}</h4>
                <p className={`text-sm text-${item.border}-600 mt-1`}>{item.desc}</p>
                <p className="text-xs text-gray-700 mt-2 italic">Takeaway: {item.takeaway}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Competitive Intelligence */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Target className="mr-2 text-purple-600" size={24} />
            Competitive Intelligence
          </h3>
          <div className="space-y-3">
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Top Competitors:</span>
              <ul className="list-disc ml-6 text-sm text-gray-700">
                <li>AWS (recently launched new AI chip, focus on cost savings)</li>
                <li>Microsoft Azure (expanding hybrid cloud, strong security messaging)</li>
                <li>Google Cloud (emphasizing open source and data analytics)</li>
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">How you win:</span>
              <ul className="list-disc ml-6 text-sm text-green-700">
                <li>Multi-cloud flexibility (Red Hat + IBM Cloud)</li>
                <li>Integrated AI and security</li>
                <li>Strong on-prem and regulated industry support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* AI-powered Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <Zap className="mr-2 text-green-600" size={24} />
          AI-Powered Recommendations
        </h3>
        <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
          <li>Share a recent AI success story with your client.</li>
          <li>Offer a cloud cost optimization assessment.</li>
          <li>Invite the client to an upcoming IBM/Red Hat webinar.</li>
          <li>Send a personalized industry trends report.</li>
        </ul>
      </div>
      {/* Time Savings Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <Clock className="mr-2 text-blue-600" size={24} />
          Time Savings Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { task: 'Prospect Research', saved: '2.1 hrs/week', automation: 85, suggestion: 'Use saved time for deeper account planning.' },
            { task: 'Proposal Writing', saved: '3.4 hrs/week', automation: 78, suggestion: 'Spend more time on client discovery.' },
            { task: 'Pricing Quotes', saved: '1.5 hrs/week', automation: 92, suggestion: 'Focus on value-based selling.' },
            { task: 'CRM Updates', saved: '1.2 hrs/week', automation: 88, suggestion: 'Build stronger client relationships.' }
          ].map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">{item.task}</span>
                <span className="text-green-600 font-bold">{item.saved}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${item.automation}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.automation}% automated</p>
              <p className="text-xs text-blue-700 mt-1 italic">{item.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
      {/* What's New in AI */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
        <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
          <Brain className="mr-2 text-purple-600" size={24} />
          What's New in AI
        </h3>
        <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
          <li>IBM launches watsonx Code Assistant for faster app modernization (2025).</li>
          <li>Red Hat OpenShift AI now supports multi-cloud model deployment.</li>
          <li>Gartner: 60% of enterprises will use generative AI for sales by 2026.</li>
          <li>New EU AI Act impacts compliance for global enterprises.</li>
        </ul>
      </div>
    </div>
  ), []);

  function renderPersonaResearch({ personaName, setPersonaName, insights, setInsights }) {
    const handleSubmit = (e) => {
      e.preventDefault();
      setInsights(fetchPersonaInsights(personaName));
    };

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <input
            type="text"
            value={personaName}
            onChange={e => setPersonaName(e.target.value)}
            placeholder="Enter the name of the employee you are meeting with"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Get Insights
          </button>
        </form>
        {insights && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                <Users className="mr-2 text-blue-600" size={24} />
                LinkedIn Summary
              </h3>
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={insights.linkedin.photo}
                  alt={personaName + " LinkedIn profile"}
                  className="w-16 h-16 rounded-full border border-gray-300 shadow-sm object-cover"
                />
                <div>
                  <div className="text-gray-700 font-medium">{insights.linkedin.headline}</div>
                  <div className="text-gray-600 text-sm">{insights.linkedin.summary}</div>
                  <a
                    href={insights.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-700 hover:underline font-semibold mt-1"
                  >
                    View LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Recent News</h4>
                <ul className="space-y-2">
                  {insights.news.map((item, i) => (
                    <li key={i} className="text-sm">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">{item.headline}</a>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Social Media Highlights</h4>
                <ul className="space-y-2">
                  {insights.social.map((item, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-purple-700">[{item.platform}]</span>{' '}
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                          {item.content}
                        </a>
                      ) : (
                        item.content
                      )}
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Key Talking Points</h4>
              <ul className="space-y-1">
                {insights.talkingPoints.map((point, i) => (
                  <li key={i} className="text-sm text-gray-700">• {point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 1. Add renderClientProductUsage function before the main component return
  const competitorProducts = [
    {
      name: "AWS (Amazon Web Services)",
      description: "Cloud platform with broad service coverage",
      usage: "High in North America, strong in startups and digital-native clients",
      strengths: ["Breadth of services", "Ecosystem", "Pricing flexibility"],
      weaknesses: ["Vendor lock-in", "Hybrid/on-prem support weaker than IBM/Red Hat"]
    },
    {
      name: "Microsoft Azure",
      description: "Enterprise cloud platform",
      usage: "Strong in regulated industries, hybrid cloud with Azure Arc",
      strengths: ["Enterprise integration", "Security", "Hybrid cloud"],
      weaknesses: ["Complex pricing", "Less open than Red Hat"]
    },
    {
      name: "Google Cloud Platform",
      description: "Cloud platform focused on data and AI",
      usage: "Popular for analytics and AI workloads",
      strengths: ["Data/AI", "Open source support"],
      weaknesses: ["Enterprise support", "Hybrid cloud maturity"]
    }
  ];

  const renderClientProductUsage = useCallback(() => {
    if (!clientName) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
          <Target className="mb-2 text-gray-300" size={48} />
          <p className="text-lg font-semibold mb-1">No client selected</p>
          <p className="text-sm">Please select a company on the <span className="font-medium text-blue-600">Client Intelligence</span> tab to view product usage.</p>
        </div>
      );
    }

    // Example: company-specific mock data (could be replaced with real API calls)
    const companyData = {
      "Acme Corp": {
        deployedIBMRedHat: [
          { name: "IBM Turbonomic", usagePattern: "Optimizing cloud spend for SAP workloads", revenue: "$420,000 (2024 YTD)", since: "2021" },
          { name: "Red Hat OpenShift", usagePattern: "Container platform for digital banking apps", revenue: "$310,000 (2024 YTD)", since: "2020" }
        ],
        deployedCompetitors: [
          { name: "AWS Lambda", usagePattern: "Serverless for web portal", since: "2022" },
          { name: "Azure SQL", usagePattern: "Legacy database for HR", since: "2019" }
        ]
      },
      "Globex Inc": {
        deployedIBMRedHat: [
          { name: "IBM Cloud Pak for Data", usagePattern: "Data science and analytics", revenue: "$180,000 (2024 YTD)", since: "2022" },
          { name: "Red Hat Ansible", usagePattern: "Automating network config", revenue: "$90,000 (2024 YTD)", since: "2023" }
        ],
        deployedCompetitors: [
          { name: "Google BigQuery", usagePattern: "Marketing analytics", since: "2023" },
          { name: "AWS EC2", usagePattern: "Compute for dev/test", since: "2020" }
        ]
      }
    };

    // Fallback to generic mock data if company not in mock DB
    const deployedIBMRedHat = (companyData[clientName]?.deployedIBMRedHat) || [
      { name: "IBM Turbonomic", usagePattern: "Automated cloud resource optimization, daily workload balancing", revenue: "$320,000 (2024 YTD)", since: "2022" },
      { name: "Red Hat OpenShift", usagePattern: "Container orchestration for 12+ microservices, hybrid cloud", revenue: "$210,000 (2024 YTD)", since: "2021" },
      { name: "IBM Cloud Pak for Data", usagePattern: "Data integration and AI/ML pipeline for analytics team", revenue: "$150,000 (2024 YTD)", since: "2023" }
    ];
    const deployedCompetitors = (companyData[clientName]?.deployedCompetitors) || [
      { name: "AWS EC2 & S3", usagePattern: "Compute and storage for legacy workloads", since: "2018" },
      { name: "Microsoft Azure SQL Database", usagePattern: "Transactional database for finance apps", since: "2020" },
      { name: "Google BigQuery", usagePattern: "Ad hoc analytics for marketing team", since: "2023" }
    ];

    // Mock: Recommendations to displace competition
    const recommendations = [
      {
        name: "IBM Cloud Pak for Integration",
        keyPoints: [
          "Unified platform for all integration needs (vs. fragmented AWS/Azure tools)",
          "AI-powered mapping reduces integration time by 50%",
          "Hybrid and multi-cloud support with Red Hat OpenShift"
        ]
      },
      {
        name: "Red Hat Ansible Automation",
        keyPoints: [
          "Agentless automation (vs. Puppet/Chef complexity)",
          "Faster onboarding and 5000+ pre-built modules",
          "Integrated with OpenShift and IBM Cloud"
        ]
      }
    ];

    return (
      <div className="space-y-8">
        {/* IBM & Red Hat Products Deployed */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Award className="mr-2 text-blue-600" size={24} />
            IBM & Red Hat Products Deployed
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-700 border-b">
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Usage Pattern</th>
                  <th className="py-2 px-4">Deployed Since</th>
                  <th className="py-2 px-4">Historical Revenue</th>
                </tr>
              </thead>
              <tbody>
                {deployedIBMRedHat.map((prod, i) => (
                  <tr key={i} className="border-b hover:bg-blue-50">
                    <td className="py-2 px-4 font-medium text-blue-800">{prod.name}</td>
                    <td className="py-2 px-4">{prod.usagePattern}</td>
                    <td className="py-2 px-4">{prod.since}</td>
                    <td className="py-2 px-4">{prod.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competitor Products Deployed */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Target className="mr-2 text-purple-600" size={24} />
            Competitor Products Deployed
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-700 border-b">
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Usage Pattern</th>
                  <th className="py-2 px-4">Deployed Since</th>
                </tr>
              </thead>
              <tbody>
                {deployedCompetitors.map((prod, i) => (
                  <tr key={i} className="border-b hover:bg-purple-50">
                    <td className="py-2 px-4 font-medium text-purple-800">{prod.name}</td>
                    <td className="py-2 px-4">{prod.usagePattern}</td>
                    <td className="py-2 px-4">{prod.since}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations to Displace Competition */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <Zap className="mr-2 text-green-600" size={24} />
            Recommended IBM & Red Hat Products to Displace Competition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800">{rec.name}</h4>
                <ul className="list-disc ml-6 mt-2 text-xs text-gray-700">
                  {rec.keyPoints.map((point, j) => (
                    <li key={j} className="mb-1">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }, [competitorProducts]);
  // ... existing code ...
  // 2. Add new tab to tabContent
  const [plannerTasks, setPlannerTasks] = useState([
    { text: 'Review top pipeline opportunities', done: false },
    { text: 'Send follow-up emails to prospects', done: false },
    { text: 'Update Salesforce with latest activity', done: false },
    { text: 'Schedule 1 new client meeting', done: false },
    { text: 'Check quota progress and plan next steps', done: false }
  ]);
  const [focusTime, setFocusTime] = useState(25 * 60); // 25 min in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [actionPlan, setActionPlan] = useState(null);

  useEffect(() => {
    if (!timerActive) return;
    if (focusTime === 0) {
      setTimerActive(false);
      return;
    }
    const interval = setInterval(() => setFocusTime(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, [timerActive, focusTime]);

  const motivationalTips = [
    "Focus on progress, not perfection.",
    "Small wins add up to big results.",
    "Prioritize your highest-impact activities.",
    "Take breaks to recharge and stay sharp.",
    "Reach out to one new prospect today.",
    "Automate a repetitive task to save time.",
    "Celebrate your achievements, no matter how small."
  ];
  const getMotivationalTip = () => {
    const day = new Date().getDate();
    return motivationalTips[day % motivationalTips.length];
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const handleTaskToggle = idx => {
    setPlannerTasks(tasks => tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
  };
  const handleResetTimer = () => {
    setFocusTime(25 * 60);
    setTimerActive(false);
  };
  const handleGenerateActionPlan = () => {
    // Simple AI suggestion logic for demo
    setActionPlan({
      focusDeal: ENHANCED_OPPORTUNITIES[0]?.company || 'No deals',
      followUp: ENHANCED_OPPORTUNITIES[1]?.company || 'No deals',
      quickWin: ENHANCED_OPPORTUNITIES[2]?.company || 'No deals',
      tip: getMotivationalTip()
    });
  };
  const formatTime = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const renderDailyPlanner = useCallback(() => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-bold text-blue-800 flex items-center">
            <Clock className="mr-2 text-blue-600" size={24} />
            {getGreeting()}, {STATIC_METRICS.name}!
          </h3>
          <p className="text-sm text-gray-600 mt-1">Here's your productivity assistant for today.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 text-blue-700 font-medium text-sm">
          <span className="font-semibold">Motivation:</span> {getMotivationalTip()}
        </div>
      </div>

      {/* Interactive Checklist */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Today's Priorities</h4>
        <ul className="space-y-2">
          {plannerTasks.map((task, idx) => (
            <li key={idx} className="flex items-center">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleTaskToggle(idx)}
                className="mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className={task.done ? 'line-through text-gray-400' : 'text-gray-800'}>{task.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Focus Timer */}
      <div className="flex items-center gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Focus Timer (25 min Pomodoro)</h4>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono text-blue-700">{formatTime(focusTime)}</span>
            <button
              onClick={() => setTimerActive(a => !a)}
              className={`px-4 py-1 rounded text-white font-medium ${timerActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {timerActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleResetTimer}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-700 mb-2">Quota Progress</h4>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${STATIC_METRICS.quotaAttainment}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{STATIC_METRICS.achieved} / {STATIC_METRICS.quota} achieved</p>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
          <Zap className="mr-2 text-yellow-500" size={20} />
          AI Suggestions for Today
        </h4>
        <ul className="list-disc ml-6 text-blue-700 text-sm space-y-1">
          <li>Focus on closing: <span className="font-semibold">{ENHANCED_OPPORTUNITIES[0]?.company || 'No deals'}</span></li>
          <li>Follow up with: <span className="font-semibold">{ENHANCED_OPPORTUNITIES[1]?.company || 'No deals'}</span></li>
          <li>Quick win: <span className="font-semibold">{ENHANCED_OPPORTUNITIES[2]?.company || 'No deals'}</span></li>
          <li>Tip: <span className="font-semibold">{getMotivationalTip()}</span></li>
        </ul>
        <button
          onClick={handleGenerateActionPlan}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
        >
          Generate Personalized Action Plan
        </button>
        {actionPlan && (
          <div className="mt-4 p-4 bg-white border border-blue-100 rounded-lg">
            <h5 className="font-semibold text-blue-700 mb-2">Your Action Plan</h5>
            <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
              <li>Focus on: <span className="font-semibold">{actionPlan.focusDeal}</span></li>
              <li>Follow up with: <span className="font-semibold">{actionPlan.followUp}</span></li>
              <li>Quick win: <span className="font-semibold">{actionPlan.quickWin}</span></li>
              <li>Motivation: <span className="font-semibold">{actionPlan.tip}</span></li>
            </ul>
          </div>
        )}
      </div>
      {/* Personalized & Dynamic Salesforce Updates */}
      <div className="bg-white border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
          <Bell className="mr-2 text-yellow-500" size={20} />
          Personalized Salesforce Updates
        </h4>
        <ul className="list-disc ml-6 text-yellow-700 text-sm space-y-2">
          {ENHANCED_OPPORTUNITIES.length === 0 && (
            <li>All opportunities are up to date! ��</li>
          )}
          {ENHANCED_OPPORTUNITIES.map((opp, idx) => {
            const recent = opp.lastActivity && (opp.lastActivity.includes('hour') || opp.lastActivity.includes('day') && parseInt(opp.lastActivity) <= 1);
            const highPriority = opp.probability >= 80;
            const needsNotes = opp.stage === 'Negotiation' || opp.stage === 'Proposal';
            return (
              <li key={idx}>
                <span className="font-semibold">{opp.company}:</span> {' '}
                {recent && (
                  <span>Log a note about recent activity ({opp.lastActivity}). </span>
                )}
                {opp.nextAction && (
                  <span>Update next action: <span className="italic">{opp.nextAction}</span>. </span>
                )}
                {highPriority && (
                  <span className="text-red-600 font-semibold">High-priority: Review and update stage ({opp.stage}). </span>
                )}
                {needsNotes && (
                  <span>Add detailed meeting notes for <span className="font-semibold">{opp.contact}</span>. </span>
                )}
                {!recent && !opp.nextAction && !highPriority && !needsNotes && (
                  <span>Review and update opportunity details as needed.</span>
                )}
              </li>
            );
          })}
          <li>Log any new calls or emails with prospects.</li>
          <li>Review and update next action items for all active opportunities.</li>
        </ul>
      </div>
    </div>
  ), [plannerTasks, focusTime, timerActive, actionPlan]);
  // ... existing code ...
  const tabContent = useMemo(() => ({
    overview: renderOverview,
    pipeline: renderPipeline,
    intelligence: renderClientIntelligence,
    productUsage: renderClientProductUsage,
    brandAnalytics: renderBrandAnalytics,
    persona: () => renderPersonaResearch({ personaName, setPersonaName, insights, setInsights }),
    dailyPlanner: renderDailyPlanner
  }), [renderOverview, renderPipeline, renderClientIntelligence, renderClientProductUsage, renderBrandAnalytics, personaName, setPersonaName, insights, setInsights, renderPersonaResearch, renderDailyPlanner]);
  // ... existing code ...
  // 3. Add new TabButton for Client Product Usage in navigation
  <TabButton 
    id="productUsage" 
    label="Client Product Usage" 
    isActive={selectedTab === 'productUsage'} 
    onClick={setSelectedTab}
  />
  // ... existing code ...

  // Ensure selectedTab is always valid
  const validTabs = Object.keys(tabContent);
  const safeSelectedTab = validTabs.includes(selectedTab) ? selectedTab : 'overview';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{STATIC_METRICS.name} AI Assistant</h1>
                  <p className="text-sm text-gray-500">Welcome back, {STATIC_METRICS.name}</p>
                </div>
              </div>
              <span className="hidden md:inline text-sm text-gray-500">IBM & Red Hat Sales Productivity Suite</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="text-gray-600 cursor-pointer hover:text-blue-600" size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600" size={16} />
              </div>
            </div>
          </div>
          
          {/* Daily Inspiration Quote */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💪</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 mb-1">Today's Inspiration</p>
                <p className="text-sm text-gray-700 italic">"{getDailyQuote()}"</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <nav className="flex flex-wrap gap-2 mb-6" role="navigation">
          <TabButton 
            id="overview" 
            label="Overview" 
            isActive={selectedTab === 'overview'} 
            onClick={setSelectedTab}
          />
          <TabButton 
            id="dailyPlanner" 
            label="Daily Planner" 
            isActive={selectedTab === 'dailyPlanner'} 
            onClick={setSelectedTab}
          />
          <TabButton 
            id="pipeline" 
            label="My Pipeline" 
            isActive={selectedTab === 'pipeline'} 
            onClick={setSelectedTab}
          />
          <TabButton 
            id="brandAnalytics" 
            label="Brand Analytics" 
            isActive={selectedTab === 'brandAnalytics'} 
            onClick={setSelectedTab}
          />
          <TabButton 
            id="intelligence" 
            label="Client Intelligence" 
            isActive={selectedTab === 'intelligence'} 
            onClick={setSelectedTab}
          />
          <TabButton 
            id="productUsage" 
            label="Client Product Usage" 
            isActive={selectedTab === 'productUsage'} 
            onClick={setSelectedTab}
          />
          <TabButton 
            id="persona" 
            label="Employee Research" 
            isActive={selectedTab === 'persona'} 
            onClick={setSelectedTab}
          />
        </nav>

        {/* Content */}
        {tabContent[safeSelectedTab] ? tabContent[safeSelectedTab]() : null}
      </main>
    </div>
  );
};

export default SalesProductivityDashboard; 