import { useState } from "react";
import { Star, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WatchListProps {
  watchList: string[];
  setWatchList: (stocks: string[]) => void;
}

export const WatchList = ({ watchList, setWatchList }: WatchListProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const stockData: Record<string, { name: string; price: string; change: string }> = {
    "000001": { name: "平安银行", price: "12.85", change: "+0.12" },
    "000002": { name: "万科A", price: "18.45", change: "-0.23" },
    "600036": { name: "招商银行", price: "42.30", change: "+0.85" },
    "600519": { name: "贵州茅台", price: "1680.00", change: "+15.20" },
  };

  const removeFromWatchList = (stockCode: string) => {
    setWatchList(watchList.filter(code => code !== stockCode));
  };

  const displayedWatchList = showAll ? watchList : watchList.slice(0, 5);
  const hasMore = watchList.length > 5;

  const StockItem = ({ code }: { code: string }) => {
    const stock = stockData[code];
    return (
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted/50 transition-all duration-300 shadow-sm hover:shadow-md">
        <div>
          <div className="text-foreground font-medium">{code}</div>
          <div className="text-muted-foreground text-sm">{stock?.name}</div>
        </div>
        <div className="text-right">
          <div className="text-foreground">¥{stock?.price}</div>
          <div className={`text-sm ${
            stock?.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
          }`}>
            {stock?.change}
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => removeFromWatchList(code)}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2 rounded-lg transition-all duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <Card className="bg-card border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center space-x-2">
          <Star className="h-5 w-5 text-amber-400" />
          <span>关注列表</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {watchList.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">暂无关注股票</p>
        ) : (
          <div className="space-y-3">
            {displayedWatchList.map((code) => (
              <StockItem key={code} code={code} />
            ))}
            
            {hasMore && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full text-amber-400 hover:text-amber-300 hover:bg-muted/50 mt-4 rounded-xl transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    查看更多 ({watchList.length - 5}条)
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border text-foreground max-w-2xl max-h-[80vh] overflow-hidden rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center space-x-2">
                      <Star className="h-5 w-5 text-amber-400" />
                      <span>关注列表 (全部 {watchList.length} 条)</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {watchList.map((code) => (
                      <StockItem key={code} code={code} />
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
