# Guide de Design UX/UI - Portfolio SIKATI BIAKOLO MBARGA PIERRE

## 1. Philosophie de Design

Le portfolio adopte une approche **Minimalist Brutalism** qui combine l'élégance épurée avec la confiance technique. Cette philosophie reflète la discipline, la rigueur et l'innovation qui caractérisent le profil de SIKATI.

### Principes Fondamentaux

**Authenticité Technique :** Chaque élément de design sert un objectif fonctionnel. Pas de décoration superflue, mais une présentation claire et directe de la compétence.

**Confiance par la Clarté :** La structure épurée et la hiérarchie visuelle claire inspirent confiance et professionnalisme auprès des recruteurs et décideurs.

**Géométrie Intentionnelle :** Les formes géométriques et les alignements asymétriques créent du dynamisme tout en maintenant la rigueur.

**Espace Respirant :** Le whitespace généreux permet au contenu de respirer et facilite la lecture et la compréhension.

---

## 2. Palette de Couleurs

### Couleurs Primaires

| Couleur | Valeur | Utilisation | Signification |
|---------|--------|------------|--------------|
| **Charcoal** | #1a1a1a | Fond principal, texte dominant | Autorité, tech, sérieux |
| **Off-White** | #f8f8f8 | Fond secondaire, cartes | Clarté, espace |
| **Electric Blue** | #0066ff | CTAs, accents, highlights | Innovation, énergie |

### Couleurs Secondaires

| Couleur | Valeur | Utilisation |
|---------|--------|------------|
| **Slate Gray** | #64748b | Texte secondaire, borders |
| **Light Gray** | #e2e8f0 | Dividers, subtle backgrounds |
| **Dark Blue** | #003d99 | Hover states, interactive elements |

### Rationale Chromatique

La palette monochromatic (charcoal + off-white) crée une fondation solide et intemporelle. L'electric blue fonctionne comme accent stratégique qui attire l'attention sur les éléments critiques (boutons CTA, projets vedettes, liens) sans surcharger visuellement. Cette combinaison est particulièrement efficace pour un portfolio tech car elle communique la discipline et la modernité.

---

## 3. Système Typographique

### Hiérarchie Typographique

| Niveau | Police | Poids | Taille | Utilisation |
|--------|--------|-------|--------|------------|
| **Display** | Playfair Display | Bold (700) | 72px / 64px / 48px | Titres principaux, hero section |
| **Heading 1** | Playfair Display | Bold (700) | 48px | Titres de sections |
| **Heading 2** | IBM Plex Sans | Semi-Bold (600) | 32px | Sous-titres |
| **Heading 3** | IBM Plex Sans | Semi-Bold (600) | 24px | Titres de cartes |
| **Body** | IBM Plex Sans | Regular (400) | 16px | Texte principal |
| **Small** | IBM Plex Sans | Regular (400) | 14px | Texte secondaire |
| **Mono** | IBM Plex Mono | Regular (400) | 13px / 14px | Code, labels techniques |

### Rationale Typographique

**Playfair Display** pour les headings apporte une élégance intemporelle et une présence visuelle forte, contrastant avec la modernité de **IBM Plex Sans** pour le body. Cette combinaison crée une hiérarchie claire et mémorable. **IBM Plex Mono** pour les éléments techniques renforce l'authenticité du profil de développeur.

### Recommandations d'Utilisation

Les headings en Playfair Display doivent être utilisés avec parcimonie (maximum 2-3 par page) pour maintenir leur impact. Le line-height pour le body doit être d'au moins 1.6 pour assurer une lisibilité optimale. Les couleurs de texte doivent respecter un contraste minimum de 4.5:1 pour l'accessibilité.

---

## 4. Système d'Espacement

### Échelle de Spacing

L'espacement suit une échelle basée sur 8px pour assurer une cohérence visuelle :

| Valeur | Pixels | Utilisation |
|--------|--------|------------|
| xs | 4px | Micro-espacements |
| sm | 8px | Espacements internes mineurs |
| md | 16px | Espacements standards |
| lg | 24px | Espacements majeurs |
| xl | 32px | Espacements entre sections |
| 2xl | 48px | Espacements importants |
| 3xl | 64px | Espacements de section |

### Padding & Margin

Les sections principales utilisent un padding vertical de 64px (3xl) sur desktop et 48px (2xl) sur mobile. Les cartes et composants utilisent un padding de 24px (lg). Les marges entre éléments suivent l'échelle pour créer une cohérence visuelle.

