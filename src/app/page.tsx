
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Award, AlertTriangle, ScanLine, FileScan, Settings, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Site Quality</CardTitle>
            <Award className="h-5 w-5 text-green-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              -1 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Checks</CardTitle>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Completed today
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Welcome to iAccessible!</CardTitle>
          <CardDescription>
            This is your central hub for managing and improving web accessibility.
            Explore the tools and resources to make your digital products inclusive for everyone.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/accessibility-check" passHref>
                <Button variant="default" className="w-full sm:w-auto justify-start text-left">
                  <ScanLine className="mr-2 h-4 w-4" /> Scan a Web Page
                </Button>
              </Link>
              <Link href="/reports" passHref>
                <Button variant="outline" className="w-full sm:w-auto justify-start text-left">
                  <FileText className="mr-2 h-4 w-4" /> View Reports
                </Button>
              </Link>
              <Link href="/pdf-scan" passHref>
                <Button variant="outline" className="w-full sm:w-auto justify-start text-left">
                  <FileScan className="mr-2 h-4 w-4" /> Scan a PDF Document
                </Button>
              </Link>
              <Link href="/settings" passHref>
                <Button variant="outline" className="w-full sm:w-auto justify-start text-left">
                  <Settings className="mr-2 h-4 w-4" /> Manage Settings
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-video rounded-md overflow-hidden mt-4 md:mt-0">
            <Image 
              src="https://placehold.co/600x338.png" 
              alt="Placeholder image illustrating accessibility concepts"
              data-ai-hint="accessibility abstract"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
