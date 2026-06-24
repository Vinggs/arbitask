"use client";

import { useState } from "react";
import { addTask } from "@/app/actions";

export default function AddTaskForm() {
  const [isOpen, setIsOpen] = useState(false);
  // State untuk form tier
  const [milestones, setMilestones] = useState([
    { description: "", reward: "" },
  ]);

  const addMilestone = () =>
    setMilestones([...milestones, { description: "", reward: "" }]);

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value } as any;
    setMilestones(newMilestones);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = [...milestones];
    newMilestones.splice(index, 1);
    setMilestones(newMilestones);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-primary-container text-on-primary rounded-lg font-label-md hover:bg-opacity-90 transition-colors shadow-sm"
      >
        New Analysis
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-headline-md text-primary mb-4">
              Mulai Task Baru
            </h3>

            <form
              action={(formData) => {
                addTask(formData);
                setIsOpen(false);
                setMilestones([{ description: "", reward: "" }]); // Reset
              }}
              className="flex flex-col gap-3"
            >
              <input
                name="name"
                placeholder="Nama Game/Task (ex: Raid)"
                className="p-2.5 bg-surface-container rounded border border-outline-variant text-on-surface focus:outline-primary"
                required
              />
              <input
                name="platform"
                placeholder="Platform (ex: Android)"
                className="p-2.5 bg-surface-container rounded border border-outline-variant text-on-surface focus:outline-primary"
                required
              />
              <input
                name="offerwall"
                placeholder="Offerwall (ex: RevU)"
                className="p-2.5 bg-surface-container rounded border border-outline-variant text-on-surface focus:outline-primary"
                required
              />

              <div className="flex gap-2">
                <input
                  name="targetValue"
                  type="number"
                  step="0.01"
                  placeholder="Target ($)"
                  className="p-2.5 bg-surface-container rounded border border-outline-variant w-full text-on-surface focus:outline-primary"
                  required
                />
                <input
                  name="deadline"
                  type="date"
                  className="p-2.5 bg-surface-container rounded border border-outline-variant w-full text-on-surface focus:outline-primary"
                  required
                />
              </div>

              {/* Area Milestones */}
              <div className="mt-2 border-t border-outline-variant pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-primary">
                    Target Tiers
                  </span>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="text-xs bg-secondary-container text-on-secondary-container px-2 py-1 rounded"
                  >
                    + Add Tier
                  </button>
                </div>

                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      placeholder="Ex: Level 10"
                      value={m.description}
                      onChange={(e) =>
                        updateMilestone(i, "description", e.target.value)
                      }
                      className="flex-1 p-2 bg-surface-container rounded border border-outline-variant text-sm text-on-surface"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="$"
                      value={m.reward}
                      onChange={(e) =>
                        updateMilestone(i, "reward", e.target.value)
                      }
                      className="w-16 p-2 bg-surface-container rounded border border-outline-variant text-sm text-on-surface"
                      required
                    />
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(i)}
                        className="text-error hover:text-red-400"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <input
                type="hidden"
                name="milestones"
                value={JSON.stringify(milestones)}
              />

              <button
                type="submit"
                className="bg-primary text-on-primary p-2.5 rounded-lg font-label-md hover:bg-primary/90 transition mt-2"
              >
                Track Sekarang
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
