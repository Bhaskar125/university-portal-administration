"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Upload,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  Send,
  Eye,
  Trash2
} from "lucide-react"

// Mock data for assignments
interface Submission {
  id: number
  submittedAt: string
  files: string[]
  feedback: string
  grade: number | null
  textSubmission?: string
}

interface Assignment {
  id: number
  title: string
  course: string
  courseId: string
  type: string
  dueDate: string
  dueTime: string
  priority: string
  maxMarks: number
  description: string
  requirements: string[]
  allowedFormats: string[]
  maxFileSize: string
  status: string
  submissions: Submission[]
  attemptLeft: number
}

const getAssignments = (): Assignment[] => {
  return [
    {
      id: 1,
      title: "Final Project Phase 2",
      course: "CS401 - Advanced Computer Science",
      courseId: "1",
      type: "project",
      dueDate: "2024-12-15",
      dueTime: "11:59 PM",
      priority: "high",
      maxMarks: 200,
      description: "Complete the implementation and documentation of your final project. Include source code, documentation, and a presentation.",
      requirements: [
        "Complete source code with comments",
        "Technical documentation (min 10 pages)",
        "User manual and installation guide",
        "PowerPoint presentation (10-15 slides)",
        "Demo video (5-10 minutes)"
      ],
      allowedFormats: [".zip", ".pdf", ".docx", ".pptx", ".mp4"],
      maxFileSize: "50MB",
      status: "pending",
      submissions: [],
      attemptLeft: 3
    },
    {
      id: 2,
      title: "Assignment 4: Machine Learning",
      course: "CS301 - Data Structures & Algorithms",
      courseId: "2",
      type: "assignment", 
      dueDate: "2024-12-08",
      dueTime: "11:59 PM",
      priority: "medium",
      maxMarks: 100,
      description: "Implement basic machine learning algorithms including linear regression, decision trees, and clustering.",
      requirements: [
        "Python implementation of algorithms",
        "Jupyter notebook with analysis",
        "Dataset processing and visualization",
        "Performance comparison report"
      ],
      allowedFormats: [".py", ".ipynb", ".pdf", ".csv"],
      maxFileSize: "25MB",
      status: "pending",
      submissions: [],
      attemptLeft: 2
    },
    {
      id: 3,
      title: "Quiz 3: Final Review",
      course: "CS350 - Database Management",
      courseId: "3",
      type: "quiz",
      dueDate: "2024-12-05",
      dueTime: "2:00 PM",
      priority: "low",
      maxMarks: 50,
      description: "Comprehensive review quiz covering all topics from the semester.",
      requirements: [
        "Complete all 25 multiple choice questions",
        "2 short essay questions",
        "Time limit: 60 minutes"
      ],
      allowedFormats: ["Online Quiz"],
      maxFileSize: "N/A",
      status: "pending",
      submissions: [],
      attemptLeft: 1
    },
    {
      id: 4,
      title: "Database Design Lab",
      course: "CS350 - Database Management", 
      courseId: "3",
      type: "lab",
      dueDate: "2024-11-28",
      dueTime: "11:59 PM",
      priority: "medium",
      maxMarks: 75,
      description: "Design and implement a complete database system for a library management system.",
      requirements: [
        "ER diagram and normalization",
        "SQL schema creation scripts",
        "Sample data insertion",
        "Query implementation for all requirements"
      ],
      allowedFormats: [".sql", ".pdf", ".docx"],
      maxFileSize: "15MB",
      status: "submitted",
      submissions: [
        {
          id: 1,
          submittedAt: "2024-11-27T10:30:00",
          files: ["library_schema.sql", "documentation.pdf"],
          feedback: "Awaiting grading",
          grade: null
        }
      ],
      attemptLeft: 1
    }
  ]
}

