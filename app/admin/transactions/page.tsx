import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";

export default function TransactionsPage() {
  const transactions = [
    {
      id: "TXN-001",
      date: "2024-01-15",
      customer: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "$1,999.00",
      status: "completed",
      type: "subscription",
    },
    {
      id: "TXN-002",
      date: "2024-01-14",
      customer: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: "$39.00",
      status: "completed",
      type: "one-time",
    },
    {
      id: "TXN-003",
      date: "2024-01-13",
      customer: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "$299.00",
      status: "completed",
      type: "subscription",
    },
    {
      id: "TXN-004",
      date: "2024-01-12",
      customer: "William Kim",
      email: "will@email.com",
      amount: "$99.00",
      status: "pending",
      type: "one-time",
    },
    {
      id: "TXN-005",
      date: "2024-01-11",
      customer: "Sofia Davis",
      email: "sofia.davis@email.com",
      amount: "$39.00",
      status: "failed",
      type: "subscription",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "subscription":
        return "bg-blue-100 text-blue-800";
      case "one-time":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and track all payment transactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search transactions..." className="pl-10" />
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Transaction ID</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{transaction.id}</td>
                    <td className="p-4 text-sm">{transaction.date}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-sm">{transaction.customer}</div>
                        <div className="text-xs text-gray-500">{transaction.email}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{transaction.amount}</td>
                    <td className="p-4">
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 