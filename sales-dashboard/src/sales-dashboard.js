import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, Bell, Target, Award, Zap, Brain, Globe } from 'lucide-react';

// Lazy load heavy components
const TaskAutomationComponent = lazy(() => Promise.resolve({
  default: ({ clientName, clientPersona }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Zap className="mr-2 text-blue-600" size={24} />
        AI Task Automation
      </h3>
      <div className="space-y-4">
        {[
          { status: 'green', title: 'Auto-generated proposal ready', desc: clientName ? `Customized for ${clientName} (${clientPersona})` : 'Waiting for client details' },
          { status: 'blue', title: 'Salesforce updated with call notes', desc: '3 opportunities automatically synced' },
          { status: 'yellow', title: 'Pricing quote generated', desc: clientPersona === 'CFO' ? 'Cost-focused messaging applied' : 
            clientPersona === 'CIO' ? 'ROI calculations included' : clientPersona ? 'Persona-specific pricing' : 'Standard enterprise pricing' }
        ].map((item, i) => (
          <div key={i} className={`flex items-center justify-between p-3 bg-${item.status}-50 rounded-lg border border-${item.status}-200`}>
            <div>
              <p className={`font-medium text-${item.status}-800`}>{item.title}</p>
              <p className={`text-sm text-${item.status}-600`}>{item.desc}</p>
            </div>
            <button className={`bg-${item.status}-600 text-white px-3 py-1 rounded text-sm hover:bg-${item.status}-700`}>
              {i === 0 ? 'Review' : i === 1 ? 'View' : 'Send'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}));

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
  name: "Wilson Hailer",
  quota: "$2.5M",
  achieved: "$1.8M",
  quotaAttainment: 72,
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

// Optimized Opportunity Card Component
const OpportunityCard = React.memo(({ 
  opp, 
  editingNote, 
  opportunityNotes, 
  onStageChange, 
  onNoteChange, 
  onNoteSubmit, 
  onEditNote, 
  onCancelEdit, 
  onSelectOpportunity 
}) => {
  const stageColors = {
    Won: 'bg-green-100 text-green-800 border-green-200',
    Negotiation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Proposal: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-800">{opp.company}</h4>
            <p className="text-gray-600">{opp.contact}</p>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-2xl font-bold text-green-600">{opp.value}</p>
              <span className="text-sm text-gray-500">Close: {new Date(opp.closeDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-right">
            <select 
              value={opp.stage}
              onChange={(e) => onStageChange(opp.id, e.target.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer ${
                stageColors[opp.stage] || stageColors.default
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
            <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
              {product}
            </span>
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
                  onChange={(e) => onNoteChange(opp.id, e.target.value)}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => onNoteSubmit(opp.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button 
                    onClick={onCancelEdit}
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
                      onClick={() => onEditNote(opp.id)}
                      className="block mt-2 text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Edit note
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => onEditNote(opp.id)}
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
              onClick={() => onSelectOpportunity(opp)}
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
  );
});

// Optimized Modal Component
const OpportunityModal = React.memo(({ opportunity, opportunityNotes, onClose }) => {
  if (!opportunity) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{opportunity.company}</h2>
              <p className="text-gray-600">{opportunity.contact}</p>
            </div>
            <button 
              onClick={onClose}
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
                  <span className="font-semibold text-green-600">{opportunity.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    opportunity.stage === 'Negotiation' ? 'bg-yellow-100 text-yellow-800' :
                    opportunity.stage === 'Proposal' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>{opportunity.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Probability:</span>
                  <span className="font-semibold">{opportunity.probability}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Close Date:</span>
                  <span className="font-semibold">{new Date(opportunity.closeDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Products</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.products.map((product, i) => (
                  <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">AI Insights</h3>
            <div className="space-y-2">
              {opportunity.aiInsights.map((insight, i) => (
                <div key={i} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{opportunityNotes[opportunity.id] || 'No notes added yet.'}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
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
  );
});

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

  const renderPipeline = useCallback(() => (
    <div className="space-y-6">
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
            <p className="text-3xl font-bold text-gray-800">$5.7M</p>
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

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Pipeline Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DEAL_PIPELINE}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="count" fill="#0f62fe" name="Number of Deals" />
            <Bar yAxisId="right" dataKey="value" fill="#24a148" name="Value ($M)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Top Opportunities</h3>
        {TOP_OPPORTUNITIES.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opp={opp}
            editingNote={editingNote}
            opportunityNotes={opportunityNotes}
            onStageChange={handleStageChange}
            onNoteChange={handleNoteChange}
            onNoteSubmit={handleNoteSubmit}
            onEditNote={setEditingNote}
            onCancelEdit={() => setEditingNote(null)}
            onSelectOpportunity={setSelectedOpportunity}
          />
        ))}
      </div>

      <OpportunityModal
        opportunity={selectedOpportunity}
        opportunityNotes={opportunityNotes}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  ), [opportunityNotes, editingNote, selectedOpportunity, handleStageChange, handleNoteChange, handleNoteSubmit]);

  const renderClientIntelligence = useCallback(() => (
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
            </div>
          </div>
        )}
      </div>

      {personalizedContent && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-red-600 font-bold">!</span>
                </span>
                Key Pain Points
              </h4>
              <ul className="space-y-2">
                {personalizedContent.painPoints.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-green-600 font-bold">✓</span>
                </span>
                Recommended Solutions
              </h4>
              <ul className="space-y-2">
                {personalizedContent.solutions.map((solution, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-bold">💬</span>
                </span>
                Key Messaging
              </h4>
              <ul className="space-y-2">
                {personalizedContent.messaging.map((message, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {personalizedContent.products && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Award className="mr-2 text-blue-600" size={24} />
                Recommended IBM & Red Hat Products
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {personalizedContent.products.map((product, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="mb-3">
                      <h4 className="font-bold text-gray-800 text-lg">{product.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    </div>
                    
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Why it fits:</p>
                      <p className="text-sm text-blue-700 mt-1">{product.alignment}</p>
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
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                ].map((action, i) => (
                  <button key={i} className={`p-4 bg-${action.color}-50 border border-${action.color}-200 rounded-lg hover:bg-${action.color}-100 transition-colors text-left`}>
                    <h5 className={`font-medium text-${action.color}-800`}>{action.title}</h5>
                    <p className={`text-sm text-${action.color}-600 mt-1`}>{action.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  ), [showClientForm, clientName, clientPersona, personalizedContent, toggleClientForm]);

  const renderInsights = useCallback(() => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Globe className="mr-2 text-blue-600" size={24} />
            Market Intelligence
          </h3>
          <div className="space-y-4">
            {[
              { gradient: 'from-blue-50 to-purple-50', border: 'blue', title: 'Cloud Infrastructure Market', desc: 'Growing at 15.2% CAGR - emphasize scalability in proposals' },
              { gradient: 'from-green-50 to-blue-50', border: 'green', title: 'AI/ML Adoption', desc: '78% of enterprises planning AI projects - Watson positioning opportunity' },
              { gradient: 'from-yellow-50 to-orange-50', border: 'yellow', title: 'Security Concerns', desc: 'Data breaches up 32% - IBM Security solutions highly relevant' }
            ].map((item, i) => (
              <div key={i} className={`p-4 bg-gradient-to-r ${item.gradient} rounded-lg border border-${item.border}-200`}>
                <h4 className={`font-medium text-${item.border}-800`}>{item.title}</h4>
                <p className={`text-sm text-${item.border}-600 mt-1`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Time Savings</h3>
          <div className="space-y-4">
            {[
              { task: 'Prospect Research', saved: '2.1 hrs/week', automation: 85 },
              { task: 'Proposal Writing', saved: '3.4 hrs/week', automation: 78 },
              { task: 'Pricing Quotes', saved: '1.5 hrs/week', automation: 92 },
              { task: 'CRM Updates', saved: '1.2 hrs/week', automation: 88 }
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ), []);

  // Tab content renderer
  const tabContent = useMemo(() => ({
    overview: renderOverview,
    pipeline: renderPipeline,
    intelligence: renderClientIntelligence,
    insights: renderInsights
  }), [renderOverview, renderPipeline, renderClientIntelligence, renderInsights]);

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
                  <h1 className="text-2xl font-bold text-gray-800">Sales AI Platform</h1>
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
            id="insights" 
            label="AI Insights" 
            isActive={selectedTab === 'insights'} 
            onClick={setSelectedTab}
          />
        </nav>

        {/* Content */}
        {tabContent[selectedTab]()}
      </main>
    </div>
  );
};

export default SalesProductivityDashboard;