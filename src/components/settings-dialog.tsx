"use client"

import * as React from "react"
import { Settings, Server, Bot, Thermometer, PercentCircle, ListOrdered } from "lucide-react"
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
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

export function SettingsDialog() {
  const [host, setHost] = React.useState("http://localhost:11434")
  const [model, setModel] = React.useState("llama3")
  const [temperature, setTemperature] = React.useState([0.7])
  const [topP, setTopP] = React.useState([0.9])
  const [topK, setTopK] = React.useState([40])

  const { toast } = useToast()

  const handleSave = () => {
    // Here you would typically save the settings, e.g., to localStorage
    // For now, we'll just show a toast notification.
    console.log("Saving settings:", { host, model, temperature: temperature[0], topP: topP[0], topK: topK[0] })
    toast({
      title: "Settings Saved",
      description: `Your configuration has been updated.`,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Provider Settings</DialogTitle>
          <DialogDescription>
            Configure your local Ollama instance details here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ollama-host" className="text-right col-span-1 flex items-center gap-2">
              <Server className="h-4 w-4" />
              Host
            </Label>
            <Input
              id="ollama-host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="col-span-3"
              placeholder="http://localhost:11434"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ollama-model" className="text-right col-span-1 flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Model
            </Label>
            <Input
              id="ollama-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="col-span-3"
              placeholder="e.g., llama3, codellama"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="temperature" className="text-right col-span-1 flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temp.
            </Label>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onValueChange={setTemperature}
              className="col-span-2"
            />
            <span className="text-sm text-muted-foreground text-center w-8">{temperature[0]}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="top-p" className="text-right col-span-1 flex items-center gap-2">
                <PercentCircle className="h-4 w-4" />
                Top P
            </Label>
            <Slider
              id="top-p"
              min={0}
              max={1}
              step={0.1}
              value={topP}
              onValueChange={setTopP}
              className="col-span-2"
            />
            <span className="text-sm text-muted-foreground text-center w-8">{topP[0]}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="top-k" className="text-right col-span-1 flex items-center gap-2">
                <ListOrdered className="h-4 w-4" />
                Top K
            </Label>
            <Slider
              id="top-k"
              min={0}
              max={100}
              step={1}
              value={topK}
              onValueChange={setTopK}
              className="col-span-2"
            />
            <span className="text-sm text-muted-foreground text-center w-8">{topK[0]}</span>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}