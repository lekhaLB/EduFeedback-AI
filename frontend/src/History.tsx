

// import React, { useState, useEffect } from 'react';
// import { Send, Upload, X, RefreshCw, Trash2 } from 'lucide-react';
// import Navigation from './components/Navigation';
// import { supabase } from './lib/supabase';

// interface HistoryEntry {
//   year: string;
//   course: string;
//   course_title: string;
//   question_number: number;
//   question_text: string;
//   test_number: number;
//   subdivision_number: string;
//   topic?: string;
//   score?: number;
//   max_score: number;
//   evaluated_score?: number;
//   BT_level: number;
//   feedback?: string;
//   page_numbers?: number[];
//   reference_textbook?: string;
//   text?: string;
//   exists: number;
//   question_type: string;
// }

// interface HistoryResponse {
//   user_history: HistoryEntry[];
// }

// function History() {
//   const [history, setHistory] = useState<HistoryEntry[]>([]);
//   const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionScore, setSubmissionScore] = useState('0');
//   const [isRevaluating, setIsRevaluating] = useState<string | null>(null);
//   const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
//   // Filter state
//   const [courseFilter, setCourseFilter] = useState<string>('');
//   const [yearFilter, setYearFilter] = useState<string>('');
//   const [testNumberFilter, setTestNumberFilter] = useState<string>('');

//   const filteredHistory = history.filter(entry => {
//     const matchesCourse = courseFilter === '' || entry.course === courseFilter;
//     const matchesYear = yearFilter === '' || entry.year === yearFilter;
//     const matchesTestNumber = testNumberFilter === '' || 
//       String(entry.test_number) === testNumberFilter;
    
//     return matchesCourse && matchesYear && matchesTestNumber;
//   });

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   // Effect to handle selected entry when filters change
//   useEffect(() => {
//     // If the currently selected entry is filtered out, select the first visible entry
//     if (filteredHistory.length > 0 && selectedEntry && !filteredHistory.includes(selectedEntry)) {
//       setSelectedEntry(filteredHistory[0]);
//     } else if (filteredHistory.length > 0 && !selectedEntry) {
//       setSelectedEntry(filteredHistory[0]);
//     }
//   }, [filteredHistory, selectedEntry]);

//   const fetchHistory = async () => {
//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         throw new Error('No authenticated session');
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('usn')
//         .eq('id', session.user.id)
//         .single();

//       if (!profile?.usn) {
//         throw new Error('USN not found in profile');
//       }

//       const response = await fetch('http://127.0.0.1:8000/history', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ usn: profile.usn }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch history');
//       }

//       const data: HistoryResponse = await response.json();
//       setHistory(data.user_history);
//       if (data.user_history.length > 0) {
//         setSelectedEntry(data.user_history[0]);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Failed to fetch history. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (entry: HistoryEntry) => {
//     const entryId = `${entry.year}-${entry.course}-${entry.test_number}-${entry.question_number}-${entry.subdivision_number}`;
//     setIsDeleting(entryId);
//     setError(null);

//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         throw new Error('No authenticated session');
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('usn')
//         .eq('id', session.user.id)
//         .single();

//       if (!profile?.usn) {
//         throw new Error('USN not found in profile');
//       }

//       const response = await fetch('http://127.0.0.1:8000/delete_answer', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           usn: profile.usn,
//           year: entry.year,
//           course: entry.course,
//           test_number: entry.test_number,
//           question_number: entry.question_number,
//           subdivision_number: entry.subdivision_number
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete answer');
//       }

