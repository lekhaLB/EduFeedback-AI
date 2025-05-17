import React, { useState, useCallback } from 'react';
import { Send, Upload, X } from 'lucide-react';
import Navigation from './components/Navigation';

interface FormData {
  usn: string;
  year: string;
  course: string;
  test_number: string;
  question_number: string;
  subdivision_number: string;
  score: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    usn: "",
    year: "2024",
    course: "",
    test_number: "1",
    question_number: "1",
    subdivision_number: "a",
    score: ""
  });

  const [feedback, setFeedback] = useState({
    message: "",
    pages: [] as number[]
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const years = ["2024", "2023", "2022", "2021"];
  const testNumbers = Array.from({ length: 4 }, (_, i) => (i + 1).toString());
  const questionNumbers = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  const subdivisions = ['a', 'b', 'c', 'd', 'e'];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please upload an image file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedFile);
      formDataToSend.append('usn', formData.usn);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('course', formData.course);
      formDataToSend.append('test_number', formData.test_number);
      formDataToSend.append('question_number', formData.question_number);
      formDataToSend.append('subdivision_number', formData.subdivision_number);
      formDataToSend.append('score', formData.score || '0');
     //LATER CHANGE TO GCLOUD RUN ADDRESS
      const response = await fetch('http://127.0.0.1:8000//upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to upload answer');
      }

      const data = await response.json();
      setFeedback(data);
      setSelectedFile(null); // Reset file after successful upload
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to upload answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex pt-16">
        {/* Left Side - Form */}
        <div className="w-1/2 p-8 border-r border-gray-200">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  USN
                </label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  placeholder="Enter your USN"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. CS231AI"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Number
                  </label>
                  <select
                    name="test_number"
                    value={formData.test_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {testNumbers.map(num => (
                      <option key={num} value={num}>Test {num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Number
                  </label>
                  <select
                    name="question_number"
                    value={formData.question_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {questionNumbers.map(num => (
                      <option key={num} value={num}>Question {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subdivision
                  </label>
                  <select
                    name="subdivision_number"
                    value={formData.subdivision_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {subdivisions.map(sub => (
                      <option key={sub} value={sub}>Part {sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <input
                    type="number"
                    name="score"
                    value={formData.score}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Answer (Image)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 py-10 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Upload className="h-8 w-8 text-gray-500" />
                          <span className="text-sm text-gray-500">{selectedFile.name}</span>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileSelect}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !selectedFile}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {isLoading ? 'Uploading...' : 'Submit Answer'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Feedback Display */}
        <div className="w-1/2 p-8 bg-white">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-800">Feedback</h2>
              <div className="text-sm text-gray-500">Student View</div>
            </div>

            <div className="space-y-6">
              {feedback.message && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-medium text-amber-600 mb-2">Missing Points</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {feedback.message}
                  </p>
                </div>
              )}

              {feedback.pages.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-medium text-blue-600 mb-2">Textbook References</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {feedback.pages.map((page, index) => (
                      <li key={index}>Page {page}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;