
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { ArrowLeft, Target, Brain, AlertTriangle, ChevronUp, Shield, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AnalysisDetails = () => {
  const router = useRouter();
  const pageTopRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // 状态管理
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [portfolioStrategy, setPortfolioStrategy] = useState<any>(null);
  const [riskManagement, setRiskManagement] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState<string>("NVDA");
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const [selectedModels, setSelectedModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载分析数据
  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        setLoading(true);
        
        // 读取 data001.json 数据
        const response = await fetch('/data001.json');
        const mockApiResponse = await response.json();
        
        // 处理分析结果数据 - 支持多个分析师
        const agents = [
          {
            id: 'aswath_damodaran',
            name: 'Aswath Damodaran',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            title: '估值专家'
          },
          {
            id: 'warren_buffett',
            name: 'Warren Buffett',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
            title: '价值投资大师'
          },
          {
            id: 'peter_lynch',
            name: 'Peter Lynch',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            title: '成长投资专家'
          }
        ];

        const mockAnalysisResults = [];
        
        // 添加 Aswath Damodaran 分析 - 使用当前选中的股票
        const aswathData = mockApiResponse.data.analyst_signals?.aswath_damodaran_agent?.[selectedStock];
        if (aswathData) {
          mockAnalysisResults.push({
            id: 'aswath_damodaran',
            agent: 'Aswath Damodaran',
            agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            analysisType: '综合分析',
            signal: aswathData.signal === 'neutral' ? '持有' : aswathData.signal === 'bullish' ? '买入' : '卖出',
            confidence: Math.round(aswathData.confidence || 75),
            reasoning: aswathData.reasoning || '暂无分析数据',
            signalStyle: aswathData.signal === 'bullish'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30'
              : aswathData.signal === 'bearish'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/30'
          });
        }
        
        // 设置语言模型信息
        const models = [
          {
            id: 'claude_sonnet_4',
            name: 'Claude Sonnet 4',
            provider: 'Anthropic',
            avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center',
            color: 'from-purple-500 to-indigo-600'
          },
          {
            id: 'gpt_4',
            name: 'GPT-4',
            provider: 'OpenAI',
            avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop&crop=center',
            color: 'from-green-500 to-emerald-600'
          }
        ];

        // 从API响应中获取可用的股票列表
        const availableStocks = Object.keys(mockApiResponse.data.decisions || {});
        
        // 设置选中的分析师、股票和模型信息
        setSelectedAgents(agents);
        setSelectedStocks(availableStocks.length > 0 ? availableStocks : ['NVDA']);
        setSelectedModels([models[0]]);
        
        // 处理投资策略数据 - 使用当前选中的股票
        const decision = mockApiResponse.data.decisions?.[selectedStock];
        const mockPortfolioStrategy = {
          action: decision ? (decision.action === 'hold' ? 'HOLD' : decision.action.toUpperCase()) : 'HOLD',
          actionColor: decision?.action === 'hold' 
            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
            : decision?.action === 'buy'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              : decision?.action === 'short'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          quantity: decision?.quantity || 0,
          confidence: Math.round(decision?.confidence || 75),
          reasoning: decision?.reasoning || `基于AI分析结果的${selectedStock}投资建议`
        };
        
        // 处理风险管理数据 - 使用当前选中的股票
        const riskData = mockApiResponse.data.analyst_signals?.risk_management_agent?.[selectedStock];
        const sentimentData = mockApiResponse.data.analyst_signals?.sentiment_agent?.[selectedStock];
        
        if (riskData) {
          const reasoningData = riskData.reasoning;
          
          const mockRiskManagement = {
            remaining_position_limit: riskData.remaining_position_limit || 50000,
            current_price: riskData.current_price || 432.50,
            reasoning: `基于当前风险评估和投资组合状况，建议严格控制${selectedStock}仓位风险，确保资金安全。当前投资组合无${selectedStock}持仓，剩余仓位限制充足，可根据市场情况适时建仓。`,
            portfolio_value: reasoningData?.portfolio_value || 100000,
            current_position_value: reasoningData?.current_position_value || 0,
            position_limit: reasoningData?.position_limit || 20000,
            remaining_limit: reasoningData?.remaining_limit || 20000,
            available_cash: reasoningData?.available_cash || 100000
          };
          setRiskManagement(mockRiskManagement);
        }

        // 添加情感分析到分析结果 - 使用当前选中的股票
        if (sentimentData) {
          mockAnalysisResults.push({
            id: 'sentiment_agent',
            agent: '情感分析师',
            agentAvatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
            analysisType: '情感分析',
            signal: sentimentData.signal === 'bullish' ? '看涨' : sentimentData.signal === 'bearish' ? '看跌' : '中性',
            confidence: Math.round(sentimentData.confidence || 50),
            reasoning: sentimentData.reasoning || '暂无情感分析数据',
            signalStyle: sentimentData.signal === 'bullish'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30'
              : sentimentData.signal === 'bearish'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/30'
          });
        }

        setAnalysisResults(mockAnalysisResults);
        setPortfolioStrategy(mockPortfolioStrategy);
        
      } catch (error) {
        console.error('加载分析数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, [selectedStock]); // 添加selectedStock作为依赖

  // 页面加载时自动滚动到顶部
  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // 确保页面滚动到最顶部
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // 监听滚动事件，显示/隐藏回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // 使用 useMemo 优化分析结果渲染，避免不必要的重渲染
  const optimizedAnalysisResults = useMemo(() => {
    if (!analysisResults) return [];
    
    return analysisResults.map((result, index) => ({
      ...result,
      id: `analysis-${index}`,
      // 预处理头像初始字母避免重复计算
      avatarInitials: result.agent?.split(' ').map((n: string) => n[0]).join('') || '',
      // 预处理信号样式
      signalStyle: result.signal === "买入"
        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30"
        : result.signal === "卖出"
          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30"
          : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/30"
    }));
  }, [analysisResults]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">正在加载分析结果...</h2>
        </div>
      </div>
    );
  }

  if (!portfolioStrategy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">分析结果未找到</h2>
          <Button onClick={() => router.push("/")} className="bg-amber-500 hover:bg-amber-600 text-black">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageTopRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          {/* 返回按钮和标题 */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-white hover:text-amber-400 hover:bg-slate-800/50"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {selectedStock} - 分析详情
            </h1>
          </div>

          <div className="space-y-8">

            {/* 免责声明提示 */}
            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-100 text-sm leading-relaxed">
                    <span className="font-semibold text-amber-300">温馨提示：</span>
                    本分析结果由AI模型基于历史数据与公开信息生成，仅供投资参考，不构成任何投资建议。市场有风险，投资需谨慎。
                  </p>
                </div>
              </div>
            </div>



            {/* 分析配置信息 */}
            <Card className="bg-gradient-to-br from-slate-800/80 via-zinc-900/60 to-slate-900/90 border-zinc-700/60 backdrop-blur-sm shadow-2xl ring-1 ring-amber-500/10">
                <CardContent className="pt-6">
                  {/* Main flex container for left and right sections */}
                  <div className="flex gap-8">
                    {/* Left Section: Stock Selection */}
                    <div className="w-80 flex-shrink-0">
                      <div className="text-slate-400 text-sm font-medium mb-4">选择股票进行分析</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedStocks.length > 1 ? selectedStocks.map((stock) => (
                          <button
                            key={stock}
                            onClick={() => setSelectedStock(stock)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedStock === stock
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30 transform scale-105'
                                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white border border-slate-600/30'
                            }`}
                          >
                            {stock}
                          </button>
                        )) : (
                          <Badge variant="outline" className="text-amber-400 border-amber-400/50 bg-amber-400/10 font-semibold px-3 py-1">
                            {selectedStock}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3 text-xs text-slate-400">
                        当前分析: <span className="text-amber-400 font-medium">{selectedStock}</span>
                        <span className="ml-4">共 {selectedStocks.length} 只股票可供分析</span>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="flex-shrink-0 px-4">
                      <div className="w-px bg-gradient-to-b from-transparent via-slate-600/40 to-transparent h-32"></div>
                    </div>
                    
                    {/* Right Section: Analysis Configuration (Language Model, Date, Analysts) */}
                    <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Inner grid for Language Model, Date, Analysts */}
                        {/* Left Sub-Column: Language Model & Date */}
                        <div className="flex flex-col justify-center h-32 space-y-4">
                          {/* Language Model */}
                          <div>
                            {selectedModels.length > 0 ? selectedModels.map((model, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={model.avatar} alt={model.name} />
                                  <AvatarFallback className={`bg-gradient-to-r ${model.color} text-white text-xs`}>
                                    {model.name.split(' ').map((n: string) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-white font-medium text-sm">{model.name}</div>
                                  <div className="text-slate-400 text-xs">{model.provider}</div>
                                </div>
                              </div>
                            )) : (
                              <div className="flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                                  <span className="text-white text-xs">CS</span>
                                </div>
                                <div>
                                  <div className="text-white font-medium text-sm">Claude Sonnet 4</div>
                                  <div className="text-slate-400 text-xs">Anthropic</div>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Date */}
                          <div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-white font-medium">
                                {new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </span>
                              <span className="text-slate-400">至</span>
                              <span className="text-white font-medium">
                                {new Date().toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Sub-Column: AI Analyst Team - spanning 2 columns */}
                        <div className="md:col-span-2 flex flex-col justify-center h-32"> {/* Occupy two columns */}
                          <div className="grid grid-cols-3 gap-3"> {/* For analyst avatars */}
                            {selectedAgents.length > 0 ? selectedAgents.slice(0, 3).map((agent, index) => (
                              <div key={index} className="text-center p-3 border border-slate-600/40 rounded-lg bg-slate-800/20 hover:border-amber-400/50 hover:bg-slate-700/30 transition-all duration-300">
                                <Avatar className="h-10 w-10 mx-auto mb-2 ring-2 ring-amber-400/40 hover:ring-amber-400/70 transition-all duration-300 shadow-lg border border-slate-600/30">
                                  <AvatarImage src={agent.avatar} alt={agent.name} className="object-cover" />
                                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-sm font-semibold">
                                    {agent.name.split(' ').map((n: string) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-white text-xs font-medium">{agent.name.split(' ')[0]}</div>
                              </div>
                            )) : (
                              <>
                                {/* Default analysts if none selected */}
                                <div className="text-center p-3 border border-slate-600/40 rounded-lg bg-slate-800/20 hover:border-amber-400/50 hover:bg-slate-700/30 transition-all duration-300">
                                  <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center ring-2 ring-amber-400/40 hover:ring-amber-400/70 transition-all duration-300 shadow-lg border border-slate-600/30">
                                    <span className="text-white text-sm font-semibold">AD</span>
                                  </div>
                                  <div className="text-white text-xs font-medium">Aswath</div>
                                </div>
                                <div className="text-center p-3 border border-slate-600/40 rounded-lg bg-slate-800/20 hover:border-amber-400/50 hover:bg-slate-700/30 transition-all duration-300">
                                  <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center ring-2 ring-amber-400/40 hover:ring-amber-400/70 transition-all duration-300 shadow-lg border border-slate-600/30">
                                    <span className="text-white text-sm font-semibold">WB</span>
                                  </div>
                                  <div className="text-white text-xs font-medium">Warren</div>
                                </div>
                                <div className="text-center p-3 border border-slate-600/40 rounded-lg bg-slate-800/20 hover:border-amber-400/50 hover:bg-slate-700/30 transition-all duration-300">
                                  <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center ring-2 ring-amber-400/40 hover:ring-amber-400/70 transition-all duration-300 shadow-lg border border-slate-600/30">
                                    <span className="text-white text-sm font-semibold">PL</span>
                                  </div>
                                  <div className="text-white text-xs font-medium">Peter</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Portfolio Strategy - 显示在上方 */}
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/90 border-slate-700/50 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent flex items-center space-x-3">
                  <Target className="h-8 w-8 text-amber-400" />
                  <span>Portfolio Strategy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-8 border border-slate-600/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    <div className="text-center">
                      <div className="text-slate-400 text-sm font-medium mb-2">Action</div>
                      <Badge className={`px-6 py-3 font-bold text-lg ${portfolioStrategy.actionColor} shadow-lg`}>
                        {portfolioStrategy.action}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-sm font-medium mb-2">Quantity</div>
                      <div className="text-white font-bold text-2xl">{portfolioStrategy.quantity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-sm font-medium mb-2">Confidence</div>
                      <div className="text-amber-400 font-bold text-2xl">{portfolioStrategy.confidence}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm font-medium mb-3">Reasoning</div>
                    <div className="text-slate-200 leading-relaxed bg-slate-800/40 p-4 rounded-lg border border-slate-700/30">
                      {/* 根据数据类型显示不同的内容 */}
                      {typeof portfolioStrategy.reasoning === 'string' ? (
                        // 普通文本显示
                      <div 
                        className="break-words overflow-hidden"
                        style={{ 
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        {portfolioStrategy.reasoning}
                      </div>
                      ) : (
                        // JSON数据结构化显示（针对Portfolio Strategy可能包含的结构化数据）
                        <div className="space-y-3">
                          {portfolioStrategy.reasoning?.insider_trading && (
                            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 text-xs font-medium">内幕交易分析</span>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    portfolioStrategy.reasoning.insider_trading.signal === 'bullish' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {portfolioStrategy.reasoning.insider_trading.signal}
                                  </span>
                                  <span className="text-amber-400 text-xs">
                                    {portfolioStrategy.reasoning.insider_trading.confidence}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          {portfolioStrategy.reasoning?.news_sentiment && (
                            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 text-xs font-medium">新闻情感分析</span>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    portfolioStrategy.reasoning.news_sentiment.signal === 'bullish' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {portfolioStrategy.reasoning.news_sentiment.signal}
                                  </span>
                                  <span className="text-amber-400 text-xs">
                                    {portfolioStrategy.reasoning.news_sentiment.confidence}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 分析结果 */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center space-x-3">
                  <Brain className="h-8 w-8 text-amber-400" />
                  <span>分析结果</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {optimizedAnalysisResults.length > 0 ? (
                    optimizedAnalysisResults.map((result) => (
                    <div key={result.id} className="p-6 bg-gradient-to-r from-slate-700/40 to-slate-800/40 rounded-xl border border-slate-600/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300 will-change-transform">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10 ring-2 ring-amber-400/30">
                            <AvatarImage src={result.agentAvatar} alt={result.agent} />
                            <AvatarFallback className="bg-slate-600 text-white font-semibold text-sm">
                              {result.avatarInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-white font-bold text-lg">{result.agent}</h3>
                            <Badge variant="outline" className="text-slate-300 border-slate-500/50 mt-1">
                              {result.analysisType}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={`px-4 py-2 font-semibold text-sm ${result.signalStyle} shadow-lg`}>
                            {result.signal}
                          </Badge>
                          <div className="text-right">
                            <div className="text-amber-400 font-bold text-lg">{result.confidence}%</div>
                            <div className="text-slate-400 text-xs">置信度</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                          {/* 根据数据类型显示不同的内容 */}
                          {typeof result.reasoning === 'string' ? (
                            // 普通文本显示
                            <div 
                              className="break-words overflow-hidden"
                              style={{ 
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto'
                              }}
                            >
                              {result.reasoning}
                            </div>
                          ) : (
                            // JSON数据结构化显示
                            <div className="space-y-3">
                              {/* 内幕交易和新闻情感分析 - 水平布局 */}
                              {(result.reasoning?.insider_trading || result.reasoning?.news_sentiment) && (
                                <div className="grid grid-cols-2 gap-3">
                                  {result.reasoning?.insider_trading && (
                                    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-300 text-sm font-medium">内幕交易分析</span>
                                        <div className="flex items-center space-x-2">
                                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                                            result.reasoning.insider_trading.signal === 'bullish' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-red-500/20 text-red-400'
                                          }`}>
                                            {result.reasoning.insider_trading.signal}
                                          </span>
                                          <span className="text-amber-400 text-sm">
                                            {result.reasoning.insider_trading.confidence}%
                                          </span>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                                          <span className="text-slate-400">总交易数:</span>
                                          <span className="text-slate-200">{result.reasoning.insider_trading.metrics?.total_trades}</span>
                                        </div>
                                        <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                                          <span className="text-slate-400">看涨交易:</span>
                                          <span className="text-green-400">{result.reasoning.insider_trading.metrics?.bullish_trades}</span>
                                        </div>
                                        <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                                          <span className="text-slate-400">看跌交易:</span>
                                          <span className="text-red-400">{result.reasoning.insider_trading.metrics?.bearish_trades}</span>
                                        </div>
                                        <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                                          <span className="text-slate-400">权重:</span>
                                          <span className="text-slate-200">{result.reasoning.insider_trading.metrics?.weight}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {result.reasoning?.news_sentiment && (
                                    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-300 text-sm font-medium">新闻情感分析</span>
                                        <div className="flex items-center space-x-2">
                                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                                            result.reasoning.news_sentiment.signal === 'bullish' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-red-500/20 text-red-400'
                                          }`}>
                                            {result.reasoning.news_sentiment.signal}
                                          </span>
                                          <span className="text-amber-400 text-sm">
                                            {result.reasoning.news_sentiment.confidence}%
                                          </span>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                                          <span className="text-slate-400">总文章数:</span>
                                          <span className="text-slate-200">{result.reasoning.news_sentiment.metrics?.total_articles}</span>
                                        </div>
                                        <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                                          <span className="text-slate-400">看涨文章:</span>
                                          <span className="text-green-400">{result.reasoning.news_sentiment.metrics?.bullish_articles}</span>
                                        </div>
                                        <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                                          <span className="text-slate-400">看跌文章:</span>
                                          <span className="text-red-400">{result.reasoning.news_sentiment.metrics?.bearish_articles}</span>
                                        </div>
                                        <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                                          <span className="text-slate-400">中性文章:</span>
                                          <span className="text-slate-400">{result.reasoning.news_sentiment.metrics?.neutral_articles}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {result.reasoning?.combined_analysis && (
                                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                                  <div className="text-slate-300 text-sm font-medium mb-3">综合分析</div>
                                  
                                  {/* 加权总分 - 水平布局 */}
                                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                    <div className="bg-slate-800/30 rounded-md p-2 border border-slate-600/20 text-center">
                                      <div className="text-slate-400 text-xs mb-1">加权看涨总分</div>
                                      <div className="text-green-400 font-medium text-lg">{result.reasoning.combined_analysis?.total_weighted_bullish}</div>
                                    </div>
                                    <div className="bg-slate-800/30 rounded-md p-2 border border-slate-600/20 text-center">
                                      <div className="text-slate-400 text-xs mb-1">加权看跌总分</div>
                                      <div className="text-red-400 font-medium text-lg">{result.reasoning.combined_analysis?.total_weighted_bearish}</div>
                                    </div>
                                  </div>

                                  {/* 信号确定 - 结论部分 */}
                                  <div className="bg-slate-600/20 rounded-md px-3 py-2 border border-slate-600/30">
                                    <div className="text-slate-400 text-xs font-medium mb-1">分析结论</div>
                                    <div className="text-slate-300 text-sm leading-relaxed">{result.reasoning.combined_analysis?.signal_determination}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">暂无分析结果</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

                        {/* 风险管理模块 */}
                        {riskManagement && (
              <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/30 border-red-500/30 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-red-400" />
                    <span>风险管理</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 左侧：关键指标 */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* 当前价格 */}
                        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-slate-400 text-xs font-medium">当前价格</span>
                          </div>
                          <div className="text-white font-bold text-lg">${riskManagement.current_price}</div>
                        </div>

                        {/* 剩余仓位限制 */}
                        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <Shield className="h-4 w-4 text-amber-400" />
                            <span className="text-slate-400 text-xs font-medium">剩余仓位限制</span>
                          </div>
                          <div className="text-amber-400 font-bold text-lg">${riskManagement.remaining_position_limit.toLocaleString()}</div>
                        </div>

                        {/* 投资组合价值 */}
                        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="h-4 w-4 text-blue-400" />
                            <span className="text-slate-400 text-xs font-medium">投资组合价值</span>
                          </div>
                          <div className="text-blue-400 font-bold text-lg">${riskManagement.portfolio_value.toLocaleString()}</div>
                        </div>

                        {/* 可用现金 */}
                        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-slate-400 text-xs font-medium">可用现金</span>
                          </div>
                          <div className="text-green-400 font-bold text-lg">${riskManagement.available_cash.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* 详细财务数据 */}
                      <div className="bg-slate-800/20 rounded-lg p-4 border border-slate-600/20">
                        <div className="text-slate-400 text-sm font-medium mb-3">详细财务数据</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                            <span className="text-slate-400">当前持仓价值:</span>
                            <span className="text-white font-medium">${riskManagement.current_position_value.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                            <span className="text-slate-400">仓位限制:</span>
                            <span className="text-white font-medium">${riskManagement.position_limit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                            <span className="text-slate-400">剩余限制:</span>
                            <span className="text-white font-medium">${riskManagement.remaining_limit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border border-slate-600/20 rounded p-2 bg-slate-800/20">
                            <span className="text-slate-400">仓位使用率:</span>
                            <span className="text-amber-400 font-medium">
                              {Math.round((riskManagement.current_position_value / riskManagement.position_limit) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 右侧：风险分析 */}
                    <div className="bg-slate-800/20 rounded-lg p-4 border border-slate-600/20">
                      <div className="text-slate-400 text-sm font-medium mb-3">风险分析</div>
                      <div className="text-slate-200 leading-relaxed text-sm">
                        <div 
                          className="break-words overflow-hidden"
                          style={{ 
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto'
                          }}
                        >
                          {riskManagement.reasoning}
                        </div>
                      </div>
                      
                      {/* 风险等级指示器 */}
                      <div className="mt-4 pt-3 border-t border-slate-600/30">
                        <div className="text-slate-400 text-xs mb-2">风险等级</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min(Math.round((riskManagement.current_position_value / riskManagement.position_limit) * 100), 100)}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-slate-300">
                            {Math.round((riskManagement.current_position_value / riskManagement.position_limit) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AnalysisDetails;
