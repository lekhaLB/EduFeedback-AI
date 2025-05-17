// import React, { useState } from "react";
// import Navigation from "./components/Navigation";

// interface SummaryData {
//   combined_feedback_summary: string;
//   textbook_references: string[];
// }

// function SummaryFeedback() {
//   const [usn, setUsn] = useState("");
//   const [courseCode, setCourseCode] = useState("");
//   const [testNumber, setTestNumber] = useState("");
//   const [summary, setSummary] = useState<SummaryData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSummary(null);
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/generate_summary_feedback", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           usn: usn.trim(),
//           course_code: courseCode.trim(),
//           test_number: Number(testNumber),
//         }),
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.detail || "Failed to fetch summary feedback");
//       }

//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (err: any) {
//       setError(err.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navigation />
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
//         <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 mt-8">
//           <h2 className="text-2xl font-bold mb-6 text-blue-700">Summary Feedback</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">USN</label>
//               <input
//                 type="text"
//                 value={usn}
//                 onChange={(e) => setUsn(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter student's USN"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
//               <input
//                 type="text"
//                 value={courseCode}
//                 onChange={(e) => setCourseCode(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Test Number</label>
//               <input
//                 type="number"
//                 value={testNumber}
//                 onChange={(e) => setTestNumber(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//               {loading ? "Fetching..." : "Get Summary"}
//             </button>
//           </form>
//           {error && <div className="text-red-600 mt-4">{error}</div>}
//           {summary && (
//             <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
//               <h3 className="text-xl font-semibold mb-2 text-blue-800">Combined Feedback Summary</h3>
//               <p className="mb-4 whitespace-pre-line">{summary.combined_feedback_summary}</p>
//               <div className="mb-2">
//                 <span className="font-semibold">Textbook References:</span>
//                 <ul className="list-disc ml-6">
//                   {summary.textbook_references &&
//                     summary.textbook_references.map((ref, idx) => (
//                       <li key={idx}>{ref}</li>
//                     ))}
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default SummaryFeedback;

import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import { supabase } from "./lib/supabase";

interface SummaryData {
  combined_feedback_summary: string;
  textbook_references: string[];
}

function SummaryFeedback() {
  const [courseCode, setCourseCode] = useState("");
  const [testNumber, setTestNumber] = useState("");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userUSN, setUserUSN] = useState<string | null>(null);

  useEffect(() => {
    const getUserUSN = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('usn')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.usn) {
          setUserUSN(profile.usn);
        }
      }
    };

    getUserUSN();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUSN) {
      setError("Unable to retrieve your USN. Please try logging in again.");
      return;
    }

    setSummary(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate_summary_feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usn: userUSN,
          course_code: courseCode.trim(),
          test_number: Number(testNumber),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to fetch summary feedback");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Summary Feedback</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Number</label>
              <input
                type="number"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                required
                min="1"
                max="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter test number (1-4)"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !userUSN}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Fetching..." : "Get Summary"}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {summary && (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-800">Combined Feedback Summary</h3>
              <p className="mb-4 whitespace-pre-line">{summary.combined_feedback_summary}</p>
              <div className="mb-2">
                <span className="font-semibold">Textbook References:</span>
                <ul className="list-disc ml-6">
                  {summary.textbook_references &&
                    summary.textbook_references.map((ref, idx) => (
                      <li key={idx}>{ref}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SummaryFeedback;