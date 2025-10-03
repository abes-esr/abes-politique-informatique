# Documentation développeur du système docusaurus de la "Politique informatique de l'Abes"

Le site https://politique-informatique.abes.fr/ est construit à l'aide de [Docusaurus](https://docusaurus.io/)

La documentation ci-dessous explique comment docusorus est paramétré pour les besoins de publication du site de la "politique informatique de l'Abes"

## Démarrage du site

Prérequis : disposer de "npm" en local.

Pour démarrer le site en local, suivant la procédure suivante :

```bash
git clone https://github.com/abes-esr/abes-politique-informatique/
cd abes-politique-informatique/
npm install
npm start
```

>[!CAUTION]
> 
> À chaque ajout/modification de page, il est important d'en vérifier la bonne syntaxe, notamment
>
> - des liens internes qui doivent être valides
> - de la mise entre accolades ouvrantes (`[AltGr] + [7]`) du code, en particulier les REGEX
> - de la bonne hiérarchisation des titres de niveau 1 `#` à 6 `######`
> 
> Le non-respect de ces bonnes pratiques entrainera une erreur lors de la compilation du code et l'indisponibilité du site

## Fichiers Markdown
Les fichiers Markdown contenant la politique de développement se situent dans le répertoire `docs`.

## Indexations des fichiers Markdown
L'indexation des fichiers Markdown s'effectue dans le fichier `sidebars.js` :
```yaml
const sidebars = {
  poldevSidebar: [
   'readme',
   'Gestion du code source',
   'Intégration continue',
   'Environnements de développement, test et production',
   'Environnement de développement intégré',
   'Architecture des projets',
   'Tests unitaires et d\'intégration',
   'Qualité de code',
   'Documentation',
   'Sécurité',
   'FAQ',
   'RGAA',
   'Gestion des API',
],
```

Modifier l'ordre des fichiers markdown dans cette liste (`tutorialSidebar`) modifiera l'ordre d'affichage sur le site (liste des fichiers Markdown affichée à gauche).
>[!NOTE]
>
> Les labels attribués à chaque fichier md sont définis automatiquement lors de l'ajout d'un fichier md.

Le chargement du fichier `sidebars.js` s'effectue dans le fichier `docusaurus.config.js` :
```yaml
  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/abes-esr/abes-politique-developpement',
        },
      }),
    ],
  ],
```

## Outil de recherche
La recherche au sein des fichiers Markdown est prise en charge par la dépendance `docusaurus-lunr-search` (_[docusaurus-lunr-search](https://www.npmjs.com/package/docusaurus-lunr-search)_)
L'affichage du champ de recherche se règle dans le fichier `docusaurus.config.js` :
```yaml
  themeConfig:
    ({
      navbar: {
        items: [
          {
            type: 'search',
            position: 'right',
          },
        ]
      }
    })
```

## Apparence

### Thèmes
Les couleurs des thèmes clair et sombre peuvent être modifiées dans le fichier `src/css/custom.css`.

Le chargement du fichier `custom.css` s'effectue dans le fichier `docusaurus.config.js` :
```yaml
  presets: [
    [
      'classic',
      ({
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
```

L'affichage du bouton de sélection du thème se règle dans le fichier `docusaurus.config.js` :
```yaml
  themeConfig:
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
    }),
```

### Table des matières
La table des matières (_affichée à droite_) s'effectue automatiquement. 
Il est possible de régler le niveau d'affichage des titres Markdown au niveau global (du niveau 2 au niveau 6) dans le fichier `docusaurus.config.js` :
```yaml
  themeConfig:
    ({
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 2,
      },
    })
```

Il est possible de régler le niveau d'affichage des titres Markdown d'une page spécifique (du niveau 2 au niveau 6) directement dans le fichier Markdown concerné :
```yaml
---
toc_min_heading_level: 2
toc_max_heading_level: 5
---
```
>[!NOTE]
> 
> Ce code doit être placé au début du fichier Markdown

Le formatage graphique de la table des matières est nativement géré par Docusaurus. Il est néanmoins possible de modifier son aspect graphique
en passant par le fichier `src/css/custom.css` :
```css
/* personalisation de la table des matières des pages Markdown (équivalent aux titres Markdown) */
ul.table-of-contents li:hover {
  padding-right: 8px;
  padding-left: 8px;
  border-radius: 5px;
  background: #f6f6f6;
  color: #222f54;
}

ul.table-of-contents li a {
  padding-right: 8px;
  padding-left: 8px;
  border-radius: 5px;
  background: #f6f6f6;
  color: #222f54;
}
```
