import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, RotateCcw, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ArchivePage() {
  const archivedItems = [
    {
      id: 1,
      type: "payment_link",
      name: "Old Pro Plan",
      description: "Legacy pro subscription plan",
      archivedDate: "2024-01-15",
      archivedBy: "John Doe",
      originalData: {
        amount: "$19.99",
        currency: "USD",
        interval: "monthly",
      },
    },
    {
      id: 2,
      type: "api_key",
      name: "Development Key v1",
      description: "Old development API key",
      archivedDate: "2024-01-10",
      archivedBy: "Jane Smith",
      originalData: {
        key: "sk_dev_old_abc123",
        permissions: "read_only",
      },
    },
    {
      id: 3,
      type: "webhook",
      name: "Legacy Webhook",
      description: "Old webhook endpoint",
      archivedDate: "2024-01-05",
      archivedBy: "System",
      originalData: {
        url: "https://old-api.example.com/webhook",
        events: ["payment.completed", "subscription.canceled"],
      },
    },
    {
      id: 4,
      type: "user_session",
      name: "Expired Session",
      description: "User session that expired",
      archivedDate: "2024-01-01",
      archivedBy: "Auto-cleanup",
      originalData: {
        userId: "user_123",
        sessionId: "sess_456",
        lastActivity: "2023-12-31",
      },
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "payment_link":
        return "bg-blue-100 text-blue-800";
      case "api_key":
        return "bg-purple-100 text-purple-800";
      case "webhook":
        return "bg-green-100 text-green-800";
      case "user_session":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archive</h1>
          <p className="text-muted-foreground">
            View and manage archived data and deleted items
          </p>
        </div>
        <Button variant="outline">
          <Trash2 className="h-4 w-4 mr-2" />
          Bulk Delete
        </Button>
      </div>

      {/* Archive Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Archived</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Archived links</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Archived keys</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Expired sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search archived items..." className="pl-10" />
        </div>
        <Button variant="outline">
          Filter by Type
        </Button>
        <Button variant="outline">
          Date Range
        </Button>
      </div>

      {/* Archived Items */}
      <Card>
        <CardHeader>
          <CardTitle>Archived Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {archivedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Badge className={getTypeColor(item.type)}>
                      {item.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>Archived: {item.archivedDate}</span>
                    <span>•</span>
                    <span>By: {item.archivedBy}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <details className="cursor-pointer">
                      <summary className="text-blue-600 hover:text-blue-800">
                        View original data
                      </summary>
                      <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(item.originalData, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Archive Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Archive Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-archive expired sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically archive user sessions after 30 days of inactivity
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Permanent deletion</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete archived items after 1 year
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Export archive</h4>
                <p className="text-sm text-muted-foreground">
                  Export all archived data for backup purposes
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 