//       await fetchHistory();
//       if (selectedEntry === entry) {
//         setSelectedEntry(null);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Failed to delete answer. Please try again.');
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith('image/')) {
//       setSelectedFile(file);
//       setError(null);
//     } else {
//       setError('Please upload an image file');
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && file.type.startsWith('image/')) {
//       setSelectedFile(file);
//       setError(null);
//     } else {
//       setError('Please upload an image file');
//     }
//   };

//   const handleAnswerSubmit = async (entry: HistoryEntry) => {
//     if (!selectedFile) {
//       setError('Please select an image file');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         throw new Error('No authenticated session');
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('usn')
//         .eq('id', session.user.id)
//         .single();

//       if (!profile?.usn) {
//         throw new Error('USN not found in profile');
//       }

//       const formData = new FormData();
//       formData.append('image', selectedFile);
//       formData.append('usn', profile.usn);
//       formData.append('year', entry.year);
//       formData.append('course', entry.course);
//       formData.append('test_number', entry.test_number.toString());
//       formData.append('question_number', entry.question_number.toString());
//       formData.append('question', entry.question_text);
//       formData.append('subdivision_number', entry.subdivision_number);
//       formData.append('score', submissionScore);

//       const response = await fetch('http://127.0.0.1:8000/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to upload answer');
//       }

//       await fetchHistory();
//       setSelectedFile(null);
//       setSubmissionScore('0');
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Failed to upload answer. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRevaluate = async (entry: HistoryEntry) => {
//     const entryId = `${entry.year}-${entry.course}-${entry.test_number}-${entry.question_number}-${entry.subdivision_number}`;
//     setIsRevaluating(entryId);
//     setError(null);

//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         throw new Error('No authenticated session');
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('usn')
//         .eq('id', session.user.id)
//         .single();

//       if (!profile?.usn) {
//         throw new Error('USN not found in profile');
//       }

//       const formData = new FormData();
//       formData.append('usn', profile.usn);
//       formData.append('year', entry.year);
//       formData.append('course', entry.course);
//       formData.append('test_number', entry.test_number.toString());
//       formData.append('question_number', entry.question_number.toString());
//       formData.append('subdivision_number', entry.subdivision_number);
//       //LATER CHANGE TO CLOUD RUN ADDRESS
//       const response = await fetch('http://127.0.0.1:8000/reevaluate', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to reevaluate answer');
//       }

//       const data = await response.json();
      
//       if (data.error) {
//         setError(data.error);
//       } else {
//         await fetchHistory();
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Failed to reevaluate answer. Please try again.');
//     } finally {
//       setIsRevaluating(null);
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     setError(null);
//   };

//   // Helper function to get unique values for filter dropdowns
//   const getUniqueValues = (data: HistoryEntry[], key: keyof HistoryEntry) => {
//     return [...new Set(data.map(item => String(item[key])))].sort();
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Navigation />
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navigation />
//       <div className="min-h-screen bg-gray-50 flex pt-16">
//         {/* Left Side - History List */}
//         <div className="w-1/2 p-8 border-r border-gray-200">
//           <div className="max-w-md mx-auto">
//             {/* Filter Controls */}
//             <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
//               <h3 className="text-sm font-medium text-gray-900 mb-3">Filter Submissions</h3>
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <label htmlFor="courseFilter" className="block text-xs font-medium text-gray-700 mb-1">
//                     Course
//                   </label>
//                   <select
//                     id="courseFilter"
//                     value={courseFilter}
//                     onChange={(e) => setCourseFilter(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">All Courses</option>
//                     {getUniqueValues(history, 'course').map((course) => (
//                       <option key={course} value={course}>
//                         {course}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label htmlFor="yearFilter" className="block text-xs font-medium text-gray-700 mb-1">
//                     Year
//                   </label>
//                   <select
//                     id="yearFilter"
//                     value={yearFilter}
//                     onChange={(e) => setYearFilter(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">All Years</option>
//                     {getUniqueValues(history, 'year').map((year) => (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label htmlFor="testNumberFilter" className="block text-xs font-medium text-gray-700 mb-1">
//                     Test Number
//                   </label>
//                   <select
//                     id="testNumberFilter"
//                     value={testNumberFilter}
//                     onChange={(e) => setTestNumberFilter(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">All Tests</option>
//                     {getUniqueValues(history, 'test_number').map((testNumber) => (
//                       <option key={testNumber} value={testNumber}>
//                         Test {testNumber}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
              
//               {/* Reset Filters Button */}
//               <button
//                 onClick={() => {
//                   setCourseFilter('');
//                   setYearFilter('');
//                   setTestNumberFilter('');
//                 }}
//                 className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
//               >
//                 <RefreshCw className="h-3 w-3" />
//                 Reset Filters
//               </button>
//             </div>

//             {/* Filter results count */}
//             <div className="mb-4 text-sm text-gray-500">
//               Showing {filteredHistory.length} of {history.length} submissions
//             </div>

//             <div className="space-y-4">
//               {filteredHistory.length === 0 ? (
//                 <p className="text-center text-gray-500">
//                   {history.length === 0 ? "No history found" : "No results match your filters"}
//                 </p>
//               ) : (
//                 filteredHistory.map((entry, index) => (
//                   <div key={index} className="flex flex-col bg-white rounded-lg border border-gray-200">
//                     <div 
//                       onClick={() => setSelectedEntry(entry)}
//                       className={`flex-1 p-4 cursor-pointer ${
//                         selectedEntry === entry ? 'bg-blue-50' : 'hover:bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="font-medium text-gray-900">
//                           {entry.course} - Test {entry.test_number}
//                         </h3>
//                         <span className="text-sm text-gray-500">{entry.year}</span>
//                       </div>
//                       <p className="text-sm text-gray-600 mb-1">
//                         <span className="font-medium">Question {entry.question_number}{entry.subdivision_number}</span>
//                       </p>
//                       <p className="text-sm text-gray-600 mb-2 line-clamp-2">
//                         {entry.question_text}
//                       </p>
//                       {entry.exists === 1 ? (
//                         <p className="text-sm text-gray-500">
//                           Score: {entry.score}/{entry.max_score}
//                         </p>
//                       ) : (
//                         <p className="text-sm text-amber-600">Not attempted</p>
//                       )}
//                     </div>
//                     {entry.exists === 1 && (
//                       <div className="px-4 py-2 border-t border-gray-100">
//                         <button
//                           onClick={() => handleDelete(entry)}
//                           disabled={isDeleting === `${entry.year}-${entry.course}-${entry.test_number}-${entry.question_number}-${entry.subdivision_number}`}
//                           className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                           {isDeleting === `${entry.year}-${entry.course}-${entry.test_number}-${entry.question_number}-${entry.subdivision_number}`
//                             ? 'Deleting...'
//                             : 'Delete Answer'
//                           }
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Selected Entry Details */}
//         <div className="w-1/2 p-8 bg-white">
//           <div className="max-w-md mx-auto">
//             {selectedEntry ? (
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between mb-8">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     {selectedEntry.course_title}
//                   </h2>
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <span>BT Level: {selectedEntry.BT_level}</span>
//                     <span>Type: {selectedEntry.question_type}</span>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg border border-gray-200 p-4">
//                   <h3 className="text-sm font-medium text-gray-900 mb-2">Question</h3>
//                   <p className="text-sm text-gray-600 whitespace-pre-line">
//                     {selectedEntry.question_text}
//                   </p>
//                 </div>

//                 {selectedEntry.exists === 1 ? (
//                   <>
//                     <div className="bg-white rounded-lg border border-gray-200 p-4">
//                       <div className="flex justify-between items-center mb-2">
//                         <h3 className="text-sm font-medium text-amber-600">Feedback</h3>
//                         <button
//                           onClick={() => handleRevaluate(selectedEntry)}
//                           disabled={isRevaluating === `${selectedEntry.year}-${selectedEntry.course}-${selectedEntry.test_number}-${selectedEntry.question_number}-${selectedEntry.subdivision_number}`}
//                           className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
//                         >
//                           <RefreshCw className="h-4 w-4" />
//                           {isRevaluating === `${selectedEntry.year}-${selectedEntry.course}-${selectedEntry.test_number}-${selectedEntry.question_number}-${selectedEntry.subdivision_number}` ? 'Reevaluating...' : 'Reevaluate'}
//                         </button>
//                       </div>
//                       <p className="text-sm text-gray-600 whitespace-pre-line">
//                         {selectedEntry.feedback}
//                       </p>
//                     </div>

//                     <div className="bg-white rounded-lg border border-gray-200 p-4">
//                       <h3 className="text-sm font-medium text-blue-600 mb-2">
//                         Textbook References
//                       </h3>
//                       <p className="text-sm text-gray-600 mb-2">
//                         {selectedEntry.reference_textbook}
//                       </p>
//                       <ul className="space-y-1 text-sm text-gray-600">
//                         {selectedEntry.page_numbers?.map((page, index) => (
//                           <li key={index}>Page {page}</li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div className="bg-white rounded-lg border border-gray-200 p-4">
//                       <h3 className="text-sm font-medium text-gray-900 mb-2">Your Answer</h3>
//                       <p className="text-sm text-gray-600 whitespace-pre-line">
//                         {selectedEntry.text}
//                       </p>
//                     </div>

//                     <div className="bg-white rounded-lg border border-gray-200 p-4">
//                       <h3 className="text-sm font-medium text-gray-900 mb-2">Topic</h3>
//                       <p className="text-sm text-gray-600">{selectedEntry.topic}</p>
//                     </div>

//                     <div className="bg-white rounded-lg border border-gray-200 p-4">
//                       <h3 className="text-sm font-medium text-green-600 mb-2">
//                         Performance
//                       </h3>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">
//                           Score: {selectedEntry.score}/{selectedEntry.max_score}
//                         </span>
//                         <span className="text-sm text-gray-600">
//                           Evaluation: {(selectedEntry.evaluated_score! * 100).toFixed(1)}%
//                         </span>
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
//                       <h3 className="text-sm font-medium text-amber-600 mb-2">Not Attempted</h3>
//                       <p className="text-sm text-gray-600">
//                         You haven't submitted an answer for this question yet. Upload your answer below.
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Score (out of {selectedEntry.max_score})
//                       </label>
//                       <input
//                         type="number"
//                         value={submissionScore}
//                         onChange={(e) => setSubmissionScore(e.target.value)}
//                         min="0"
//                         max={selectedEntry.max_score}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Your Answer (Image)
//                       </label>
//                       <div
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop}
//                         className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 py-10 ${
//                           isDragging
//                             ? 'border-blue-500 bg-blue-50'
//                             : 'border-gray-300 hover:border-gray-400'
//                         }`}
//                       >
//                         <div className="text-center">
//                           {selectedFile ? (
//                             <div className="space-y-2">
//                               <div className="flex items-center justify-center gap-2">
//                                 <Upload className="h-8 w-8 text-gray-500" />
//                                 <span className="text-sm text-gray-500">{selectedFile.name}</span>
//                                 <button
//                                   type="button"
//                                   onClick={removeFile}
//                                   className="text-red-500 hover:text-red-700"
//                                 >
//                                   <X className="h-5 w-5" />
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="space-y-2">
//                               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                               <div className="flex text-sm text-gray-600">
//                                 <label
//                                   htmlFor="file-upload"
//                                   className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
//                                 >
//                                   <span>Upload a file</span>
//                                   <input
//                                     id="file-upload"
//                                     name="file-upload"
//                                     type="file"
//                                     accept="image/*"
//                                     className="sr-only"
//                                     onChange={handleFileSelect}
//                                   />
//                                 </label>
//                                 <p className="pl-1">or drag and drop</p>
//                               </div>
//                               <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => handleAnswerSubmit(selectedEntry)}
//                       disabled={isSubmitting || !selectedFile}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <Send className="h-4 w-4" />
//                       {isSubmitting ? 'Submitting...' : 'Submit Answer'}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-500">
//                 Select a submission to view details
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default History;

