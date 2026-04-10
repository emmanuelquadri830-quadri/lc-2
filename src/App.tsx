import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Cpu, 
  Layers, 
  Zap, 
  CheckCircle2, 
  BarChart3, 
  Target, 
  Sparkles,
  ChevronRight,
  Settings,
  LayoutDashboard,
  BookOpen,
  Users,
  History,
  Search,
  Bell,
  Plus
} from 'lucide-react';

// --- Types ---

type GenerationStep = 'idle' | 'analyzing' | 'assembling' | 'ready';

interface SkillGap {
  skill: string;
  level: number;
  gap: number;
  color: string;
}

interface Question {
  id: string;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

// --- Mock Data ---

const SKILL_GAPS: SkillGap[] = [
  { skill: 'System Architecture', level: 65, gap: 25, color: 'bg-blue-500' },
  { skill: 'Distributed Systems', level: 40, gap: 50, color: 'bg-indigo-500' },
  { skill: 'Cloud Security', level: 80, gap: 10, color: 'bg-cyan-500' },
  { skill: 'Performance Tuning', level: 30, gap: 60, color: 'bg-sky-500' },
];

const TOPICS = ['Latency Optimization', 'Data Consistency', 'Fault Tolerance', 'Auto-scaling'];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const SkillCard = ({ skill }: { skill: SkillGap, key?: any }) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-semibold text-slate-700">{skill.skill}</span>
      <span className="text-xs font-medium text-slate-400">Gap: {skill.gap}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${skill.level}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${skill.color}`}
      />
    </div>
  </div>
);

export default function App() {
  const [step, setStep] = useState<GenerationStep>('idle');
  const [progress, setProgress] = useState(0);
  const [assembledQuestions, setAssembledQuestions] = useState<Question[]>([]);

  const startGeneration = () => {
    setStep('analyzing');
    setProgress(0);
    setAssembledQuestions([]);
  };

  useEffect(() => {
    if (step === 'analyzing') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep('assembling');
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(timer);
    }

    if (step === 'assembling') {
      const interval = setInterval(() => {
        if (assembledQuestions.length < 5) {
          const newQ: Question = {
            id: Math.random().toString(36).substr(2, 9),
            type: ['Multiple Choice', 'Code Challenge', 'Scenario'][Math.floor(Math.random() * 3)],
            difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as any,
            topic: TOPICS[assembledQuestions.length % TOPICS.length]
          };
          setAssembledQuestions(prev => [...prev, newQ]);
        } else {
          clearInterval(interval);
          setTimeout(() => setStep('ready'), 800);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [step, assembledQuestions.length]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col gap-8 hidden lg:flex">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight">Aura AI</span>
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={BookOpen} label="Learning Paths" />
          <SidebarItem icon={Target} label="Skill Assessment" />
          <SidebarItem icon={History} label="Test History" />
          <SidebarItem icon={Users} label="Team Insights" />
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <SidebarItem icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Adaptive Intelligence</h1>
            <p className="text-slate-500 text-sm">Dynamic test generation based on your unique profile.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-64"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white shadow-sm"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Skill Gaps */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={20} />
                  <h2 className="font-bold text-slate-800">Skill Analysis</h2>
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:underline">View Details</button>
              </div>
              <div className="space-y-4">
                {SKILL_GAPS.map((skill, i) => (
                  <SkillCard key={i} skill={skill} />
                ))}
              </div>
            </div>

            <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Ready for a challenge?</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Our AI will generate a unique path focusing on your 60% gap in Performance Tuning.
                </p>
                <button 
                  onClick={startGeneration}
                  disabled={step !== 'idle' && step !== 'ready'}
                  className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus size={18} />
                  Generate Dynamic Test
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                <Brain size={120} />
              </div>
            </div>
          </div>

          {/* Right Column: Generation Flow */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="text-indigo-600" size={20} />
                  <h2 className="font-bold text-slate-800">System Engine</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${step === 'idle' ? 'bg-slate-300' : 'bg-green-500 animate-pulse'}`}></span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {step === 'idle' ? 'System Idle' : step === 'ready' ? 'Generation Complete' : 'Processing...'}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {step === 'idle' && (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center max-w-md"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                        <Layers className="text-slate-300" size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Generation</h3>
                      <p className="text-slate-500 text-sm">
                        Start a new assessment to see the AI engine assemble questions in real-time based on your skill gaps.
                      </p>
                    </motion.div>
                  )}

                  {step === 'analyzing' && (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full max-w-lg"
                    >
                      <div className="mb-8 text-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="inline-block mb-4"
                        >
                          <Zap className="text-blue-600" size={48} />
                        </motion.div>
                        <h3 className="text-xl font-bold text-slate-800">Analyzing Skill Gaps</h3>
                        <p className="text-slate-500 text-sm">Cross-referencing interests with identified weaknesses...</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          <span>Neural Mapping</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 'assembling' && (
                    <motion.div 
                      key="assembling"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                          <Layers size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Real-time Question Assembly</h3>
                          <p className="text-slate-500 text-sm">Synthesizing unique adaptive challenges...</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                          {assembledQuestions.map((q, idx) => (
                            <motion.div
                              key={q.id}
                              initial={{ opacity: 0, scale: 0.9, x: -20 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-4"
                            >
                              <div className={`p-2 rounded-lg ${
                                q.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                                q.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                'bg-red-50 text-red-600'
                              }`}>
                                <CheckCircle2 size={16} />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">{q.topic}</div>
                                <div className="text-sm font-semibold text-slate-800">{q.type}</div>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full font-bold text-slate-500 uppercase">{q.difficulty}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {assembledQuestions.length < 5 && (
                            <motion.div 
                              className="p-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center"
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <div className="flex items-center gap-2 text-slate-300">
                                <Plus size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Assembling...</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {step === 'ready' && (
                    <motion.div 
                      key="ready"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center w-full max-w-md"
                    >
                      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <CheckCircle2 className="text-green-500" size={48} />
                        <motion.div 
                          className="absolute inset-0 rounded-full border-4 border-green-500/20"
                          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Test Path Ready</h3>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        We've assembled 12 custom questions focusing on your growth areas. 
                        Estimated time: 18 minutes.
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group">
                          Start Assessment
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => setStep('idle')}
                          className="w-full py-3 bg-white text-slate-500 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors"
                        >
                          Reset Engine
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Stats */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Complexity</div>
                  <div className="text-lg font-bold text-slate-700">Adaptive</div>
                </div>
                <div className="text-center border-x border-slate-200">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Accuracy</div>
                  <div className="text-lg font-bold text-slate-700">98.4%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Confidence</div>
                  <div className="text-lg font-bold text-slate-700">High</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
