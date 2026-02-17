import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <style>{`
        [data-sonner-type="success"] {
          background-color: #d4edda !important; /* Light green */
          color: #155724 !important; /* Dark green */
          border-color: #c3e6cb !important; /* Medium green */
        }
        [data-sonner-type="error"] {
          background-color: #f8d7da !important; /* Light red */
          color: #721c24 !important; /* Dark red */
          border-color: #f5c6cb !important; /* Medium red */
        }
        [data-sonner-type="warning"] {
          background-color: #fff3cd !important; /* Light orange/yellow */
          color: #856404 !important; /* Dark orange/yellow */
          border-color: #ffeeba !important; /* Medium orange/yellow */
        }
        /* Default/normal toast styling if needed, otherwise it will be white/black */
        [data-sonner-type="normal"] {
          background-color: white !important;
          color: black !important;
          border-color: lightgray !important;
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]} // Keep dynamic theme from next-themes
        className="toaster group"
        toastOptions={{
          classNames: {
            // Keep default classNames for structural elements, but colors are handled by explicit style
            toast:
              "group toast group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        {...props}
      />
    </>
  );
};

export { Toaster };
