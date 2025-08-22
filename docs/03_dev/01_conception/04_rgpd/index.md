

# RGPD

## Cookies et autres traceurs

### Cadre juridique

Lorsqu'ils visitent un site web, les utilisateurs doivent être informés et donner leur consentement préalablement au dépôt ou la lecture de cookies et autres traceurs, à moins que ces traceurs ne bénéficient d’une des exemptions prévues par l’[article 82 de la loi Informatique et Libertés](https://www.cnil.fr/fr/la-loi-informatique-et-libertes#article82).

Les cookies permettant de collecter les données personnelles de l'utilisateur doivent faire l'objet d'une **information** et d'un **recueil de consentement**.
Seuls les cookies indispensables au bon fonctionnement du site sont exemptés de consentement, mais ils doivent être consultables dans le panneau de recueil de consentement et dans la page de politique des cookies.

Pour rappel, d'après la CNIL l'article 5(3) de la directive 2002/58/CE modifiée en 2009 pose le principe :
- *d'un consentement préalable de l'utilisateur avant le stockage d'informations sur son terminal ou l'accès à des informations déjà stockées sur celui-ci ;*
- *sauf si ces actions sont strictement nécessaires à la fourniture d'un service de communication en ligne expressément demandé par l'utilisateur ou ont pour finalité exclusive de permettre ou faciliter une communication par voie électronique.*

Pour plus de précisions, vous pouvez vous référer au [site web de la CNIL](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi).

### Rédaction de la politique de cookies

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

### Alternatives en cas de refus de l'utilisateur, cas *ReCAPTCHA*

Les éditeurs de sites doivent informer clairement les utilisateurs sur les cookies utilisés, leur finalité et les conséquences de leur refus.
Dans le cas d'un formulaire, si le refus de dépôt de cookie empêche à l'utilisateur d'utiliser un service, la CNIL recommande à l'éditeur du site web de proposer une alternative équivalente en terme d'accès au service.
Cette alternative doit être proposée clairement sur la page, à l'image du formulaire de [signalement de theses.fr](https://theses.fr/signaler?nnt=2024UPASP055&source=star&etabPpn=241345251)
![Mention d'alternative au formulaire avec captcha de theses.fr](/img/13-alternative-formulaire.png)

### Cookies strictement nécessaires

Certains cookies sont considérés comme "strictement nécessaires" au fonctionnement d'un site web (par exemple, ceux utilisés pour mémoriser les choix de l'utilisateur concernant les cookies). Ces cookies peuvent être utilisés sans consentement préalable.

## Intégration du consentement des utilisateurs

Nous utilisons [Tarteaucitron.io](https://tarteaucitron.io/) qui est un outil open-source javascript utilisé dans la gestion des cookies sur les sites web. Il est facilement et rapidement implémentable, il est spécifiquement concu pour répondre aux exigences du RGPD en matière de consentement des utilisateurs pour le dépôt de cookies.
Il prend en charge une large gamme de services tiers.

![Présentation du panneau de gestion des cookies de tarteaucitron.io](/img/13-bandeau-tarteaucitron.png)

### Fonctionnalités
- Gestion des catégories de cookies : vous pouvez catégoriser vos cookies (nécessaires, statistiques, marketing, etc.) pour offrir à l'utilisateur un choix plus granulaire.
- Personnalisation de l'apparence du panneau (couleurs, textes, position).
- Suivi des consentements : Tarteaucitron permet de suivre les choix des utilisateurs et de générer des rapports.
- Intégration avec d'autres outils : Tarteaucitron peut être intégré avec d'autres outils de gestion de consentement ou de protection des données.

### Mise en place
[Guide d'installation](https://tarteaucitron.io/fr/install/)

Avant de commencer, téléchargez le plugin depuis le dépôt [github de tarteaucitron.io](https://github.com/AmauriC/tarteaucitron.js)
Placez le contenu dans le répertoire **/public** de votre application. 
![Localisation du dossier tarteaucitron](/img/13-dossier-installation.png)

#### HTML
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

#### VueJS
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


#### Paramètres importants

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




## Bonnes pratiques concernant les données personnelles

Concernantla notion d’informatique et liberté, on peut dégager les bonnes pratiques suivantes :

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

