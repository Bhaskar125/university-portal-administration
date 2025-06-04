"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Settings,
  Save,
  AlertCircle,
  CheckCircle,
  Shield,
  Bell,
  Globe,
  Server,
  RefreshCw
} from "lucide-react"

export default function SystemSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  const [generalSettings, setGeneralSettings] = useState({
    institutionName: "University Portal",
    institutionCode: "UP2024",
    academicYear: "2024-2025",
    defaultLanguage: "English",
    timezone: "UTC-5",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    emailDomain: "@university.edu"
  })

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: "8",
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    sessionTimeout: "30",
    twoFactorAuth: false,
    loginAttempts: "5",
    accountLockDuration: "15"
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    enrollmentNotifications: true,
    gradeNotifications: true,
    systemMaintenanceNotifications: true,
    marketingEmails: false,
    weeklyReports: true
  })

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: "daily",
    logRetention: "30",
    maxFileUploadSize: "10",
    allowedFileTypes: "pdf,doc,docx,jpg,png",
    apiRateLimit: "1000"
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    googleAuth: false,
    microsoftAuth: false,
    ldapAuth: false,
    paymentGateway: "stripe",
    emailProvider: "sendgrid",
    smsProvider: "twilio",
    cloudStorage: "aws",
    analyticsEnabled: true
  })

  const handleGeneralChange = (field: string, value: string | boolean) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSystemChange = (field: string, value: string | boolean) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleIntegrationChange = (field: string, value: string | boolean) => {
    setIntegrationSettings(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSaveSettings = async (category: string) => {
    setIsLoading(true)
    setError("")
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log(`Saving ${category} settings:`)
      if (category === "general") console.log(generalSettings)
      if (category === "security") console.log(securitySettings)
      if (category === "notifications") console.log(notificationSettings)
      if (category === "system") console.log(systemSettings)
      if (category === "integration") console.log(integrationSettings)
      
      setSuccess(`${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully!`)
      
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError(`Failed to save ${category} settings. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async (service: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(`${service} connection test successful!`)
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError(`${service} connection test failed.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Configure system-wide settings and preferences.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Save className="w-4 h-4" />
            Save All
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top duration-300">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top duration-300">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              General Settings
            </CardTitle>
            <CardDescription>Basic institution and system configuration</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Institution Name</Label>
              <Input
                value={generalSettings.institutionName}
                onChange={(e) => handleGeneralChange("institutionName", e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Institution Code</Label>
                <Input
                  value={generalSettings.institutionCode}
                  onChange={(e) => handleGeneralChange("institutionCode", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Academic Year</Label>
                <Input
                  value={generalSettings.academicYear}
                  onChange={(e) => handleGeneralChange("academicYear", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Default Language</Label>
                <Select value={generalSettings.defaultLanguage} onValueChange={(value) => handleGeneralChange("defaultLanguage", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Timezone</Label>
                <Select value={generalSettings.timezone} onValueChange={(value) => handleGeneralChange("timezone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                    <SelectItem value="UTC-6">UTC-6 (CST)</SelectItem>
                    <SelectItem value="UTC-7">UTC-7 (MST)</SelectItem>
                    <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Currency</Label>
                <Select value={generalSettings.currency} onValueChange={(value) => handleGeneralChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Date Format</Label>
                <Select value={generalSettings.dateFormat} onValueChange={(value) => handleGeneralChange("dateFormat", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Email Domain</Label>
              <Input
                value={generalSettings.emailDomain}
                onChange={(e) => handleGeneralChange("emailDomain", e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <Button 
              onClick={() => handleSaveSettings("general")} 
              disabled={isLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : "Save General Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Security Settings
            </CardTitle>
            <CardDescription>Authentication and security configuration</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Min Password Length</Label>
                <Input
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => handleSecurityChange("passwordMinLength", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Session Timeout (min)</Label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Password Requirements</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={securitySettings.passwordRequireSpecial}
                    onCheckedChange={(checked) => handleSecurityChange("passwordRequireSpecial", !!checked)}
                  />
                  <Label className="text-sm">Require special characters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={securitySettings.passwordRequireNumbers}
                    onCheckedChange={(checked) => handleSecurityChange("passwordRequireNumbers", !!checked)}
                  />
                  <Label className="text-sm">Require numbers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={securitySettings.passwordRequireUppercase}
                    onCheckedChange={(checked) => handleSecurityChange("passwordRequireUppercase", !!checked)}
                  />
                  <Label className="text-sm">Require uppercase letters</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
              />
              <Label className="text-sm">Enable Two-Factor Authentication</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Max Login Attempts</Label>
                <Input
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => handleSecurityChange("loginAttempts", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Lock Duration (min)</Label>
                <Input
                  type="number"
                  value={securitySettings.accountLockDuration}
                  onChange={(e) => handleSecurityChange("accountLockDuration", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <Button 
              onClick={() => handleSaveSettings("security")} 
              disabled={isLoading}
              className="w-full mt-4 bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Saving..." : "Save Security Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-green-600" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Communication Channels</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", !!checked)}
                  />
                  <Label className="text-sm">Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("smsNotifications", !!checked)}
                  />
                  <Label className="text-sm">SMS Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("pushNotifications", !!checked)}
                  />
                  <Label className="text-sm">Push Notifications</Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Notification Types</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={notificationSettings.enrollmentNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("enrollmentNotifications", !!checked)}
                  />
                  <Label className="text-sm">Enrollment Updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={notificationSettings.gradeNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("gradeNotifications", !!checked)}
                  />
                  <Label className="text-sm">Grade Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={notificationSettings.systemMaintenanceNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("systemMaintenanceNotifications", !!checked)}
                  />
                  <Label className="text-sm">System Maintenance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationChange("weeklyReports", !!checked)}
                  />
                  <Label className="text-sm">Weekly Reports</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={notificationSettings.marketingEmails}
                onCheckedChange={(checked) => handleNotificationChange("marketingEmails", !!checked)}
              />
              <Label className="text-sm">Marketing Communications</Label>
            </div>

            <Button 
              onClick={() => handleSaveSettings("notifications")} 
              disabled={isLoading}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Saving..." : "Save Notification Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600" />
              System Configuration
            </CardTitle>
            <CardDescription>Technical system settings and performance</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">System Modes</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleSystemChange("maintenanceMode", checked)}
                  />
                  <Label className="text-sm">Maintenance Mode</Label>
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={systemSettings.debugMode}
                    onCheckedChange={(checked) => handleSystemChange("debugMode", checked)}
                  />
                  <Label className="text-sm">Debug Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={systemSettings.cacheEnabled}
                    onCheckedChange={(checked) => handleSystemChange("cacheEnabled", checked)}
                  />
                  <Label className="text-sm">Enable Caching</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Backup Frequency</Label>
                <Select value={systemSettings.backupFrequency} onValueChange={(value) => handleSystemChange("backupFrequency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Log Retention (days)</Label>
                <Input
                  type="number"
                  value={systemSettings.logRetention}
                  onChange={(e) => handleSystemChange("logRetention", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Max Upload Size (MB)</Label>
                <Input
                  type="number"
                  value={systemSettings.maxFileUploadSize}
                  onChange={(e) => handleSystemChange("maxFileUploadSize", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">API Rate Limit/hour</Label>
                <Input
                  type="number"
                  value={systemSettings.apiRateLimit}
                  onChange={(e) => handleSystemChange("apiRateLimit", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Allowed File Types</Label>
              <Input
                value={systemSettings.allowedFileTypes}
                onChange={(e) => handleSystemChange("allowedFileTypes", e.target.value)}
                placeholder="pdf,doc,docx,jpg,png"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <p className="text-xs text-gray-500">Comma-separated file extensions</p>
            </div>

            <Button 
              onClick={() => handleSaveSettings("system")} 
              disabled={isLoading}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Saving..." : "Save System Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Integration Settings - Full Width */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-600" />
            Integration Settings
          </CardTitle>
          <CardDescription>Third-party services and API integrations</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Authentication</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={integrationSettings.googleAuth}
                    onCheckedChange={(checked) => handleIntegrationChange("googleAuth", checked)}
                  />
                  <Label className="text-sm">Google OAuth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={integrationSettings.microsoftAuth}
                    onCheckedChange={(checked) => handleIntegrationChange("microsoftAuth", checked)}
                  />
                  <Label className="text-sm">Microsoft OAuth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={integrationSettings.ldapAuth}
                    onCheckedChange={(checked) => handleIntegrationChange("ldapAuth", checked)}
                  />
                  <Label className="text-sm">LDAP/Active Directory</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Payment & Communication</h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Payment Gateway</Label>
                  <Select value={integrationSettings.paymentGateway} onValueChange={(value) => handleIntegrationChange("paymentGateway", value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Email Provider</Label>
                  <Select value={integrationSettings.emailProvider} onValueChange={(value) => handleIntegrationChange("emailProvider", value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">SMS Provider</Label>
                  <Select value={integrationSettings.smsProvider} onValueChange={(value) => handleIntegrationChange("smsProvider", value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="vonage">Vonage</SelectItem>
                      <SelectItem value="plivo">Plivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Storage & Analytics</h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Cloud Storage</Label>
                  <Select value={integrationSettings.cloudStorage} onValueChange={(value) => handleIntegrationChange("cloudStorage", value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws">Amazon S3</SelectItem>
                      <SelectItem value="gcp">Google Cloud</SelectItem>
                      <SelectItem value="azure">Azure Blob</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={integrationSettings.analyticsEnabled}
                    onCheckedChange={(checked) => handleIntegrationChange("analyticsEnabled", checked)}
                  />
                  <Label className="text-xs">Google Analytics</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Connection Tests</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleTestConnection("Database")}
                  className="w-full text-xs"
                >
                  Test Database
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleTestConnection("Email")}
                  className="w-full text-xs"
                >
                  Test Email Service
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleTestConnection("Storage")}
                  className="w-full text-xs"
                >
                  Test Cloud Storage
                </Button>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => handleSaveSettings("integration")} 
            disabled={isLoading}
            className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? "Saving..." : "Save Integration Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 