import { toast } from "sonner";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  startTransition,
} from "react";
import { motion } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolio";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Upload,
  Save,
  X,
  FileText,
  Image,
  Download,
  Eye,
  FolderOpen,
  User,
  Briefcase,
  Award,
  Mail,
  ExternalLink,
  LogOut,
  MessageCircle,
  GripVertical, // Add GripVertical for drag handle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import Quill styles
import { decodeHtmlEntities } from "@/lib/utils"; // New import
import { useTranslation } from "react-i18next"; // Import useTranslation

interface FileItem {
  id: string;
  name: string;
  url: string;
  type: string;
  created_at: string;
}

// Helper component for sortable projects
const SortableProject = ({
  project,
  children,
}: {
  project: any;
  children: (props: {
    attributes: any;
    listeners: any;
    setNodeRef: (element: HTMLElement | null) => void;
    style: React.CSSProperties;
    isDragging: boolean;
  }) => React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return <div ref={setNodeRef}>{children({ attributes, listeners, setNodeRef, style, isDragging })}</div>;
};

// Helper component for sortable skills
const SortableSkill = ({
  skill,
  children,
}: {
  skill: any;
  children: (props: {
    attributes: any;
    listeners: any;
    setNodeRef: (element: HTMLElement | null) => void;
    style: React.CSSProperties;
    isDragging: boolean;
  }) => React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return <div ref={setNodeRef}>{children({ attributes, listeners, setNodeRef, style, isDragging })}</div>;
};

export default function Admin() {
  const {
    profile,
    projects,
    skills,
    contactInfo,
    messages, // Added messages
    isLoading,
    refreshAll,
    fetchMessages, // Added fetchMessages
    updateProfile,
    updateContactInfo,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    deleteMessage,
    updateMessageStatus, // Import the new action
    updateProjectOrder, // Import for project reordering
    updateSkillOrder, // Import for skill reordering
  } = usePortfolioStore();
  const { session, signOut } = useAuth();
  const { t } = useTranslation(); // Initialize useTranslation

  // DND-Kit sensors
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedAndFilteredProjects.findIndex(
        p => p.id === active.id
      );
      const newIndex = sortedAndFilteredProjects.findIndex(
        p => p.id === over?.id
      );

      const reorderedProjects = arrayMove(
        sortedAndFilteredProjects,
        oldIndex,
        newIndex
      );

      // Update local state immediately for visual feedback
      // Note: `projects` from store is immutable, need to update via an action.
      // For now, we'll map the reordered projects to their new order_index and push to DB
      const projectsToUpdate = reorderedProjects.map((project, index) => ({
        id: project.id,
        order_index: index, // New order_index based on visual position
      }));

      startTransition(async () => {
        // Wrap in startTransition
        try {
          await updateProjectOrder(projectsToUpdate); // Call the store action
          toast.success("Ordre des projets mis à jour !");
        } catch (e: any) {
          console.error("Failed to update project order:", e);
          toast.error(
            `Échec de la mise à jour de l'ordre des projets: ${e.message || "Erreur inconnue"}`
          );
        }
      });
    }
  };

  const onDragEndSkills = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedAndFilteredSkills.findIndex(
        s => s.id === active.id
      );
      const newIndex = sortedAndFilteredSkills.findIndex(
        s => s.id === over?.id
      );

      const reorderedSkills = arrayMove(
        sortedAndFilteredSkills,
        oldIndex,
        newIndex
      );

      const skillsToUpdate = reorderedSkills.map((skill, index) => ({
        ...skill,
        order_index: index, // Add order_index back
      }));

      startTransition(async () => {
        // Wrap in startTransition
        try {
          await updateSkillOrder(skillsToUpdate); // Call the new store action
          toast.success("Ordre des compétences mis à jour !");
        } catch (e: any) {
          console.error("Failed to update skill order:", e);
          toast.error(
            `Échec de la mise à jour de l'ordre des compétences: ${e.message || "Erreur inconnue"}`
          );
        }
      });
    }
  };

  useEffect(() => {
    refreshAll(); // Fetch all data on component mount
  }, [refreshAll]);

  // Calculate unread messages count
  const unreadMessagesCount = messages.filter(m => !m.is_read).length;

  // Handle marking messages as read when tab is activated
  const handleTabChange = (value: string) => {
    if (value === "messages") {
      messages.forEach(message => {
        if (!message.is_read) {
          updateMessageStatus(message.id, true);
        }
      });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null); // Re-added for Files Tab
  const avatarInputRef = useRef<HTMLInputElement>(null); // New ref for avatar
  const cvInputRef = useRef<HTMLInputElement>(null); // New ref for CV
  const projectImageInputRef = useRef<HTMLInputElement>(null); // New ref for project images
  const [files, setFiles] = useState<FileItem[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Helper functions to convert between JSON and string for translations
  const getStringFromTranslations = (translations: any, fallback: string = ""): string => {
    if (!translations) return fallback;
    
    let text = "";
    
    if (typeof translations === "string") {
      text = translations;
    } else if (translations && typeof translations === "object") {
      text = translations["fr"] || translations["en"] || "";
    }
    
    if (typeof text !== "string" || !text) return fallback;
    
    // Decode HTML entities and strip HTML tags for display
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');
  };

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || "",
    bio: getStringFromTranslations(profile?.bio),
    location: profile?.location || "",
    avatar_url: profile?.avatar_url || "",
    cv_url: profile?.cv_url || "",
    vision_text: getStringFromTranslations(profile?.vision_text),
    hero_description: getStringFromTranslations(profile?.hero_description),
    projects_count: profile?.projects_count || "",
    technologies_count: profile?.technologies_count || "",
    years_experience: profile?.years_experience || "",
    certifications_count: profile?.certifications_count || "",
    highlighted_sections: profile?.highlighted_sections || [],
  });
  const [contactForm, setContactForm] = useState({
    email: contactInfo?.email || "",
    phone: contactInfo?.phone || "",
    github_url: contactInfo?.github_url || "",
    linkedin_url: contactInfo?.linkedin_url || "",
    location: contactInfo?.location || "",
  });
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "web",
    github_url: "",
    demo_url: "",
    image_url: "", // Add image_url to newProject state
    technologies: "",
  });
  const [newSkill, setNewSkill] = useState<{
    category: string;
    level: string;
    icon: string;
    technologies: { name: string; level: number }[];
  }>({
    category: "",
    level: "Débutant",
    icon: "Code",
    technologies: [],
  });

  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editedSkillForm, setEditedSkillForm] = useState<{
    category: string;
    level: string;
    icon: string;
    technologies: { name: string; level: number }[];
  }>({
    category: "",
    level: "Débutant",
    icon: "Code",
    technologies: [],
  });

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null); // New state for project editing
  const [editedProjectForm, setEditedProjectForm] = useState({
    // New state for project form
    title: "",
    description: "",
    category: "web",
    github_url: "",
    demo_url: "",
    technologies: "", // comma separated string
    image_url: "", // Add image_url to editedProjectForm state
  });

  const handleProfileBioChange = useCallback(
    (content: string) => {
      setProfileForm(prevForm => ({
        ...prevForm,
        bio: content,
      }));
    },
    [setProfileForm]
  );

  const handleProfileVisionTextChange = useCallback(
    (content: string) => {
      setProfileForm(prevForm => ({
        ...prevForm,
        vision_text: content,
      }));
    },
    [setProfileForm]
  );

  const handleProfileHighlightedSectionChange = useCallback(
    (id: "myStory" | "myMotivations", content: string) => {
      setProfileForm(prevForm => ({
        ...prevForm,
        highlighted_sections: prevForm.highlighted_sections?.map(section =>
          section.id === id ? { ...section, content } : section
        ),
      }));
    },
    [setProfileForm]
  );

  const handleNewProjectDescriptionChange = useCallback(
    (content: string) => {
      setNewProject(prevProject => ({
        ...prevProject,
        description: content,
      }));
    },
    [setNewProject]
  );

  const handleEditedProjectDescriptionChange = useCallback(
    (content: string) => {
      setEditedProjectForm(prevForm => ({
        ...prevForm,
        description: content,
      }));
    },
    [setEditedProjectForm]
  );

  const [projectSearchTerm, setProjectSearchTerm] = useState(""); // State for project search

  const filteredProjects = projects.filter(project => {
    const searchTermLower = projectSearchTerm.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchTermLower) ||
      project.description?.toLowerCase().includes(searchTermLower) ||
      (project.technologies &&
        project.technologies.some(tech =>
          tech.toLowerCase().includes(searchTermLower)
        ))
    );
  });

  const [projectSortKey, setProjectSortKey] = useState<string>("title"); // Default sort by title
  const [projectSortDirection, setProjectSortDirection] = useState<
    "asc" | "desc"
  >("asc");

  const sortedAndFilteredProjects = [...filteredProjects].sort(
    (a: any, b: any) => {
      let compareA = a[projectSortKey];
      let compareB = b[projectSortKey];

      // Handle case where properties might be null or undefined
      if (compareA === null || compareA === undefined) compareA = "";
      if (compareB === null || compareB === undefined) compareB = "";

      if (typeof compareA === "string" && typeof compareB === "string") {
        return projectSortDirection === "asc"
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      }
      // Fallback for non-string comparisons (e.g., numbers, booleans)
      if (compareA < compareB) return projectSortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return projectSortDirection === "asc" ? 1 : -1;
      return 0;
    }
  );

  const [skillSearchTerm, setSkillSearchTerm] = useState(""); // State for skill search
  const [skillSortKey, setSkillSortKey] = useState<string>("category"); // Default sort by category
  const [skillSortDirection, setSkillSortDirection] = useState<"asc" | "desc">(
    "asc"
  );

  const filteredSkills = skills.filter(skill => {
    const searchTermLower = skillSearchTerm.toLowerCase();
    let techArray: any[] = [];
    try {
      techArray =
        typeof skill.technologies === "string"
          ? JSON.parse(skill.technologies || "[]")
          : skill.technologies;
    } catch {
      techArray = [];
    }
    const technologiesString = techArray
      .map((tech: any) => (tech.name || "").toLowerCase())
      .join(" ");
    return (
      skill.category.toLowerCase().includes(searchTermLower) ||
      technologiesString.includes(searchTermLower)
    );
  });

  const sortedAndFilteredSkills = [...filteredSkills].sort((a: any, b: any) => {
    let compareA = a[skillSortKey];
    let compareB = b[skillSortKey];

    if (skillSortKey === "level") {
      // Custom sorting for 'level'
      const levelOrder: { [key: string]: number } = {
        Débutant: 1,
        Intermédiaire: 2,
        Avancé: 3,
      };
      compareA = levelOrder[a.level] || 0;
      compareB = levelOrder[b.level] || 0;
    }

    if (typeof compareA === "string" && typeof compareB === "string") {
      return skillSortDirection === "asc"
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    }
    if (compareA < compareB) return skillSortDirection === "asc" ? -1 : 1;
    if (compareA > compareB) return skillSortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const [messageSearchTerm, setMessageSearchTerm] = useState(""); // State for message search
  const [messageSortKey, setMessageSortKey] = useState<string>("created_at"); // Default sort by created_at
  const [messageSortDirection, setMessageSortDirection] = useState<
    "desc" | "asc"
  >("desc"); // Newest first by default

  const filteredMessages = messages.filter(message => {
    const searchTermLower = messageSearchTerm.toLowerCase();
    return (
      message.name.toLowerCase().includes(searchTermLower) ||
      message.email.toLowerCase().includes(searchTermLower) ||
      message.subject?.toLowerCase().includes(searchTermLower) ||
      message.message.toLowerCase().includes(searchTermLower)
    );
  });

  const sortedAndFilteredMessages = [...filteredMessages].sort(
    (a: any, b: any) => {
      let compareA = a[messageSortKey];
      let compareB = b[messageSortKey];

      if (typeof compareA === "string" && typeof compareB === "string") {
        return messageSortDirection === "asc"
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      }
      // For date comparison (assuming created_at is a string or Date object)
      if (messageSortKey === "created_at") {
        return messageSortDirection === "asc"
          ? new Date(compareA).getTime() - new Date(compareB).getTime()
          : new Date(compareB).getTime() - new Date(compareA).getTime();
      }

      if (compareA < compareB) return messageSortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return messageSortDirection === "asc" ? 1 : -1;
      return 0;
    }
  );

  const handleEditSkillClick = useCallback((skill: any) => {
    console.log("[Admin] handleEditSkillClick called for skill:", skill.id);
    setEditingSkillId(String(skill.id));
    console.log("[Admin] editingSkillId set to:", String(skill.id));
    let parsedTechnologies: { name: string; level: number }[] = Array.isArray(
      skill.technologies
    )
      ? skill.technologies
      : [];

    setEditedSkillForm({
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
      technologies: parsedTechnologies,
    });
    console.log("[Admin] editedSkillForm set");
  }, [setEditingSkillId, setEditedSkillForm]);

  const handleSaveEditedSkill = useCallback(async () => {
    if (!editingSkillId) return;
    try {
      await updateSkill(editingSkillId, {
        category: editedSkillForm.category,
        level: editedSkillForm.level,
        icon: editedSkillForm.icon,
        technologies: editedSkillForm.technologies as any,
      });
      setEditingSkillId(null);
      setEditedSkillForm({
        category: "",
        level: "Débutant",
        icon: "Code",
        technologies: [], // Reset to empty array
      });
      toast.success("Compétence mise à jour avec succès !");
    } catch (e: any) {
      // Add : any to error for type safety
      console.error("Error updating skill:", e);
      toast.error(
        `Échec de la mise à jour de la compétence: ${e.message || "Erreur inconnue"}`
      );
    }
  }, [editingSkillId, editedSkillForm, updateSkill, setEditingSkillId, setEditedSkillForm]);

  const handleCancelEditSkill = useCallback(() => {
    setEditingSkillId(null);
    setEditedSkillForm({
      category: "",
      level: "Débutant",
      icon: "Code",
      technologies: [],
    });
  }, [setEditingSkillId, setEditedSkillForm]);

  const handleEditProjectClick = useCallback((project: any) => {
    console.log(
      "[Admin] handleEditProjectClick called for project:",
      project.id
    );
    const cleanDescription = decodeHtmlEntities(project.description); // Use the utility function
    setEditingProjectId(String(project.id));
    console.log("[Admin] editingProjectId set to:", String(project.id));
    setEditedProjectForm({
      title: project.title,
      description: cleanDescription,
      category: project.category || "web",
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
      technologies: (project.technologies || []).join(", "),
      image_url: project.image_url || "",
    });
    console.log("[Admin] editedProjectForm set");
  }, [setEditingProjectId, setEditedProjectForm]);

  const handleSaveEditedProject = useCallback(async () => {
    console.log(
      "[Admin] handleSaveEditedProject called, editingProjectId:",
      editingProjectId
    );
    if (!editingProjectId) return;
    try {
      console.log("[Admin] Saving project with data:", editedProjectForm);
      await updateProject(editingProjectId, {
        title: editedProjectForm.title,
        description: editedProjectForm.description,
        category: editedProjectForm.category,
        github_url: editedProjectForm.github_url,
        demo_url: editedProjectForm.demo_url,
        technologies: editedProjectForm.technologies
          .split(",")
          .map(t => t.trim()),
        image_url: editedProjectForm.image_url,
      });
      setEditingProjectId(null);
      toast.success("Projet mis à jour avec succès !");
    } catch (e: any) {
      console.error("Error saving edited project:", e);
      toast.error(
        `Échec de la mise à jour du projet: ${e.message || "Erreur inconnue"}`
      );
    }
  }, [editingProjectId, editedProjectForm, updateProject, setEditingProjectId]);

  const handleCancelEditProject = useCallback(() => {
    setEditingProjectId(null);
  }, [setEditingProjectId]);

  const fetchFiles = async () => {
    const { data } = await supabase.storage.from("portfolio").list();
    if (data) {
      const fileItems: FileItem[] = await Promise.all(
        data.map(async file => {
          const {
            data: { publicUrl },
          } = supabase.storage.from("portfolio").getPublicUrl(file.name);
          return {
            id: file.id,
            name: file.name,
            url: publicUrl,
            type: file.name.split(".").pop() || "file",
            created_at: file.created_at,
          };
        })
      );
      setFiles(fileItems);
    }
  };

  // Generic file upload handler, updated to accept target state setter and field name
  const handleGenericFileUpload = async (
    file: File,
    type: "image" | "document",
    setTargetState: React.Dispatch<React.SetStateAction<any>>,
    fieldToUpdate: string // e.g., "avatar_url", "cv_url", "image_url"
  ): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file);
      if (error) throw error;

      if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(fileName);

        setTargetState((prev: any) => ({
          ...prev,
          [fieldToUpdate]: publicUrl,
        }));
        toast.success("Fichier uploadé avec succès !");
        return publicUrl;
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Échec de l'upload: ${error.message || "Erreur inconnue"}`);
    } finally {
      setUploading(false);
    }
    return null;
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "document"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      await handleGenericFileUpload(file, type, setNewProject, "image_url");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleGenericFileUpload(
        file,
        "image",
        setProfileForm,
        "avatar_url"
      );
    }
  };

  const handleCvFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleGenericFileUpload(file, "document", setProfileForm, "cv_url");
    }
  };

  const handleProjectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEditing) {
        await handleGenericFileUpload(
          file,
          "image",
          setEditedProjectForm,
          "image_url"
        );
      } else {
        await handleGenericFileUpload(
          file,
          "image",
          setNewProject,
          "image_url"
        );
      }
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    try {
      await supabase.storage.from("portfolio").remove([file.name]);
      setFiles(files.filter(f => f.id !== file.id));
      // Additionally, check if the deleted file was the avatar or CV and clear the respective URL in profileForm
      if (profileForm.avatar_url === file.url) {
        setProfileForm(prev => ({ ...prev, avatar_url: "" }));
      }
      if (profileForm.cv_url === file.url) {
        setProfileForm(prev => ({ ...prev, cv_url: "" }));
      }
      toast.success("Fichier supprimé avec succès !");
    } catch (error: any) {
      // Add : any to error for type safety
      console.error("Delete error:", error);
      toast.error(
        `Échec de la suppression du fichier: ${error.message || "Erreur inconnue"}`
      );
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Convert translation fields to JSON format
      const profileDataToSave = {
        ...profileForm,
        bio: { fr: profileForm.bio } as any,
        vision_text: { fr: profileForm.vision_text } as any,
        hero_description: { fr: profileForm.hero_description } as any,
        highlighted_sections: profileForm.highlighted_sections as any,
      };

      await updateProfile(profileDataToSave as any);
      setEditingProfile(false);
      toast.success("Profil mis à jour avec succès !");
    } catch (e: any) {
      // Add : any to error for type safety
      console.error("Error updating profile:", e);
      toast.error(
        `Échec de la mise à jour du profil: ${e.message || "Erreur inconnue"}`
      );
    }
  };

  const handleSaveContact = async () => {
    try {
      await updateContactInfo(contactForm);
      setEditingContact(false);
      toast.success("Informations de contact mises à jour avec succès !");
    } catch (e: any) {
      // Add : any to error for type safety
      console.error("Error updating contact info:", e);
      toast.error(
        `Échec de la mise à jour des informations de contact: ${e.message || "Erreur inconnue"}`
      );
    }
  };

  const handleAddProject = async () => {
    try {
      await addProject({
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        github_url: newProject.github_url || null,
        demo_url: newProject.demo_url || null,
        image_url: newProject.image_url || null, // Use newProject.image_url
        technologies: newProject.technologies.split(",").map(t => t.trim()),
        featured: false,
        order_index: projects.length + 1,
      });
      setNewProject({
        title: "",
        description: "",
        category: "web",
        github_url: "",
        demo_url: "",
        image_url: "",
        technologies: "",
      });
      toast.success("Projet ajouté avec succès !");
    } catch (e: any) {
      // Add : any to error for type safety
      console.error("Error adding project:", e);
      toast.error(
        `Échec de l'ajout du projet: ${e.message || "Erreur inconnue"}`
      );
    }
  };

  const handleAddSkill = async () => {
    try {
      await addSkill({
        category: newSkill.category,
        level: newSkill.level,
        icon: newSkill.icon,
        technologies: newSkill.technologies as any,
      });
      setNewSkill({
        category: "",
        level: "Débutant",
        icon: "Code",
        technologies: [], // Reset to empty array
      });
      toast.success("Compétence ajoutée avec succès !");
    } catch (e: any) {
      // Add : any to error for type safety
      console.error("Error adding skill:", e);
      toast.error(
        `Échec de l'ajout de la compétence: ${e.message || "Erreur inconnue"}`
      );
    }
  };

  const handleDeleteProject = useCallback(async (id: string) => {
    console.log("[Admin] handleDeleteProject called for id:", id);
    try {
      await deleteProject(id);
      toast.success("Projet supprimé avec succès !");
    } catch (e: any) {
      console.error("Error deleting project:", e);
      toast.error(
        `Échec de la suppression du projet: ${e.message || "Erreur inconnue"}`
      );
    }
  }, [deleteProject]);

  const handleDeleteSkill = useCallback(async (id: string) => {
    console.log("[Admin] handleDeleteSkill called for id:", id);
    try {
      await deleteSkill(id);
      toast.success("Compétence supprimée avec succès !");
    } catch (e: any) {
      console.error("Error deleting skill:", e);
      toast.error(
        `Échec de la suppression de la compétence: ${e.message || "Erreur inconnue"}`
      );
    }
  }, [deleteSkill]);

  const handleDeleteMessage = useCallback(async (id: string) => {
    try {
      await deleteMessage(id);
      toast.success("Message supprimé avec succès !");
    } catch (e: any) {
      console.error("Error deleting message:", e);
      toast.error(
        `Échec de la suppression du message: ${e.message || "Erreur inconnue"}`
      );
    }
  }, [deleteMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1a1a] to-[#262626] border-b border-[#333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066ff] to-[#8b5cf6] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Portfolio Admin
              </h1>
              <p className="text-xs text-[#71717a]">
                Connecté en tant que: {session?.user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                refreshAll();
                fetchFiles();
              }}
              className="border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white hover:border-[#0066ff]"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Rafraîchir
            </Button>
            <Button
              variant="destructive"
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs
          defaultValue="profile"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="bg-[#1a1a1a] border border-[#333] p-1 mb-8 flex flex-wrap gap-1">
            <TabsTrigger
              value="profile"
              className="text-gray-200 data-[state=inactive]:text-gray-400 data-[state=active]:bg-[#0066ff] data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" /> Profil
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="text-gray-200 data-[state=inactive]:text-gray-400 data-[state=active]:bg-[#0066ff] data-[state=active]:text-white"
            >
              <Briefcase className="w-4 h-4 mr-2" /> Projets
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="text-gray-200 data-[state=inactive]:text-gray-400 data-[state=active]:bg-[#0066ff] data-[state=active]:text-white"
            >
              <Award className="w-4 h-4 mr-2" /> Compétences
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="text-gray-200 data-[state=inactive]:text-gray-400 data-[state=active]:bg-[#0066ff] data-[state=active]:text-white"
            >
              <Mail className="w-4 h-4 mr-2" /> Contact
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="text-gray-200 data-[state=inactive]:text-gray-400 data-[state=active]:bg-[#0066ff] data-[state=active]:text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> Messages
              {unreadMessagesCount > 0 && (
                <Badge className="ml-2 bg-red-600 text-white">
                  {unreadMessagesCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="text-gray-200 data-[state=inactive]:text-gray-400 data-[state=active]:bg-[#0066ff] data-[state=active]:text-white"
            >
              <FolderOpen className="w-4 h-4 mr-2" /> Fichiers
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-[#1a1a1a] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0066ff]" />
                    Informations du Profil
                  </CardTitle>
                  <CardDescription className="text-[#71717a]">
                    Gérez vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {editingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Nom complet
                        </label>
                        <Input
                          value={profileForm.full_name}
                          onChange={e =>
                            setProfileForm({
                              ...profileForm,
                              full_name: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Bio / Sous-titre
                        </label>
                        <ReactQuill
                          theme="snow"
                          value={profileForm.bio}
                          onChange={handleProfileBioChange}
                          className="bg-[#262626] border-[#333] text-white [&_.ql-toolbar]:bg-[#1a1a1a] [&_.ql-editor]:min-h-[8rem]" // Tailwind classes for styling Quill
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Localisation
                        </label>
                        <Input
                          value={profileForm.location}
                          onChange={e =>
                            setProfileForm({
                              ...profileForm,
                              location: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      {/* Avatar Upload */}
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Photo de profil
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={handleAvatarUpload}
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                          />
                          <Button
                            onClick={() => avatarInputRef.current?.click()}
                            className="bg-[#0066ff] hover:bg-[#0052cc]"
                            disabled={uploading}
                          >
                            <Image className="w-4 h-4 mr-2" />
                            {uploading ? "Upload..." : "Uploader Photo"}
                          </Button>
                          {profileForm.avatar_url && (
                            <img
                              src={profileForm.avatar_url}
                              alt="Aperçu"
                              className="w-16 h-16 rounded-full object-cover border-2 border-[#0066ff]"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </div>

                      {/* CV Upload */}
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Votre CV
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            ref={cvInputRef}
                            onChange={handleCvFileUpload}
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            disabled={uploading}
                          />
                          <Button
                            onClick={() => cvInputRef.current?.click()}
                            className="bg-[#0066ff] hover:bg-[#0052cc]"
                            disabled={uploading}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {uploading ? "Upload..." : "Uploader CV"}
                          </Button>
                          {profileForm.cv_url && (
                            <div className="flex items-center gap-2 bg-[#262626] p-2 rounded-md">
                              <FileText className="w-5 h-5 text-[#a1a1aa]" />
                              <span className="text-white text-sm">
                                CV Actuel
                              </span>
                              <a
                                href={profileForm.cv_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0066ff] hover:underline text-sm"
                                aria-label="Voir le CV"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setProfileForm(prev => ({
                                    ...prev,
                                    cv_url: "",
                                  }))
                                }
                                aria-label="Supprimer le CV"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Highlighted Sections */}
                      {profileForm.highlighted_sections?.map(section => (
                        <div key={section.id}>
                          <label className="block text-sm text-[#a1a1aa] mb-2">
                            {t(`home.${section.id}`)}
                          </label>
                          <ReactQuill
                            theme="snow"
                            value={section.content}
                            onChange={content =>
                              handleProfileHighlightedSectionChange(
                                section.id,
                                content
                              )
                            }
                            className="bg-[#262626] border-[#333] text-white [&_.ql-toolbar]:bg-[#1a1a1a] [&_.ql-editor]:min-h-[8rem]"
                          />
                        </div>
                      ))}

                      {/* Vision Text */}
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Votre Vision
                        </label>
                        <ReactQuill
                          theme="snow"
                          value={profileForm.vision_text}
                          onChange={handleProfileVisionTextChange}
                          className="bg-[#262626] border-[#333] text-white [&_.ql-toolbar]:bg-[#1a1a1a] [&_.ql-editor]:min-h-[8rem]"
                        />
                      </div>
                      {/* Hero Description */}
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Description Hero (Page d'accueil)
                        </label>
                        <Textarea
                          value={profileForm.hero_description}
                          onChange={e =>
                            setProfileForm({
                              ...profileForm,
                              hero_description: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white placeholder-[#52525b]"
                          placeholder="Description qui s'affiche sur la page d'accueil..."
                          rows={4}
                        />
                      </div>
                      {/* Projects Count */}
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Nombre de Projets (ex: 15+)
                        </label>
                        <Input
                          value={profileForm.projects_count}
                          onChange={e =>
                            setProfileForm({
                              ...profileForm,
                              projects_count: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      {/* Technologies Count */}
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Nombre de Technologies (ex: 20+)
                        </label>
                        <Input
                          value={profileForm.technologies_count}
                          onChange={e =>
                            setProfileForm({
                              ...profileForm,
                              technologies_count: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      {/* Years Experience */}
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Années d'Expérience (ex: 3+)
                        </label>
                        <Input
                          value={profileForm.years_experience}
                          onChange={e =>
                            setProfileForm({
                              ...profileForm,
                              years_experience: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      {/* Certifications Count */}
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Nombre de Certifications (ex: 2)
                        </label>
                        <Input
                          value={profileForm.certifications_count}
                          onChange={e =>
                            setProfileForm({
                              ...profileForm,
                              certifications_count: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-[#0066ff] hover:bg-[#0052cc]"
                        >
                          <Save className="w-4 h-4 mr-2" /> Sauvegarder
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingProfile(false)}
                          className="border-[#333] text-[#a1a1aa]"
                        >
                          <X className="w-4 h-4" /> Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full object-cover border-2 border-[#0066ff]"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0066ff] to-[#8b5cf6] flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {profile.full_name}
                              </h3>
                              <p className="text-[#71717a]">
                                {profile.location}
                              </p>
                            </div>
                          </div>
                          <p className="text-[#a1a1aa]">
                            {getStringFromTranslations(profile.bio, "")}
                          </p>
                          <Button
                            onClick={() => {
                              setProfileForm({
                                full_name: profile?.full_name || "",
                                bio: getStringFromTranslations(profile?.bio, ""),
                                location: profile?.location || "",
                                avatar_url: profile?.avatar_url || "",
                                cv_url: profile?.cv_url || "",
                                vision_text: getStringFromTranslations(profile?.vision_text, ""),
                                hero_description: getStringFromTranslations(profile?.hero_description, ""),
                                projects_count: profile?.projects_count || "",
                                technologies_count:
                                  profile?.technologies_count || "",
                                years_experience:
                                  profile?.years_experience || "",
                                certifications_count:
                                  profile?.certifications_count || "",
                                highlighted_sections: profile?.highlighted_sections || [],
                              });
                              setEditingProfile(true);
                            }}
                            className="bg-[#0066ff] hover:bg-[#0052cc]"
                          >
                            <Edit className="w-4 h-4 mr-2" /> Modifier
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <User className="w-16 h-16 text-[#333] mx-auto mb-4" />
                          <p className="text-[#71717a] mb-4">
                            Aucun profil configuré
                          </p>
                          <Button
                            onClick={() => setEditingProfile(true)}
                            className="bg-[#0066ff] hover:bg-[#0052cc]"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Ajouter un profil
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview Card */}
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#262626] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-white">Aperçu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 bg-[#0f0f0f] rounded-xl p-6">
                    <img
                      src={
                        profile?.avatar_url || "https://via.placeholder.com/150"
                      }
                      alt="Avatar"
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-3 border-[#0066ff]"
                      loading="lazy"
                    />
                    <h3 className="text-xl font-bold text-white mb-1">
                      {profile?.full_name || "Votre nom"}
                    </h3>
                    <p className="text-[#71717a] text-sm mb-2">
                      {profile?.location || "Votre localisation"}
                    </p>
                    <p className="text-[#a1a1aa] text-sm">
                      {getStringFromTranslations(profile?.bio, "Votre bio")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="bg-[#1a1a1a] border-[#333] mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#0066ff]" />
                  Ajouter un Projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Titre du projet *"
                    value={newProject.title}
                    onChange={e =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    className="bg-[#262626] border-[#333] text-white"
                  />
                  <select
                    value={newProject.category}
                    onChange={e =>
                      setNewProject({ ...newProject, category: e.target.value })
                    }
                    className="bg-[#262626] border-[#333] text-white rounded-lg px-4 py-2"
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="network">Réseau</option>
                    <option value="security">Sécurité</option>
                    <option value="ml">ML/IA</option>
                  </select>
                  <Input
                    placeholder="URL GitHub"
                    value={newProject.github_url}
                    onChange={e =>
                      setNewProject({
                        ...newProject,
                        github_url: e.target.value,
                      })
                    }
                    className="bg-[#262626] border-[#333] text-white"
                  />
                  <Input
                    placeholder="URL Démo"
                    value={newProject.demo_url}
                    onChange={e =>
                      setNewProject({ ...newProject, demo_url: e.target.value })
                    }
                    className="bg-[#262626] border-[#333] text-white"
                  />
                  <Input
                    placeholder="Technologies (séparées par virgule)"
                    value={newProject.technologies}
                    onChange={e =>
                      setNewProject({
                        ...newProject,
                        technologies: e.target.value,
                      })
                    }
                    className="bg-[#262626] border-[#333] text-white md:col-span-2"
                  />
                  {/* Project Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#a1a1aa] mb-2">
                      Image du Projet
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        ref={projectImageInputRef}
                        onChange={e => handleProjectImageUpload(e, false)} // false for new project
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                      />
                      <Button
                        onClick={() => projectImageInputRef.current?.click()}
                        className="bg-[#0066ff] hover:bg-[#0052cc]"
                        disabled={uploading}
                      >
                        <Image className="w-4 h-4 mr-2" />
                        {uploading ? "Upload..." : "Uploader Image"}
                      </Button>
                      {newProject.image_url && (
                        <img
                          src={newProject.image_url}
                          alt="Aperçu du projet"
                          className="w-24 h-24 object-cover rounded-md border-2 border-[#0066ff]"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </div>
                  <ReactQuill
                    theme="snow"
                    placeholder="Description du projet"
                    value={newProject.description}
                    onChange={handleNewProjectDescriptionChange}
                    className="bg-[#262626] border-[#333] text-white md:col-span-2 [&_.ql-toolbar]:bg-[#1a1a1a] [&_.ql-editor]:min-h-[8rem]"
                  />
                  <Button
                    onClick={handleAddProject}
                    className="md:col-span-2 bg-[#0066ff] hover:bg-[#0052cc]"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Ajouter le projet
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Rechercher des projets par titre, description ou technologies..."
                value={projectSearchTerm}
                onChange={e => setProjectSearchTerm(e.target.value)}
                className="bg-[#1a1a1a] border-[#333] text-white placeholder-[#71717a] focus:border-[#0066ff] flex-1"
              />
              <div className="flex gap-2">
                <select
                  value={projectSortKey}
                  onChange={e => setProjectSortKey(e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white rounded-lg px-4 py-2"
                >
                  <option value="title">Titre</option>
                  <option value="category">Catégorie</option>
                  <option value="created_at">Date de création</option>
                </select>
                <Button
                  variant="outline"
                  className="border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white"
                  onClick={() =>
                    setProjectSortDirection(prev =>
                      prev === "asc" ? "desc" : "asc"
                    )
                  }
                >
                  {projectSortDirection === "asc" ? "▲" : "▼"}
                </Button>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={sortedAndFilteredProjects.map((p: any) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedAndFilteredProjects.map((project: any) => (
                    <SortableProject key={project.id} project={project}>
                      {({ attributes, listeners, setNodeRef, style, isDragging }) => (
                        <Card
                          ref={setNodeRef}
                          style={style}
                          className="bg-[#1a1a1a] border-[#333] h-full hover:border-[#0066ff]/50 transition-all duration-300 group hover:shadow-xl hover:shadow-[#0066ff]/10 overflow-hidden"
                        >
                          <CardContent className="p-4">
                            {editingProjectId === project.id ? (
                              // Edit Form for Project
                              <div className="space-y-3">
                                <Input
                                  placeholder="Titre du projet *"
                                  value={editedProjectForm.title}
                                  onChange={e =>
                                    setEditedProjectForm({
                                      ...editedProjectForm,
                                      title: e.target.value,
                                    })
                                  }
                                  className="bg-[#262626] border-[#333] text-white"
                                />
                                <select
                                  value={editedProjectForm.category}
                                  onChange={e =>
                                    setEditedProjectForm({
                                      ...editedProjectForm,
                                      category: e.target.value,
                                    })
                                  }
                                  className="bg-[#262626] border-[#333] text-white rounded-lg px-4 py-2 w-full"
                                >
                                  <option value="web">Web</option>
                                  <option value="mobile">Mobile</option>
                                  <option value="network">Réseau</option>
                                  <option value="security">Sécurité</option>
                                  <option value="ml">ML/IA</option>
                                </select>
                                <Input
                                  placeholder="URL GitHub"
                                  value={editedProjectForm.github_url}
                                  onChange={e =>
                                    setEditedProjectForm({
                                      ...editedProjectForm,
                                      github_url: e.target.value,
                                    })
                                  }
                                  className="bg-[#262626] border-[#333] text-white"
                                />
                                <Input
                                  placeholder="URL Démo"
                                  value={editedProjectForm.demo_url}
                                  onChange={e =>
                                    setEditedProjectForm({
                                      ...editedProjectForm,
                                      demo_url: e.target.value,
                                    })
                                  }
                                  className="bg-[#262626] border-[#333] text-white"
                                />
                                <Input
                                  placeholder="Technologies (séparées par virgule)"
                                  value={editedProjectForm.technologies}
                                  onChange={e =>
                                    setEditedProjectForm({
                                      ...editedProjectForm,
                                      technologies: e.target.value,
                                    })
                                  }
                                  className="bg-[#262626] border-[#333] text-white"
                                />
                                {/* Project Image Upload for Editing */}
                                <div>
                                  <label className="block text-sm text-[#a1a1aa] mb-2">
                                    Image du Projet
                                  </label>
                                  <div className="flex items-center gap-4">
                                    <input
                                      type="file"
                                      ref={projectImageInputRef}
                                      onChange={e =>
                                        handleProjectImageUpload(e, true)
                                      } // true for editing project
                                      accept="image/*"
                                      className="hidden"
                                      disabled={uploading}
                                    />
                                    <Button
                                      onClick={() =>
                                        projectImageInputRef.current?.click()
                                      }
                                      className="bg-[#0066ff] hover:bg-[#0052cc]"
                                      disabled={uploading}
                                    >
                                      <Image className="w-4 h-4 mr-2" />
                                      {uploading ? "Upload..." : "Uploader Image"}
                                    </Button>
                                    {editedProjectForm.image_url && (
                                      <img
                                        src={editedProjectForm.image_url}
                                        alt="Aperçu du projet"
                                        className="w-24 h-24 object-cover rounded-md border-2 border-[#0066ff]"
                                        loading="lazy"
                                      />
                                    )}
                                  </div>
                                </div>
                                <ReactQuill
                                  theme="snow"
                                  placeholder="Description du projet"
                                  value={editedProjectForm.description}
                                  onChange={handleEditedProjectDescriptionChange}
                                  className="bg-[#262626] border-[#333] text-white [&_.ql-toolbar]:bg-[#1a1a1a] [&_.ql-editor]:min-h-[8rem]"
                                />{" "}
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    onClick={handleSaveEditedProject}
                                    className="flex-1 bg-[#0066ff] hover:bg-[#0052cc]"
                                  >
                                    <Save className="w-4 h-4 mr-2" /> Sauvegarder
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={handleCancelEditProject}
                                    className="flex-1 border-[#333] text-[#a1a1aa]"
                                  >
                                    <X className="w-4 h-4" /> Annuler
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // Display Mode for Project
                              <>
                                <div className="flex justify-between items-start mb-3 gap-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <GripVertical
                                      className="w-5 h-5 text-[#71717a] cursor-grab active:cursor-grabbing flex-shrink-0"
                                      {...attributes}
                                      {...listeners}
                                    />
                                    <h3 className="font-semibold text-white text-sm sm:text-base break-words">
                                      {project.title}
                                    </h3>
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleEditProjectClick(project);
                                      }}
                                      className="p-1.5 sm:p-2 rounded-lg bg-[#0066ff] hover:bg-[#0052cc] text-white transition-all duration-200"
                                      aria-label="Modifier le projet"
                                    >
                                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </motion.button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={e => e.stopPropagation()}
                                          className="p-1.5 sm:p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                                          aria-label="Supprimer le projet"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </motion.button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-[#1a1a1a] border-[#333] text-white">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-white">
                                            Confirmer la suppression
                                          </AlertDialogTitle>
                                          <AlertDialogDescription className="text-[#a1a1aa]">
                                            Êtes-vous sûr de vouloir supprimer ce
                                            projet ? Cette action est
                                            irréversible.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel className="border-[#333] text-[#a1a1aa] hover:bg-[#262626]">
                                            Annuler
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              handleDeleteProject(project.id)
                                            }
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                          >
                                            Supprimer
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                                <p className="text-sm text-[#71717a] mb-3 line-clamp-2">
                                  {project.description
                                    ? project.description
                                        .replace(/&nbsp;/g, " ")
                                        .replace(/&#39;/g, "'")
                                        .replace(/&amp;/g, "&")
                                        .replace(/&lt;/g, "<")
                                        .replace(/&gt;/g, ">")
                                        .replace(/&quot;/g, '"')
                                    : ""}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {(project.technologies || [])
                                    .slice(0, 3)
                                    .map((tech: string, i: number) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-xs border-[#333] text-[#a1a1aa]"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                  {project.github_url && (
                                    <a
                                      href={project.github_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1"
                                    >
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white"
                                      >
                                        <ExternalLink className="w-3 h-3 mr-1" />{" "}
                                        Code
                                      </Button>
                                    </a>
                                  )}
                                  {project.demo_url && (
                                    <a
                                      href={project.demo_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1"
                                    >
                                      <Button
                                        size="sm"
                                        className="w-full bg-[#0066ff] hover:bg-[#0052cc]"
                                      >
                                        <Eye className="w-3 h-3 mr-1" /> Demo
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </SortableProject>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card className="bg-[#1a1a1a] border-[#333] mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#0066ff]" />
                  Ajouter une Compétence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Catégorie (ex: Développement Web) *"
                    value={newSkill.category}
                    onChange={e =>
                      setNewSkill({ ...newSkill, category: e.target.value })
                    }
                    className="bg-[#262626] border-[#333] text-white"
                  />
                  <select
                    value={newSkill.level}
                    onChange={e =>
                      setNewSkill({ ...newSkill, level: e.target.value })
                    }
                    className="bg-[#262626] border-[#333] text-white rounded-lg px-4 py-2"
                  >
                    <option value="Avancé">Avancé</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Débutant">Débutant</option>
                  </select>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm text-[#a1a1aa]">
                      Technologies (Nom et Pourcentage)
                    </label>
                    {editedSkillForm.technologies.map(
                      (tech, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Nom de la technologie"
                            value={tech.name}
                            onChange={e => {
                              const updatedTechs = [
                                ...editedSkillForm.technologies,
                              ];
                              updatedTechs[index].name =
                                e.target.value;
                              setEditedSkillForm({
                                ...editedSkillForm,
                                technologies: updatedTechs,
                              });
                            }}
                            className="bg-[#262626] border-[#333] text-white flex-1"
                          />
                          <Input
                            type="number"
                            placeholder="Pourcentage (0-100)"
                            value={tech.level}
                            onChange={e => {
                              const updatedTechs = [
                                ...editedSkillForm.technologies,
                              ];
                              updatedTechs[index].level = parseInt(
                                e.target.value
                              );
                              setEditedSkillForm({
                                ...editedSkillForm,
                                technologies: updatedTechs,
                              });
                            }}
                            min="0"
                            max="100"
                            className="bg-[#262626] border-[#333] text-white w-24"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const updatedTechs =
                                editedSkillForm.technologies.filter(
                                  (_, i) => i !== index
                                );
                              setEditedSkillForm({
                                ...editedSkillForm,
                                technologies: updatedTechs,
                              });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    )}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setNewSkill({
                          ...newSkill,
                          technologies: [
                            ...newSkill.technologies,
                            { name: "", level: 0 },
                          ],
                        })
                      }
                      className="w-full border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Ajouter une technologie
                    </Button>
                  </div>

                  <Button
                    onClick={handleAddSkill}
                    className="md:col-span-2 bg-[#0066ff] hover:bg-[#0052cc]"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Ajouter la compétence
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Skill Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Rechercher des compétences par catégorie ou technologies..."
                value={skillSearchTerm}
                onChange={e => setSkillSearchTerm(e.target.value)}
                className="bg-[#1a1a1a] border-[#333] text-white placeholder-[#71717a] focus:border-[#0066ff] flex-1"
              />
              <div className="flex gap-2">
                <select
                  value={skillSortKey}
                  onChange={e => setSkillSortKey(e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white rounded-lg px-4 py-2"
                >
                  <option value="category">Catégorie</option>
                  <option value="level">Niveau</option>
                </select>
                <Button
                  variant="outline"
                  className="border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white"
                  onClick={() =>
                    setSkillSortDirection(prev =>
                      prev === "asc" ? "desc" : "asc"
                    )
                  }
                >
                  {skillSortDirection === "asc" ? "▲" : "▼"}
                </Button>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEndSkills} // Use the new handler for skills
            >
              <SortableContext
                items={sortedAndFilteredSkills.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sortedAndFilteredSkills.map((skill: any) => (
                    <SortableSkill key={skill.id} skill={skill}>
                      {({ attributes, listeners, setNodeRef, style, isDragging }) => (
                        <Card
                          ref={setNodeRef}
                          style={style}
                          className="bg-[#1a1a1a] border-[#333] h-full"
                        >
                          <CardContent className="p-4">
                            {editingSkillId === skill.id ? (
                              <div className="space-y-3">
                                <Input
                                  placeholder="Catégorie (ex: Développement Web) *"
                                  value={editedSkillForm.category}
                                  onChange={e =>
                                    setEditedSkillForm({
                                      ...editedSkillForm,
                                      category: e.target.value,
                                    })
                                  }
                                  className="bg-[#262626] border-[#333] text-white"
                                />
                                <select
                                  value={editedSkillForm.level}
                                  onChange={e =>
                                    setEditedSkillForm({
                                      ...editedSkillForm,
                                      level: e.target.value,
                                    })
                                  }
                                  className="bg-[#262626] border-[#333] text-white rounded-lg px-4 py-2 w-full"
                                >
                                  <option value="Avancé">Avancé</option>
                                  <option value="Intermédiaire">
                                    Intermédiaire
                                  </option>
                                  <option value="Débutant">Débutant</option>
                                </select>

                                <div className="space-y-2">
                                  <label className="block text-sm text-[#a1a1aa]">
                                    Technologies (Nom et Pourcentage)
                                  </label>
                                  {editedSkillForm.technologies.map(
                                    (tech, index) => (
                                      <div key={index} className="flex gap-2">
                                        <Input
                                          placeholder="Nom de la technologie"
                                          value={tech.name}
                                          onChange={e => {
                                            const updatedTechs = [
                                              ...editedSkillForm.technologies,
                                            ];
                                            updatedTechs[index].name =
                                              e.target.value;
                                            setEditedSkillForm({
                                              ...editedSkillForm,
                                              technologies: updatedTechs,
                                            });
                                          }}
                                          className="bg-[#262626] border-[#333] text-white flex-1"
                                        />
                                        <Input
                                          type="number"
                                          placeholder="Pourcentage (0-100)"
                                          value={tech.level}
                                          onChange={e => {
                                            const updatedTechs = [
                                              ...editedSkillForm.technologies,
                                            ];
                                            updatedTechs[index].level = parseInt(
                                              e.target.value
                                            );
                                            setEditedSkillForm({
                                              ...editedSkillForm,
                                              technologies: updatedTechs,
                                            });
                                          }}
                                          min="0"
                                          max="100"
                                          className="bg-[#262626] border-[#333] text-white w-24"
                                        />
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            const updatedTechs =
                                              editedSkillForm.technologies.filter(
                                                (_, i) => i !== index
                                              );
                                            setEditedSkillForm({
                                              ...editedSkillForm,
                                              technologies: updatedTechs,
                                            });
                                          }}
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    )
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      setEditedSkillForm({
                                        ...editedSkillForm,
                                        technologies: [
                                          ...editedSkillForm.technologies,
                                          { name: "", level: 0 },
                                        ],
                                      })
                                    }
                                    className="w-full border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white"
                                  >
                                    <Plus className="w-4 h-4 mr-2" /> Ajouter une
                                    technologie
                                  </Button>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={handleSaveEditedSkill}
                                    className="flex-1 bg-[#0066ff] hover:bg-[#0052cc]"
                                  >
                                    <Save className="w-4 h-4 mr-2" /> Sauvegarder
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={handleCancelEditSkill}
                                    className="flex-1 border-[#333] text-[#a1a1aa]"
                                  >
                                    <X className="w-4 h-4" /> Annuler
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // Display Mode for Skill
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <GripVertical
                                    className="w-5 h-5 text-[#71717a] cursor-grab active:cursor-grabbing"
                                    {...attributes}
                                    {...listeners}
                                  />
                                  <div>
                                    <h3 className="font-semibold text-white">
                                      {skill.category}
                                    </h3>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {(Array.isArray(skill.technologies)
                                        ? skill.technologies
                                        : []
                                      ).map((tech: any, i: number) => (
                                        <Badge
                                          key={i}
                                          variant="outline"
                                          className="text-xs border-[#333] text-[#a1a1aa]"
                                        >
                                          {tech.name}
                                        </Badge>
                                      ))}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="mt-2 border-[#333] text-[#a1a1aa]"
                                    >
                                      {skill.level}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleEditSkillClick(skill);
                                    }}
                                    aria-label="Modifier la compétence"
                                  >
                                    <Edit className="w-4 h-4 text-[#0066ff]" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={e => e.stopPropagation()}
                                        aria-label="Supprimer la compétence"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-[#1a1a1a] border-[#333] text-white">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="text-white">
                                          Confirmer la suppression
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-[#a1a1aa]">
                                          Êtes-vous sûr de vouloir supprimer cette
                                          compétence ? Cette action est
                                          irréversible.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="border-[#333] text-[#1a1a1aa] hover:bg-[#262626]">
                                          Annuler
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteSkill(skill.id)
                                          }
                                          className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                          Supprimer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </SortableSkill>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-[#1a1a1a] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#0066ff]" />
                    Informations de Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingContact ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Email
                        </label>
                        <Input
                          value={contactForm.email}
                          onChange={e =>
                            setContactForm({
                              ...contactForm,
                              email: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Téléphone
                        </label>
                        <Input
                          value={contactForm.phone}
                          onChange={e =>
                            setContactForm({
                              ...contactForm,
                              phone: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          GitHub
                        </label>
                        <Input
                          value={contactForm.github_url}
                          onChange={e =>
                            setContactForm({
                              ...contactForm,
                              github_url: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          LinkedIn
                        </label>
                        <Input
                          value={contactForm.linkedin_url}
                          onChange={e =>
                            setContactForm({
                              ...contactForm,
                              linkedin_url: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2">
                          Localisation
                        </label>
                        <Input
                          value={contactForm.location}
                          onChange={e =>
                            setContactForm({
                              ...contactForm,
                              location: e.target.value,
                            })
                          }
                          className="bg-[#262626] border-[#333] text-white"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveContact}
                          className="bg-[#0066ff] hover:bg-[#0052cc]"
                        >
                          <Save className="w-4 h-4 mr-2" /> Sauvegarder
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingContact(false)}
                          className="border-[#333] text-[#a1a1aa]"
                        >
                          <X className="w-4 h-4" /> Annuler
                        </Button>
                      </div>
                    </div>
                  ) : contactInfo ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-[#262626] rounded-lg">
                        <Mail className="w-5 h-5 text-[#0066ff]" />
                        <span className="text-white">{contactInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-[#262626] rounded-lg">
                        <span className="text-[#0066ff]">📱</span>
                        <span className="text-white">{contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-[#262626] rounded-lg">
                        <span className="text-[#0066ff]">📍</span>
                        <span className="text-white">
                          {contactInfo.location}
                        </span>
                      </div>
                      <Button
                        onClick={() => {
                          setContactForm({
                            email: contactInfo?.email || "",
                            phone: contactInfo?.phone || "",
                            github_url: contactInfo?.github_url || "",
                            linkedin_url: contactInfo?.linkedin_url || "",
                            location: contactInfo?.location || "",
                          });
                          setEditingContact(true);
                        }}
                        className="mt-4 bg-[#0066ff] hover:bg-[#0052cc]"
                      >
                        <Edit className="w-4 h-4 mr-2" /> Modifier
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Mail className="w-16 h-16 text-[#333] mx-auto mb-4" />
                      <p className="text-[#71717a] mb-4">
                        Aucun contact configuré
                      </p>
                      <Button
                        onClick={() => setEditingContact(true)}
                        className="bg-[#0066ff] hover:bg-[#0052cc]"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Ajouter des contacts
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="bg-[#1a1a1a] border-[#333]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#0066ff]" />
                  Messages Reçus
                </CardTitle>
                <CardDescription className="text-[#71717a]">
                  Consultez et gérez les messages envoyés via le formulaire de
                  contact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Message Search and Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Rechercher des messages par nom, email, sujet ou contenu..."
                    value={messageSearchTerm}
                    onChange={e => setMessageSearchTerm(e.target.value)}
                    className="bg-[#1a1a1a] border-[#333] text-white placeholder-[#71717a] focus:border-[#0066ff] flex-1"
                  />
                  <div className="flex gap-2">
                    <select
                      value={messageSortKey}
                      onChange={e => setMessageSortKey(e.target.value)}
                      className="bg-[#1a1a1a] border-[#333] text-white rounded-lg px-4 py-2"
                    >
                      <option value="created_at">Date</option>
                      <option value="name">Nom</option>
                      <option value="email">Email</option>
                      <option value="subject">Sujet</option>
                    </select>
                    <Button
                      variant="outline"
                      className="border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white"
                      onClick={() =>
                        setMessageSortDirection(prev =>
                          prev === "asc" ? "desc" : "asc"
                        )
                      }
                    >
                      {messageSortDirection === "asc" ? "▲" : "▼"}
                    </Button>
                  </div>
                </div>

                {sortedAndFilteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-[#a1a1aa]">
                    Aucun message reçu pour le moment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedAndFilteredMessages.map((message: any) => (
                      <Card
                        key={message.id}
                        className="bg-[#262626] border-[#333]"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-semibold">
                                {message.subject || "Pas de sujet"}
                              </p>
                              <p className="text-[#a1a1aa] text-sm">
                                De: {message.name} &lt;{message.email}&gt;
                              </p>
                              <p className="text-[#71717a] text-sm">
                                Reçu le:{" "}
                                {new Date(message.created_at).toLocaleString()}
                              </p>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  aria-label="Supprimer le message"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">
                                    Confirmer la suppression
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-[#a1a1aa]">
                                    Êtes-vous sûr de vouloir supprimer ce
                                    message ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-[#333] text-[#a1a1aa] hover:bg-[#262626]">
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteMessage(message.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <p className="text-[#e0e0e0] text-sm mt-2">
                            {message.message}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <Card className="bg-[#1a1a1a] border-[#333]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#0066ff]" />
                  Gestion des Fichiers
                </CardTitle>
                <CardDescription className="text-[#71717a]">
                  Uploadez des images et documents pour votre portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload Buttons */}
                <div className="flex gap-4 mb-8">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={e => handleUpload(e, "image")}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#0066ff] hover:bg-[#0052cc]"
                      disabled={uploading}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      {uploading ? "Upload..." : "Uploader Images"}
                    </Button>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={e => handleUpload(e, "document")}
                      accept=".pdf,.doc,.docx,.txt"
                      multiple
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-[#333] text-[#a1a1aa] hover:bg-[#0066ff] hover:text-white"
                      disabled={uploading}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Uploader Documents
                    </Button>
                  </div>
                </div>

                {/* Files Grid */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map(file => (
                    <Card key={file.id} className="bg-[#262626] border-[#333]">
                      <CardContent className="p-3">
                        <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                          {["jpg", "jpeg", "png", "gif", "webp"].includes(
                            file.type
                          ) ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <FileText className="w-8 h-8 text-[#71717a]" />
                          )}
                        </div>
                        <p className="text-xs text-[#a1a1aa] truncate mb-2">
                          {file.name}
                        </p>
                        <div className="flex gap-1">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs border-[#333]"
                              aria-label="Voir le fichier"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                            </Button>
                          </a>
                          <a href={file.url} download className="flex-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs border-[#333]"
                              aria-label="Télécharger le fichier"
                            >
                              <Download className="w-3 h-3 mr-1" />
                            </Button>
                          </a>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                aria-label="Supprimer le fichier"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#1a1a1a] border-[#333] text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">
                                  Confirmer la suppression
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-[#a1a1aa]">
                                  Êtes-vous sûr de vouloir supprimer le fichier
                                  "{file.name}" ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-[#333] text-[#a1a1aa] hover:bg-[#262626]">
                                  Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteFile(file)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}