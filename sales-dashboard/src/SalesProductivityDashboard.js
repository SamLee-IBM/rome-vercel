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

// Mapping from competitor products to IBM/Red Hat equivalents
const COMPETITOR_TO_IBM_EQUIVALENTS = {
  // AWS
  "AWS Lambda": ["IBM Cloud Code Engine"],
  "AWS EC2": ["IBM Virtual Servers", "IBM Power Systems Virtual Server"],
  "AWS EC2 & S3": ["IBM Virtual Servers", "IBM Cloud Object Storage"],
  "AWS S3": ["IBM Cloud Object Storage"],
  "AWS Cost Explorer": ["IBM Turbonomic"],
  // Azure
  "Azure SQL": ["IBM Db2", "IBM Cloud Databases for PostgreSQL"],
  "Microsoft Azure SQL Database": ["IBM Db2", "IBM Cloud Databases for PostgreSQL"],
  "Azure AKS": ["Red Hat OpenShift"],
  // Google
  "Google BigQuery": ["IBM Cloud Pak for Data"],
  "Google Cloud Run": ["IBM Cloud Code Engine"],
  // General
  "Serverless for web portal": ["IBM Cloud Code Engine"],
  "Transactional database for finance apps": ["IBM Db2"],
  "Compute and storage for legacy workloads": ["IBM Virtual Servers", "IBM Cloud Object Storage"],
  "Ad hoc analytics for marketing team": ["IBM Cloud Pak for Data"],
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
    className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
    style={{ minWidth: 0 }}
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
  "Dogs are always in the pushup position.",
  "I haven't slept for ten days, because that would be too long.",
  "I wanted to buy a candle holder, but the store didn't have one. So I got a cake.",
  "Rice is great if you're hungry and want 2000 of something.",
  "An escalator can never break: it can only become stairs.",
  "I saw a commercial on late night TV, it said, 'Forget everything you know about slipcovers.' So I did.",
  "I think Bigfoot is blurry, that's the problem.",
  "I bought a seven-dollar pen because I always lose pens and I got sick of not caring.",
  "I used to be a hot-tar roofer. Yeah, I remember that... day.",
  "I had a paper route when I was a kid. I was supposed to go to 2,000 houses. Or two dumpsters",
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
    company: "Global Bank Inc",
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
    company: "Acme Group",
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
    company: "Global Bank Inc",
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
  const [showAllIBM, setShowAllIBM] = useState(false);
  const [showAllCompetitors, setShowAllCompetitors] = useState(false);

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

  // Mock data for client interests
  const MOCK_CLIENT_INTERESTS = [
    {
      id: 1,
      name: "Jane Doe",
      title: "VP of IT",
      email: "jane.doe@client.com",
      phone: "555-123-4567",
      company: "Acme Corp",
      product: "IBM Cloud Pak for Data",
      brand: "IBM",
      campaign: "AI Modernization Webinar Q2",
      notes: "Attended webinar, interested in data modernization. Wants follow-up on migration options."
    },
    {
      id: 2,
      name: "John Smith",
      title: "Director of Infrastructure",
      email: "john.smith@client.com",
      phone: "555-987-6543",
      company: "Globex Inc",
      product: "Red Hat OpenShift",
      brand: "Red Hat",
      campaign: "Hybrid Cloud Campaign",
      notes: "Requested a demo. Focused on hybrid cloud orchestration."
    },
    {
      id: 3,
      name: "Alice Lee",
      title: "CIO",
      email: "alice.lee@client.com",
      phone: "555-555-5555",
      company: "Initech",
      product: "IBM Turbonomic",
      brand: "IBM",
      campaign: "Cost Optimization Outreach",
      notes: "Interested in cost savings. Asked for case studies."
    }
  ];

  // Email template generator
  function generateEmail({ name, title, company, product, campaign }) {
    return `Subject: Thank you for your interest in ${product}\n\nHi ${name},\n\nThank you for your interest in ${product} during our recent \"${campaign}\" campaign. As the ${title} at ${company}, you are in a great position to drive innovation and value with this solution.\n\nI'd love to schedule a quick call to discuss how ${product} can help you achieve your goals. Please let me know your availability, or feel free to reply directly to this email.\n\nBest regards,\n[Your Name]\nIBM & Red Hat Sales Team`;
  }


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

  // State for the Client Interests modal and email
  const [emailContent, setEmailContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalInterest, setModalInterest] = useState(null);

  const handleGenerateEmail = useCallback((interest) => {
    setEmailContent(generateEmail(interest));
    setModalInterest(interest);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalInterest(null);
    setEmailContent("");
  }, []);

  const renderClientInterests = useCallback(() => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Users className="mr-2 text-blue-600" size={24} />
          Recent Client Interests (ISC)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-700 border-b">
                <th className="py-2 px-4">Contact</th>
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Company</th>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Brand</th>
                <th className="py-2 px-4">Campaign</th>
                <th className="py-2 px-4">Notes</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CLIENT_INTERESTS.map((interest) => (
                <tr key={interest.id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">
                    <div className="font-medium text-blue-800">{interest.name}</div>
                    <div className="text-xs text-gray-500">{interest.email}<br/>{interest.phone}</div>
                  </td>
                  <td className="py-2 px-4">{interest.title}</td>
                  <td className="py-2 px-4">{interest.company}</td>
                  <td className="py-2 px-4">{interest.product}</td>
                  <td className="py-2 px-4">{interest.brand}</td>
                  <td className="py-2 px-4">{interest.campaign}</td>
                  <td className="py-2 px-4">{interest.notes}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      onClick={() => handleGenerateEmail(interest)}
                    >
                      Generate Email Outreach
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for email preview */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-lg w-full">
            <h4 className="text-lg font-bold text-gray-800 mb-2">Email Outreach Preview</h4>
            <textarea
              className="w-full h-48 p-2 border border-gray-300 rounded mb-4 text-sm font-mono"
              value={emailContent}
              readOnly
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {navigator.clipboard.writeText(emailContent); handleCloseModal();}}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ), [showModal, emailContent, handleCloseModal, handleGenerateEmail]);

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

  // Enhanced account quota data with primary/secondary quota split and closed opportunities breakdown
  const ACCOUNT_QUOTA_DATA = [
    {
      account: 'Global Bank Inc',
      primaryQuota: {
        quota: 1500000,
        achieved: 1200000,
        type: 'Transactional/Trans'
      },
      secondaryQuota: {
        quota: 500000,
        achieved: 300000,
        type: 'SaaS/Services'
      },
      closedOpportunities: [
        {
          id: 'GB-001',
          name: 'Cloud Migration Project',
          value: 750000,
          closeDate: '2025-01-15',
          stage: 'Closed Won',
          quotaType: 'primary',
          products: ['Red Hat OpenShift', 'IBM Cloud Pak for Integration']
        },
        {
          id: 'GB-002',
          name: 'Security Infrastructure Upgrade',
          value: 450000,
          closeDate: '2025-02-20',
          stage: 'Closed Won',
          quotaType: 'primary',
          products: ['IBM Security QRadar', 'IBM Security Guardium']
        },
        {
          id: 'GB-003',
          name: 'DevOps Automation Initiative',
          value: 300000,
          closeDate: '2025-03-10',
          stage: 'Closed Won',
          quotaType: 'secondary',
          products: ['Red Hat Ansible Automation', 'IBM Cloud Code Engine']
        }
      ],
      pipelineValue: 730000,
      activeOpportunities: 2
    },
    {
      account: 'Acme Group',
      primaryQuota: {
        quota: 2200000,
        achieved: 1400000,
        type: 'Transactional/Trans'
      },
      secondaryQuota: {
        quota: 800000,
        achieved: 400000,
        type: 'SaaS/Services'
      },
      closedOpportunities: [
        {
          id: 'AG-001',
          name: 'Enterprise Data Platform',
          value: 900000,
          closeDate: '2025-01-30',
          stage: 'Closed Won',
          quotaType: 'primary',
          products: ['IBM Cloud Pak for Data', 'Red Hat OpenShift']
        },
        {
          id: 'AG-002',
          name: 'Hybrid Cloud Infrastructure',
          value: 600000,
          closeDate: '2025-02-15',
          stage: 'Closed Won',
          quotaType: 'primary',
          products: ['IBM Cloud', 'Red Hat Enterprise Linux']
        },
        {
          id: 'AG-003',
          name: 'Cost Optimization Project',
          value: 300000,
          closeDate: '2025-03-05',
          stage: 'Closed Won',
          quotaType: 'secondary',
          products: ['IBM Turbonomic', 'Red Hat Insights']
        }
      ],
      pipelineValue: 320000,
      activeOpportunities: 1
    }
  ];

  const renderPipeline = useCallback(() => {
    return (
      <div className="space-y-6">
        {/* Quota Attainment by Account */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <Target className="mr-2 text-blue-600" size={24} />
            Quota Attainment by Account
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ACCOUNT_QUOTA_DATA.map((acct) => {
              const totalQuota = acct.primaryQuota.quota + acct.secondaryQuota.quota;
              const totalAchieved = acct.primaryQuota.achieved + acct.secondaryQuota.achieved;
              const totalPercent = Math.round((totalAchieved / totalQuota) * 100);
              const primaryPercent = Math.round((acct.primaryQuota.achieved / acct.primaryQuota.quota) * 100);
              const secondaryPercent = Math.round((acct.secondaryQuota.achieved / acct.secondaryQuota.quota) * 100);
              
              return (
                <div key={acct.account} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 text-lg mb-3">{acct.account}</h4>
                    
                    {/* Total Quota Summary */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Total Quota</div>
                        <div className="text-lg font-bold text-gray-800">${totalQuota.toLocaleString()}</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Total Achieved</div>
                        <div className="text-lg font-bold text-green-600">${totalAchieved.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Total Attainment:</span>
                      <span className="font-bold text-blue-700 text-lg">{totalPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="h-3 rounded-full bg-blue-600 transition-all duration-1000"
                        style={{ width: `${Math.min(100, totalPercent)}%` }}
                      />
                    </div>
                    
                    {/* Primary vs Secondary Quota Breakdown */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-2">Primary Quota</div>
                        <div className="text-xs text-blue-600 mb-1">{acct.primaryQuota.type}</div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quota:</span>
                          <span className="font-medium">${acct.primaryQuota.quota.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Achieved:</span>
                          <span className="font-medium text-green-600">${acct.primaryQuota.achieved.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-blue-600">Attainment:</span>
                          <span className="font-bold text-blue-700">{primaryPercent}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-600 transition-all duration-1000"
                            style={{ width: `${Math.min(100, primaryPercent)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-sm font-medium text-purple-800 mb-2">Secondary Quota</div>
                        <div className="text-xs text-purple-600 mb-1">{acct.secondaryQuota.type}</div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quota:</span>
                          <span className="font-medium">${acct.secondaryQuota.quota.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Achieved:</span>
                          <span className="font-medium text-green-600">${acct.secondaryQuota.achieved.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-purple-600">Attainment:</span>
                          <span className="font-bold text-purple-700">{secondaryPercent}%</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-purple-600 transition-all duration-1000"
                            style={{ width: `${Math.min(100, secondaryPercent)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="text-blue-600 font-medium">Pipeline</div>
                        <div className="text-blue-800">${acct.pipelineValue.toLocaleString()}</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
                        <div className="text-purple-600 font-medium">Active Deals</div>
                        <div className="text-purple-800">{acct.activeOpportunities}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Closed Opportunities Breakdown */}
                  <div className="mt-6">
                    <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </span>
                      Closed Opportunities ({acct.closedOpportunities.length})
                    </h5>
                    <div className="space-y-3">
                      {acct.closedOpportunities.map((opp) => (
                        <div key={opp.id} className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-gray-800 text-sm">{opp.name}</div>
                              <div className="text-xs text-gray-500">{opp.id}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">${opp.value.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">{opp.closeDate}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              {opp.stage}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              opp.quotaType === 'primary' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {opp.quotaType === 'primary' ? 'Primary' : 'Secondary'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {opp.products.map((product, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Opportunities */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-green-600" size={24} />
            Active Opportunities
          </h3>
          <div className="space-y-4">
            {ENHANCED_OPPORTUNITIES.map((opp) => (
              <div key={opp.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{opp.company}</h4>
                    <p className="text-sm text-gray-600">{opp.contact}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{opp.value}</div>
                    <div className="text-sm text-gray-500">{opp.probability}% probability</div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {opp.stage}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {opp.brand}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {opp.licensingType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Close: {opp.closeDate}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-700"><strong>Next Action:</strong> {opp.nextAction}</p>
                  <p className="text-sm text-gray-500">Last Activity: {opp.lastActivity}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-gray-700">AI Insights:</h5>
                  <ul className="space-y-1">
                    {opp.aiInsights.map((insight, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Products:</h5>
                  <div className="flex flex-wrap gap-2">
                    {opp.products.map((product, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                        {product.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Insights */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Brain className="mr-2 text-purple-600" size={24} />
            Pipeline Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Total Pipeline Value</h4>
              <div className="text-2xl font-bold text-blue-600">
                ${ENHANCED_OPPORTUNITIES.reduce((sum, opp) => sum + parseInt(opp.value.replace(/[$,]/g, '')), 0).toLocaleString()}K
              </div>
              <p className="text-sm text-blue-600 mt-1">Across {ENHANCED_OPPORTUNITIES.length} opportunities</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Average Probability</h4>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(ENHANCED_OPPORTUNITIES.reduce((sum, opp) => sum + opp.probability, 0) / ENHANCED_OPPORTUNITIES.length)}%
              </div>
              <p className="text-sm text-green-600 mt-1">Weighted pipeline value</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Next 30 Days</h4>
              <div className="text-2xl font-bold text-purple-600">
                {ENHANCED_OPPORTUNITIES.filter(opp => {
                  const closeDate = new Date(opp.closeDate);
                  const thirtyDaysFromNow = new Date();
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                  return closeDate <= thirtyDaysFromNow;
                }).length}
              </div>
              <p className="text-sm text-purple-600 mt-1">Opportunities closing</p>
            </div>
          </div>
        </div>
      </div>
    );
  }, []);

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
          { name: "IBM Turbonomic", usagePattern: "Optimizing cloud spend for SAP workloads", assignedRevenue: 500000, deployedRevenue: 420000, lastDeploymentReport: "2024-04-10", since: "2021" },
          { name: "Red Hat OpenShift", usagePattern: "Container platform for digital banking apps", assignedRevenue: 350000, deployedRevenue: 310000, lastDeploymentReport: "2024-04-12", since: "2020" },
          { name: "IBM Cloud Pak for Integration", usagePattern: "Integrating legacy and cloud apps", assignedRevenue: 200000, deployedRevenue: 180000, lastDeploymentReport: "2024-04-15", since: "2022" },
          { name: "Red Hat Ansible Automation", usagePattern: "Automating IT operations", assignedRevenue: 120000, deployedRevenue: 100000, lastDeploymentReport: "2024-04-16", since: "2023" }
        ],
        deployedCompetitors: [
          { name: "AWS Lambda", usagePattern: "Serverless for web portal", since: "2022" },
          { name: "Azure SQL", usagePattern: "Legacy database for HR", since: "2019" },
          { name: "Google BigQuery", usagePattern: "Analytics for marketing", since: "2023" },
          { name: "AWS EC2", usagePattern: "Compute for dev/test", since: "2020" }
        ]
      },
      "Globex Inc": {
        deployedIBMRedHat: [
          { name: "IBM Cloud Pak for Data", usagePattern: "Data science and analytics", assignedRevenue: 200000, deployedRevenue: 180000, lastDeploymentReport: "2024-04-08", since: "2022" },
          { name: "Red Hat Ansible", usagePattern: "Automating network config", assignedRevenue: 100000, deployedRevenue: 90000, lastDeploymentReport: "2024-04-09", since: "2023" },
          { name: "IBM Security QRadar", usagePattern: "Threat detection and response", assignedRevenue: 150000, deployedRevenue: 120000, lastDeploymentReport: "2024-04-17", since: "2021" },
          { name: "Red Hat Enterprise Linux", usagePattern: "Enterprise OS for workloads", assignedRevenue: 80000, deployedRevenue: 70000, lastDeploymentReport: "2024-04-18", since: "2020" }
        ],
        deployedCompetitors: [
          { name: "Google BigQuery", usagePattern: "Marketing analytics", since: "2023" },
          { name: "AWS EC2", usagePattern: "Compute for dev/test", since: "2020" },
          { name: "Microsoft Azure SQL Database", usagePattern: "Transactional DB for finance", since: "2021" },
          { name: "AWS S3", usagePattern: "Object storage for backups", since: "2019" }
        ]
      }
    };

    // Fallback to generic mock data if company not in mock DB
    const deployedIBMRedHat = (companyData[clientName]?.deployedIBMRedHat) || [
      { name: "IBM Turbonomic", usagePattern: "Automated cloud resource optimization, daily workload balancing", assignedRevenue: 400000, deployedRevenue: 320000, lastDeploymentReport: "2024-04-11", since: "2022" },
      { name: "Red Hat OpenShift", usagePattern: "Container orchestration for 12+ microservices, hybrid cloud", assignedRevenue: 250000, deployedRevenue: 210000, lastDeploymentReport: "2024-04-13", since: "2021" },
      { name: "IBM Cloud Pak for Data", usagePattern: "Data integration and AI/ML pipeline for analytics team", assignedRevenue: 180000, deployedRevenue: 150000, lastDeploymentReport: "2024-04-14", since: "2023" },
      { name: "Red Hat Ansible Automation", usagePattern: "Automating IT operations", assignedRevenue: 100000, deployedRevenue: 80000, lastDeploymentReport: "2024-04-19", since: "2023" }
    ];
    const deployedCompetitors = (companyData[clientName]?.deployedCompetitors) || [
      { name: "AWS EC2 & S3", usagePattern: "Compute and storage for legacy workloads", since: "2018" },
      { name: "Microsoft Azure SQL Database", usagePattern: "Transactional database for finance apps", since: "2020" },
      { name: "Google BigQuery", usagePattern: "Ad hoc analytics for marketing team", since: "2023" },
      { name: "AWS Lambda", usagePattern: "Serverless for web portal", since: "2022" }
    ];

    // Show more/less state for IBM and competitor products
    const visibleIBM = showAllIBM ? deployedIBMRedHat : deployedIBMRedHat.slice(0, 2);
    const visibleCompetitors = showAllCompetitors ? deployedCompetitors : deployedCompetitors.slice(0, 2);

    // Dynamically generate recommendations based on deployed competitors
    const recommendedProducts = [];
    const recommendedNames = new Set();
    deployedCompetitors.forEach((prod) => {
      const equivalents = COMPETITOR_TO_IBM_EQUIVALENTS[prod.name] || COMPETITOR_TO_IBM_EQUIVALENTS[prod.usagePattern] || [];
      equivalents.forEach(eq => {
        if (!recommendedNames.has(eq)) {
          // Try to find product details from ENHANCED_PRODUCTS or fallback
          let productDetail = null;
          for (const persona in ENHANCED_PRODUCTS) {
            const found = ENHANCED_PRODUCTS[persona].find(p => p.name === eq);
            if (found) { productDetail = found; break; }
          }
          recommendedProducts.push({
            name: eq,
            rationale: `Recommended to displace ${prod.name}`,
            description: productDetail?.description || '',
            differentiator: productDetail?.differentiators?.[0] || '',
            alignment: productDetail?.alignment || ''
          });
          recommendedNames.add(eq);
        }
      });
    });
    // Limit to top 2, ensure unique differentiators and richer descriptions
    const topRecommended = recommendedProducts.slice(0, 2).map((rec, idx, arr) => {
      // Find a unique differentiator for each product
      let productDetail = null;
      for (const persona in ENHANCED_PRODUCTS) {
        const found = ENHANCED_PRODUCTS[persona].find(p => p.name === rec.name);
        if (found) { productDetail = found; break; }
      }
      // Pick a different differentiator for each product if possible
      let differentiator = productDetail?.differentiators?.[0] || '';
      if (arr.length > 1 && idx === 1 && productDetail?.differentiators?.length > 1) {
        // Try to pick a different differentiator for the second product
        differentiator = productDetail.differentiators[1];
      }
      // Compose a richer, more tailored description
      let detailedDescription = '';
      detailedDescription += `${rec.name} is ${productDetail?.description || 'an IBM/Red Hat solution'} designed to help organizations ${productDetail?.alignment?.toLowerCase() || 'modernize and optimize their IT environment'}. `;
      detailedDescription += `This product is especially relevant for clients currently using ${rec.rationale.replace('Recommended to displace ', '')}, as it addresses common pain points such as ${differentiator.replace(/^vs [^:]+: /, '').split(' with ')[0] || 'integration, cost, and scalability'}. `;
      detailedDescription += `A key differentiator: ${differentiator}. `;
      detailedDescription += `By adopting ${rec.name}, clients can expect outcomes like improved efficiency, reduced costs, and a future-proofed technology stack. Now is an ideal time to consider this transition, as many organizations are seeking to maximize ROI and reduce vendor lock-in.`;
      return { ...rec, detailedDescription, differentiator };
    });

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
                  <th className="py-2 px-4">Assigned Revenue</th>
                  <th className="py-2 px-4">Deployed Revenue</th>
                  <th className="py-2 px-4">% Deployed</th>
                  <th className="py-2 px-4">Last Deployment Report</th>
                </tr>
              </thead>
              <tbody>
                {visibleIBM.map((prod, i) => {
                  const percent = prod.assignedRevenue && prod.deployedRevenue ? Math.round((prod.deployedRevenue / prod.assignedRevenue) * 100) : null;
                  return (
                    <tr key={i} className="border-b hover:bg-blue-50">
                      <td className="py-2 px-4 font-medium text-blue-800">{prod.name}</td>
                      <td className="py-2 px-4">{prod.usagePattern}</td>
                      <td className="py-2 px-4">{prod.since}</td>
                      <td className="py-2 px-4">{prod.assignedRevenue ? `$${prod.assignedRevenue.toLocaleString()}` : '-'}</td>
                      <td className="py-2 px-4">{prod.deployedRevenue ? `$${prod.deployedRevenue.toLocaleString()}` : '-'}</td>
                      <td className="py-2 px-4">{percent !== null ? `${percent}%` : '-'}</td>
                      <td className="py-2 px-4">{prod.lastDeploymentReport || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-2 flex justify-end">
              <button
                className="text-blue-600 text-xs font-medium underline hover:text-blue-800 focus:outline-none"
                onClick={() => setShowAllIBM(v => !v)}
              >
                {showAllIBM ? 'Show less' : 'Show more'}
              </button>
            </div>
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
                  <th className="py-2 px-4">IBM Equivalent(s)</th>
                </tr>
              </thead>
              <tbody>
                {visibleCompetitors.map((prod, i) => {
                  const equivalents = COMPETITOR_TO_IBM_EQUIVALENTS[prod.name] || COMPETITOR_TO_IBM_EQUIVALENTS[prod.usagePattern] || [];
                  return (
                    <tr key={i} className="border-b hover:bg-purple-50">
                      <td className="py-2 px-4 font-medium text-purple-800">{prod.name}</td>
                      <td className="py-2 px-4">{prod.usagePattern}</td>
                      <td className="py-2 px-4">{prod.since}</td>
                      <td className="py-2 px-4">
                        {equivalents.length > 0 ? (
                          equivalents.map((eq, idx) => (
                            <span key={idx} className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs font-medium mr-1 mb-1">{eq}</span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-2 flex justify-end">
              <button
                className="text-purple-600 text-xs font-medium underline hover:text-purple-800 focus:outline-none"
                onClick={() => setShowAllCompetitors(v => !v)}
              >
                {showAllCompetitors ? 'Show less' : 'Show more'}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations to Displace Competition */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <Zap className="mr-2 text-green-600" size={24} />
            Recommended IBM & Red Hat Products to Displace Competition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topRecommended.length === 0 ? (
              <div className="text-gray-500 italic">No direct IBM/Red Hat equivalents found for current competitor products.</div>
            ) : (
              topRecommended.map((rec, i) => (
                <div key={i} className="bg-green-50 rounded-lg p-4 border border-green-200 flex flex-col space-y-2">
                  <h4 className="font-semibold text-green-800 text-lg mb-1">{rec.name}</h4>
                  {rec.detailedDescription && <p className="text-sm text-gray-700 mb-1">{rec.detailedDescription}</p>}
                  {rec.differentiator && <div className="border-l-4 border-blue-300 pl-3 text-xs text-blue-700 mb-1"><span className="font-semibold">Key differentiator:</span> {rec.differentiator}</div>}
                  {rec.alignment && <div className="border-l-4 border-green-300 pl-3 text-xs text-green-700 mb-1"><span className="font-semibold">How it helps:</span> {rec.alignment}</div>}
                  <div className="border-t border-green-100 pt-2 mt-2 text-xs text-gray-700">{rec.rationale}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }, [clientName, showAllIBM, showAllCompetitors]);
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
    dailyPlanner: renderDailyPlanner,
    clientInterests: renderClientInterests // <-- Add this line
  }), [renderOverview, renderPipeline, renderClientIntelligence, renderClientProductUsage, renderBrandAnalytics, personaName, setPersonaName, insights, setInsights, renderPersonaResearch, renderDailyPlanner, renderClientInterests]);
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
              {/* Logo */}
              <img src="/rome-logo.png" alt="ROME AI Sales Platform" style={{ height: 80 }} className="mr-4" />
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
        <nav className="flex flex-nowrap gap-2 mb-6 w-full" role="navigation">
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
          {/* <TabButton 
            id="persona" 
            label="Employee Research" 
            isActive={selectedTab === 'persona'} 
            onClick={setSelectedTab}
          /> */}
          <TabButton 
            id="clientInterests" 
            label="Client Interests" 
            isActive={selectedTab === 'clientInterests'} 
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