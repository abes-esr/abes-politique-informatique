# Conception

La première étape du cycle de vie du développement d’un logiciel concerne sa conception. Cette rubrique décrit le cadre que l'Abes utilise pour concevoir les outils et applications de son système d'information. 

## Nommage d'une application

Un projet dont l'objectif est de créer ou de faire évoluer une application donnera forcément lieu tôt ou tard au choix d'un nom d'application.
Généralement le nom d'un projet réutilise le nom de l'application mais ce sont deux notions distinctes.

Au niveau technique il est nécessaire de choisir un nom d'application respectant les règles suivantes :
* réutiliser le nom public de l'application (exemple : on choisirait "qualimarc" et pas "outil-qualite-sudoc" car c'est comme ça qu'il est connu par le public)
* ne pas utiliser de majuscules
* si nécessaire de plusieurs mots, les séparer avec des tirets "-" (tiret du 6)
* ne pas terminer par un chiffre (c'est une contrainte du puits de log de l'Abes qui n'accepte pas que le nom de l'application se termine par un chiffre, par exemple privilégier "projetetab" plutôt que "projet2024")

Ce nom sera ensuite utilisé dans le nom des dépôts github, dans le code source et sa documentation, dans les images et les conteneurs docker, dans les tests, dans les scripts de déploiement, dans le nom de domaine du site web. Si ce nom change, il devient alors nécessaire de modifier l'ensemble de la chaine technique (attention cette opération peut être couteuse d'où l'importance de bien choisir le nom le plus en amont possible).









## Architecture d'une application

L’analyse des projets menés à l'Abes a permis de découvrir des structures de projets hétérogènes dépendant de plusieurs facteurs : IDE utilisé, plugins d’IDE, type de projet, expérience personnelle de l'agent dans le développement. Lors d'un transfert de responsabilité d'application vers un autre agent, ou lors de l'intervention d’un développeur sur le code de l’application, il était donc difficile de s'approprier le code en raison de ces aspects hétérogènes.

C'est pourquoi l'utilisation de frameworks spécifiques à chaque type de projet est maintenant préconisée.

Nous pouvons classer nos projets / applications en trsoi catégories : api, web, et batch

### Application de type API

Depuis le projet d'établissement 2024-2028, nous privilégions la [stratégie "API first"](https://projet2024.abes.fr/docs/2.4/projet2024#24-une-strat%C3%A9gie-dapi) que ce soit pour le système de gestion de métadonnées central de l'Abes ou pour les applications satellites ou autonommes développées par l'Abes.

La technologie préconisée pour implémenter des API dans des applications développées par l'Abes est : Java Spring Boot

#### Nommage du github de l'API

les dépôts Github hébergeant les API doivent être nommés en respectant la nomenclature : `<xxx>-api-<typeDeLAPI>`.

Pour choisir `<xxx>`, on garde à l'esprit que :
- le nom du projet ne sera pas obligatoirement le nom de l'application finale
- le nom de domaine en production devra correspondre à `<xxx>`
- les "marques" Abes devront correspondre à `<xxx>`

Pour choisir `<typeDeLApi>`, on précise la finalité de l'API si pertinent.