export default function AssignmentSubmissionPage() {
  const router = useRouter()
  const [assignments] = useState(getAssignments())
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [submissionText, setSubmissionText] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">("pending")

  const pendingAssignments = assignments.filter(a => a.status === "pending")
  const submittedAssignments = assignments.filter(a => a.status === "submitted")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmission = async () => {
    if (!selectedAssignment) return

    setIsSubmitting(true)
    
    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update assignment status
    selectedAssignment.status = "submitted"
    selectedAssignment.submissions.push({
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      files: selectedFiles.map(f => f.name),
      feedback: "Awaiting grading",
      grade: null,
      textSubmission: submissionText
    })

    setSelectedFiles([])
    setSubmissionText("")
    setSelectedAssignment(null)
    setIsSubmitting(false)
    
    alert("Assignment submitted successfully!")
  }

  const formatDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `${diffDays} days left`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-700 border-red-200"
      case "medium": return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low": return "bg-green-50 text-green-700 border-green-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="hover:scale-105 transition-transform duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
              Assignment Submission
            </h1>
            <p className="text-gray-600 mt-1">Submit your assignments and track your progress</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {pendingAssignments.length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {submittedAssignments.length} Submitted
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`${
              activeTab === "pending"
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200`}
          >
            <Clock className="w-4 h-4" />
            Pending ({pendingAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab("submitted")}
            className={`${
              activeTab === "submitted"
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200`}
          >
            <CheckCircle className="w-4 h-4" />
            Submitted ({submittedAssignments.length})
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignment List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {(activeTab === "pending" ? pendingAssignments : submittedAssignments).map((assignment) => (
              <Card 
                key={assignment.id} 
                className={`border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedAssignment?.id === assignment.id ? 'ring-2 ring-blue-500 border-blue-200' : ''
                }`}
                onClick={() => setSelectedAssignment(assignment)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {assignment.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 mt-1">
                        {assignment.course}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className={getPriorityColor(assignment.priority)}>
                        {assignment.priority}
                      </Badge>
                      {assignment.status === "pending" && (
                        <Badge variant="outline" className="text-xs">
                          {formatDaysLeft(assignment.dueDate)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">{assignment.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()} at {assignment.dueTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{assignment.maxMarks} marks</span>
                      </div>
                    </div>

                    {assignment.status === "submitted" && assignment.submissions.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Submitted</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Submitted on {new Date(assignment.submissions[0].submittedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submission Panel */}
        <div className="space-y-6">
          {selectedAssignment ? (
            <>
              {/* Assignment Details */}
              <Card className="border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Assignment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedAssignment.title}</h4>
                    <p className="text-sm text-gray-600">{selectedAssignment.course}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-700">{selectedAssignment.description}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Requirements:</h5>
                    <ul className="space-y-1">
                      {selectedAssignment.requirements.map((req: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Due Date:</span>
                      <p className="text-gray-600">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Max Marks:</span>
                      <p className="text-gray-600">{selectedAssignment.maxMarks}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">File Formats:</span>
                      <p className="text-gray-600">{selectedAssignment.allowedFormats.join(", ")}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Max Size:</span>
                      <p className="text-gray-600">{selectedAssignment.maxFileSize}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submission Form */}
              {selectedAssignment.status === "pending" && (
                <Card className="border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-emerald-500" />
                      Submit Assignment
                    </CardTitle>
                    <CardDescription>Upload files and add submission notes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Text Submission */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Submission Notes (Optional)
                      </label>
                      <textarea
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        rows={4}
                        placeholder="Add any notes or comments about your submission..."
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Files
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          accept={selectedAssignment.allowedFormats.join(",")}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose Files
                        </Button>
                      </div>
                      
                      {selectedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmission}
                      disabled={isSubmitting || (selectedFiles.length === 0 && !submissionText)}
                      className="w-full gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Assignment
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                      Attempts remaining: {selectedAssignment.attemptLeft}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submission History */}
              {selectedAssignment.submissions.length > 0 && (
                <Card className="border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-purple-500" />
                      Submission History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAssignment.submissions.map((submission: Submission) => (
                        <div key={submission.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Submitted: {new Date(submission.submittedAt).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Files: {submission.files.join(", ")}
                              </p>
                            </div>
                            {submission.grade && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {submission.grade}/{selectedAssignment.maxMarks}
                              </Badge>
                            )}
                          </div>
                          
                          {submission.textSubmission && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                              {submission.textSubmission}
                            </div>
                          )}
                          
                          <div className="mt-2 text-xs text-blue-600">
                            Status: {submission.feedback}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Assignment</h3>
                <p className="text-gray-600">Choose an assignment from the list to view details and submit your work.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 