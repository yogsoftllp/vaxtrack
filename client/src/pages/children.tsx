import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChildCard } from "@/components/child-card";
import { Plus, Users, Search } from "lucide-react";
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-children-title">
            Children
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your children's profiles and vaccination records
          </p>
        </div>
        <Link href="/children/add">
          <Button className="gap-2" data-testid="button-add-child">
            <Plus className="h-4 w-4" />
            Add Child
          </Button>
        </Link>
      </div>

      {/* Search */}
      {children && children.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search children..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-children"
          />
        </div>
      )}

      {/* Children List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredChildren && filteredChildren.length > 0 ? (
        <div className="space-y-4">
          {filteredChildren.map((child) => (
            <Link key={child.id} href={`/children/${child.id}`}>
              <ChildCard 
                child={child} 
                stats={child.stats}
              />
            </Link>
          ))}
        </div>
      ) : children && children.length > 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground text-sm">
              Try a different search term
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No children added yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Add your first child to start tracking their vaccinations and receive timely reminders
            </p>
            <Link href="/children/add">
              <Button className="gap-2" size="lg">
                <Plus className="h-4 w-4" />
                Add Your First Child
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
