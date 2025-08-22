
# RGAA


L'accessibilité du web est la possibilité d'accéder aux contenus et services web pour les personnes handicapées (visuels, auditifs, moteurs, neurologiques, handicapées temporaires, etc.), pour les personnes âgées ou peu habituées aux conténus et services web et plus généralement pour tous les utilisateurs, quels que soient leurs moyens d'accès (mobile, tablette, ordinateur, télévision, etc.) ou leur conditions d'environnement (luminosité, niveau sonore, bande passante réduite, etc.)

Les pratiques d'accessibilité ont pour vocation de réduire ou supprimer les obstacles qui empêchent les utilisateurs d'accéder ou d'interagir avec des services. Le respect de ces pratiques s'applique autant aux UX/UI designers lors de la conception de l'identité graphique et du fonctionnement d'un projet web, qu'aux équipes de développement lors de l'écriture du code d'un projet.

Les acteurs et actrices qui participent à la création d'un service web doivent considérer que les utilisateurs peuvent :

* ne pas pouvoir entendre, bouger, voir;
* rencontrer des difficultés à lire ou à comprendre le contenu textuel ;
* ne pas posséder, ou ne pas être en mesure d'utiliser un clavier ou une souris ;
* utiliser un écran n'affichant que le texte, un petit écran ou une connexion internet lente ;
* ne pas comprendre couramment la langue dans laquelle le document est rédigé ;
* se trouver dans une situation où leurs yeux, leurs oreilles ou leurs moans sont occupés ou gênés ;
* utiliser une version ancienne d'un logiciel de consultation, un logiciel entièrement différent ou un système d'exploitation différent.

La prise en compte de ces problématiques est essentielle afin de rendre les services web accessibles à tous.


## RGAA en pratique

RGAA en pratique pour les équipes de développement VueJS.

La structure d'une application web est importante. En effet, celle-ci peut être lu par un lecteur d'écran
et servir à la navigation. De fait, il est nécessaire d'y porter une attention particulière.
En ce sens, il faut définir des zones avec les balises HTML correspondantes
(```<header>```, ```<main>```, ```<nav>```, ```<footer>```, ```<section>```).
Leur présence oblige à veiller à ne pas surcharger le code avec une imbrication d'UI Component et/ou de balises HTML
(```<v-container>```, ```<div>```, ```<section>```, ```<v-sheet>```, etc.) qui pourraient être fusionnée
en une seule balise HTML ou un seul UI Component VueJs.

La plupart des UI Component VueJs génère un code HTML propre et lisible par les lecteurs d'écran
(```<v-btn>```, ```<v-img>```, etc.).  
Néanmoins, certains d'entre eux génèrent des erreurs sur les ```aria-label```, ```role``` ou ```id``` qu'il n'est,
pour le moment, pas possible de corriger (```<v-expansion-panel>```, ```<v-combobox>```, ```<v-radio-group>```, ```<v-data-table>```).  
D'autres encore, ne génèrent pas d'informations exploitables pour les lecteurs d'écran. Il est donc nécessaire de remédier à ce problème.

Voici listé ci-dessous quelques UI Component VueJs et les méthodes pour améliorer leur accessibilité.

### Image

La balise HTML ```<img>``` et l'UI Component VueJs ```<v-img>``` possédant toutes les deux un attribut ```alt=""```,
la mise en place de description est facilitée.

*Exemple :*
```HTML
<img src="/img/logo.svg" alt="logo [nom_de_l_application]">
```
ou :
```HTML
<v-img src="/img/logo.svg" alt="logo [nom_de_l_application]">
```

### Icône

L'UI Component VueJs ```<v-icon>``` ne prend pas en compte l'attribut ```alt```.
De plus, un ```<v-icon>``` simple (ex : ```<v-icon>mdi-home< /v-icon>```) ne permet pas
l'utilisation d'un ```aria-label```, même si ce dernier est associé à un ```role="img"```.
Il ne renverra donc aucune information exploitable pour un lecteur de d'écran.
Pour palier ce problème, une solution existe.

*Exemple avec utilisation d'une balise HTML ```<div>``` :*
```HTML
<div aria-label="Premièrement" role="img">
    <v-icon>mdi-numeric-1-box</v-icon>
</div>
```

:information_source: L'ajout de l'attribut ```@click=""``` à un UI Component ```<v-icon>```
le transformera, une fois le code VueJs compilé, en balise HTML ```<button>```.
La solution proposée ci-dessus n'est donc pas recommandée, car elle lèverait une erreur d'association role-balise.  
La solution consiste à simplement ajouter un ```aria-label``` au ```<v-icon>``` :

*Exemple d'un ```<v-icon>``` possédant un attribut ```@click```:*
```HTML
<v-icon @click="goToHome()" aria-label="Retourner à l'accueil">mdi-home</v-icon>
```

### Titre

Utiliser les balises HTML ```<h1>``` à ```<h6>```, afin que les lecteurs d'écran puissent les détecter et permettre la navigation par titre au clavier.

*Exemple d'un titre avec un style dans un fichier css lié au projet :*
```HTML
<h2>Premier titre simple</h2>
```

```CSS
h2 {
  font-size: 1.26em; 
  color : #252C61; 
  font-weight: bold;
}
```
### Titre et icône imbriquée

Dans le cas des titres avec numérotation par icônes,
il est possible d'imbriquer une ```<v-icon>``` de numérotation dans un titre (```<h1>``` à ```<h6>```).  
Il n'est pas nécessaire d'appliquer un ```aria-label``` ainsi qu'un ```role="img"``` à l'icône.
En effet, la ```<v-icon>``` étant imbriquée dans le titre (```<h1>``` à ```<h6>```),
le titre sera lu par le lecteur d'écran au passage de la souris sur la ```<v-icon>```.

