import { create } from "zustand";
import { supabase, Database } from "@/lib/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  highlighted_sections?: {
    id: "myStory" | "myMotivations";
    title: string;
    content: string;
  }[];
};
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type ContactInfo = Database["public"]["Tables"]["contact_info"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];

interface PortfolioStore {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  contactInfo: ContactInfo | null;
  messages: Message[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchSkills: () => Promise<void>;
  fetchContactInfo: () => Promise<void>;
  refreshAll: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<Omit<Profile, 'highlighted_sections'>> & { highlighted_sections?: Profile['highlighted_sections'] }) => Promise<void>;
  updateContactInfo: (data: Partial<ContactInfo>) => Promise<void>;
  addProject: (
    data: Omit<Project, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSkill: (data: Omit<Skill, "id" | "created_at">) => Promise<void>;
  updateSkill: (id: string, data: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  addMessage: (data: Omit<Message, "id" | "created_at">) => Promise<void>;
  fetchMessages: () => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  updateMessageStatus: (id: string, is_read: boolean) => Promise<void>; // New action
  updateProjectOrder: (
    projects: { id: string; order_index: number }[]
  ) => Promise<void>; // New action
  updateSkillOrder: (
    skills: { id: string; order_index: number }[]
  ) => Promise<void>; // New action
}

export const usePortfolioStore = create<PortfolioStore>()(
    (set, get) => ({
      profile: null,
      projects: [],
      skills: [],
      contactInfo: null,
      messages: [],
      isLoading: false,
      isRefreshing: false,
      error: null,

      fetchProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from("profiles")
            .select("*, highlighted_sections")
            .single();
          if (error) throw error;

          // Explicitly extract highlighted_sections and other data
          const { highlighted_sections: rawHighlightedSections, ...restOfData } = data;

          const transformedHighlightedSections = rawHighlightedSections
            ? (rawHighlightedSections as any[]) // Cast to any[] for transformation
                .filter(s => s.id !== "vision")
                .map(s => ({
                  ...s,
                  id: s.id === "story" ? "myStory" : s.id === "motivations" ? "myMotivations" : s.id,
                }))
            : undefined;

          set({
            profile: {
              ...(restOfData as Database["public"]["Tables"]["profiles"]["Row"]),
              highlighted_sections: transformedHighlightedSections,
            },
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          set({ error: "Failed to fetch profile", isLoading: false });
        }
      },

      fetchProjects: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("order_index", { ascending: true });
          if (error) throw error;
          set({ projects: data || [], isLoading: false });
        } catch (error) {
          console.error("Error fetching projects:", error);
          set({ error: "Failed to fetch projects", isLoading: false });
        }
      },

      fetchSkills: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from("skills")
            .select("*")
            .order("created_at", { ascending: true });
          if (error) throw error;
          set({ skills: data || [], isLoading: false });
        } catch (error) {
          console.error("Error fetching skills:", error);
          set({ error: "Failed to fetch skills", isLoading: false });
        }
      },