Ainsi, les API concernant le sudoc seront regroupées par exemple dans un dépôt Github : [https://github.com/abes-esr/sudoc-api/](https://github.com/abes-esr/sudoc-api/)
Les API seront ensuite accessibles via une url comme `https://www.sudoc.fr/services/bestppn`

#### Multi-dépôts ou Mono-dépôt pour des API ?

Plusieurs dépôts sont à privilégier lorsque les API d'une même application n'ont que peu de rapport entre elles. Par exemple [https://github.com/abes-esr/theses-api-recherche](https://github.com/abes-esr/theses-api-recherche) contient les API relatives à la recherche dans les métadonnées des thèses tandis que [https://github.com/abes-esr/theses-api-diffusion](https://github.com/abes-esr/theses-api-diffusion) regroupe des services permettant de récupérer les documents thèses.
Un seul dépôt est pertinent lorsque plusieurs API partagent la même thématique. On aura alors un répertoire par API, comme c'est le cas pour [https://github.com/abes-esr/idref-api/](https://github.com/abes-esr/idref-api/) ou [https://github.com/abes-esr/qualinka-microservices/](https://github.com/abes-esr/qualinka-microservices/)

#### Versionnage des API

Les API doivent être versionnées en utilisant la notation v1, v2 dans l'url. Ainsi, on peut mettre en ligne une nouvelle version d'une API (/v2) tout en préservant pour un temps donné la version en cours (/v1).
On utilise le versionnage sémantique [https://semver.org/lang/fr/](https://semver.org/lang/fr/) pour gérer les versions de nos applications, les v1, v2 de l'url des API correspondent au premier numéro de la notation sémantique.
On change ce numéro en cas de modification dans les paramètres d'entrée ou de sortie de l'API, ou en cas de changement majeur de comportement susceptible de casser les programmes externes appelant nos API.

#### Sécurité des API

* l'authentification (sur LDAP, base de données, service web etc.) et une gestion via l'utilisation de token JWT
* l'autorisation: droits sur les services vérifiés par spring security

Voir aussi la section ci-dessous coucernant la sécurité.

#### Documentation des API

La documentation est proposée via OpenAPI. Pour les projets Java Spring, la documentation peut être générée facilement via l'outil SpringFox:

* ajouter la dépendance dans le pom.xml
* ajouter les annotations sur les méthodes dans les interfaces @ApiOperation(value = "renvoie les demandeModifs pour les administrateurs", notes ="...")
* ajouter une classe SwaggerConfig

La documentation produite doit suivre les recommandations de la DINUM pour le partage des données par API dans l'administration : [https://www.numerique.gouv.fr/publications/recommandations-partage-donnees-api/](https://www.numerique.gouv.fr/publications/recommandations-partage-donnees-api/)

#### Déploiement des API

Le choix d'un unique ou de plusieurs containers Docker pour déployer les API se fait en fonction de l'architecture choisie.
Si on met en oeuvre une architecture Java "traditionnelle", on peut soit déployer l'API dans un seul container, soit avoir un container par API. Dans le cas d'une architecture microservice, on aura un container par service ainsi que pour les éléments du système comme le registry par exemple.

### Application de type web

Nous privilégions une architecture avec un fort découplage entre client et serveur : ceci permet une meilleure expérience utilisateur (le client s'exécute dans le navigateur) et donne la possibilité d'ajouter ou de remplacer facilement le client.

La partie serveur se traduit par une API qui est un ensemble de services web accessibles, versionnés et documentés (voir la section ci-dessus).

Pour développer la partie cliente, nous avons choisi d'utiliser le [framework VueJs](https://vuejs.org/).

### Application de type batch

Ces applications permettent de réaliser des tâches côté serveur sans IHM.
L'utilisation du framework [Java Spring Batch](https://spring.io/projects/spring-batch) est notre choix.









## Sécurité d'une application

Les documents publiés par l'Agence Nationale de la Sécurité des Systèmes d'Information (https://cyber.gouv.fr/sites/default/files/IMG/pdf/NP_Securite_Web_NoteTech.pdf) ou la communauté OWASP (https://owasp.org/www-project-application-security-verification-standard/) fournissent des ensembles de règles que nous nous efforçons de garder à l'esprit lors des phases de conception de nos applications. La CNIL fournit également un [guide de bonnes pratiques](https://github.com/LINCnil/Guide-RGPD-du-developpeur/blob/master/06-S%C3%A9curiser%20vos%20sites%20web%2C%20vos%20applications%20et%20vos%20serveurs.md) que nous nous efforçons de suivre.

Nous utilisons les analyses Sonarqube pour repérer les éventuels problèmes de sécurité dans le code que nous produisons. Les règles appliquées pour le langage Java sont disponibles ici : https://rules.sonarsource.com/java
Nos projets dont les dépôts sont sur Github sont analysés via Sonarcloud.

Depuis le 19 juillet 2024, nous homologons toutes les applications utilisée en production. Pour cela nous disposons d'une [procédure d'homologation d'une application](https://abesfr.sharepoint.com/:w:/r/sites/Bouda/Securite/CelluleSecurite/Homologation/ProcedureHomologation.docx?d=w1084c2b832f6416abe2b2d4ba7a1157d&csf=1&web=1&e=5B8FXw) (lien interne). Nous nous appuyons sur le service https://monservicesecurise.cyber.gouv.fr/ proposé par l'ANSSI (voir aussi l'[article dans le blog technique de l'Abes](https://punktokomo.abes.fr/2025/06/23/homologation-de-securite-des-systemes-dinformation-labes-sengage-avec-monservicesecurise/)). 

### Gestion des authentifications

Pour la sécurisation de nos applications Java, nous utilisons systématiquement le framework Spring Security pour les nouveaux développements.
Comme pour les autres éléments du framework Spring, il existe différents niveaux d'implémentation, de la plus standardisée à la plus personnalisée.
Le framework permet de gérer à la fois :

* l'authentification (qui consiste à prouver l'identité d'un utilisateur). L'authentification est également mise en place à l'aide de tokens JWT.
* l'autorisation (gérer les droits des utilisateurs sur les services).

### Mot de passe oublié

Lorsque nous devons implémenter un circuit de récupération de mot de passe, nous suivons ce modèle :
* proposer un formulaire de login avec lien "mot de passe oublié". Cette page permet de saisir une adresse mail.
* Un lien est envoyé à cette adresse mail, ce lien est valable une journée au maximum.
* Lorsque l'utilisateur clique sur le lien, il arrive sur une page protégée qui permet de choisir un nouveau mot de passe.
* Le mot de passe est mis à jour.

### Règles relatives à la définition des mots de passe

Les mots de passe doivent respecter des règles relatives à la complexité : longueur, mélange de caractères etc. Les vérifications de mots de passe doivent avoir lieu aussi bien côté client que serveur.
Les règles suivantes :
* au moins 8 caractères,
* au moins une majuscule,
* au moins un chiffre
* au moins un caractère spécial (!@#$%&*())

peuvent être vérifiées par cette expression régulière : `"(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}"`  
Les mots de passe doivent obligatoirement être hashés pour le stockage : nous utilisons [BCrypt](https://fr.wikipedia.org/wiki/Bcrypt).

On peut utiliser par exemple le site : https://passwordsgenerator.net/ pour générer un mot de passe.  
Et le site https://www.security.org/how-secure-is-my-password/ pour tester sa robustesse.

### Blocage après un certain nombre de tentatives de connexion

Il faut ajouter un système pour bloquer momentanément le compte au-delà d'un certain nombre de tentatives de connexions infructueuses (il faut par exemple se prémunir contre les attaques de type "brute force" qui consiste à essayer de trouver un mot de passe en faisant de multiples tentatives). Nous implémentons ce type de protection dans le code.

### Analyse dependabot

[Dependabot](https://docs.github.com/fr/code-security/getting-started/dependabot-quickstart-guide) est un outil GutHub qui analyse les vulnérabilités des dépendances utilisées par nos codes sources. Lorsque une faille est découverte, dependabot propose une pull request avec la montée en version de la dépendance. L'activation de dependabot se configure via l'onglet Security. L'outil analyse la branche main. 


Voici la procédure à suivre lorsqu'une PR est proposée :
* Récupérer en local la branche avec la montée de version proposée par depenbdabot et tester si l'application fonctionne avec la nouvelle version. Pour le code VueJS, il faut lancer les commandes "npm install" (pour récuperer les dependances) puis "npm run serve" pour vérifier l'application.
* Si aucun problème n'est détecté, il faut merger la branche sur main. On fusionne ensuite main sur develop.

### Sécurisation d'un formulaire web anonyme (par Captcha)

Les formulaires web pouvant être renseignés anonymement sont exposés aux robots spammeurs qui trainent sur le web public.

Généralement ces robots ne vont pas tout de suite trouver comment publier du spam sur le formulaire en question, il leur faudra un certain temps avant de le repérer. Les formulaires web générés par des plateformes ou framework comme par exemple Wordpress ou Drupal sont repérés beaucoup plus rapidement par ces robots du fait de la popularité de ces plateformes.

La mise en place d'un Captcha est une protection efficace. L'utilisation du système [reCaptcha](https://www.google.com/recaptcha/about/) est préconisé de manière à obtenir une uniformisation de l'expérience utilisateur sur les sites web produits par l'Abes (démarche UX). A noter que le compte commun Abes (applications.abes) est à utiliser pour administrer l'ensemble des instances de reCaptcha.

Plusieurs sites de l'Abes implémentent un Captcha dont voici un recensement :

- Theses.fr dans la section "signaler une erreur" (reCaptcha) : https://www.theses.fr/feedbacktheses.jsp?origine=2005PA05S018&lng=fr&ppn_origine=026404788&appli_origine=Sudoc
- IdRef dans la section "signaler une erreur" (reCaptcha) : https://www.idref.fr/assistance.jsp?ppn=139753753&titre=Dacos,%20Marin%20(1971-....)
- Licences Nationales pour la création de compte (reCaptcha) : https://acces.licencesnationales.fr/creation-compte
- Calames (système ad-hoc qui serait à modifier en reCaptcha) : http://www.calames.abes.fr/pub/ssl/Reg.aspx

### Sécurisation par CORS des API de l'application

CORS est l'acronyme de ["Cross-origin resource sharing"](https://fr.wikipedia.org/wiki/Cross-origin_resource_sharing). C'est un système implémenté dans les navigateurs web modernes qui permet de filtrer quels sont les sites web qui peuvent accéder ou pas à votre API via HTTP en précisant si besoin les méthodes HTTP que l'on autorise.

Par défaut, ce système de sécurité est restrictif au maximum et ne permet donc pas à un autre site web de venir interroger via HTTP (Ajax) votre API.

Dans le cadre de l'Abes, nos API sont développées en Java Spring et ont comme vocation à être ouvertes au maximum. Nous avons donc un réglage au niveau des CORS très ouvert. Voici le code java spring à reprendre dans les applications pour une configuration très ouverte des CORS (pas de filtrage par domaine) :
```java
/**
 * Réglages des CORS (très ouverts) qui permettent au front en javascript de s'y connecter
 * depuis n'importe quel domaine : localhost, dev, test, prod, ou même depuis d'autres domaines.
 */
@Bean
public FilterRegistrationBean simpleCorsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Collections.singletonList("*"));
        config.setAllowedMethods(Collections.singletonList("*"));
        config.setAllowedHeaders(Collections.singletonList("*"));
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
        }
```

Ce code est implémenté dans notre application "Hello World" nommée abes-hello, vous le trouverez ici:  
https://github.com/abes-esr/abes-hello-back/blob/develop/web/src/main/java/fr/abes/helloabes/HelloABESApplication.java#L168-L187













## RGPD dans une application

### Cookies et autres traceurs

#### Cadre juridique

Lorsqu'ils visitent un site web, les utilisateurs doivent être informés et donner leur consentement préalablement au dépôt ou la lecture de cookies et autres traceurs, à moins que ces traceurs ne bénéficient d’une des exemptions prévues par l’[article 82 de la loi Informatique et Libertés](https://www.cnil.fr/fr/la-loi-informatique-et-libertes#article82).

Les cookies permettant de collecter les données personnelles de l'utilisateur doivent faire l'objet d'une **information** et d'un **recueil de consentement**.
Seuls les cookies indispensables au bon fonctionnement du site sont exemptés de consentement, mais ils doivent être consultables dans le panneau de recueil de consentement et dans la page de politique des cookies.

Pour rappel, d'après la CNIL l'article 5(3) de la directive 2002/58/CE modifiée en 2009 pose le principe :
- *d'un consentement préalable de l'utilisateur avant le stockage d'informations sur son terminal ou l'accès à des informations déjà stockées sur celui-ci ;*
- *sauf si ces actions sont strictement nécessaires à la fourniture d'un service de communication en ligne expressément demandé par l'utilisateur ou ont pour finalité exclusive de permettre ou faciliter une communication par voie électronique.*

Pour plus de précisions, vous pouvez vous référer au [site web de la CNIL](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi).

#### Rédaction de la politique de cookies

La politique des cookies permet d'informer les utilisateurs sur la nature des cookies qui sont stockés par le site web dans leur navigateur.
Elle concerne l'intégralité des cookies : les cookies tiers comme les cookies nécessaires au bon fonctionnement de l'application.
Une page accessible aux utilisateurs depuis l'application doit lister les cookies déposés par celle-ci. 

Ces informations doivent être listées sur la page de la politique de confidentialité et les mentions légales doivent faire figurer un lien vers celle-ci.

Pour chaque cookie, la page doit préciser :
- Son nom
- Sa finalité
- Sa durée de stockage

Pour ce faire, avant de rédiger la politique, il est nécessaire de recenser exhaustivement tous les cookies utilisés par le site web.
Il est à noter que les cookies tiers peuvent évoluer et être mis à jour par leurs éditeurs, ce qui implique une mise à jour régulière.
La politique des cookies doit également préciser à l'utilisateur de manière claire qu'il a le choix d'accepter ou refuser les cookies.

Vous pouvez consulter un exemple sur la page dédiée à la gestion des données personnelles et des cookies du site [theses.fr](https://abes.fr/pages-donnees-personnelles/thesesfr.html)

#### Alternatives en cas de refus de l'utilisateur, cas *ReCAPTCHA*

Les éditeurs de sites doivent informer clairement les utilisateurs sur les cookies utilisés, leur finalité et les conséquences de leur refus.
Dans le cas d'un formulaire, si le refus de dépôt de cookie empêche à l'utilisateur d'utiliser un service, la CNIL recommande à l'éditeur du site web de proposer une alternative équivalente en terme d'accès au service.
Cette alternative doit être proposée clairement sur la page, à l'image du formulaire de [signalement de theses.fr](https://theses.fr/signaler?nnt=2024UPASP055&source=star&etabPpn=241345251)
![Mention d'alternative au formulaire avec captcha de theses.fr](/img/13-alternative-formulaire.png)

#### Cookies strictement nécessaires

Certains cookies sont considérés comme "strictement nécessaires" au fonctionnement d'un site web (par exemple, ceux utilisés pour mémoriser les choix de l'utilisateur concernant les cookies). Ces cookies peuvent être utilisés sans consentement préalable.

### Intégration du consentement des utilisateurs

Nous utilisons [Tarteaucitron.io](https://tarteaucitron.io/) qui est un outil open-source javascript utilisé dans la gestion des cookies sur les sites web. Il est facilement et rapidement implémentable, il est spécifiquement concu pour répondre aux exigences du RGPD en matière de consentement des utilisateurs pour le dépôt de cookies.
Il prend en charge une large gamme de services tiers.

![Présentation du panneau de gestion des cookies de tarteaucitron.io](/img/13-bandeau-tarteaucitron.png)

#### Fonctionnalités
- Gestion des catégories de cookies : vous pouvez catégoriser vos cookies (nécessaires, statistiques, marketing, etc.) pour offrir à l'utilisateur un choix plus granulaire.
- Personnalisation de l'apparence du panneau (couleurs, textes, position).
- Suivi des consentements : Tarteaucitron permet de suivre les choix des utilisateurs et de générer des rapports.
- Intégration avec d'autres outils : Tarteaucitron peut être intégré avec d'autres outils de gestion de consentement ou de protection des données.

#### Mise en place
[Guide d'installation](https://tarteaucitron.io/fr/install/)

Avant de commencer, téléchargez le plugin depuis le dépôt [github de tarteaucitron.io](https://github.com/AmauriC/tarteaucitron.js)
Placez le contenu dans le répertoire **/public** de votre application. 
![Localisation du dossier tarteaucitron](/img/13-dossier-installation.png)

##### HTML
1. Collez le script suivant dans le head de la ou des pages.s concernée.s
2. Pour le paramètre `privacyUrl`, précisez le lien vers la politique des cookies.
3. Affinez le reste des paramètres comme la position de la balise (cf ci-dessous)
4. Rendez-vous à l'étape 3 du [Guide d'installation](https://tarteaucitron.io/fr/install/) et cherchez les services tiers qui déposent des traceurs sur votre site (ex: reCAPTCHA de *Google*).
5. Le guide vous donne les scripts et balises à ajouter à votre page
   - Supprimez la balise originale du service et remplacez-la par celle donnée par le guide d'installation. Prenez soin de bien remplacer les tokens et autres informations nécessaires au bon fonctionnement du service (elles sont colorées en vert dans l'exemple donné par le guide)
   - Revenez dans le ```<head>``` de la page et ajoutez à la suite le script donné par le guide

``` html
<head>

        <script src="/tarteaucitron/tarteaucitron.js"></script>

        <script type="text/javascript">
        tarteaucitron.init({
    	  "privacyUrl": "", /* url de la politique des données/cookies */
          "bodyPosition": "bottom", /* or top to bring it as first element for accessibility */

    	  "hashtag": "#tarteaucitron", /* Open the panel with this hashtag */
    	  "cookieName": "tarteaucitron", /* Cookie name */
    
    	  "orientation": "middle", /* Banner position (top - bottom) */
       
          "groupServices": false, /* Group services by category */
          "showDetailsOnClick": true, /* Click to expand the description */
          "serviceDefaultState": "wait", /* Default state (true - wait - false) */
                           
    	  "showAlertSmall": false, /* Show the small banner on bottom right */
    	  "cookieslist": false, /* Show the cookie list */
                           
          "closePopup": false, /* Show a close X on the banner */

          "showIcon": true, /* Show cookie icon to manage cookies */
          //"iconSrc": "", /* Optionnal: URL or base64 encoded image */
          "iconPosition": "BottomRight", /* BottomRight, BottomLeft, TopRight and TopLeft */

    	  "adblocker": false, /* Show a Warning if an adblocker is detected */
                           <
          "DenyAllCta" : tr<ue, /* Show the deny all button */
          "AcceptAllCta" : <true, /* Show the accept all button when highPrivacy on */
          "highPrivacy": true, /* HIGHLY RECOMMANDED Disable auto consent */
          "alwaysNeedConsent": false, /* Ask the consent for "Privacy by design" services */
                           
    	  "handleBrowserDNTRequest": false, /* If Do Not Track == 1, disallow all */

    	  "removeCredit": false, /* Remove credit link */
    	  "moreInfoLink": true, /* Show more info link */

          "useExternalCss": false, /* If false, the tarteaucitron.css file will be loaded */
          "useExternalJs": false, /* If false, the tarteaucitron.js file will be loaded */

    	  //"cookieDomain": ".my-multisite-domaine.fr", /* Shared cookie for multisite */
                          
          "readmoreLink": "", /* Change the default readmore link */

          "mandatory": true, /* Show a message about mandatory cookies */
          "mandatoryCta": true, /* Show the disabled accept button when mandatory on */
    
          //"customCloserId": "", /* Optional a11y: Custom element ID used to open the panel */
          
          "googleConsentMode": true, /* Enable Google Consent Mode v2 for Google ads and GA4 */
          
          "partnersList": false /* Show the number of partners on the popup/middle banner */
        });
        </script>
```

##### VueJS
L'opération est la même que pour le HTML, mais les scripts sont insérés dans les paramètres de la méthode *useHead()* de la partie *script setup*

``` javascript
   useHead({
   title: ...,
   script: [
       {
        src: "/tarteaucitronjs/tarteaucitron.js"
       },
       {
        children: `tarteaucitron.init({"privacyUrl": "https://abes.fr/pages-donnees-personnelles/thesesfr.html", "bodyPosition": "top", "hashtag": "#tarteaucitron", "cookieName": "tarteaucitron", "orientation": "middle", "groupServices": false, "showDetailsOnClick": true, "serviceDefaultState": "wait", "showAlertSmall": false, "cookieslist": false, "closePopup": false, "showIcon": true, "iconPosition": "BottomRight", "adblocker": false, "DenyAllCta" : true, "AcceptAllCta" : true, "highPrivacy": true, "handleBrowserDNTRequest": false, "removeCredit": false, "moreInfoLink": true, "useExternalCss": false, "useExternalJs": false, "readmoreLink": "", "mandatory": true, "mandatoryCta": true});`
       }, // Script pour configurer le panneau de cookies
       {
        children: `tarteaucitron.user.recaptchaapi = 'XXXX'; (tarteaucitron.job = tarteaucitron.job || []).push('recaptcha');`
       } // script concernant le service ReCAPTCHA
   ]
   });
```


##### Paramètres importants

Veillez à bien remplir les paramètres suivants :
- `"privacyUrl": "xxxx"` Le lien vers la politique des cookies
- `"bodyPosition": "top"` Permet de mettre le focus sur le panneau de cookies directement (Bonne pratique d'accessibilité)
- `"mandatory": "true"; mandatoryCta: true;` Faire apparaître la mention "Ce site utilise des cookies nécessaires à son bon fonctionnement. Ils ne peuvent pas être désactivés."
- `"highPrivacy": "true"` Désactive le consentement automatique

**Exemple pour *ReCAPTCHA* :**

1. Ajoutez ce code dans les scripts de votre page pour initialiser le service :

HTML

```html
<script type="text/javascript">
   tarteaucitron.user.recaptchaapi = 'XXXXX';
   (tarteaucitron.job = tarteaucitron.job || []).push('recaptcha');
</script>
```

OU

Vue3

```javascript
useHead({
   ...,
   script: [
      ...
      {
        children: `tarteaucitron.user.recaptchaapi = 'XXXXX-'; (tarteaucitron.job = tarteaucitron.job || []).push('recaptcha');`
      }
   ]
});
```

2. Ajoutez cette balise à l'endroit où le service doit s'afficher :

```html
<div class="g-recaptcha" data-sitekey="sitekey"></div>
```

3. Retirez le script original de l'outil tiers :

```html
<script src='https://www.google.com/recaptcha/api.js?render=XXXXX'></script>
``` 

4. Remplacez "XXXXX" par la clé de l'API *Google ReCAPTCHA*


















## RGAA dans une application


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


### RGAA en pratique, pour les équipes de développement VueJS

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

#### Image

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

#### Icône

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

#### Titre

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
#### Titre et icône imbriquée

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

#### Tableau

Les contenus des tableaux sont régis selon les mêmes principes que leur type de base.
C'est-à-dire que les titres de colonne sont du texte et seront donc lus comme du texte.

Les images et icônes, elles, seront traitées comme tel. À ce propos, voir : [image](#image) ou [icone](#icone) plus haut.

#### Bouton

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

#### Navigation

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

#### Lien

La balise HTML ```<a>```, permet la création de lien. Elle doit être complétée par un attribut ```aria-label```
qui reprend le texte du lien et le complète d'informations utiles aux personnes se servant de logiciel d'aide
à la navigation. De plus, les liens vers des pages externes au site d'origine doivent être ouvert dans un
nouvel onglet et signalé comme tel pour les utilisateurs.

*Exemple :*
```HTML
<a href="https://abes.fr/mentions-legales/" aria-label="Ouvre, dans un nouvel onglet du navigateur, la page internet de l'Abes sur les mentions légales" target="_blank">Mentions légales</a> 
```

### Tests RGAA

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
















## Bonnes pratiques de programmation

En termes de programmation, nous cherchons à privilégier :

* la programmation avec des interfaces et non des implémentations
* l'inversion de contrôle pour réduire le couplage entre classes
* l'utilisation des design patterns reconnus (tout en prenant soin d'éviter l'écueil de la sur-utilisation)
* les principes [KISS](https://fr.wikipedia.org/wiki/Principe_KISS), [YAGNI](https://fr.wikipedia.org/wiki/YAGNI) et [DRY](https://fr.wikipedia.org/wiki/Ne_vous_r%C3%A9p%C3%A9tez_pas) 

Concernant plus spécifiquement la notion d’informatique et liberté, on peut dégager les bonnes pratiques suivantes :

* Ne pas effectuer de développements ni de tests sur les environnements de production.
* Ne pas effectuer de tests sur des données personnelles réelles et utiliser des techniques d’anonymisation.
* Prévoir une gestion rigoureuse des habilitations et droits d’accès sur les applications.
* Prévoir en préalable à la mise en production d’une application la durée de conservation de tous les comptes utilisateurs et administrateurs.
* Ne pas partager les comptes administrateurs entre plusieurs personnes.
* Sécuriser systématiquement l’interface d’administration des applications.
* Dans le cadre des données personnelles, prévoir des systèmes de purge automatique afin de respecter la durée de conservation des données, définie en amont de la mise en production.
* Etre vigilant quant à la compatibilité du format des données avec la durée de conservation (ex : date sur 4 caractères et non 2).
* Prévoir des modalités sécurisées lorsque l’application permet le dépôt de fichiers.
* Prévoir dans les applications une mention de mise en garde contre un contenu abusif, pour toutes les zones de texte libre.
* Prévoir une page Mentions légales dès lors que l’application contient des données personnelles.

De façon générale, il faut se référer au guide RGPD fourni par la CNIL : [https://github.com/LINCnil/Guide-RGPD-du-developpeur](https://github.com/LINCnil/Guide-RGPD-du-developpeur)
