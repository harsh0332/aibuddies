"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientOrbs from "../ui/ambient";
import CornerBorders from "../ui/corner-borders";
import {
  Video,
  CheckSquare,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  ListTodo,
  Database,
  ArrowRight,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { BRAND_CONFIG } from "@/config/content";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
}

interface IntegrationTool {
  name: string;
  icon: any;
}

interface WorkflowData {
  id: string;
  tag: string;
  categoryTitle: string;
  title: string;
  description: string;
  tools: IntegrationTool[];
  steps: WorkflowStep[];
  resultTitle: string;
  resultDescription: string;
  metricsBadge: string;
}

const WORKFLOWS: WorkflowData[] = [
  {
    id: "meetings",
    tag: "MEETINGS & CALLS",
    categoryTitle: "AUTOMATIC MEETING FOLLOW-UPS & ACTION DISPATCHER",
    title: "Automatic Meeting Follow-Ups with Owners & Deadlines",
    description: "Transform raw voice conversations into structured tasks, assigned ownership, and polished email recaps automatically.",
    tools: [
      { name: "Fireflies", icon: Video },
      { name: "Asana", icon: CheckSquare },
      { name: "Gmail", icon: Mail },
      { name: "Slack", icon: MessageSquare },
      { name: "Notion", icon: FileText },
    ],
    steps: [
      {
        id: 1,
        title: "Auto-Capture Transcript & Summary",
        description: "Captures meeting audio, multi-speaker transcript, and key discussion highlights silently in real-time."
      },
      {
        id: 2,
        title: "Extract Action Items & Open Decisions",
        description: "Extracts key decisions, explicit client commitments, and open questions using LLM reasoning."
      },
      {
        id: 3,
        title: "Assign Owners & Due Dates in Asana",
        description: "Automatically assigns task owners, due dates, and creates linked task cards inside Asana & Notion."
      },
      {
        id: 4,
        title: "Draft Attendees Recap & Next-Steps Email",
        description: "Drafts a concise executive summary email with action items and sends it to all attendees."
      },
      {
        id: 5,
        title: "Post Internal Highlights & Ownership to Slack",
        description: "Dispatches internal highlights and owner summaries directly to designated team Slack channels."
      }
    ],
    resultTitle: "ZERO MANUAL NOTE-TAKING",
    resultDescription: "Meetings produce assigned owners, tracked due dates, and a ready-to-send recap + next steps email automatically.",
    metricsBadge: "100% Task Accuracy"
  },
  {
    id: "dashboard",
    tag: "DAILY OPERATIONS",
    categoryTitle: "CROSS-PLATFORM DAILY OPERATIONS & EXECUTIVE BRIEFING",
    title: "Daily Follow-Up Dashboard Across Email, Chat & Tasks",
    description: "Synthesize communication channels into a unified 8:00 AM prioritized executive briefing sent straight to your chat.",
    tools: [
      { name: "Gmail", icon: Mail },
      { name: "Slack", icon: MessageSquare },
      { name: "Google Calendar", icon: Calendar },
      { name: "Notion", icon: FileText },
      { name: "Todoist", icon: ListTodo },
      { name: "HubSpot", icon: Database },
    ],
    steps: [
      {
        id: 1,
        title: "Scan Email Threads & Pending Commitments",
        description: "Scans active email threads for un-replied client questions, quote requests, and pending commitments."
      },
      {
        id: 2,
        title: "Detect Slack Messages Requiring Next Steps",
        description: "Identifies team Slack messages that imply an owed response, approval, or immediate decision."
      },
      {
        id: 3,
        title: "Cross-Check Daily Calendar & Meeting Prep",
        description: "Cross-checks today's calendar for high-priority meetings needing pre-work or pre-meeting briefing notes."
      },
      {
        id: 4,
        title: "Reconcile Due/Overdue Tasks & Blockers",
        description: "Reconciles tasks due or overdue across platforms and flags bottlenecked deliverables blocking progress."
      },
      {
        id: 5,
        title: "Generate 'Today' Executive Briefing to Slack",
        description: "Generates a prioritized daily morning brief sent straight to Slack (or Notion) with 1-click action items."
      }
    ],
    resultTitle: "OPERATIONAL AUTOPILOT",
    resultDescription: "A prioritized daily list of outstanding replies, overdue items, and meeting prep sent straight to your team chat.",
    metricsBadge: "Saved 2.5 hrs/day"
  }
];

