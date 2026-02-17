export const portfolioData = {
  hero: {
    title: "PIERRE SIKATI MBARGA",
    subtitle:
      "Développeur Web & Mobile | Administrateur Réseaux | Passionné par la Cybersécurité & l'IA",
    description:
      "Étudiant en Licence 3 Informatique au Cameroun, je conçois des solutions technologiques modernes et sécurisées. Avec une approche polyvalente et disciplinée, je combine développement full-stack, infrastructure réseau et innovation en cybersécurité pour créer de l'impact durable.",
    cta: {
      primary: "Collaborons sur votre prochain projet",
      secondary: "Voir mes projets",
    },
  },

  about: {
    title: "À Propos de Moi",
    paragraphs: [
      "Je suis actuellement en Licence 3 Informatique, avec une formation solide en algorithmique, structures de données, programmation orientée objet et architecture logicielle. Mon parcours académique m'a permis de développer une compréhension profonde des principes fondamentaux de l'informatique, tout en explorant des domaines spécialisés comme les réseaux, la sécurité et l'apprentissage automatique.",
      "Originaire du Cameroun, je suis motivé par la conviction que la technologie peut transformer les sociétés africaines. Mon objectif est de devenir un expert IT capable de concevoir des solutions innovantes, sécurisées et adaptées aux contextes africains. Je crois en l'apprentissage continu, l'excellence technique et l'impact social positif.",
      "Je maîtrise l'art de l'auto-apprentissage. Que ce soit par la documentation technique, les cours en ligne, les projets personnels ou l'expérimentation, je sais identifier les lacunes et les combler rapidement. Cette discipline est essentielle dans un domaine aussi dynamique que l'informatique.",
    ],
    stats: [
      { label: "Projets Complets", value: "15+" },
      { label: "Technologies Maîtrisées", value: "20+" },
      { label: "Années d'Expérience", value: "3+" },
      { label: "Certifications en Cours", value: "2" },
    ],
  },

  skills: {
    title: "Compétences Techniques",
    categories: [
      {
        title: "Développement Web & Mobile",
        icon: "Code",
        level: "Avancé",
        technologies: [
          { name: "React", level: 90 },
          { name: "TypeScript", level: 85 },
          { name: "Node.js", level: 80 },
          { name: "Tailwind CSS", level: 88 },
          { name: "Vue.js", level: 75 },
        ],
      },
      {
        title: "Administration Réseaux",
        icon: "Network",
        level: "Intermédiaire",
        technologies: [
          { name: "Cisco IOS", level: 70 },
          { name: "Linux", level: 75 },
          { name: "TCP/IP", level: 80 },
          { name: "VPN", level: 65 },
          { name: "Pare-feu", level: 70 },
        ],
      },
      {
        title: "Cybersécurité",
        icon: "Shield",
        level: "Débutant",
        technologies: [
          { name: "Kali Linux", level: 60 },
          { name: "Burp Suite", level: 55 },
          { name: "OWASP", level: 65 },
          { name: "Pentesting", level: 50 },
          { name: "Cryptographie", level: 60 },
        ],
      },
      {
        title: "Machine Learning & IA",
        icon: "Brain",
        level: "Débutant",
        technologies: [
          { name: "Python", level: 70 },
          { name: "Scikit-learn", level: 60 },
          { name: "TensorFlow", level: 55 },
          { name: "Pandas", level: 65 },
          { name: "Jupyter", level: 70 },
        ],
      },
    ],
  },

  projects: [
    {
      id: 1,
      title: "Platforme E-Learning Camerounaise",
      description:
        "Application web complète pour l'éducation en ligne avec gestion des cours, paiements mobiles et suivi de progression.",
      image: "/api/placeholder/600/400",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      category: "web",
      github: "https://github.com/sikati/elearning-platform",
      demo: "https://elearning-demo.vercel.app",
      featured: true,
    },
    {
      id: 2,
      title: "App Mobile Santé Plus",
      description:
        "Application mobile pour la prise de rendez-vous médicaux et téléconsultation au Cameroun.",
      image: "/api/placeholder/600/400",
      technologies: ["React Native", "Firebase", "Redux", "Expo"],
      category: "mobile",
      github: "https://github.com/sikati/sante-plus-app",
      demo: "https://expo.dev/@sikati/sante-plus",
      featured: true,
    },
    {
      id: 3,
      title: "Réseau Sécurisé PME",
      description:
        "Architecture réseau complète avec sécurité avancée pour PME camerounaises.",
      image: "/api/placeholder/600/400",
      technologies: ["Cisco", "Linux", "VPN", "Pare-feu", "Wireshark"],
      category: "network",
      github: "https://github.com/sikati/pme-network-security",
      featured: false,
    },
    {
      id: 4,
      title: "Security Audit Tool",
      description:
        "Outil d'audit de sécurité automatisé pour applications web avec rapports détaillés.",
      image: "/api/placeholder/600/400",
      technologies: ["Python", "Burp Suite", "Kali Linux", "Docker"],
      category: "security",
      github: "https://github.com/sikati/security-audit-tool",
      featured: false,
    },
    {
      id: 5,
      title: "ML Predictive Analytics",
      description:
        "Modèle de machine learning pour prédiction des tendances du marché camerounais.",
      image: "/api/placeholder/600/400",
      technologies: [
        "Python",
        "Scikit-learn",
        "TensorFlow",
        "Pandas",
        "Jupyter",
      ],
      category: "ml",
      github: "https://github.com/sikati/ml-predictive-analytics",
      featured: false,
    },
  ],

  contact: {
    title: "Contact",
    description:
      "Intéressé par une collaboration ou avez un projet en tête ? Je serais ravi de discuter comment je peux contribuer.",
    email: "sikati.pierre@example.com",
    phone: "+237 XXX XXX XXX",
    linkedin: "https://linkedin.com/in/sikati-pierre",
    github: "https://github.com/sikati",
    address: "Cameroun",
  },
};
