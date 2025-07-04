"use client";

export function Overview() {
  // 模拟图表数据
  const data = [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 1900 },
    { name: "Mar", total: 2400 },
    { name: "Apr", total: 2100 },
    { name: "May", total: 2800 },
    { name: "Jun", total: 3200 },
    { name: "Jul", total: 3600 },
    { name: "Aug", total: 4200 },
    { name: "Sep", total: 3800 },
    { name: "Oct", total: 4600 },
    { name: "Nov", total: 5200 },
    { name: "Dec", total: 5800 },
  ];

  const maxValue = Math.max(...data.map(d => d.total));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Monthly Revenue</h3>
        <p className="text-sm text-muted-foreground">
          Showing total revenue for the last 12 months
        </p>
      </div>
      
      <div className="h-[300px] w-full">
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-primary rounded-t-sm min-h-[20px] transition-all duration-300 hover:bg-primary/80"
                style={{ 
                  height: `${(item.total / maxValue) * 100}%`,
                  minHeight: '20px'
                }}
              />
              <div className="text-xs text-muted-foreground mt-2">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">This month</p>
          <p className="text-2xl font-bold">$5,800</p>
        </div>
        <div>
          <p className="text-muted-foreground">Last month</p>
          <p className="text-2xl font-bold">$5,200</p>
        </div>
      </div>
    </div>
  );
} 