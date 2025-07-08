"use client";

import { useState } from "react";
import { AnalysisPanel } from "@/components/analysis/AnalysisPanel";
import { BacktestPanel } from "@/components/analysis/BacktestPanel";
import { WatchList } from "@/components/analysis/WatchList";
import { AnalysisHistory } from "@/components/analysis/AnalysisHistory";
import { ProtectedRoute } from "@/components/analysis/ProtectedRoute";

const Index = () => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [watchList, setWatchList] = useState<string[]>([]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-analysis-text relative overflow-hidden">        
        <div className="relative z-10">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* 左侧面板 - 固定定位，增加右侧边界线 */}
              <div className="lg:col-span-1">
                <div className="sticky top-5 space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide lg:border-r lg:border-analysis-border lg:pr-6">
                  <WatchList 
                    watchList={watchList} 
                    setWatchList={setWatchList} 
                  />
                  {/* 添加分隔线增强层次感 */}
                  <div className="hidden lg:block w-full h-px bg-gradient-to-r from-transparent via-analysis-border to-transparent"></div>
                  <AnalysisHistory />
                </div>
              </div>
              
              {/* 主内容区域 */}
              <div className="lg:col-span-3">
                {activeTab === "analysis" && <AnalysisPanel watchList={watchList} setWatchList={setWatchList} />}
                {activeTab === "backtest" && <BacktestPanel />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
