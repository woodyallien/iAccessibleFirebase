
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListTree, GitCommit, CalendarDays, PlusCircle, Bug, Zap, ShieldCheck } from "lucide-react";

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'improvement' | 'security';
  description: string;
}

interface VersionLog {
  version: string;
  date: string;
  entries: ChangelogEntry[];
}

const changelogData: VersionLog[] = [
  {
    version: "1.2.0",
    date: "2024-07-30",
    entries: [
      { version: "1.2.0", date: "2024-07-30", type: 'feature', description: "Implemented dynamic credit system with context API." },
      { version: "1.2.0", date: "2024-07-30", type: 'feature', description: "Added Ad Hoc PDF scanning page." },
      { version: "1.2.0", date: "2024-07-30", type: 'improvement', description: "Enhanced Report Builder UI with dynamic report display area." },
      { version: "1.2.0", date: "2024-07-30", type: 'fix', description: "Resolved hydration errors related to client-side date formatting and conditional rendering." },
    ],
  },
  {
    version: "1.1.0",
    date: "2024-07-15",
    entries: [
      { version: "1.1.0", date: "2024-07-15", type: 'feature', description: "Added Notification system with dropdown and history page." },
      { version: "1.1.0", date: "2024-07-15", type: 'improvement', description: "Updated application color themes and fonts based on new design guidelines." },
      { version: "1.1.0", date: "2024-07-15", type: 'improvement', description: "Made sidebar fully collapsible with a ribbon-style toggle." },
    ],
  },
  {
    version: "1.0.0",
    date: "2024-07-01",
    entries: [
      { version: "1.0.0", date: "2024-07-01", type: 'feature', description: "Initial release of iAccessible MVP." },
      { version: "1.0.0", date: "2024-07-01", type: 'feature', description: "Dashboard, Settings, and Ad Hoc Web Page Scan functionalities." },
    ],
  },
];

const getTypeAttributes = (type: ChangelogEntry['type']) => {
  switch (type) {
    case 'feature':
      return { icon: <PlusCircle className="h-4 w-4 text-green-500" />, label: "Feature", color: "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100" };
    case 'fix':
      return { icon: <Bug className="h-4 w-4 text-red-500" />, label: "Fix", color: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100" };
    case 'improvement':
      return { icon: <Zap className="h-4 w-4 text-blue-500" />, label: "Improvement", color: "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100" };
    case 'security':
      return { icon: <ShieldCheck className="h-4 w-4 text-purple-500" />, label: "Security", color: "bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100" };
    default:
      return { icon: <GitCommit className="h-4 w-4 text-muted-foreground" />, label: "Update", color: "bg-muted text-muted-foreground" };
  }
};


export default function ChangelogPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ListTree className="h-8 w-8 text-primary" />
          Application Changelog
        </h1>
      </div>
      <CardDescription>
        Stay updated with the latest features, improvements, and fixes in iAccessible.
      </CardDescription>

      <div className="space-y-8">
        {changelogData.map((versionLog) => (
          <Card key={versionLog.version} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <GitCommit className="h-6 w-6 text-primary" />
                  Version {versionLog.version}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Date(versionLog.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-none pl-0">
                {versionLog.entries.map((entry, index) => {
                  const { icon, label, color } = getTypeAttributes(entry.type);
                  return (
                    <li key={index} className="flex items-start gap-3 p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors">
                      <span className="mt-0.5">{icon}</span>
                      <div>
                        <Badge variant="outline" className={`px-2 py-0.5 text-xs font-medium ${color} border-transparent`}>{label}</Badge>
                        <p className="mt-1 text-sm text-foreground">{entry.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
       <Card className="mt-6 bg-accent/50 border-accent shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Feedback?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-accent-foreground">
            We're constantly working to improve iAccessible. If you have any feedback or suggestions,
            please don't hesitate to reach out to our support team or use the feedback form (coming soon).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
