import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HelpDialog() {
  const exampleJson = `{
  "name": "Work",
  "areas": [
    {
      "id": "10-19",
      "name": "Administration",
      "description": "Company admin tasks",
      "tags": ["hr", "legal", "compliance"],
      "categories": [
        {
          "id": "11",
          "name": "HR Documents",
          "description": "Employee records and policies",
          "tags": ["employees", "policies"]
        },
        {
          "id": "12",
          "name": "Legal",
          "description": "Contracts and agreements",
          "tags": ["contracts"]
        }
      ]
    }
  ]
}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Johnny Decimal Finder - Help</DialogTitle>
          <DialogDescription>
            A fast search tool for your Johnny Decimal filing systems
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">What is Johnny Decimal?</h3>
              <p className="text-muted-foreground">
                Johnny Decimal is a system to organize your files, notes, and life. It uses a simple 
                numbering scheme: Areas (10-19, 20-29, etc.) contain Categories (11, 12, 21, 22, etc.), 
                making it easy to find anything quickly.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">How to Use This App</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Import your Johnny Decimal system as a JSON file</li>
                <li>Type in the search box to find areas and categories</li>
                <li>Browse the tree view when search is empty</li>
                <li>Edit descriptions and tags directly to improve search</li>
                <li>Export your updated system to save changes</li>
                <li>Switch between multiple systems (Work, Home, etc.)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Keyboard Shortcuts</h3>
              <ul className="text-muted-foreground space-y-1">
                <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">/</kbd> Focus search</li>
                <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> Clear search</li>
                <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑</kbd> <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↓</kbd> Navigate results</li>
                <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> Expand/collapse result</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">JSON File Format</h3>
              <p className="text-muted-foreground mb-2">
                Your JSON file should follow this structure:
              </p>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                {exampleJson}
              </pre>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Field Descriptions</h3>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li><strong>name</strong>: Name of your system (e.g., "Work", "Home")</li>
                <li><strong>areas</strong>: Array of area objects (10-19, 20-29, etc.)</li>
                <li><strong>areas[].id</strong>: Area range like "10-19", "20-29"</li>
                <li><strong>areas[].name</strong>: Human-readable area name</li>
                <li><strong>areas[].description</strong>: Optional description for search</li>
                <li><strong>areas[].tags</strong>: Optional array of tags for search</li>
                <li><strong>categories</strong>: Array of category objects within an area</li>
                <li><strong>categories[].id</strong>: Two-digit ID like "11", "12"</li>
                <li><strong>categories[].name</strong>: Human-readable category name</li>
                <li><strong>categories[].description</strong>: Optional description</li>
                <li><strong>categories[].tags</strong>: Optional array of tags</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Tips</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Add descriptive tags to make items easier to find</li>
                <li>Use the tree view to explore your full system</li>
                <li>Export regularly to save your tag/description edits</li>
                <li>Install as a PWA for offline desktop use</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
