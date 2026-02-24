import { Card, CardContent } from "@/components/ui/card";

export default function LotteryLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-muted" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
