import { useState } from "react";
import { Calendar, TrendingUp, TrendingDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
type Language = 'zh' | 'en';
interface Translations {
  zh: {
    [key: string]: string;
  };
  en: {
    [key: string]: string;
  };
}
const translations: Translations = {
  zh: {
    title: "策略回测",
    subtitle: "设置回测参数，测试交易策略的历史表现",
    selectStock: "选择股票",
    selectStockPlaceholder: "请选择股票",
    selectAgent: "选择AI分析师",
    selectAgentPlaceholder: "请选择分析师",
    startDate: "开始日期",
    endDate: "结束日期",
    startBacktest: "开始回测",
    backtesting: "回测中...",
    portfolioSummary: "投资组合摘要",
    cashBalance: "现金余额",
    positionValue: "持仓价值",
    totalValue: "总价值",
    return: "收益率",
    sharpeRatio: "夏普比率",
    sortinoRatio: "索提诺比率",
    maxDrawdown: "最大回撤",
    dailyTrades: "每日交易情况",
    date: "日期",
    stock: "股票",
    action: "操作",
    quantity: "数量",
    price: "价格",
    shares: "持股",
    positionValueTable: "持仓价值",
    bullish: "看涨%",
    bearish: "看跌%",
    neutral: "中性%",
    buy: "买入",
    sell: "卖出",
    hold: "持有"
  },
  en: {
    title: "Strategy Backtest",
    subtitle: "Set backtest parameters to test historical performance of trading strategies",
    selectStock: "Select Stock",
    selectStockPlaceholder: "Please select stock",
    selectAgent: "Select AI Analyst",
    selectAgentPlaceholder: "Please select analyst",
    startDate: "Start Date",
    endDate: "End Date",
    startBacktest: "Start Backtest",
    backtesting: "Backtesting...",
    portfolioSummary: "Portfolio Summary",
    cashBalance: "Cash Balance",
    positionValue: "Position Value",
    totalValue: "Total Value",
    return: "Return",
    sharpeRatio: "Sharpe Ratio",
    sortinoRatio: "Sortino Ratio",
    maxDrawdown: "Max Drawdown",
    dailyTrades: "Daily Trading",
    date: "Date",
    stock: "Stock",
    action: "Action",
    quantity: "Quantity",
    price: "Price",
    shares: "Shares",
    positionValueTable: "Position Value",
    bullish: "Bullish%",
    bearish: "Bearish%",
    neutral: "Neutral%",
    buy: "Buy",
    sell: "Sell",
    hold: "Hold"
  }
};
export const BacktestPanel = () => {
  const [language, setLanguage] = useState<Language>('zh');
  const [backtestConfig, setBacktestConfig] = useState({
    stock: "",
    startDate: "",
    endDate: "",
    agent: "",
    analysisType: ""
  });
  const [backtestResults, setBacktestResults] = useState<any>(null);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const t = translations[language];
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };
  const getActionText = (action: string) => {
    switch (action) {
      case '买入':
      case 'Buy':
        return t.buy;
      case '卖出':
      case 'Sell':
        return t.sell;
      case '持有':
      case 'Hold':
        return t.hold;
      default:
        return action;
    }
  };
  const runBacktest = async () => {
    if (!backtestConfig.stock || !backtestConfig.startDate || !backtestConfig.endDate) {
      return;
    }
    setIsBacktesting(true);

    // 模拟回测API调用
    setTimeout(() => {
      const mockResults = {
        summary: {
          cashBalance: 119239.91,
          totalPositionValue: -19682.26,
          totalValue: 99557.65,
          return: -0.44,
          sharpeRatio: -10.04,
          sortinoRatio: -10.04,
          maxDrawdown: 0.54
        },
        trades: [{
          date: "2024-01-15",
          ticker: backtestConfig.stock,
          action: "买入",
          quantity: 100,
          price: 42.30,
          shares: 100,
          positionValue: 4230,
          bullish: 75,
          bearish: 15,
          neutral: 10
        }, {
          date: "2024-01-16",
          ticker: backtestConfig.stock,
          action: "持有",
          quantity: 0,
          price: 42.85,
          shares: 100,
          positionValue: 4285,
          bullish: 70,
          bearish: 20,
          neutral: 10
        }, {
          date: "2024-01-17",
          ticker: backtestConfig.stock,
          action: "卖出",
          quantity: 50,
          price: 41.95,
          shares: 50,
          positionValue: 2097.5,
          bullish: 45,
          bearish: 40,
          neutral: 15
        }]
      };
      setBacktestResults(mockResults);
      setIsBacktesting(false);
    }, 3000);
  };
  return <div className="space-y-6">
      <Card className="bg-analysis-card border border-analysis-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative">
        <div className="relative z-10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-analysis-text to-analysis-text-secondary bg-clip-text text-transparent flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-amber-400" />
                  <span>{t.title}</span>
                </CardTitle>
                <p className="text-analysis-text-muted mt-2">{t.subtitle}</p>
              </div>
              
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-analysis-text font-medium mb-2 block">{t.selectStock}</label>
                <Select value={backtestConfig.stock} onValueChange={value => setBacktestConfig(prev => ({
                ...prev,
                stock: value
              }))}>
                  <SelectTrigger className="bg-analysis-card-secondary border-analysis-border text-analysis-text h-12 backdrop-blur-sm rounded-xl hover:bg-analysis-card-hover transition-all duration-200">
                    <SelectValue placeholder={t.selectStockPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-analysis-card border-analysis-border backdrop-blur-md rounded-xl">
                    <SelectItem value="000001">000001 - {language === 'zh' ? '平安银行' : 'Ping An Bank'}</SelectItem>
                    <SelectItem value="600036">600036 - {language === 'zh' ? '招商银行' : 'China Merchants Bank'}</SelectItem>
                    <SelectItem value="600519">600519 - {language === 'zh' ? '贵州茅台' : 'Kweichow Moutai'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-analysis-text font-medium mb-2 block">{t.selectAgent}</label>
                <Select value={backtestConfig.agent} onValueChange={value => setBacktestConfig(prev => ({
                ...prev,
                agent: value
              }))}>
                  <SelectTrigger className="bg-analysis-card-secondary border-analysis-border text-analysis-text h-12 backdrop-blur-sm rounded-xl hover:bg-analysis-card-hover transition-all duration-200">
                    <SelectValue placeholder={t.selectAgentPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-analysis-card border-analysis-border backdrop-blur-md rounded-xl">
                    <SelectItem value="warren-buffett">Warren Buffett</SelectItem>
                    <SelectItem value="peter-lynch">Peter Lynch</SelectItem>
                    <SelectItem value="ben-graham">Ben Graham</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-analysis-text font-medium mb-2 block">{t.startDate}</label>
                <Input type="date" value={backtestConfig.startDate} onChange={e => setBacktestConfig(prev => ({
                ...prev,
                startDate: e.target.value
              }))} className="bg-analysis-card-secondary border-analysis-border text-analysis-text h-12 backdrop-blur-sm rounded-xl hover:bg-analysis-card-hover focus:bg-analysis-card-hover transition-all duration-200" />
              </div>

              <div>
                <label className="text-analysis-text font-medium mb-2 block">{t.endDate}</label>
                <Input type="date" value={backtestConfig.endDate} onChange={e => setBacktestConfig(prev => ({
                ...prev,
                endDate: e.target.value
              }))} className="bg-analysis-card-secondary border-analysis-border text-analysis-text h-12 backdrop-blur-sm rounded-xl hover:bg-analysis-card-hover focus:bg-analysis-card-hover transition-all duration-200" />
              </div>
            </div>

            <Button onClick={runBacktest} disabled={!backtestConfig.stock || !backtestConfig.startDate || !backtestConfig.endDate || isBacktesting} className="w-full bg-blue-600 hover:bg-analysis-button-hover text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-blue-600">
              {isBacktesting ? <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t.backtesting}</span>
                </div> : t.startBacktest}
            </Button>
          </CardContent>
        </div>
      </Card>

      {/* 回测结果 */}
      {backtestResults && <>
          {/* 投资组合摘要 */}
          <Card className="bg-gradient-to-br from-analysis-card via-analysis-card to-analysis-card-secondary border-analysis-border backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-analysis-text to-analysis-text-secondary bg-clip-text text-transparent">{t.portfolioSummary}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-analysis-text-muted text-sm">{t.cashBalance}</div>
                  <div className="text-analysis-text text-lg font-medium">
                    ¥{backtestResults.summary.cashBalance.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-analysis-text-muted text-sm">{t.positionValue}</div>
                  <div className="text-analysis-text text-lg font-medium">
                    ¥{backtestResults.summary.totalPositionValue.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-analysis-text-muted text-sm">{t.totalValue}</div>
                  <div className="text-analysis-text text-lg font-medium">
                    ¥{backtestResults.summary.totalValue.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-analysis-text-muted text-sm">{t.return}</div>
                  <div className={`text-lg font-medium flex items-center justify-center space-x-1 ${backtestResults.summary.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {backtestResults.summary.return >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{backtestResults.summary.return}%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-analysis-card-secondary border border-analysis-border rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-analysis-text-muted text-sm">{t.sharpeRatio}</div>
                  <div className="text-analysis-text text-lg font-medium">{backtestResults.summary.sharpeRatio}</div>
                </div>
                <div className="text-center p-4 bg-analysis-card-secondary border border-analysis-border rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-analysis-text-muted text-sm">{t.sortinoRatio}</div>
                  <div className="text-analysis-text text-lg font-medium">{backtestResults.summary.sortinoRatio}</div>
                </div>
                <div className="text-center p-4 bg-analysis-card-secondary border border-analysis-border rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-analysis-text-muted text-sm">{t.maxDrawdown}</div>
                  <div className="text-red-400 text-lg font-medium">{backtestResults.summary.maxDrawdown}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 交易记录 */}
          <Card className="bg-gradient-to-br from-analysis-card via-analysis-card to-analysis-card-secondary border-analysis-border backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-analysis-text to-analysis-text-secondary bg-clip-text text-transparent">{t.dailyTrades}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-analysis-border">
                      <th className="text-left text-analysis-text-secondary py-2">{t.date}</th>
                      <th className="text-left text-analysis-text-secondary py-2">{t.stock}</th>
                      <th className="text-left text-analysis-text-secondary py-2">{t.action}</th>
                      <th className="text-right text-analysis-text-secondary py-2">{t.quantity}</th>
                      <th className="text-right text-analysis-text-secondary py-2">{t.price}</th>
                      <th className="text-right text-analysis-text-secondary py-2">{t.shares}</th>
                      <th className="text-right text-analysis-text-secondary py-2">{t.positionValueTable}</th>
                      <th className="text-right text-analysis-text-secondary py-2">{t.bullish}</th>
                      <th className="text-right text-analysis-text-secondary py-2">{t.bearish}</th>
                      <th className="text-right text-analysis-text-secondary py-2">{t.neutral}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backtestResults.trades.map((trade: any, index: number) => <tr key={index} className="border-b border-analysis-border hover:bg-analysis-card-hover transition-all duration-200">
                        <td className="text-analysis-text py-3">{trade.date}</td>
                        <td className="text-analysis-text py-3">{trade.ticker}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${trade.action === '买入' || trade.action === 'Buy' ? 'bg-green-500/20 text-green-400' : trade.action === '卖出' || trade.action === 'Sell' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {getActionText(trade.action)}
                          </span>
                        </td>
                        <td className="text-right text-analysis-text py-3">{trade.quantity}</td>
                        <td className="text-right text-analysis-text py-3">¥{trade.price}</td>
                        <td className="text-right text-analysis-text py-3">{trade.shares}</td>
                        <td className="text-right text-analysis-text py-3">¥{trade.positionValue.toLocaleString()}</td>
                        <td className="text-right text-green-400 py-3">{trade.bullish}%</td>
                        <td className="text-right text-red-400 py-3">{trade.bearish}%</td>
                        <td className="text-right text-yellow-400 py-3">{trade.neutral}%</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>}
    </div>;
};