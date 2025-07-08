import { useState } from "react";
import { Clock, ChevronRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AnalysisHistoryItem {
  id: string;
  stockCode: string;
  stockName: string;
  analysisDate: string;
  action: string;
  confidence: number;
  analysisResults: any[];
  portfolioStrategy: any;
}

export const AnalysisHistory = () => {
  const router = useRouter();
  
  // 模拟分析历史数据
  const [historyData] = useState<AnalysisHistoryItem[]>([
    {
      id: "1",
      stockCode: "600519",
      stockName: "贵州茅台",
      analysisDate: "2024-06-23 14:30",
      action: "LONG",
      confidence: 87,
      analysisResults: [],
      portfolioStrategy: {
        action: "LONG",
        actionColor: "bg-gradient-to-r from-green-500 to-green-600 text-white",
        quantity: 150,
        confidence: 87,
        reasoning: "基于所有分析师的综合评估结果，看多信号占主导地位。平均置信度为87%，建议建立多头仓位。"
      }
    },
    {
      id: "2",
      stockCode: "000001",
      stockName: "平安银行",
      analysisDate: "2024-06-23 10:15",
      action: "SHORT",
      confidence: 72,
      analysisResults: [],
      portfolioStrategy: {
        action: "SHORT",
        actionColor: "bg-gradient-to-r from-red-500 to-red-600 text-white",
        quantity: 200,
        confidence: 72,
        reasoning: "基于所有分析师的综合评估结果，看空信号占主导地位。平均置信度为72%，建议建立空头仓位。"
      }
    },
    {
      id: "3",
      stockCode: "600036",
      stockName: "招商银行",
      analysisDate: "2024-06-22 16:45",
      action: "HOLD",
      confidence: 65,
      analysisResults: [],
      portfolioStrategy: {
        action: "HOLD",
        actionColor: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black",
        quantity: 0,
        confidence: 65,
        reasoning: "基于所有分析师的综合评估结果，持有信号占主导地位。平均置信度为65%，建议维持当前仓位。"
      }
    },
    {
      id: "4",
      stockCode: "000002",
      stockName: "万科A",
      analysisDate: "2024-06-22 09:20",
      action: "LONG",
      confidence: 78,
      analysisResults: [],
      portfolioStrategy: {
        action: "LONG",
        actionColor: "bg-gradient-to-r from-green-500 to-green-600 text-white",
        quantity: 300,
        confidence: 78,
        reasoning: "基于所有分析师的综合评估结果，看多信号占主导地位。平均置信度为78%，建议建立多头仓位。"
      }
    },
    {
      id: "5",
      stockCode: "600519",
      stockName: "贵州茅台",
      analysisDate: "2024-06-21 15:30",
      action: "SHORT",
      confidence: 83,
      analysisResults: [],
      portfolioStrategy: {
        action: "SHORT",
        actionColor: "bg-gradient-to-r from-red-500 to-red-600 text-white",
        quantity: 100,
        confidence: 83,
        reasoning: "基于所有分析师的综合评估结果，看空信号占主导地位。平均置信度为83%，建议建立空头仓位。"
      }
    },
    {
      id: "6",
      stockCode: "000001",
      stockName: "平安银行",
      analysisDate: "2024-06-21 11:45",
      action: "HOLD",
      confidence: 68,
      analysisResults: [],
      portfolioStrategy: {
        action: "HOLD",
        actionColor: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black",
        quantity: 0,
        confidence: 68,
        reasoning: "基于所有分析师的综合评估结果，持有信号占主导地位。平均置信度为68%，建议维持当前仓位。"
      }
    }
  ]);

  const handleHistoryClick = (item: AnalysisHistoryItem) => {
    // Next.js router doesn't support passing state directly like react-router.
    // You might need to use query parameters or a global state management solution.
    router.push("/analysis-details");
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "LONG":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "SHORT":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      case "HOLD":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black";
      default:
        return "bg-slate-600 text-white";
    }
  };

  const displayedHistory = historyData.slice(0, 5);
  const hasMore = historyData.length > 5;

  const HistoryItem = ({ item }: { item: AnalysisHistoryItem }) => (
    <div
      onClick={() => handleHistoryClick(item)}
      className="p-3 bg-analysis-card-secondary rounded-xl hover:bg-analysis-card-hover transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-analysis-text font-medium text-sm">{item.stockCode}</span>
            <span className="text-analysis-text-muted text-xs truncate">{item.stockName}</span>
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <Badge className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${getActionColor(item.action)}`}>
              {item.action}
            </Badge>
            <span className="text-amber-400 text-xs font-medium">{item.confidence}%</span>
          </div>
          <div className="text-analysis-text-muted text-xs">{item.analysisDate}</div>
        </div>
        <ChevronRight className="h-4 w-4 text-analysis-text-muted group-hover:text-amber-400 transition-colors flex-shrink-0" />
      </div>
    </div>
  );

  return (
    <Card className="bg-analysis-card border border-analysis-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-analysis-text flex items-center space-x-2 text-base">
          <Clock className="h-4 w-4 text-blue-400" />
          <span>分析历史</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {historyData.length === 0 ? (
          <p className="text-analysis-text-muted text-center py-4 text-sm">暂无分析历史</p>
        ) : (
          <div className="space-y-3">
            {displayedHistory.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
            
            {hasMore && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full text-amber-400 hover:text-amber-300 hover:bg-analysis-card-hover mt-4 h-8 text-xs rounded-xl transition-all duration-200"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    查看更多 ({historyData.length - 5}条)
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-analysis-card border-analysis-border text-analysis-text max-w-2xl max-h-[80vh] overflow-hidden rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-analysis-text flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-amber-400" />
                      <span>分析历史 (全部 {historyData.length} 条)</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {historyData.map((item) => (
                      <HistoryItem key={item.id} item={item} />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