      fetchContactInfo: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from("contact_info")
            .select("*")
            .single();
          if (error) throw error;
          set({ contactInfo: data, isLoading: false });
        } catch (error) {
          console.error("Error fetching contact info:", error);
          set({ error: "Failed to fetch contact info", isLoading: false });
        }
      },

      fetchMessages: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .order("is_read", { ascending: true }) // Unread first
            .order("created_at", { ascending: false }); // Newest first within read status
          if (error) throw error;
          set({ messages: data || [], isLoading: false });
        } catch (error) {
          console.error("Error fetching messages:", error);
          set({ error: "Failed to fetch messages", isLoading: false });
        }
      },

      refreshAll: async () => {
        set({ isRefreshing: true, error: null });
        try {
          await Promise.all([
            get().fetchProfile(),
            get().fetchProjects(),
            get().fetchSkills(),
            get().fetchContactInfo(),
            get().fetchMessages(),
          ]);
          set({ isRefreshing: false });
        } catch (error) {
          console.error("Error refreshing data:", error);
          set({ error: "Failed to refresh data", isRefreshing: false });
        }
      },

      clearError: () => set({ error: null }),

      updateProfile: async data => {
        try {
          set({ isLoading: true, error: null });
          let query;
          if (get().profile?.id) {
            // Update existing profile
            query = supabase
              .from("profiles")
              .update(data)
              .eq("id", get().profile!.id);
          } else {
            // Insert new profile, linking it to the authenticated user's ID
            const user = (await supabase.auth.getSession()).data.session?.user;
            if (!user) {
              throw new Error("No authenticated user to create profile for.");
            }
            query = supabase.from("profiles").insert({ ...data, id: user.id });
          }

          const { data: updated, error } = await query.select().single();
          if (error) throw error;
          set({ profile: updated, isLoading: false });
        } catch (error) {
          console.error("Error updating/creating profile:", error);
          set({ error: "Failed to update/create profile", isLoading: false });
          throw error;
        }
      },

      updateContactInfo: async data => {
        try {
          set({ isLoading: true, error: null });
          let query;
          if (get().contactInfo?.id) {
            // Update existing contact info
            query = supabase
              .from("contact_info")
              .update({ ...data, updated_at: new Date().toISOString() })
              .eq("id", get().contactInfo!.id);
          } else {
            // Insert new contact info, linking it to the authenticated user's ID
            const user = (await supabase.auth.getSession()).data.session?.user;
            if (!user) {
              throw new Error(
                "No authenticated user to create contact info for."
              );
            }
            query = supabase.from("contact_info").insert({
              ...data,
              id: user.id,
              updated_at: new Date().toISOString(),
            });
          }

          const { data: updated, error } = await query.select().single();
          if (error) throw error;
          set({ contactInfo: updated, isLoading: false });
        } catch (error) {
          console.error("Error updating/creating contact info:", error);
          set({
            error: "Failed to update/create contact info",
            isLoading: false,
          });
          throw error;
        }
      },

      addProject: async data => {
        try {
          set({ isLoading: true, error: null });
          const { data: inserted, error } = await supabase
            .from("projects")
            .insert(data)
            .select()
            .single();
          if (error) throw error;
          set({ projects: [...get().projects, inserted], isLoading: false });
        } catch (error) {
          console.error("Error adding project:", error);
          set({ error: "Failed to add project", isLoading: false });
          throw error;
        }
      },

      updateProject: async (id, data) => {
        try {
          set({ isLoading: true, error: null });
          const { data: updated, error } = await supabase
            .from("projects")
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();
          if (error) throw error;
          set({
            projects: get().projects.map(p => (p.id === id ? updated : p)),
            isLoading: false,
          });
        } catch (error) {
          console.error("Error updating project:", error);
          set({ error: "Failed to update project", isLoading: false });
          throw error;
        }
      },

      deleteProject: async id => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);
          if (error) throw error;
          set({
            projects: get().projects.filter(p => p.id !== id),
            isLoading: false,
          });
        } catch (error) {
          console.error("Error deleting project:", error);
          set({ error: "Failed to delete project", isLoading: false });
          throw error;
        }
      },

      addSkill: async data => {
        try {
          set({ isLoading: true, error: null });
          const { data: inserted, error } = await supabase
            .from("skills")
            .insert(data)
            .select()
            .single();
          if (error) throw error;
          set({ skills: [...get().skills, inserted], isLoading: false });
        } catch (error) {
          console.error("Error adding skill:", error);
          set({ error: "Failed to add skill", isLoading: false });
          throw error;
        }
      },

      updateSkill: async (id, data) => {
        try {
          set({ isLoading: true, error: null });
          const { data: updated, error } = await supabase
            .from("skills")
            .update(data)
            .eq("id", id)
            .select()
            .single();
          if (error) throw error;
          set({
            skills: get().skills.map(s => (s.id === id ? updated : s)),
            isLoading: false,
          });
        } catch (error) {
          console.error("Error updating skill:", error);
          set({ error: "Failed to update skill", isLoading: false });
          throw error;
        }
      },

      deleteSkill: async id => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.from("skills").delete().eq("id", id);
          if (error) throw error;
          set({
            skills: get().skills.filter(s => s.id !== id),
            isLoading: false,
          });
        } catch (error) {
          console.error("Error deleting skill:", error);
          set({ error: "Failed to delete skill", isLoading: false });
          throw error;
        }
      },

      addMessage: async data => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.from("messages").insert(data);
          if (error) throw error;
          set({ isLoading: false });
        } catch (error: unknown) {
          console.error(
            "Error adding message:",
            (error as Error).message || error
          );
          set({ error: "Failed to send message", isLoading: false });
          throw error;
        }
      },

      deleteMessage: async id => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from("messages")
            .delete()
            .eq("id", id);
          if (error) throw error;
          set({
            messages: get().messages.filter(msg => msg.id !== id),
            isLoading: false,
          });
        } catch (error) {
          console.error("Error deleting message:", error);
          set({ error: "Failed to delete message", isLoading: false });
          throw error;
        }
      },

      updateMessageStatus: async (id, is_read) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from("messages")
            .update({ is_read })
            .eq("id", id);
          if (error) throw error;
          set({
            messages: get().messages.map(msg =>
              msg.id === id ? { ...msg, is_read } : msg
            ),
            isLoading: false,
          });
        } catch (error) {
          console.error("Error updating message status:", error);
          set({ error: "Failed to update message status", isLoading: false });
          throw error;
        }
      },

      updateProjectOrder: async projects => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.from("projects").upsert(projects);
          if (error) throw error;
          set({ isLoading: false });
        } catch (error) {
          console.error("Error updating project order:", error);
          set({ error: "Failed to update project order", isLoading: false });
          throw error;
        }
      },

      updateSkillOrder: async skills => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.from("skills").upsert(skills);
          if (error) throw error;
          set({ isLoading: false });
        } catch (error) {
          console.error("Error updating skill order:", error);
          set({ error: "Failed to update skill order", isLoading: false });
          throw error;
        }
      },
    })
);