---

## 5. Système de Composants

### Boutons

**Bouton Primaire (CTA)** : Fond electric blue (#0066ff), texte blanc, padding 12px 24px, border-radius 4px, transition 200ms. Hover state : fond dark blue (#003d99).

**Bouton Secondaire** : Fond transparent, border 2px electric blue, texte electric blue, padding 12px 24px, border-radius 4px. Hover state : fond light gray (#e2e8f0).

**Bouton Tertiary** : Texte electric blue, pas de border ni fond, underline au hover.

### Cartes de Projet

Les cartes de projet utilisent un fond off-white (#f8f8f8) avec un border subtil (1px #e2e8f0). Padding interne 24px. Au hover, une subtle shadow apparaît (0 4px 12px rgba(0,0,0,0.08)) et le contenu se décale légèrement vers le haut (transform: translateY(-4px)).

### Dividers & Lignes d'Accent

Les dividers horizontales utilisent une ligne de 1px #e2e8f0. Les lignes d'accent (geometric dividers) utilisent l'electric blue (#0066ff) avec une hauteur de 3-4px. Ces éléments créent une rupture visuelle intentionnelle entre les sections.

---

## 6. Structure de Mise en Page

### Layout Global

Le portfolio utilise une mise en page asymétrique qui combine un layout centré (max-width 1280px) avec des éléments qui débordent intentionnellement pour créer du dynamisme.

### Sections Principales

**Hero Section :** Full-width, fond charcoal (#1a1a1a), texte off-white (#f8f8f8). Contient un headline en Playfair Display (72px), une sous-ligne en IBM Plex Sans (18px), et un CTA button. Padding vertical 96px.

**About Section :** Layout asymétrique avec texte à gauche (60% width) et un élément visuel ou image à droite (40% width). Fond off-white (#f8f8f8).

**Skills Section :** Grille de cartes avec 3 colonnes sur desktop, 1 colonne sur mobile. Chaque carte contient un titre, une description et une liste de technologies.

**Projects Section :** Masonry grid avec des cartes de tailles variées. Les projets vedettes occupent 2 colonnes. Chaque carte affiche une image, titre, description, technologies et lien GitHub.

**Contact Section :** Centré, fond charcoal (#1a1a1a), texte off-white (#f8f8f8). Contient un formulaire ou des liens de contact.

### Breakpoints Responsifs

- **Desktop :** 1280px et plus
- **Tablet :** 768px à 1279px
- **Mobile :** 320px à 767px

---

## 7. Interactions & Animations

### Principes d'Animation

Les animations doivent être rapides et précises, reflétant l'esthétique brutalist. Pas de animations molles ou excessives. Les transitions doivent servir un objectif fonctionnel (indiquer un changement d'état, guider l'attention).

### Animations Spécifiques

**Scroll Reveal :** Les éléments apparaissent au scroll avec une fade-in + slide-up (opacity 0 → 1, transform translateY(20px) → 0) sur 600ms avec un délai staggeré de 100ms entre les éléments.

**Hover States :** Les boutons et cartes réagissent au hover avec une couleur de fond ou une subtle shadow. Transition 200ms pour la fluidité.

**Micro-interactions :** Les liens affichent un underline au hover. Les boutons affichent une légère scale (1.02x) au hover pour indiquer l'interactivité.

### Easing Functions

Utiliser `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design easing) pour les animations principales. Pour les micro-interactions, utiliser `ease-out` pour une sensation plus naturelle.

---

## 8. Imagerie & Visuels

### Style d'Imagerie

Les images doivent être modernes, épurées et techniquement pertinentes. Privilégier les images de haute qualité avec une composition claire. Pour les projets, utiliser des screenshots ou des mockups plutôt que des images génériques.

### Overlays & Traitement

Les images de projet peuvent utiliser un overlay subtil (charcoal avec 20% opacity) au hover pour améliorer la lisibilité du texte. Les images de background utilisent un gradient overlay pour assurer la lisibilité du texte par-dessus.

### Iconographie

Utiliser une bibliothèque d'icônes cohérente (ex. Lucide Icons, Feather Icons). Les icônes doivent être minimalistes et géométriques, alignées avec l'esthétique brutalist. Taille standard : 24px pour les icônes principales, 16px pour les icônes secondaires.

---

## 9. Accessibilité

### Contraste & Lisibilité

Tous les textes doivent respecter un ratio de contraste minimum de 4.5:1 pour les textes normaux et 3:1 pour les textes grands. Le charcoal (#1a1a1a) sur off-white (#f8f8f8) offre un excellent contraste (17.5:1).

### Navigation Clavier

Tous les éléments interactifs doivent être accessibles au clavier. Les focus states doivent être visibles (outline ou ring de couleur).

### Sémantique HTML

Utiliser une structure HTML sémantique (header, nav, main, section, article, footer). Les headings doivent suivre une hiérarchie logique (h1 → h2 → h3).

### Texte Alternatif

Toutes les images doivent avoir un alt text descriptif. Les icônes décoratives peuvent avoir un aria-hidden="true".

---

## 10. Performance & Optimisation

### Optimisation d'Images

Les images doivent être optimisées pour le web (compressées, au format moderne comme WebP). Utiliser la technique du responsive images (srcset) pour servir des images adaptées à la taille de l'écran.

### Lazy Loading

Les images en-dessous du fold doivent utiliser le lazy loading pour améliorer les performances initiales.

### CSS & JavaScript

Minimiser le CSS et le JavaScript. Utiliser des frameworks comme Tailwind CSS pour réduire la taille du CSS. Éviter les animations lourdes qui impactent les performances.

---

## 11. Recommandations GitHub

### Optimisation du Profil GitHub

**Photo de Profil :** Utiliser une photo professionnelle de haute qualité, bien éclairée et avec un fond neutre.

**Bio :** "Développeur Web & Mobile | Réseaux & Cybersécurité | Étudiant en L3 Informatique 🚀"

**README Professionnel :** Créer un README personnalisé avec une introduction, les compétences clés, les projets vedettes et les statistiques GitHub.

**Épingler les Projets :** Épingler 6 projets représentatifs (mix de web, mobile, réseau, sécurité, ML) pour les mettre en avant.

**Descriptions Complètes :** Chaque projet doit avoir une description claire, un README bien structuré, et un lien vers la démo en ligne si applicable.

**Badges & Statistiques :** Utiliser des badges pour afficher les technologies utilisées, les stats GitHub (commits, contributions) et les certifications.

---

## 12. Palette de Couleurs Détaillée (CSS/Tailwind)

```css
:root {
  --color-charcoal: #1a1a1a;
  --color-off-white: #f8f8f8;
  --color-electric-blue: #0066ff;
  --color-dark-blue: #003d99;
  --color-slate-gray: #64748b;
  --color-light-gray: #e2e8f0;
  --color-border: #e2e8f0;
}

/* Tailwind Configuration */
colors: {
  charcoal: '#1a1a1a',
  'off-white': '#f8f8f8',
  'electric-blue': '#0066ff',
  'dark-blue': '#003d99',
  'slate-gray': '#64748b',
  'light-gray': '#e2e8f0',
}
```

---

## 13. Checklist de Mise en Œuvre

- [ ] Importer les polices Google (Playfair Display, IBM Plex Sans, IBM Plex Mono)
- [ ] Configurer les variables CSS pour la palette de couleurs
- [ ] Créer les composants de base (Button, Card, Section)
- [ ] Implémenter la structure de mise en page responsive
- [ ] Ajouter les animations et transitions
- [ ] Optimiser les images et les performances
- [ ] Tester l'accessibilité (contraste, navigation clavier)
- [ ] Tester sur différents appareils et navigateurs
- [ ] Valider le HTML et le CSS
- [ ] Mesurer les Core Web Vitals

---

## 14. Ressources & Références

**Polices Google :**
- Playfair Display : https://fonts.google.com/specimen/Playfair+Display
- IBM Plex Sans : https://fonts.google.com/specimen/IBM+Plex+Sans
- IBM Plex Mono : https://fonts.google.com/specimen/IBM+Plex+Mono

**Iconographie :**
- Lucide Icons : https://lucide.dev
- Feather Icons : https://feathericons.com

**Outils de Design :**
- Figma pour les maquettes
- ColorHexa pour les analyses de couleurs
- WebAIM pour les tests de contraste

**Inspiration & Références :**
- Dribbble : Rechercher "minimalist portfolio" et "tech portfolio"
- Awwwards : Portfolios tech primés
- GitHub : Profils GitHub professionnels d'autres développeurs