export default function Integrations() {
  const [activeTab, setActiveTab] = useState<string>("meetings");
  const [activeStepMap, setActiveStepMap] = useState<Record<string, number>>({
    meetings: 1,
    dashboard: 1,
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const activeWorkflow = WORKFLOWS.find((w) => w.id === activeTab) || WORKFLOWS[0];
  const currentStep = activeStepMap[activeTab] || 1;

  // Auto-play timer cycling through steps 1 to 5
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStepMap((prev) => {
        const nextStep = prev[activeTab] >= 5 ? 1 : prev[activeTab] + 1;
        return { ...prev, [activeTab]: nextStep };
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying, activeTab]);

  const handleStepClick = (stepId: number) => {
    setIsPlaying(false);
    setActiveStepMap((prev) => ({ ...prev, [activeTab]: stepId }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="integrations"
      className="relative py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-surface-base w-full overflow-hidden"
    >
      <AmbientOrbs />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-12"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-widest text-signature uppercase">
                04 / AUTOMATED WORKFLOWS & INTEGRATIONS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-signature/10 border border-signature/30 text-signature">
                <span className="w-1.5 h-1.5 rounded-full bg-signature animate-pulse" />
                LIVE PROCESS ANIMATION
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-light text-text-primary tracking-tight leading-[1.15]">
              Autonomous Workflows That Run Your Operations
            </h2>

            <p className="text-text-tertiary text-base md:text-lg max-w-2xl font-normal leading-relaxed">
              See how AI Buddies connects your existing stack—Gmail, Slack, Asana, Notion & Calendar—into self-executing, zero-friction automated pipelines.
            </p>
          </motion.div>

          {/* Workflow Selector Tabs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 border-b border-border-custom/40 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              {WORKFLOWS.map((wf) => {
                const isActive = activeTab === wf.id;
                return (
                  <button
                    key={wf.id}
                    onClick={() => {
                      setActiveTab(wf.id);
                      setIsPlaying(true);
                    }}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2.5 ${
                      isActive
                        ? "bg-signature/15 text-white border border-signature/40 shadow-[0_0_20px_rgba(43,160,220,0.25)]"
                        : "bg-surface-raised/60 text-text-tertiary border border-border-custom/30 hover:text-white hover:border-border-custom/60"
                    }`}
                  >
                    <Zap className={`w-4 h-4 ${isActive ? "text-signature" : "text-text-tertiary"}`} />
                    <span>{wf.tag}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute inset-0 rounded-xl border border-signature/60 pointer-events-none"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-surface-raised border border-border-custom/50 text-text-tertiary hover:text-white transition-colors"
                title={isPlaying ? "Pause process animation" : "Play process animation"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-signature animate-pulse" />
                    <span>PAUSE SIMULATION</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-signature" />
                    <span>AUTO PLAY</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveStepMap((prev) => ({ ...prev, [activeTab]: 1 }));
                  setIsPlaying(true);
                }}
                className="p-1.5 rounded-lg bg-surface-raised border border-border-custom/50 text-text-tertiary hover:text-white transition-colors"
                title="Reset step execution"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Workflow Interactive Cards Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorkflow.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Infrastructure & Tool Ecosystem */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="glass-panel p-6 md:p-8 rounded-2xl border border-border-custom/50 bg-surface-raised/40 relative overflow-hidden flex flex-col gap-6">
                  <CornerBorders />
                  
                  {/* Category Badge & Title */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-mono tracking-widest text-signature font-semibold uppercase">
                      {activeWorkflow.tag}
                    </span>
                    <h3 className="text-xl md:text-2xl font-medium text-white leading-snug">
                      {activeWorkflow.title}
                    </h3>
                    <p className="text-xs md:text-sm text-text-tertiary leading-relaxed mt-1">
                      {activeWorkflow.description}
                    </p>
                  </div>

                  {/* Connected Infrastructure Tool Pills */}
                  <div className="flex flex-col gap-3 pt-2">
                    <span className="text-xs font-mono tracking-widest text-text-tertiary uppercase flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-signature" />
                      INFRASTRUCTURE
                    </span>

                    <div className="flex flex-wrap gap-2.5">
                      {activeWorkflow.tools.map((tool, idx) => {
                        const Icon = tool.icon as any;
                        return (
                          <motion.div
                            key={tool.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.08 }}
                            className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-base/80 border border-border-custom/60 hover:border-signature/50 hover:bg-signature/10 transition-all duration-300 shadow-sm"
                          >
                            <Icon className="w-4 h-4 text-signature group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-text-secondary group-hover:text-white">
                              {tool.name}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Execution Status Card */}
                  <div className="mt-2 p-4 rounded-xl bg-signature/5 border border-signature/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-signature/20 text-signature">
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-white font-medium">
                          STEP {currentStep} OF 5 ACTIVE
                        </span>
                        <span className="text-[11px] font-mono text-signature">
                          {isPlaying ? "Automated Pipeline Executing..." : "Simulation Paused (Click steps)"}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-signature/20 text-signature border border-signature/30">
                      {activeWorkflow.metricsBadge}
                    </span>
                  </div>
                </div>

                {/* Final Result Card */}
                <div className="glass-panel p-6 rounded-2xl border border-signature/40 bg-gradient-to-br from-signature/10 via-surface-raised to-surface-base relative overflow-hidden flex flex-col gap-3 shadow-[0_0_30px_rgba(43,160,220,0.15)]">
                  <div className="flex items-center gap-2 text-xs font-mono text-signature font-semibold tracking-wider uppercase">
                    <CheckCircle2 className="w-4 h-4 text-signature" />
                    <span>RESULT</span>
                  </div>

                  <h4 className="text-sm md:text-base font-semibold text-white tracking-wide">
                    {activeWorkflow.resultTitle}
                  </h4>

                  <p className="text-xs md:text-sm text-text-tertiary leading-relaxed">
                    {activeWorkflow.resultDescription}
                  </p>

                  <a
                    href="https://cal.com/ai-buddies/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-signature hover:text-signature-bright group transition-colors"
                  >
                    <span>Deploy this workflow for your team</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Column: Animated Step-by-Step Execution Pipeline */}
              <div className="lg:col-span-7 glass-panel p-6 md:p-8 rounded-2xl border border-border-custom/50 bg-surface-raised/40 relative overflow-hidden">
                <CornerBorders />

                <div className="flex items-center justify-between border-b border-border-custom/30 pb-4 mb-6">
                  <span className="text-xs font-mono tracking-widest text-text-tertiary uppercase flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-signature" />
                    WORKFLOW EXECUTION
                  </span>

                  <div className="flex items-center gap-1.5">
                    {activeWorkflow.steps.map((s) => (
                      <span
                        key={s.id}
                        onClick={() => handleStepClick(s.id)}
                        className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                          currentStep === s.id
                            ? "w-6 bg-signature shadow-[0_0_10px_rgba(43,160,220,0.8)]"
                            : currentStep > s.id
                            ? "w-2 bg-signature/60"
                            : "w-2 bg-border-custom/60"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Vertical Step Nodes with Animated Energy Progress Line */}
                <div className="relative flex flex-col gap-5 pl-2">
                  {/* Energy Line track background */}
                  <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-border-custom/40" />
                  
                  {/* Animated Active Progress Fill Line */}
                  <motion.div
                    className="absolute left-[27px] top-6 w-[2px] bg-gradient-to-b from-signature via-signature-bright to-signature shadow-[0_0_12px_rgba(43,160,220,0.9)]"
                    animate={{
                      height: `${((currentStep - 1) / 4) * 82 + 5}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />

                  {activeWorkflow.steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isPassed = currentStep > step.id;

                    return (
                      <motion.div
                        key={step.id}
                        onClick={() => handleStepClick(step.id)}
                        whileHover={{ x: 4 }}
                        className={`group relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          isActive
                            ? "bg-signature/10 border border-signature/40 shadow-[0_0_25px_rgba(43,160,220,0.15)]"
                            : isPassed
                            ? "bg-surface-base/40 border border-border-custom/30 opacity-80"
                            : "bg-surface-base/20 border border-border-custom/20 hover:border-border-custom/50 opacity-60"
                        }`}
                      >
                        {/* Step Number Circle Node */}
                        <div
                          className={`relative z-10 flex items-center justify-center shrink-0 w-10 h-10 rounded-full font-mono text-xs font-bold transition-all duration-300 ${
                            isActive
                              ? "bg-signature text-black shadow-[0_0_20px_rgba(43,160,220,0.9)] scale-110"
                              : isPassed
                              ? "bg-signature/20 text-signature border border-signature/40"
                              : "bg-surface-raised text-text-tertiary border border-border-custom/50"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-5 h-5 text-signature" /> : step.id}
                        </div>

                        {/* Step Content */}
                        <div className="flex flex-col gap-1 pt-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-sm md:text-base font-medium transition-colors ${
                                isActive ? "text-white font-semibold" : "text-text-secondary group-hover:text-white"
                              }`}
                            >
                              {step.title}
                            </h4>

                            {isActive && (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-signature font-medium px-2 py-0.5 rounded-full bg-signature/15 border border-signature/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-signature animate-ping" />
                                PROCESSING
                              </span>
                            )}
                          </div>

                          <p className="text-xs md:text-sm text-text-tertiary leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Callout Banner */}
          <motion.div
            variants={itemVariants}
            className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-surface-raised via-signature/10 to-surface-raised border border-border-custom/50 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex flex-col gap-1 text-center md:text-left">
              <h4 className="text-lg md:text-xl font-medium text-white">
                Need a custom workflow for your specific tech stack?
              </h4>
              <p className="text-xs md:text-sm text-text-tertiary">
                We build custom API bridges, internal database syncs, WhatsApp pipelines, and voice agents.
              </p>
            </div>

            <a
              href="https://cal.com/ai-buddies/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-signature text-black font-semibold text-sm hover:bg-signature-bright transition-all shadow-[0_0_25px_rgba(43,160,220,0.4)] hover:shadow-[0_0_35px_rgba(43,160,220,0.6)] whitespace-nowrap flex items-center gap-2"
            >
              <span>Book Workflow Audit</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
