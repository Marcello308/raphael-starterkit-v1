import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentTransactions() {
  const transactions = [
    {
      id: 1,
      user: {
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        avatar: "/avatars/01.png",
      },
      amount: "+$1,999.00",
      status: "completed",
    },
    {
      id: 2,
      user: {
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        avatar: "/avatars/02.png",
      },
      amount: "+$39.00",
      status: "completed",
    },
    {
      id: 3,
      user: {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        avatar: "/avatars/03.png",
      },
      amount: "+$299.00",
      status: "completed",
    },
    {
      id: 4,
      user: {
        name: "William Kim",
        email: "will@email.com",
        avatar: "/avatars/04.png",
      },
      amount: "+$99.00",
      status: "pending",
    },
    {
      id: 5,
      user: {
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        avatar: "/avatars/05.png",
      },
      amount: "+$39.00",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={transaction.user.avatar} alt="Avatar" />
            <AvatarFallback>
              {transaction.user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction.user.email}
            </p>
          </div>
          <div className="ml-auto space-y-1 text-right">
            <p className="text-sm font-medium leading-none">
              {transaction.amount}
            </p>
            <p className={`text-xs ${
              transaction.status === 'completed' 
                ? 'text-green-600' 
                : 'text-yellow-600'
            }`}>
              {transaction.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 