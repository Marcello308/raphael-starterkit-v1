import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Eye, Edit, Trash2, ExternalLink } from "lucide-react";

export default function PaymentLinksPage() {
  const paymentLinks = [
    {
      id: 1,
      name: "Pro Subscription",
      amount: "$29.99",
      currency: "USD",
      interval: "monthly",
      url: "https://pay.example.com/pro-monthly",
      status: "active",
      created: "2024-01-15",
      clicks: 234,
      conversions: 45,
    },
    {
      id: 2,
      name: "One-time Purchase",
      amount: "$99.99",
      currency: "USD",
      interval: "one-time",
      url: "https://pay.example.com/one-time",
      status: "active",
      created: "2024-01-10",
      clicks: 156,
      conversions: 23,
    },
    {
      id: 3,
      name: "Enterprise Plan",
      amount: "$299.99",
      currency: "USD",
      interval: "annually",
      url: "https://pay.example.com/enterprise",
      status: "draft",
      created: "2024-01-05",
      clicks: 0,
      conversions: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Links</h1>
          <p className="text-muted-foreground">
            Create and manage payment links for your products and services
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Payment Link
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{link.name}</h3>
                    <Badge variant={link.status === "active" ? "default" : "secondary"}>
                      {link.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-lg text-gray-900">
                      {link.amount} {link.currency}
                    </span>
                    <span>•</span>
                    <span>{link.interval}</span>
                    <span>•</span>
                    <span>Created: {link.created}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {link.url}
                    </code>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="text-blue-600">{link.clicks} clicks</span>
                    <span className="text-green-600">{link.conversions} conversions</span>
                    <span className="text-gray-600">
                      {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : 0}% conversion rate
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New payment completed</p>
                <p className="text-xs text-muted-foreground">Pro Subscription - $29.99</p>
              </div>
              <div className="text-xs text-muted-foreground">2 minutes ago</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Payment link clicked</p>
                <p className="text-xs text-muted-foreground">Enterprise Plan</p>
              </div>
              <div className="text-xs text-muted-foreground">5 minutes ago</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New payment link created</p>
                <p className="text-xs text-muted-foreground">Starter Plan</p>
              </div>
              <div className="text-xs text-muted-foreground">1 hour ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 