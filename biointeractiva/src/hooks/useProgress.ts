"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

interface ModuleProgress {
  module_id: string;
  completed: boolean;
  score: number;
  completed_at: string | null;
}

export function useProgress() {
  const { user } = useUser();
  const [progress, setProgress] = useState<Record<string, ModuleProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress({});
      setLoading(false);
      return;
    }

    async function fetchProgress() {
      if (!user) return;
      
      const userId = user.id;
      
      try {
        const { data, error } = await supabase
          .from("module_progress")
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;

        const progressMap: Record<string, ModuleProgress> = {};
        data?.forEach((p) => {
          progressMap[p.module_id] = {
            module_id: p.module_id,
            completed: p.completed,
            score: p.score,
            completed_at: p.completed_at,
          };
        });

        setProgress(progressMap);
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  const completeModule = async (moduleId: string, score: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("module_progress")
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          completed: true,
          score,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,module_id"
        });

      if (error) throw error;

      setProgress((prev) => ({
        ...prev,
        [moduleId]: {
          module_id: moduleId,
          completed: true,
          score,
          completed_at: new Date().toISOString(),
        },
      }));
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  const totalScore = Object.values(progress).reduce((acc, p) => acc + (p.score || 0), 0);
  const completedModules = Object.values(progress).filter((p) => p.completed).length;

  return {
    progress,
    loading,
    completeModule,
    totalScore,
    completedModules,
  };
}
