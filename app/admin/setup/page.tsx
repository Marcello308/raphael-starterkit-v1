import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";

export default function SetupPage() {
  const setupSteps = [
    {
      id: 1,
      title: "Configure Database",
      description: "Set up your database connection and run initial migrations",
      completed: true,
    },
    {
      id: 2,
      title: "Set up Authentication",
      description: "Configure authentication providers and security settings",
      completed: true,
    },
    {
      id: 3,
      title: "Configure Payment Gateway",
      description: "Set up Creem payment processing and webhook endpoints",
      completed: false,
    },
    {
      id: 4,
      title: "Customize Branding",
      description: "Update logos, colors, and brand elements",
      completed: false,
    },
    {
      id: 5,
      title: "Set up Email Service",
      description: "Configure email templates and SMTP settings",
      completed: false,
    },
    {
      id: 6,
      title: "Deploy to Production",
      description: "Final deployment and go-live checklist",
      completed: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quick Setup</h1>
        <p className="text-muted-foreground">
          Complete these steps to get your platform ready for production
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(setupSteps.filter(step => step.completed).length / setupSteps.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">
              {setupSteps.filter(step => step.completed).length} of {setupSteps.length} completed
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {setupSteps.map((step) => (
              <div key={step.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="mt-1">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
                <div>
                  {step.completed ? (
                    <span className="text-sm text-green-600">Completed</span>
                  ) : (
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="h-auto p-4 flex-col items-start">
              <div className="font-medium">Import Sample Data</div>
              <div className="text-sm text-muted-foreground">
                Load sample data to test your setup
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium">Run System Check</div>
              <div className="text-sm text-muted-foreground">
                Verify all systems are working correctly
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium">View Documentation</div>
              <div className="text-sm text-muted-foreground">
                Access setup guides and tutorials
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium">Contact Support</div>
              <div className="text-sm text-muted-foreground">
                Get help with your setup
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 