*Exemple d'une icône de numérotation imbriquée dans un titre :*
```HTML
<h2>
    <v-icon color="#252C61" style="margin-top: -4px">mdi-numeric-1-box</v-icon>
    Premier titre
</h2>
```

:information_source: un ```margin-top``` négatif peut être appliqué à l'icône afin que le titre s'aligne sur elle au mieux,
dans le cas où un ```vertical-align``` (```baseline```, ```text-top```, ```text-bottom```, ```sub``` ou ```super```)
ne le permet pas efficacement.

### Tableau

Les contenus des tableaux sont régis selon les mêmes principes que leur type de base.
C'est-à-dire que les titres de colonne sont du texte et seront donc lus comme du texte.

Les images et icônes, elles, seront traitées comme tel. À ce propos, voir : [image](#image) ou [icone](#icone) plus haut.

### Bouton

Plusieurs types de boutons existe. Chacun sera lu et interprété différemment par les lecteurs d'écran.

1. Cas d'un bouton avec un label (contenu écrit dans le bouton). Le texte sera lu directement par un lecteur d'écran et reconnu comme un bouton dans la structure de la page.

    *Exemple d'un bouton simple :*
    ```HTML
      <v-btn text tile color="blue" value="accueil" to="/accueil">
      Accueil
      </v-btn>
    ```

2. Cas d'un bouton avec un texte et une icône. 
Le texte sera lu directement par un lecteur d'écran et reconnu comme un bouton dans la structure de la page.  
Dans ce cas, il n'est pas possible d'utiliser une balise ```<div>``` qui englobe l'UI Component ```<v-icon>```
(comme vu dans le chapitre sur les [icônes](#icone)), 
car cela génère un conflit aria-role entre le ```<v-btn>``` et le ```<v-icon>```.

    *Exemple d'un bouton avec texte et icône :*
    ```HTML
    <v-btn text value="accueil" to="/accueil">
        Accueil
    <v-icon alt="Accueil">mdi-home</v-icon>
    </v-btn>
    ```

### Navigation

La balise HTML ```<nav>``` permet la reconnaissance d'une zone de navigation comme élément de structure par les lecteurs d'écran,
offrant de fait plus d'option de navigation, notamment au clavier. Une seule zone de navigation devrait être spécifiée
pour une application.

*Exemple de navigation par bouton :*
```HTML
<nav aria-label="navigation">
    <v-row role="toolbar">
        <v-btn text value="accueil">Accueil</v-btn>
        <v-btn text value="page1">Page 1</v-btn>
        <v-btn text value="page2">Page 2</v-btn>
    </v-row>
</nav>
```

*Exemple de navigation par fil d'Ariane (code HTML et CSS associé) :*
```HTML
<nav aria-label="fil d'Ariane" class="filAriane">
    <ul>
        <li>
            <span @click="$router.push({path: '/'})" class="v-slider__thumb">Accueil</span>
        </li>
        <li>
            <span @click="$router.push({path: '/'})" class="v-slider__thumb">Interface de vérification</span>
        </li>
        <li>
            <div aria-current="page">Historique des analysess</div>
        </li>
    </ul>
</nav>
```
```CSS
.filAriane {
    padding: 0 .5rem;
    color: #595959;
}

.filAriane ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
}

.filAriane li:not(:last-child)::after {
    display: inline-block;
    margin: 0 .25rem;
    content: ">";
}

.filAriane span {
    color: #595959;
    cursor: pointer;
}

.filAriane span:hover {
    color: #9a3614;
    cursor: pointer;
    text-decoration: underline;
}
```

### Lien

La balise HTML ```<a>```, permet la création de lien. Elle doit être complétée par un attribut ```aria-label```
qui reprend le texte du lien et le complète d'informations utiles aux personnes se servant de logiciel d'aide
à la navigation. De plus, les liens vers des pages externes au site d'origine doivent être ouvert dans un
nouvel onglet et signalé comme tel pour les utilisateurs.

*Exemple :*
```HTML
<a href="https://abes.fr/mentions-legales/" aria-label="Ouvre, dans un nouvel onglet du navigateur, la page internet de l'Abes sur les mentions légales" target="_blank">Mentions légales</a> 
```

## Tests RGAA

Plusieurs outils permettent de contrôler que le code de l'application respecte les règles d'accessibilité. 

* Application.s lourde.s :
    * NVDA (application open source pour ordinateur). Lecteur d'écran.


* Plugins pour navigateurs :

|    Nom de l'application     |  Navigateurs supportés  | Fonctionnalité.s                                                                                                                                                                                                                                          |
|:---------------------------:|:-----------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|          NoCoffee           |         FireFox         | Simule des altérations de la perception visuelle (couleurs, dégénération maculaire, etc.)                                                                                                                                                                 |
|  IBM Accessibility Checker  |     FireFox, Chrome     | Analyse l'accessibilité d'une page et propose une manière de corriger les erreurs (ne recharge pas la page pour effectuer le test)                                                                                                                        |
|         LightHouse          |         Chrome          | Analyse l'accessibilité d'une page et propose une manière de corriger les erreurs (doit recharger la page pour effectuer le test)                                                                                                                         |
|    Wave Evaluation Tool     |     FireFox, Chrome     | Affiche l'ordre de défilement des éléments de l'interface (via la touche Tab). <br/> Affiche la structure de l'interface. <br/> Contrôle le taux de contraste entre les éléments superposés et propose un pickup color intégré pour effectuer des tests.  |
|    WCAG Contrast checker    |     Firefox, Chrome     | Contrôle le taux de contraste entre les éléments superposés et propose un pickup color intégré pour effectuer des tests.                                                                                                                                  |



