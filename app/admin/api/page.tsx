import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Eye, EyeOff, Trash2 } from "lucide-react";

export default function ApiPage() {
  const apiKeys = [
    {
      id: 1,
      name: "Production API Key",
      key: "sk_prod_1234567890abcdef",
      created: "2024-01-15",
      lastUsed: "2024-01-20",
      status: "active",
    },
    {
      id: 2,
      name: "Development API Key",
      key: "sk_dev_abcdef1234567890",
      created: "2024-01-10",
      lastUsed: "2024-01-19",
      status: "active",
    },
    {
      id: 3,
      name: "Testing API Key",
      key: "sk_test_fedcba0987654321",
      created: "2024-01-05",
      lastUsed: "2024-01-18",
      status: "inactive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API</h1>
          <p className="text-muted-foreground">
            Manage API keys and monitor API usage
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* API Usage Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234,567</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">+0.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145ms</div>
            <p className="text-xs text-muted-foreground">-12ms from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1000/h</div>
            <p className="text-xs text-muted-foreground">Current limit</p>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{apiKey.name}</h3>
                    <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                      {apiKey.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {apiKey.key}
                    </code>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>Created: {apiKey.created}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
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

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Authentication</h4>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                <code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.example.com/v1/endpoint`}</code>
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Example Request</h4>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                <code>{`curl -X GET \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  https://api.example.com/v1/data`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 