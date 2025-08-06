"use client"

import * as React from "react"
import { Settings, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function SettingsDialog() {
  const [host, setHost] = React.useState("http://localhost:11434")
  const { toast } = useToast()

  const handleSave = () => {
    // Here you would typically save the settings, e.g., to localStorage
    // For now, we'll just show a toast notification.
    console.log("Saving Ollama host:", host)
    toast({
      title: "Settings Saved",
      description: `Ollama host has been set to ${host}`,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your local AI provider settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ollama-host" className="text-right col-span-1 flex items-center gap-2">
              <Server className="h-4 w-4" />
              Ollama Host
            </Label>
            <Input
              id="ollama-host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="col-span-3"
              placeholder="http://localhost:11434"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

    