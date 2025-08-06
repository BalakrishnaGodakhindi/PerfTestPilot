"use client";

import * as React from 'react';
import { UploadCloud, FileText, ClipboardList, Sparkles, Download, Loader2, TestTube2, BookUser, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { generateTestCasesAction } from './actions';
import { SettingsDialog } from '@/components/settings-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const [swaggerDoc, setSwaggerDoc] = React.useState<string>('');
  const [fileName, setFileName] = React.useState<string>('');
  const [generatedResult, setGeneratedResult] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSwaggerDoc(content);
        setFileName(file.name);
        setGeneratedResult('');
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Error reading file',
          description: 'Could not read the selected file.',
        });
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] || null);
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    handleFile(event.dataTransfer.files?.[0] || null);
  };

  const handleGenerate = async () => {
    if (!swaggerDoc) {
      toast({
        variant: 'destructive',
        title: 'No document found',
        description: 'Please upload a Swagger/OpenAPI document first.',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedResult('');
    
    const result = await generateTestCasesAction({ swaggerDoc });
    
    if (result.success && result.data) {
      setGeneratedResult(result.data);
      toast({
        title: 'Success!',
        description: 'Test cases have been generated.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }

    setIsLoading(false);
  };

  const handleDownload = () => {
    if (!generatedResult) return;

    const blob = new Blob([generatedResult], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'perftest-pilot-script.jmx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const loadExample = async (filePath: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(filePath);
      const text = await response.text();
      setSwaggerDoc(text);
      setFileName(name);
      setGeneratedResult('');
      toast({
        title: `Loaded ${name}`,
        description: 'You can now generate test cases.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load example',
        description: 'Please check the console for more details.',
      });
      console.error('Failed to load example swagger:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 px-4 sm:px-6">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <TestTube2 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">
                    PerfTest Pilot
                </h1>
            </div>
            <SettingsDialog />
        </div>
        <p className="container mx-auto text-muted-foreground mt-2">
          AI-powered performance test case and JMeter script generation from your API docs.
        </p>
      </header>

      <main className="container mx-auto flex-1 p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <FileText className="h-6 w-6" />
                API Documentation
              </CardTitle>
              <CardDescription>
                Upload your Swagger 2.0 or OpenAPI 3.0 documentation to begin, or use one of the examples.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".json,.yaml,.yml"
                />
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                    isDragOver ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/10'
                  )}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">Swagger/OpenAPI (JSON or YAML)</p>
                  </div>
                </label>
              
              <div className="flex items-center justify-center">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <BookUser className="mr-2 h-4 w-4" />
                      Load Example
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => loadExample('/examples/petstore.json', 'Pet Store API')}>
                      Pet Store API
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => loadExample('/examples/user-management.json', 'User Management API')}>
                      User Management API
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => loadExample('/examples/ecommerce.json', 'E-commerce API')}>
                      E-commerce API
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {fileName && <p className="text-sm text-muted-foreground">Uploaded: <span className="font-medium text-foreground">{fileName}</span></p>}
              
              <ScrollArea className="flex-1 h-64 md:h-auto border rounded-md bg-muted/20">
                <Textarea
                  value={swaggerDoc}
                  onChange={(e) => setSwaggerDoc(e.target.value)}
                  placeholder="Your uploaded document content will appear here..."
                  className="w-full h-full min-h-[300px] bg-transparent border-0 focus-visible:ring-0"
                />
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={!swaggerDoc || isLoading} size="lg" className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Generating...' : 'Generate Test Cases'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <ClipboardList className="h-6 w-6" />
                Generated Test Cases
              </CardTitle>
              <CardDescription>
                AI-generated test cases and JMeter script structure will be displayed below.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-full max-h-[500px] w-full rounded-md border p-4">
                {isLoading && !generatedResult && (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <div className="space-y-2 mt-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                )}
                {!isLoading && !generatedResult && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-muted-foreground">Your generated test cases will appear here.</p>
                    <p className="text-sm text-muted-foreground">Upload your API docs and let the magic happen ✨</p>
                  </div>
                )}
                {generatedResult && (
                  <pre className="text-sm whitespace-pre-wrap break-words">
                    <code>{generatedResult}</code>
                  </pre>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDownload} disabled={!generatedResult || isLoading} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download className="mr-2 h-5 w-5" />
                Download JMeter Script
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="text-center p-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PerfTest Pilot. All rights reserved.</p>
      </footer>
    </div>
  );
}

    