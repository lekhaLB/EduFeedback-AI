// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BookOpen, Plus, FileQuestion, LogOut } from 'lucide-react';
// import { supabase } from '../lib/supabase';

// export default function Navigation() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isTeacher, setIsTeacher] = React.useState<boolean | null>(null);
//   const [isLoading, setIsLoading] = React.useState(false);

//   React.useEffect(() => {
//     const checkRole = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session) {
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', session.user.id)
//           .single();
        
//         setIsTeacher(profile?.role === 'teacher');
//       }
//     };

//     checkRole();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       setIsLoading(true);
//       await supabase.auth.signOut();
//       navigate('/signin');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <Link to={isTeacher ? "/add-course" : "/history"} className="flex items-center gap-2">
//               <BookOpen className="h-6 w-6 text-blue-600" />
//               <span className="font-bold text-gray-900">EduFeedback AI</span>
//             </Link>
//           </div>
          
//           <div className="flex items-center gap-4">
//             {isTeacher && (
//               // Teacher navigation
//               <>
//                 <Link
//                   to="/add-course"
//                   className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
//                     location.pathname === "/add-course"
//                       ? "text-blue-600"
//                       : "text-gray-700 hover:text-blue-600"
//                   }`}
//                 >
//                   <Plus className="h-4 w-4" />
//                   Add Course
//                 </Link>
//                 <Link
//                   to="/add-question"
//                   className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
//                     location.pathname === "/add-question"
//                       ? "text-blue-600"
//                       : "text-gray-700 hover:text-blue-600"
//                   }`}
//                 >
//                   <FileQuestion className="h-4 w-4" />
//                   Add Question
//                 </Link>
//               </>
//             )}
            
//             {/* Logout button */}
//             <button
//               onClick={handleLogout}
//               disabled={isLoading}
//               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
//             >
//               <LogOut className="h-4 w-4" />
//               {isLoading ? 'Signing out...' : 'Sign out'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

//with just summary added

// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BookOpen, Plus, FileQuestion, LogOut, History, FileText } from 'lucide-react';
// import { supabase } from '../lib/supabase';

// export default function Navigation() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isTeacher, setIsTeacher] = React.useState<boolean | null>(null);
//   const [isLoading, setIsLoading] = React.useState(false);

//   React.useEffect(() => {
//     const checkRole = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session) {
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', session.user.id)
//           .single();
        
//         setIsTeacher(profile?.role === 'teacher');
//       }
//     };

//     checkRole();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       setIsLoading(true);
//       await supabase.auth.signOut();
//       navigate('/signin');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <Link to={isTeacher ? "/add-course" : "/history"} className="flex items-center gap-2">
//               <BookOpen className="h-6 w-6 text-blue-600" />
//               <span className="font-bold text-gray-900">EduFeedback AI</span>
//             </Link>
//           </div>
          
//           <div className="flex items-center gap-4">
//             {isTeacher ? (
//               // Teacher navigation
//               <>
//                 <Link
//                   to="/add-course"
//                   className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
//                     location.pathname === "/add-course"
//                       ? "text-blue-600"
//                       : "text-gray-700 hover:text-blue-600"
//                   }`}
//                 >
//                   <Plus className="h-4 w-4" />
//                   Add Course
//                 </Link>
//                 <Link
//                   to="/add-question"
//                   className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
//                     location.pathname === "/add-question"
//                       ? "text-blue-600"
//                       : "text-gray-700 hover:text-blue-600"
//                   }`}
//                 >
//                   <FileQuestion className="h-4 w-4" />
//                   Add Question
//                 </Link>
//               </>
//             ) : (
//               // Student navigation
//               <>
//                 <Link
//                   to="/history"
//                   className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
//                     location.pathname === "/history"
//                       ? "text-blue-600"
//                       : "text-gray-700 hover:text-blue-600"
//                   }`}
//                 >
//                   <History className="h-4 w-4" />
//                   History
//                 </Link>
//                 <Link
//                   to="/summary"
//                   className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
//                     location.pathname === "/summary"
//                       ? "text-blue-600"
//                       : "text-gray-700 hover:text-blue-600"
//                   }`}
//                 >
//                   <FileText className="h-4 w-4" />
//                   Summary Feedback
//                 </Link>
//               </>
//             )}
            
//             {/* Logout button */}
//             <button
//               onClick={handleLogout}
//               disabled={isLoading}
//               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
//             >
//               <LogOut className="h-4 w-4" />
//               {isLoading ? 'Signing out...' : 'Sign out'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, FileQuestion, LogOut, History, FileText, BarChart } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTeacher, setIsTeacher] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsTeacher(profile?.role === 'teacher');
      }
    };

    checkRole();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={isTeacher ? "/add-course" : "/history"} className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">EduFeedback AI</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isTeacher ? (
              // Teacher navigation
              <>
                <Link
                  to="/add-course"
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                    location.pathname === "/add-course"
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Add Course
                </Link>
                <Link
                  to="/add-question"
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                    location.pathname === "/add-question"
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <FileQuestion className="h-4 w-4" />
                  Add Question
                </Link>
                <Link
                  to="/blooms"
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                    location.pathname === "/blooms"
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <BarChart className="h-4 w-4" />
                  Blooms Analysis
                </Link>
              </>
            ) : (
              // Student navigation
              <>
                <Link
                  to="/history"
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                    location.pathname === "/history"
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <History className="h-4 w-4" />
                  History
                </Link>
                <Link
                  to="/summary"
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                    location.pathname === "/summary"
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Summary Feedback
                </Link>
              </>
            )}
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isLoading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}