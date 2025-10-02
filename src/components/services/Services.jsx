"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Upload, FileText, Link2, ImageIcon, CheckCircle2, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

const Services = () => {
  const [activeTab, setActiveTab] = useState("blog")

  // Single form state that changes based on active tab
  const [formData, setFormData] = useState({
    blog: {
      logo: null,
      csvFile: null,
      keywords: [
        { id: 1, keyword: "", link: "" },
        { id: 2, keyword: "", link: "" },
        { id: 3, keyword: "", link: "" },
        { id: 4, keyword: "", link: "" },
        { id: 5, keyword: "", link: "" },
      ],
    },
    backlink: {
      logo: null,
      csvFile: null,
      keywords: [
        { id: 1, keyword: "", link: "" },
        { id: 2, keyword: "", link: "" },
        { id: 3, keyword: "", link: "" },
        { id: 4, keyword: "", link: "" },
        { id: 5, keyword: "", link: "" },
      ],
    },
    guestPosting: {
      logo: null,
      csvFile: null,
      keywords: [
        { id: 1, keyword: "", link: "" },
        { id: 2, keyword: "", link: "" },
        { id: 3, keyword: "", link: "" },
        { id: 4, keyword: "", link: "" },
        { id: 5, keyword: "", link: "" },
      ],
    },
  })

  const handleLogoUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], logo: e.target.result },
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleCsvUpload = (file) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], csvFile: file },
    }))
  }

  const updateKeyword = (keywordId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        keywords: prev[activeTab].keywords.map((k) => (k.id === keywordId ? { ...k, [field]: value } : k)),
      },
    }))
  }

  const addKeyword = () => {
    const newKeyword = {
      id: Date.now(),
      keyword: "",
      link: "",
    }

    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        keywords: [...prev[activeTab].keywords, newKeyword],
      },
    }))
  }

  const removeKeyword = (keywordId) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        keywords: prev[activeTab].keywords.filter((k) => k.id !== keywordId),
      },
    }))
  }

  const saveKeyword = () => {
    alert(`Keyword saved for ${activeTab} form!`)
  }

  const handleSave = () => {
    alert("All forms saved successfully!")
  }

  const getTabConfig = (tab) => {
    switch (tab) {
      case "blog":
        return {
          title: "Blog Generation",
          description: "Configure your blog content generation settings",
          icon: FileText,
        }
      case "backlink":
        return {
          title: "Backlink Management",
          description: "Set up your backlink strategy and tracking",
          icon: Link2,
        }
      case "guestPosting":
        return {
          title: "Guest Posting",
          description: "Manage guest posting opportunities and settings",
          icon: FileText,
        }
      default:
        return { title: "", description: "", icon: FileText }
    }
  }

  const currentFormData = formData[activeTab]
  const tabConfig = getTabConfig(activeTab)
  const TabIcon = tabConfig.icon

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Service Configuration</h1>
              <p className="text-sm text-muted-foreground">Manage your content generation and SEO services</p>
            </div>
            <Link to="/projects" className="self-start sm:self-auto">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 bg-transparent p-0 h-auto mb-6 sm:mb-8">
            <TabsTrigger
              value="blog"
              className="data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:border-primary/50 border-2 border-transparent rounded-xl p-3 sm:p-4 transition-all duration-200 hover:border-primary/30"
            >
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 shrink-0">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="font-semibold text-xs sm:text-sm truncate">Blog Generation</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">Content creation</div>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="backlink"
              className="data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:border-primary/50 border-2 border-transparent rounded-xl p-3 sm:p-4 transition-all duration-200 hover:border-primary/30"
            >
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 shrink-0">
                  <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="font-semibold text-xs sm:text-sm truncate">Backlink Settings</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">Link building</div>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="guestPosting"
              className="data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:border-primary/50 border-2 border-transparent rounded-xl p-3 sm:p-4 transition-all duration-200 hover:border-primary/30 sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 shrink-0">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="font-semibold text-xs sm:text-sm truncate">Guest Posting</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">Outreach management</div>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid gap-6">
              {/* Header Card */}
              <Card className="border-2 shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <TabIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{tabConfig.title}</CardTitle>
                      <CardDescription className="text-base mt-1">{tabConfig.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Upload Section */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {/* Logo Upload Card */}
                <Card className="border-2 shadow-none">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <CardTitle className="text-base sm:text-lg">Brand Logo</CardTitle>
                    </div>
                    <CardDescription className="text-sm">Upload your brand logo for content generation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e.target.files[0])}
                        className="hidden"
                        id={`logo-${activeTab}`}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById(`logo-${activeTab}`).click()}
                        className="w-full justify-center gap-2 h-20 sm:h-24 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-sm sm:text-base"
                      >
                        <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Choose Logo File</span>
                        <span className="sm:hidden">Choose Logo</span>
                      </Button>
                      {currentFormData.logo && (
                        <div className="relative rounded-lg border-2 border-primary/20 bg-muted/30 p-3 sm:p-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <img
                              src={currentFormData.logo || "/placeholder.svg"}
                              alt="Logo preview"
                              className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border-2 border-border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="truncate">Logo uploaded successfully</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Ready to use in content</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* CSV Upload Card */}
                <Card className="border-2 shadow-none">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <CardTitle className="text-base sm:text-lg">Data Import</CardTitle>
                    </div>
                    <CardDescription className="text-sm">Import keywords and links from CSV file</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleCsvUpload(e.target.files[0])}
                        className="hidden"
                        id={`csv-${activeTab}`}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById(`csv-${activeTab}`).click()}
                        className="w-full justify-center gap-2 h-20 sm:h-24 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-sm sm:text-base"
                      >
                        <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Choose CSV File</span>
                        <span className="sm:hidden">Choose CSV</span>
                      </Button>
                      {currentFormData.csvFile && (
                        <Alert className="border-2 border-green-500/20 bg-green-500/5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <AlertDescription className="text-sm font-medium">
                            <span className="text-foreground truncate block">{currentFormData.csvFile.name}</span>
                            <p className="text-xs text-muted-foreground mt-1">File ready for processing</p>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Keywords Section */}
              <Card className="border-2 shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg sm:text-xl">Keyword Management</CardTitle>
                      <CardDescription className="text-sm">
                        Add and manage your target keywords and associated links
                      </CardDescription>
                    </div>
                    <Button onClick={addKeyword} size="sm" className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      <Plus className="h-4 w-4" />
                      Add Keyword
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {currentFormData.keywords.map((keywordItem, index) => (
                      <div
                        key={keywordItem.id}
                        className="group relative rounded-lg border border-border bg-card p-3 sm:p-4 transition-all hover:border-primary/30 hover:shadow-md"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div className="grid flex-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label
                                htmlFor={`keyword-${keywordItem.id}`}
                                className="text-xs font-medium text-muted-foreground"
                              >
                                Keyword
                              </Label>
                              <Input
                                id={`keyword-${keywordItem.id}`}
                                placeholder="Enter target keyword"
                                value={keywordItem.keyword}
                                onChange={(e) => updateKeyword(keywordItem.id, "keyword", e.target.value)}
                                className="border focus:border-primary text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`link-${keywordItem.id}`}
                                className="text-xs font-medium text-muted-foreground"
                              >
                                Target URL
                              </Label>
                              <Input
                                id={`link-${keywordItem.id}`}
                                placeholder="https://example.com"
                                value={keywordItem.link}
                                onChange={(e) => updateKeyword(keywordItem.id, "link", e.target.value)}
                                className="border focus:border-primary text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2 sm:flex-col sm:gap-2 lg:flex-row">
                            <Button onClick={saveKeyword} size="sm" className="flex-1 sm:flex-none gap-1 bg-green-600 hover:bg-green-700 text-xs">
                              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Save</span>
                            </Button>
                            <Button
                              onClick={() => removeKeyword(keywordItem.id)}
                              size="sm"
                              variant="destructive"
                              className="flex-1 sm:flex-none gap-1 text-xs"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4 pt-4">
                <Link to="/projects" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="gap-2 px-6 sm:px-8 bg-transparent w-full">
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                  </Button>
                </Link>
                <Button onClick={handleSave} size="lg" className="gap-2 bg-primary hover:bg-primary/90 px-6 sm:px-8 w-full sm:w-auto">
                  <CheckCircle2 className="h-4 w-4" />
                  Save All Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Services