import React, { useState, useEffect } from 'react';
import { Send, Upload, X, RefreshCw, Trash2 } from 'lucide-react';
import Navigation from './components/Navigation';
import { supabase } from './lib/supabase';

interface HistoryEntry {
  year: string;
  course: string;
  course_title: string;
  question_number: number;
  question_text: string;
  test_number: number;
  subdivision_number: string;
  topic?: string;
  score?: number;
  max_score: number;
  evaluated_score?: number;
  BT_level: number;
  feedback?: string;
  page_numbers?: number[];
  reference_textbook?: string;
  text?: string;
  exists: number;
  question_type: string;
}

interface HistoryResponse {
  user_history: HistoryEntry[];
}

function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionScore, setSubmissionScore] = useState('0');
  const [isRevaluating, setIsRevaluating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [courseFilter, setCourseFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [testNumberFilter, setTestNumberFilter] = useState<string>('');

  const filteredHistory = history.filter(entry => {
    const matchesCourse = courseFilter === '' || entry.course === courseFilter;
    const matchesYear = yearFilter === '' || entry.year === yearFilter;
    const matchesTestNumber = testNumberFilter === '' || 
      String(entry.test_number) === testNumberFilter;
    
    return matchesCourse && matchesYear && matchesTestNumber;
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (filteredHistory.length > 0 && selectedEntry && !filteredHistory.includes(selectedEntry)) {
      setSelectedEntry(filteredHistory[0]);
    } else if (filteredHistory.length > 0 && !selectedEntry) {
      setSelectedEntry(filteredHistory[0]);
    }
  }, [filteredHistory, selectedEntry]);

  const fetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('usn')
        .eq('id', session.user.id)
        .single();

      if (!profile?.usn) {
        throw new Error('USN not found in profile');
      }

      const response = await fetch('http://127.0.0.1:8000/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usn: profile.usn }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data: HistoryResponse = await response.json();
      setHistory(data.user_history);
      if (data.user_history.length > 0) {
        setSelectedEntry(data.user_history[0]);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (entry: HistoryEntry) => {
    const entryId = `${entry.year}-${entry.course}-${entry.test_number}-${entry.question_number}-${entry.subdivision_number}`;
    setIsDeleting(entryId);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('usn')
        .eq('id', session.user.id)
        .single();

      if (!profile?.usn) {
        throw new Error('USN not found in profile');
      }

      const response = await fetch('http://127.0.0.1:8000/delete_answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usn: profile.usn,
          year: entry.year,
          course: entry.course,
          test_number: entry.test_number,
          question_number: entry.question_number,
          subdivision_number: entry.subdivision_number
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete answer');
      }

      await fetchHistory();
      if (selectedEntry === entry) {
        setSelectedEntry(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete answer. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleAnswerSubmit = async (entry: HistoryEntry) => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('usn')
        .eq('id', session.user.id)
        .single();

      if (!profile?.usn) {
        throw new Error('USN not found in profile');
      }

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('usn', profile.usn);
      formData.append('year', entry.year);
      formData.append('course', entry.course);
      formData.append('test_number', entry.test_number.toString());
      formData.append('question_number', entry.question_number.toString());
      formData.append('question', entry.question_text);
      formData.append('subdivision_number', entry.subdivision_number);
      formData.append('score', submissionScore);

      const endpoint = entry.question_type === 'image' ? '/upload_img' : '/upload';
      
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload answer');
      }

      await fetchHistory();
      setSelectedFile(null);
      setSubmissionScore('0');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to upload answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevaluate = async (entry: HistoryEntry) => {
    const entryId = `${entry.year}-${entry.course}-${entry.test_number}-${entry.question_number}-${entry.subdivision_number}`;
    setIsRevaluating(entryId);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('usn')
        .eq('id', session.user.id)
        .single();

      if (!profile?.usn) {
        throw new Error('USN not found in profile');
      }

      const formData = new FormData();
      formData.append('usn', profile.usn);
      formData.append('year', entry.year);
      formData.append('course', entry.course);
      formData.append('test_number', entry.test_number.toString());
      formData.append('question_number', entry.question_number.toString());
      formData.append('subdivision_number', entry.subdivision_number);
      const response = await fetch('http://127.0.0.1:8000/reevaluate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to reevaluate answer');
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        await fetchHistory();
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to reevaluate answer. Please try again.');
    } finally {
      setIsRevaluating(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const getUniqueValues = (data: HistoryEntry[], key: keyof HistoryEntry) => {
    return [...new Set(data.map(item => String(item[key])))].sort();
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex pt-16">
        <div className="w-1/2 p-8 border-r border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Filter Submissions</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="courseFilter" className="block text-xs font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    id="courseFilter"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Courses</option>
                    {getUniqueValues(history, 'course').map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="yearFilter" className="block text-xs font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    id="yearFilter"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Years</option>
                    {getUniqueValues(history, 'year').map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="testNumberFilter" className="block text-xs font-medium text-gray-700 mb-1">
                    Test Number
                  </label>
                  <select
                    id="testNumberFilter"
                    value={testNumberFilter}
                    onChange={(e) => setTestNumberFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Tests</option>
                    {getUniqueValues(history, 'test_number').map((testNumber) => (
                      <option key={testNumber} value={testNumber}>
                        Test {testNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setCourseFilter('');
                  setYearFilter('');
                  setTestNumberFilter('');
                }}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Reset Filters
              </button>
            </div>

            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredHistory.length} of {history.length} submissions
            </div>

            <div className="space-y-4">
              {filteredHistory.length === 0 ? (
                <p className="text-center text-gray-500">
                  {history.length === 0 ? "No history found" : "No results match your filters"}
                </p>
              ) : (
                filteredHistory.map((entry, index) => (
                  <div key={index} className="flex flex-col bg-white rounded-lg border border-gray-200">
                    <div 
                      onClick={() => setSelectedEntry(entry)}
                      className={`flex-1 p-4 cursor-pointer ${
                        selectedEntry === entry ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">
                          {entry.course} - Test {entry.test_number}
                        </h3>
                        <span className="text-sm text-gray-500">{entry.year}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Question {entry.question_number}{entry.subdivision_number}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {entry.question_text}
                      </p>
                      {entry.exists === 1 ? (
                        <p className="text-sm text-gray-500">
                          Score: {entry.score}/{entry.max_score}
                        </p>
                      ) : (
                        <p className="text-sm text-amber-600">Not attempted</p>
                      )}
                    </div>
                    {entry.exists === 1 && (
                      <div className="px-4 py-2 border-t border-gray-100">
                        <button
                          onClick={() => handleDelete(entry)}
                          disabled={isDeleting === `${entry.year}-${entry.course}-${entry.test_number}-${entry.question_number}-${entry.subdivision_number}`}
                          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          {isDeleting === `${entry.year}-${entry.course}-${entry.test_number}-${entry.question_number}-${entry.subdivision_number}`
                            ? 'Deleting...'
                            : 'Delete Answer'
                          }
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-1/2 p-8 bg-white">
          <div className="max-w-md mx-auto">
            {selectedEntry ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedEntry.course_title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>BT Level: {selectedEntry.BT_level}</span>
                    <span>Type: {selectedEntry.question_type}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Question</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {selectedEntry.question_text}
                  </p>
                </div>

                {selectedEntry.exists === 1 ? (
                  <>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-amber-600">Feedback</h3>
                        <button
                          onClick={() => handleRevaluate(selectedEntry)}
                          disabled={isRevaluating === `${selectedEntry.year}-${selectedEntry.course}-${selectedEntry.test_number}-${selectedEntry.question_number}-${selectedEntry.subdivision_number}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {isRevaluating === `${selectedEntry.year}-${selectedEntry.course}-${selectedEntry.test_number}-${selectedEntry.question_number}-${selectedEntry.subdivision_number}` ? 'Reevaluating...' : 'Reevaluate'}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {selectedEntry.feedback}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-sm font-medium text-blue-600 mb-2">
                        Textbook References
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedEntry.reference_textbook}
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {selectedEntry.page_numbers?.map((page, index) => (
                          <li key={index}>Page {page}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Your Answer</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {selectedEntry.text}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Topic</h3>
                      <p className="text-sm text-gray-600">{selectedEntry.topic}</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-sm font-medium text-green-600 mb-2">
                        Performance
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Score: {selectedEntry.score}/{selectedEntry.max_score}
                        </span>
                        <span className="text-sm text-gray-600">
                          Evaluation: {(selectedEntry.evaluated_score! * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                      <h3 className="text-sm font-medium text-amber-600 mb-2">Not Attempted</h3>
                      <p className="text-sm text-gray-600">
                        You haven't submitted an answer for this question yet. Upload your answer below.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Score (out of {selectedEntry.max_score})
                      </label>
                      <input
                        type="number"
                        value={submissionScore}
                        onChange={(e) => setSubmissionScore(e.target.value)}
                        min="0"
                        max={selectedEntry.max_score}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
                        required
                      />
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
                    </div>

                    <button
                      onClick={() => handleAnswerSubmit(selectedEntry)}
                      disabled={isSubmitting || !selectedFile}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a submission to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default History;
