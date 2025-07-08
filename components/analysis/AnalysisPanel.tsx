import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // 使用 Next.js 的 useRouter
import { Brain, TrendingUp, Shield, Target, BarChart3, Activity, Clock, Search, Plus, Cpu, Zap, Crown, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { runStockAnalysis, AnalysisRequest, ProgressResponse } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// 品牌图标组件 - 使用真实的品牌LOGO图片
const BrandLogo = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <img src={src} alt={alt} className={`${className} object-contain`} />
);

interface AnalysisPanelProps {
  watchList: string[];
  setWatchList: (stocks: string[]) => void;
}

export const AnalysisPanel = ({ watchList, setWatchList }: AnalysisPanelProps) => {
  const router = useRouter(); // 将 useNavigate 替换为 useRouter
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const [selectedLanguageModel, setSelectedLanguageModel] = useState<string>("");
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [progressSteps, setProgressSteps] = useState<ProgressResponse[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const progressListRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 股票历史记录（模拟数据）
  const stockHistory = [
    { code: "600519", name: "贵州茅台", lastAnalyzed: "2024-06-23" },
    { code: "000001", name: "平安银行", lastAnalyzed: "2024-06-22" },
    { code: "600036", name: "招商银行", lastAnalyzed: "2024-06-21" },
  ];

  // 股票搜索结果数据
  const [searchResults] = useState([
    { code: "000001", name: "平安银行", price: "12.85", change: "+0.12" },
    { code: "000002", name: "万科A", price: "18.45", change: "-0.23" },
    { code: "600036", name: "招商银行", price: "42.30", change: "+0.85" },
    { code: "600519", name: "贵州茅台", price: "1680.00", change: "+15.20" },
  ]);

  const legendaryAgents = [
    {
      key: "aswath_damodaran",
      display_name: "Aswath Damodaran",
      description: "The Dean of Valuation",
      investing_style: "quantitative_analytical",
      order: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "ben_graham",
      display_name: "Ben Graham",
      description: "The Father of Value Investing",
      investing_style: "value_investing",
      order: 1,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "bill_ackman",
      display_name: "Bill Ackman",
      description: "The Activist Investor",
      investing_style: "contrarian_activist",
      order: 2,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "cathie_wood",
      display_name: "Cathie Wood",
      description: "The Queen of Growth Investing",
      investing_style: "growth_investing",
      order: 3,
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "charlie_munger",
      display_name: "Charlie Munger",
      description: "The Rational Thinker",
      investing_style: "value_investing",
      order: 4,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "michael_burry",
      display_name: "Michael Burry",
      description: "The Big Short Contrarian",
      investing_style: "contrarian_activist",
      order: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "peter_lynch",
      display_name: "Peter Lynch",
      description: "The 10-Bagger Investor",
      investing_style: "growth_investing",
      order: 6,
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "phil_fisher",
      display_name: "Phil Fisher",
      description: "The Scuttlebutt Investor",
      investing_style: "growth_investing",
      order: 7,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "rakesh_jhunjhunwala",
      display_name: "Rakesh Jhunjhunwala",
      description: "The Big Bull Of India",
      investing_style: "macro_global",
      order: 8,
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "stanley_druckenmiller",
      display_name: "Stanley Druckenmiller",
      description: "The Macro Investor",
      investing_style: "macro_global",
      order: 9,
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face"
    },
    {
      key: "warren_buffett",
      display_name: "Warren Buffett",
      description: "The Oracle of Omaha",
      investing_style: "value_investing",
      order: 10,
      avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const professionalAnalysts = [
    {
      key: "technical_analyst",
      display_name: "Technical Analyst",
      description: "Chart Pattern Specialist",
      investing_style: "technical_analysis",
      order: 11,
      icon: Activity
    },
    {
      key: "fundamentals_analyst",
      display_name: "Fundamentals Analyst",
      description: "Financial Statement Specialist",
      investing_style: "quantitative_analytical",
      order: 12,
      icon: BarChart3
    },
    {
      key: "sentiment_analyst",
      display_name: "Sentiment Analyst",
      description: "Market Sentiment Specialist",
      investing_style: "technical_analysis",
      order: 13,
      icon: Brain
    },
    {
      key: "valuation_analyst",
      display_name: "Valuation Analyst",
      description: "Company Valuation Specialist",
      investing_style: "quantitative_analytical",
      order: 14,
      icon: TrendingUp
    }
  ];

  // 合并所有分析师用于查找
  const allAgents = [...legendaryAgents, ...professionalAnalysts];

  // 辅助函数：格式化推理文本，处理可能为对象的情况
  const formatReasoning = (reasoning: any): string => {
    if (typeof reasoning === 'object' && reasoning !== null) {
      // 如果是对象，将其键值对转换为可读的字符串
      return Object.entries(reasoning)
        .map(([key, value]) => {
          // 格式化键名（例如：trend_following -> Trend Following）
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
          // 确保值也是字符串，避免再次出现对象作为React子元素的问题
          return `${formattedKey}: ${String(value)}`;
        })
        .join('; '); // 使用分号和空格分隔各个推理条目
    }
    // 如果已经是字符串或者其他基本类型，直接转换为字符串
    return String(reasoning || "暂无分析原因"); 
  };

  const languageModels = [
    {
      display_name: "Claude Haiku 3.5",
      model_name: "claude-3-5-haiku-latest",
      provider: "Anthropic",
      logo: "https://pbs.twimg.com/profile_images/1798110641414443008/XP8gyBaY_400x400.jpg"
    },
    {
      display_name: "Claude Sonnet 4",
      model_name: "claude-sonnet-4-20250514",
      provider: "Anthropic",
      logo: "https://pbs.twimg.com/profile_images/1798110641414443008/XP8gyBaY_400x400.jpg"
    },
    {
      display_name: "Claude Opus 4",
      model_name: "claude-opus-4-20250514",
      provider: "Anthropic",
      logo: "https://pbs.twimg.com/profile_images/1798110641414443008/XP8gyBaY_400x400.jpg"
    },
    {
      display_name: "DeepSeek R1",
      model_name: "deepseek-reasoner",
      provider: "DeepSeek",
      logo: "https://pbs.twimg.com/profile_images/1717417613775757312/Uk1zNOj4_400x400.jpg"
    },
    {
      display_name: "DeepSeek V3",
      model_name: "deepseek-chat",
      provider: "DeepSeek",
      logo: "https://pbs.twimg.com/profile_images/1717417613775757312/Uk1zNOj4_400x400.jpg"
    },
    {
      display_name: "Gemini 2.5 Flash",
      model_name: "gemini-2.5-flash-preview-05-20",
      provider: "Gemini",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
    },
    {
      display_name: "Gemini 2.5 Pro",
      model_name: "gemini-2.5-pro-preview-06-05",
      provider: "Gemini",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
    },
    {
      display_name: "Llama 4 Scout (17b)",
      model_name: "meta-llama/llama-4-scout-17b-16e-instruct",
      provider: "Groq",
      logo: "https://pbs.twimg.com/profile_images/1346576832800452614/IKTBFFTJ_400x400.png"
    },
    {
      display_name: "Llama 4 Maverick (17b)",
      model_name: "meta-llama/llama-4-maverick-17b-128e-instruct",
      provider: "Groq",
      logo: "https://pbs.twimg.com/profile_images/1346576832800452614/IKTBFFTJ_400x400.png"
    },
    {
      display_name: "GPT 4o",
      model_name: "gpt-4o",
      provider: "OpenAI",
      logo: "https://pbs.twimg.com/profile_images/1885410181409820672/ztsaR0JW_400x400.jpg"
    },
    {
      display_name: "GPT 4.1",
      model_name: "gpt-4.1-2025-04-14",
      provider: "OpenAI",
      logo: "https://pbs.twimg.com/profile_images/1885410181409820672/ztsaR0JW_400x400.jpg"
    },
    {
      display_name: "GPT 4.5",
      model_name: "gpt-4.5-preview",
      provider: "OpenAI",
      logo: "https://pbs.twimg.com/profile_images/1885410181409820672/ztsaR0JW_400x400.jpg"
    },
    {
      display_name: "o3",
      model_name: "o3",
      provider: "OpenAI",
      logo: "https://pbs.twimg.com/profile_images/1885410181409820672/ztsaR0JW_400x400.jpg"
    },
    {
      display_name: "o4 Mini",
      model_name: "o4-mini",
      provider: "OpenAI",
      logo: "https://pbs.twimg.com/profile_images/1885410181409820672/ztsaR0JW_400x400.jpg"
    }
  ];

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleLanguageModelSelect = (modelId: string) => {
    setSelectedLanguageModel(modelId);
  };

  const handleStockSelect = (stockCode: string, stockName?: string) => {
    if (stockName) {
      setSelectedStock(`${stockCode} - ${stockName}`);
      setSearchQuery(`${stockCode} - ${stockName}`);
    } else {
      setSelectedStock(stockCode);
      setSearchQuery(stockCode);
    }
    setShowDropdown(false);
  };

  // 处理用户直接输入
  const handleDirectInput = () => {
    if (searchQuery.trim() && !selectedStock) {
      setSelectedStock(searchQuery.trim());
    }
  };

  const addToWatchList = (stockCode: string) => {
    if (!watchList.includes(stockCode)) {
      setWatchList([...watchList, stockCode]);
    }
  };

  const filteredResults = searchResults.filter(
    stock =>
      stock.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 控制下拉框显示
  useEffect(() => {
    setShowDropdown(searchQuery.length > 0 && selectedStock !== searchQuery);
  }, [searchQuery, selectedStock]);

  const runAnalysis = async () => {
    if (!selectedStock || selectedAgents.length === 0 || !selectedLanguageModel) {
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysisDialog(true);
    setProgressSteps([]);
    setAnalysisProgress("正在准备分析...");
    
    // 创建一个新的 AbortController 实例
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      // 解析股票代码 - 支持直接输入或选择格式
      let stockCode = selectedStock.trim();
      
      // 如果是 "代码 - 名称" 格式，提取代码部分
      if (stockCode.includes(' - ')) {
        stockCode = stockCode.split(' - ')[0].trim();
      }
      
      // 验证股票代码不为空
      if (!stockCode) {
        throw new Error('请输入有效的股票代码');
      }
      
      console.log('股票代码解析:', {
        原始输入: selectedStock,
        解析后代码: stockCode,
        将发送的tickers: [stockCode]
      });
      
      // 获取选中模型的信息
      const selectedModel = languageModels.find(m => m.model_name === selectedLanguageModel);
      if (!selectedModel) {
        throw new Error('未找到选中的语言模型');
      }

      // 构建agent_models - 根据选中的分析师生成
      const agentModels = selectedAgents.map((agentId) => {
        // 查找选中的分析师信息
        const agent = allAgents.find(a => a.key === agentId);
        
        return {
          agent_id: agentId, // 使用实际的agent key作为ID
          model_name: selectedModel.model_name,
          model_provider: selectedModel.provider
        };
      });

      // 构建请求数据
      const request: AnalysisRequest = {
        tickers: [stockCode], // 获取用户输入的股票代码
        selected_agents: selectedAgents,
        agent_models: agentModels,
        start_date: "2025-06-01", // 固定开始日期
        end_date: "2025-06-05",   // 固定结束日期
        model_name: selectedModel.model_name,
        model_provider: selectedModel.provider,
        initial_cash: 100000,
        margin_requirement: 0
      };

      // 调试输出
      console.log('发送分析请求:', {
        用户输入: selectedStock,
        解析股票代码: stockCode,
        tickers参数: [stockCode],
        选中分析师: selectedAgents,
        选中模型: selectedModel.display_name,
        agent_models: agentModels,
        完整请求: request
      });

      // 调用API，并传入 signal
      const result = await runStockAnalysis(request, (progress: ProgressResponse) => {
        // 处理进度更新
        console.log('分析进度:', progress);
        const progressText = `${progress.agent} - ${progress.status}`;
        setAnalysisProgress(progressText);
        
        // 添加到进度步骤列表
        setProgressSteps(prev => {
          const newSteps = [...prev, progress];
          // 自动滚动到最新内容
          setTimeout(() => {
            if (progressListRef.current) {
              progressListRef.current.scrollTop = progressListRef.current.scrollHeight;
            }
          }, 100);
          return newSteps;
        });
      }, signal);

      // 调试API响应数据
      console.log('API完整响应:', result);
      console.log('API返回的原始analyst_signals:', result.data.analyst_signals);
      
      // 添加空值检查防止 "Cannot read properties of null" 错误
      if (!result.data.analyst_signals) {
        throw new Error('API响应中缺少analyst_signals数据');
      }
      
      console.log('API返回的analyst_signals键列表:', Object.keys(result.data.analyst_signals));
      console.log('将用于查找信号的股票代码 (stockCode):', stockCode);
      console.log('选中的分析师:', selectedAgents);

      // 转换API响应为组件需要的格式
      const analysisResults = selectedAgents.map(agentId => {
        const selectedAgent = allAgents.find(a => a.key === agentId);
        
        // 尝试多种可能的键格式来查找信号数据
        const possibleKeys = [
          agentId,                    // 直接使用 agentId (如: sentiment_agent)
          `${agentId}_agent`,         // agentId + "_agent" (如: sentiment_agent_agent)
          `${agentId}Agent`,          // 驼峰格式 (如: sentimentAgent)
          agentId.replace(/_/g, ''),  // 去掉下划线 (如: sentimentagent)
        ];
        
        let agentSignal = null;
        let usedKey = '';
        
        // 尝试每种可能的键格式
        for (const key of possibleKeys) {
          // 添加更安全的检查，确保key存在且有数据
          if (result.data.analyst_signals[key] && 
              typeof result.data.analyst_signals[key] === 'object' && 
              result.data.analyst_signals[key][stockCode]) {
            agentSignal = result.data.analyst_signals[key][stockCode];
            usedKey = key;
            break;
          }
        }
        
        console.log(`处理分析师 ${agentId}:`, {
          display_name: selectedAgent?.display_name,
          possibleKeys: possibleKeys,
          usedKey: usedKey,
          foundSignal: !!agentSignal, // 是否找到了信号
          retrievedSignal: agentSignal, // 找到的信号数据
          allAvailableKeys: Object.keys(result.data.analyst_signals), // 显示所有可用的键
          rawAgentData: selectedAgent // 原始分析师数据
        });
        
        if (!agentSignal) {
          // 如果没有找到特定代理的信号，使用默认值
          console.warn(`未找到分析师 ${agentId} 的信号数据，使用默认值。`);
          console.warn(`尝试过的键格式: ${possibleKeys.join(', ')}`);
          console.warn(`API实际返回的键: ${Object.keys(result.data.analyst_signals).join(', ')}`);
          // 调整 avatar 逻辑，确保专业分析师有正确的头像（即使是key的fallback）
          const agentAvatar = selectedAgent && 'avatar' in selectedAgent ? selectedAgent.avatar : (
            selectedAgent && 'icon' in selectedAgent ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>${selectedAgent.display_name}</title><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` : undefined // 简易SVG图标作为fallback
          );

          return {
            agent: selectedAgent?.display_name || agentId,
            agentAvatar: agentAvatar || undefined, // 确保此处为 undefined 或有效图片路径
            analysisType: "综合分析",
            signal: "持有",
            confidence: 50,
            reasoning: formatReasoning("暂无可用的分析数据"),
          };
        }

        // 将API的signal转换为中文
        const signalMap: Record<string, string> = {
          'buy': '买入',
          'sell': '卖出',
          'hold': '持有',
          'neutral': '持有',
          'bullish': '买入',
          'bearish': '卖出'
        };

        return {
          agent: selectedAgent?.display_name || agentId,
          agentAvatar: 'avatar' in selectedAgent ? selectedAgent.avatar : selectedAgent?.key,
          analysisType: "综合分析",
          signal: signalMap[agentSignal.signal] || '持有',
          confidence: Math.round(agentSignal.confidence),
          reasoning: formatReasoning(agentSignal.reasoning),
        };
      });

      console.log('转换后的分析结果:', analysisResults);

      // 构建投资组合策略
      // 添加空值检查防止 "Cannot read properties of null" 错误
      console.log('API返回的decisions数据:', result.data.decisions);
      console.log('API响应的完整data结构:', Object.keys(result.data || {}));
      
      let portfolioStrategy;
      
      if (!result.data.decisions || Object.keys(result.data.decisions).length === 0) {
        console.warn('API响应中缺少decisions数据，使用默认投资策略');
        // 如果没有decisions数据，创建一个默认的投资策略
        portfolioStrategy = {
          action: 'HOLD',
          actionColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black',
          quantity: 0,
          confidence: 50,
          reasoning: formatReasoning('暂无投资决策数据，建议持有观望')
        };
      } else {
        const decision = result.data.decisions[stockCode];
        
        if (!decision) {
          console.warn(`未获取到股票 ${stockCode} 的投资决策数据，使用默认策略`);
          portfolioStrategy = {
            action: 'HOLD',
            actionColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black',
            quantity: 0,
            confidence: 50,
            reasoning: formatReasoning('暂无该股票的投资决策数据，建议持有观望')
          };
        } else {
          // 将API的action转换为中文和颜色
          const actionMap: Record<string, { text: string; color: string }> = {
            'long': { text: 'LONG', color: 'bg-gradient-to-r from-green-500 to-green-600 text-white' },
            'short': { text: 'SHORT', color: 'bg-gradient-to-r from-red-500 to-red-600 text-white' },
            'hold': { text: 'HOLD', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' }
          };

          const actionInfo = actionMap[decision.action] || actionMap['hold'];

          portfolioStrategy = {
            action: actionInfo.text,
            actionColor: actionInfo.color,
            quantity: decision.quantity,
            confidence: Math.round(decision.confidence),
            reasoning: formatReasoning(decision.reasoning)
          };
        }
      }
      
      // 显示完成状态
      setAnalysisProgress("分析完成，正在跳转...");
      
      // 调试输出
      console.log('准备跳转到详情页面:', {
        analysisResults, // 确认分析结果是否完整
        portfolioStrategy, // 确认投资策略是否完整
        selectedStock,
        analysisResultsLength: analysisResults?.length, // 确认数组长度
        portfolioStrategyKeys: Object.keys(portfolioStrategy || {}), // 确认对象是否有键
        isAnalysisResultsArray: Array.isArray(analysisResults), // 确认是否是数组
        isPortfolioStrategyObject: typeof portfolioStrategy === 'object' && portfolioStrategy !== null // 确认是否是对象
      });
      
      // 延迟一下让用户看到完成状态，然后关闭弹窗并跳转
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowAnalysisDialog(false);
        setAnalysisProgress("");
        setProgressSteps([]);
        
        // 导航到分析详情页面
        router.push("/analysis-details"); // 替换 navigate，并移除 state 参数，Next.js 不直接支持
      }, 1000);
      
    } catch (error) {
      console.error('分析失败:', error);
      setIsAnalyzing(false);
      setShowAnalysisDialog(false);
      setAnalysisProgress("");
      setProgressSteps([]);
      
      // 如果是用户主动中断，不显示错误提示
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('分析被用户中断。');
        return; // 不显示toast
      }
      
      // 使用toast显示错误信息
      toast({
        title: "分析失败",
        description: error instanceof Error ? error.message : '未知错误，请稍后重试',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* 分析进度弹窗 */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-analysis-card via-analysis-card to-analysis-card-secondary border-analysis-border backdrop-blur-md shadow-2xl rounded-xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              正在分析 {selectedStock}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* 加载动画 */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-analysis-border rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-amber-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-amber-400" />
                </div>
              </div>
            </div>
            
            {/* 当前进度 */}
            <div className="text-center space-y-3">
              <div className="bg-analysis-card-secondary rounded-xl p-4 border border-analysis-border shadow-sm">
                <p className="text-analysis-text font-semibold text-lg">{analysisProgress}</p>
                <p className="text-analysis-text-muted text-sm mt-1">这可能需要几分钟时间，请耐心等待...</p>
              </div>
            </div>
            
            {/* 进度列表 */}
            {progressSteps.length > 0 && (
              <div className="space-y-3">
                <div className="text-analysis-text-secondary text-sm font-medium text-center">分析步骤</div>
                <div 
                  ref={progressListRef}
                  className="h-52 overflow-y-auto scrollbar-hide space-y-3 px-1"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {progressSteps.map((step, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 text-sm p-3 bg-analysis-card-secondary rounded-xl border border-analysis-border hover:bg-analysis-card-hover transition-all duration-200 min-h-[3.5rem] shadow-sm"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 animate-pulse"></div>
                      <div className="flex-1 min-w-0">
                        <span className="text-analysis-text font-medium block truncate text-xs">
                          {step.agent}
                        </span>
                        <span className="text-analysis-text-muted text-xs block truncate">
                          {step.status}
                        </span>
                      </div>
                      <span className="text-analysis-text-muted text-xs flex-shrink-0">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
                {progressSteps.length > 3 && (
                  <div className="text-center text-analysis-text-muted text-xs">
                    向上滑动查看更多步骤
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 主要分析卡片 */}
      <Card className="bg-analysis-card border border-analysis-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative">
        <div className="relative z-10">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-bold text-analysis-text">
              AI股票分析
            </CardTitle>
            <p className="text-analysis-text-muted mt-2">选择股票和AI分析师，获取专业的投资建议</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 股票选择 */}
            <div className="space-y-3">
              <label className="text-analysis-text font-semibold text-lg">1. 选择股票</label>
              <div className="relative" ref={dropdownRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-analysis-text-muted z-10" />
                <Input
                  placeholder="输入股票代码或名称（如：NVDA、贵州茅台）..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleDirectInput();
                    }
                  }}
                  onBlur={handleDirectInput}
                  className="pl-10 bg-analysis-card-secondary border-analysis-border text-analysis-text placeholder-analysis-text-muted h-12 text-lg backdrop-blur-sm rounded-xl hover:bg-analysis-card-hover focus:bg-analysis-card-hover transition-all duration-200"
                />
                
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-analysis-card border border-analysis-border rounded-xl shadow-lg max-h-64 overflow-y-auto backdrop-blur-md">
                    {filteredResults.map((stock) => (
                      <div
                        key={stock.code}
                        className="flex items-center justify-between p-3 hover:bg-analysis-card-hover transition-all duration-200 border-b border-analysis-border last:border-b-0"
                      >
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleStockSelect(stock.code, stock.name)}
                        >
                          <div className="text-analysis-text font-medium">{stock.code}</div>
                          <div className="text-analysis-text-muted text-sm">{stock.name}</div>
                        </div>
                        <div className="text-right mr-2">
                          <div className="text-analysis-text">¥{stock.price}</div>
                          <div className={`text-sm ${
                            stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stock.change}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToWatchList(stock.code);
                          }}
                          className="bg-amber-500 hover:bg-analysis-button-hover text-black ml-2 h-8 w-8 p-0 rounded-lg transition-all duration-200"
                          disabled={watchList.includes(stock.code)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedStock && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStock("");
                      setSearchQuery("");
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-analysis-text-muted hover:text-analysis-text h-8 w-8 p-0 rounded-lg transition-all duration-200"
                  >
                    ✕
                  </Button>
                )}
              </div>

              {/* 当前选中的股票显示 */}
              {selectedStock && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-amber-500 text-black font-semibold rounded-lg">
                      已选择
                    </Badge>
                    <span className="text-amber-300 font-medium">{selectedStock}</span>
                  </div>
                </div>
              )}

              {/* 股票历史 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-analysis-text-muted" />
                  <span className="text-analysis-text-muted text-sm">股票历史</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stockHistory.map((stock) => (
                    <Button
                      key={stock.code}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStockSelect(stock.code, stock.name)}
                      className={`bg-analysis-card-secondary border-analysis-border text-analysis-text-secondary hover:bg-analysis-card-hover hover:text-analysis-text transition-all duration-200 rounded-xl ${
                        selectedStock === `${stock.code} - ${stock.name}` ? 'border-amber-400/50 bg-amber-500/20 text-amber-300' : ''
                      }`}
                    >
                      <span className="text-xs">{stock.code}</span>
                      <span className="ml-1 text-xs opacity-80">{stock.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI分析师选择 */}
            <div className="space-y-6">
              <label className="text-analysis-text font-semibold text-lg">2. 选择AI分析师</label>
              
              {/* 传奇投资大师 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-amber-400" />
                  <h3 className="text-amber-300 font-semibold">传奇投资大师</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {legendaryAgents.map((agent) => (
                    <div
                      key={agent.key}
                      className={`group p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        selectedAgents.includes(agent.key)
                          ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-400/50 shadow-amber-500/20"
                          : "bg-analysis-card-secondary border-analysis-border hover:border-amber-400/30 hover:bg-analysis-card-hover shadow-sm"
                      }`}
                      onClick={() => handleAgentToggle(agent.key)}
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={selectedAgents.includes(agent.key)}
                          onChange={() => handleAgentToggle(agent.key)}
                          className=""
                        />
                        <div className="relative">
                          <Avatar className={`h-12 w-12 ring-4 transition-all ${
                            selectedAgents.includes(agent.key)
                              ? "ring-amber-400/70 shadow-lg shadow-amber-400/20"
                              : "ring-amber-400/30 group-hover:ring-amber-400/50"
                          }`}>
                            <AvatarImage src={agent.avatar} alt={agent.display_name} />
                            <AvatarFallback className="bg-analysis-card text-analysis-text font-semibold">
                              {agent.display_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {/* AI标识徽章 */}
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-analysis-card flex items-center justify-center transition-all ${
                            selectedAgents.includes(agent.key)
                              ? "bg-amber-500 text-black"
                              : "bg-gradient-to-br from-purple-500 to-blue-600 text-white"
                          }`}>
                            <Brain className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-analysis-text font-semibold text-lg">{agent.display_name}</div>
                          <div className="text-analysis-text-secondary text-sm mt-2 leading-relaxed">{agent.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 专业分析师 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-purple-400" />
                  <h3 className="text-purple-300 font-semibold">专业分析师</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {professionalAnalysts.map((analyst) => {
                    const Icon = analyst.icon;
                    return (
                      <div
                        key={analyst.key}
                        className={`group p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                          selectedAgents.includes(analyst.key)
                            ? "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-400/50 shadow-purple-500/20"
                            : "bg-analysis-card-secondary border-analysis-border hover:border-purple-400/30 hover:bg-analysis-card-hover shadow-sm"
                        }`}
                        onClick={() => handleAgentToggle(analyst.key)}
                      >
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedAgents.includes(analyst.key)}
                            onChange={() => handleAgentToggle(analyst.key)}
                            className=""
                          />
                          <Icon className="h-8 w-8 text-amber-400 mt-1 group-hover:text-amber-300 transition-colors" />
                          <div className="flex-1">
                            <div className="text-analysis-text font-semibold text-lg">{analyst.display_name}</div>
                            <div className="text-analysis-text-secondary text-sm mt-2 leading-relaxed">{analyst.description}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 语言模型选择 */}
            <div className="space-y-4">
              <label className="text-analysis-text font-semibold text-lg">3. 选择语言模型</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {languageModels.map((model) => {
                  return (
                    <div
                      key={model.model_name}
                      className={`group p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        selectedLanguageModel === model.model_name
                          ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-400/50 shadow-blue-500/20"
                          : "bg-analysis-card-secondary border-analysis-border hover:border-blue-400/30 hover:bg-analysis-card-hover shadow-sm"
                      }`}
                      onClick={() => handleLanguageModelSelect(model.model_name)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-all ${
                          selectedLanguageModel === model.model_name 
                            ? "bg-blue-500/20" 
                            : "bg-analysis-card hover:bg-analysis-card-hover"
                        }`}>
                          <BrandLogo 
                            src={model.logo} 
                            alt={`${model.provider} logo`}
                            className="h-5 w-5"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm transition-colors ${
                            selectedLanguageModel === model.model_name 
                              ? "text-blue-300" 
                              : "text-analysis-text"
                          }`}>
                            {model.display_name}
                          </div>
                          <div className="text-analysis-text-muted text-xs mt-1 truncate">
                            {model.provider}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={runAnalysis}
              disabled={!selectedStock || selectedAgents.length === 0 || !selectedLanguageModel || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-analysis-button-hover text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-blue-600"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>分析中...</span>
                </div>
              ) : (
                "开始分析"
              )}
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
