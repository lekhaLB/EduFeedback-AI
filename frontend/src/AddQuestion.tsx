// import React, { useState, useCallback } from 'react';
// import { BookOpen, Upload, X, Plus } from 'lucide-react';
// import Navigation from './components/Navigation';

// interface QuestionFormData {
//   year: string;
//   course_code: string;
//   test_number: number;
//   question_number: number;
//   max_score: number;
//   subdivision_number: string;
//   BT_level: number;
// }

// function AddQuestion() {
//   const [formData, setFormData] = useState<QuestionFormData>({
//     year: new Date().getFullYear().toString(),
//     course_code: '',
//     test_number: 1,
//     question_number: 1,
//     max_score: 5,
//     subdivision_number: 'a',
//     BT_level: 1
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [extractedText, setExtractedText] = useState<string | null>(null);

//   const years = [
//     new Date().getFullYear().toString(),
//     (new Date().getFullYear() - 1).toString(),
//     (new Date().getFullYear() - 2).toString()
//   ];
//   const testNumbers = Array.from({ length: 4 }, (_, i) => i + 1);
//   const questionNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
//   const subdivisions = ['a', 'b', 'c', 'd', 'e'];
//   const btLevels = Array.from({ length: 6 }, (_, i) => i + 1);

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith('image/')) {
//       setSelectedFile(file);
//       setError(null);
//     } else {
//       setError('Please upload an image file');
//     }
//   }, []);

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && file.type.startsWith('image/')) {
//       setSelectedFile(file);
//       setError(null);
//     } else {
//       setError('Please upload an image file');
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     setError(null);
//     setExtractedText(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       setError('Please select an image file');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('image', selectedFile);
//       formDataToSend.append('year', formData.year);
//       formDataToSend.append('course_code', formData.course_code);
//       formDataToSend.append('test_number', formData.test_number.toString());
//       formDataToSend.append('question_number', formData.question_number.toString());
//       formDataToSend.append('max_score', formData.max_score.toString());
//       formDataToSend.append('subdivision_number', formData.subdivision_number);
//       formDataToSend.append('BT_level', formData.BT_level.toString());
//       //LATER CHANGE TO GCLOUD RUN ADDR
//       const response = await fetch('http://127.0.0.1:8000//upload_question', {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to upload question');
//       }

//       const data = await response.json();
//       setSuccess('Question uploaded successfully!');
//       setExtractedText(data.question_text);
//       setSelectedFile(null);
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Failed to upload question. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
//     setFormData({
//       ...formData,
//       [e.target.name]: value
//     });
//   };

//   return (
//     <>
//       <Navigation />
//       <div className="min-h-screen bg-gray-50 pt-16">
//         <div className="max-w-2xl mx-auto p-8">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <BookOpen className="h-6 w-6 text-blue-600" />
//                 <h1 className="text-xl font-semibold text-gray-900">Add New Question</h1>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Academic Year
//                     </label>
//                     <select
//                       name="year"
//                       value={formData.year}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       {years.map(year => (
//                         <option key={year} value={year}>{year}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Course Code
//                     </label>
//                     <input
//                       type="text"
//                       name="course_code"
//                       value={formData.course_code}
//                       onChange={handleChange}
//                       placeholder="e.g. CS101"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Test Number
//                     </label>
//                     <select
//                       name="test_number"
//                       value={formData.test_number}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       {testNumbers.map(num => (
//                         <option key={num} value={num}>Test {num}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Question Number
//                     </label>
//                     <select
//                       name="question_number"
//                       value={formData.question_number}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       {questionNumbers.map(num => (
//                         <option key={num} value={num}>Question {num}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Subdivision
//                     </label>
//                     <select
//                       name="subdivision_number"
//                       value={formData.subdivision_number}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       {subdivisions.map(sub => (
//                         <option key={sub} value={sub}>Part {sub}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Max Score
//                     </label>
//                     <input
//                       type="number"
//                       name="max_score"
//                       value={formData.max_score}
//                       onChange={handleChange}
//                       min="1"
//                       max="100"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       BT Level
//                     </label>
//                     <select
//                       name="BT_level"
//                       value={formData.BT_level}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       {btLevels.map(level => (
//                         <option key={level} value={level}>Level {level}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Question Image
//                   </label>
//                   <div
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                     className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 py-10 ${
//                       isDragging
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-300 hover:border-gray-400'
//                     }`}
//                   >
//                     <div className="text-center">
//                       {selectedFile ? (
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-center gap-2">
//                             <Upload className="h-8 w-8 text-gray-500" />
//                             <span className="text-sm text-gray-500">{selectedFile.name}</span>
//                             <button
//                               type="button"
//                               onClick={removeFile}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               <X className="h-5 w-5" />
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="space-y-2">
//                           <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                           <div className="flex text-sm text-gray-600">
//                             <label
//                               htmlFor="file-upload"
//                               className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
//                             >
//                               <span>Upload a file</span>
//                               <input
//                                 id="file-upload"
//                                 name="file-upload"
//                                 type="file"
//                                 accept="image/*"
//                                 className="sr-only"
//                                 onChange={handleFileSelect}
//                               />
//                             </label>
//                             <p className="pl-1">or drag and drop</p>
//                           </div>
//                           <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="bg-red-50 border border-red-200 rounded-md p-4">
//                     <p className="text-sm text-red-600">{error}</p>
//                   </div>
//                 )}

//                 {success && (
//                   <div className="bg-green-50 border border-green-200 rounded-md p-4">
//                     <p className="text-sm text-green-600">{success}</p>
//                   </div>
//                 )}

//                 {extractedText && (
//                   <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
//                     <h3 className="text-sm font-medium text-blue-600 mb-2">Extracted Question Text</h3>
//                     <p className="text-sm text-gray-600 whitespace-pre-line">{extractedText}</p>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isLoading || !selectedFile}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Plus className="h-4 w-4" />
//                   {isLoading ? 'Uploading Question...' : 'Add Question'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AddQuestion;


import React, { useState, useCallback } from 'react';
import { BookOpen, Upload, X, Plus } from 'lucide-react';
import Navigation from './components/Navigation';

interface QuestionFormData {
  year: string;
  course_code: string;
  test_number: number;
  question_number: number;
  max_score: number;
  subdivision_number: string;
  BT_level: number;
  question_type: string; // Added new field
}

function AddQuestion() {
  const [formData, setFormData] = useState<QuestionFormData>({
    year: new Date().getFullYear().toString(),
    course_code: '',
    test_number: 1,
    question_number: 1,
    max_score: 5,
    subdivision_number: 'a',
    BT_level: 1,
    question_type: 'text' // Default value for question type
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  // Removed years array as we're now using a text input
  const testNumbers = Array.from({ length: 4 }, (_, i) => i + 1);
  const questionNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
  const subdivisions = ['a', 'b', 'c', 'd', 'e'];
  const btLevels = Array.from({ length: 6 }, (_, i) => i + 1);
  const questionTypes = ['text', 'image']; // Question type options

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

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setExtractedText(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedFile);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('course_code', formData.course_code);
      formDataToSend.append('test_number', formData.test_number.toString());
      formDataToSend.append('question_number', formData.question_number.toString());
      formDataToSend.append('max_score', formData.max_score.toString());
      formDataToSend.append('subdivision_number', formData.subdivision_number);
      formDataToSend.append('BT_level', formData.BT_level.toString());
      formDataToSend.append('question_type', formData.question_type); // Added new field
      //LATER CHANGE TO GCLOUD RUN ADDR
      const response = await fetch('http://127.0.0.1:8000/upload_question', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to upload question');
      }

      const data = await response.json();
      setSuccess('Question uploaded successfully!');
      setExtractedText(data.question_text);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to upload question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Add New Question</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="e.g. 2025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleChange}
                      placeholder="e.g. CS101"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
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
                      Question Type
                    </label>
                    <select
                      name="question_type"
                      value={formData.question_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {questionTypes.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Score
                    </label>
                    <input
                      type="number"
                      name="max_score"
                      value={formData.max_score}
                      onChange={handleChange}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {subdivisions.map(sub => (
                        <option key={sub} value={sub}>Part {sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BT Level
                    </label>
                    <select
                      name="BT_level"
                      value={formData.BT_level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {btLevels.map(level => (
                        <option key={level} value={level}>Level {level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Image
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

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

                {extractedText && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-600 mb-2">Extracted Question Text</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{extractedText}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !selectedFile}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  {isLoading ? 'Uploading Question...' : 'Add Question'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddQuestion;
