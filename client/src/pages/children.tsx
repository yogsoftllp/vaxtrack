import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Child } from "@shared/schema";

interface ChildWithStats extends Child {
  stats: {
    total: number;
    completed: number;
    upcoming: number;
    overdue: number;
  };
}

export default function Children() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: children, isLoading } = useQuery<ChildWithStats[]>({
    queryKey: ["/api/children"],
  });

  const filteredChildren = children?.filter((child) => {
    const fullName = `${child.firstName} ${child.lastName || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto w-full sm:max-w-2xl">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white" data-testid="text-children-title">
              Children
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Manage all profiles</p>
          </div>
          <Link href="/children/add">
            <Button size="icon" data-testid="button-add-child">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 max-w-md mx-auto w-full sm:max-w-2xl pt-4 space-y-4">
        {/* Search */}
        {children && children.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-0 bg-slate-100 dark:bg-slate-800"
              data-testid="input-search-children"
            />
          </div>
        )}

        {/* Children List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : filteredChildren && filteredChildren.length > 0 ? (
          <div className="space-y-3">
            {filteredChildren.map((child) => (
              <Link key={child.id} href={`/children/${child.id}`}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-all" data-testid={`card-child-${child.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{child.firstName} {child.lastName}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {child.stats.completed} of {child.stats.total} vaccines
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(child.stats.completed / child.stats.total) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : children && children.length > 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400">No results</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">No children yet</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Add your first child to start tracking vaccines
              </p>
              <Link href="/children/add" className="w-full">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Child
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
