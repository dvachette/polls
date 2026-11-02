# Spécification fonctionnelle — Plateforme de sondage anonyme

**Branche** : `chore/specs`  
**Créée le** : 2026-11-02  
**Statut** : Draft  
**Entrée** : plateforme permettant de créer des sondages, de collecter un vote par adresse email sans exposer les emails dans les résultats, et de limiter les répondants à certains domaines.

## Scope Baseline

- **Méthode de découverte** : analyse de la demande fonctionnelle fournie par le produit.
- **Items identifiés** : 8 capacités fonctionnelles et 4 contraintes de confidentialité/sécurité.
- **Items dans le périmètre** : toutes les capacités identifiées pour un MVP.
- **Hors périmètre du MVP** : comptes utilisateurs persistants, SSO, modification d'un vote, export avancé, collaboration entre créateurs, paiement et modération éditoriale.

## Acteurs

- **Créateur** : personne qui configure un sondage et consulte ses résultats.
- **Répondant** : personne qui reçoit un lien de vote après vérification de son adresse email.
- **Service de messagerie** : service externe chargé d'envoyer les liens uniques.
- **Système** : plateforme qui protège l'identité des répondants et garantit l'unicité des votes.

## Scénarios utilisateur et tests

### User Story 1 — Créer et partager un sondage (Priorité : P1)

En tant que créateur, je veux créer un sondage et obtenir un lien de participation ainsi qu'un lien privé de résultats afin de le partager et de suivre les réponses.

**Pourquoi cette priorité** : c'est le parcours central qui donne sa valeur à la plateforme.

**Test indépendant** : créer un sondage avec une question et deux choix, ouvrir le lien de participation dans une session séparée et vérifier que le sondage est affiché.

**Scénarios d'acceptation** :

1. **Étant donné** qu'un visiteur est sur la page de création, **quand** il renseigne un titre, au moins une question et les choix requis puis valide, **alors** le système crée le sondage et affiche un lien de participation ainsi qu'un lien privé de résultats.
2. **Étant donné** qu'un sondage vient d'être créé, **quand** le créateur ouvre le lien de participation, **alors** le contenu du sondage est visible sans révéler le lien de résultats.
3. **Étant donné** que le créateur soumet un formulaire invalide, **quand** il tente de créer le sondage, **alors** le système indique les champs à corriger et ne crée pas de sondage incomplet.

### User Story 2 — Voter après vérification de l'email (Priorité : P1)

En tant que répondant, je veux recevoir un lien unique par email pour voter afin que mon adresse ne puisse pas enregistrer plusieurs votes.

**Pourquoi cette priorité** : l'unicité par adresse email est la garantie principale de fiabilité du sondage.

**Test indépendant** : demander un accès avec une adresse email, suivre le lien reçu, voter, puis tenter une seconde fois avec la même adresse.

**Scénarios d'acceptation** :

1. **Étant donné** qu'un répondant saisit une adresse autorisée, **quand** il demande à voter, **alors** le système confirme la demande sans afficher l'adresse dans les résultats et envoie un lien unique à cette adresse.
2. **Étant donné** qu'un lien de vote valide n'a pas encore été utilisé, **quand** le répondant l'ouvre et choisit une réponse valide, **alors** le vote est enregistré et le lien devient inutilisable.
3. **Étant donné** qu'une adresse a déjà voté pour un sondage, **quand** elle demande ou ouvre un nouveau lien de vote pour ce même sondage, **alors** aucun second vote n'est enregistré et un message explicite est affiché.
4. **Étant donné** qu'un lien est expiré, invalide ou déjà consommé, **quand** il est ouvert, **alors** le vote est refusé et le répondant peut demander un nouveau lien si son adresse n'a pas encore voté.

### User Story 3 — Consulter des résultats anonymisés (Priorité : P1)

En tant que créateur, je veux consulter les résultats agrégés de mon sondage sans voir les adresses email des répondants.

**Pourquoi cette priorité** : la confidentialité des répondants doit être préservée tout en permettant au créateur d'exploiter les résultats.

**Test indépendant** : enregistrer plusieurs votes avec des adresses distinctes, ouvrir le lien privé de résultats et vérifier les totaux sans aucune adresse email.

**Scénarios d'acceptation** :

1. **Étant donné** qu'un sondage possède des votes, **quand** le créateur ouvre son lien de résultats, **alors** le système affiche les totaux par choix et le nombre total de votes.
2. **Étant donné** que des adresses email ont voté, **quand** les résultats sont affichés ou exportés, **alors** aucune adresse, partie d'adresse ou donnée permettant de les déduire n'est incluse.
3. **Étant donné** qu'un visiteur ne possède pas le lien privé de résultats, **quand** il tente d'accéder aux résultats, **alors** l'accès est refusé.

### User Story 4 — Restreindre les répondants à des domaines (Priorité : P2)

En tant que créateur, je veux limiter les adresses autorisées à un ou plusieurs domaines afin de réserver un sondage à une entreprise, une école ou une communauté.

**Pourquoi cette priorité** : ce contrôle répond aux cas d'usage organisationnels tout en restant indépendant du reste du parcours.

**Test indépendant** : créer un sondage limité à `exemple.org`, demander un lien avec une adresse autorisée puis avec une adresse externe.

**Scénarios d'acceptation** :

1. **Étant donné** que le créateur configure un ou plusieurs domaines autorisés, **quand** il crée le sondage, **alors** les domaines sont enregistrés et affichés dans le récapitulatif de configuration.
2. **Étant donné** qu'un sondage est limité à `exemple.org`, **quand** une adresse `utilisateur@exemple.org` demande un lien, **alors** la demande peut continuer vers la vérification email.
3. **Étant donné** qu'un sondage est limité à `exemple.org`, **quand** une adresse `utilisateur@autre.org` demande un lien, **alors** aucun lien de vote n'est envoyé et la raison du refus est indiquée.
4. **Étant donné** qu'aucun domaine n'est configuré, **quand** une adresse valide demande un lien, **alors** toute adresse email valide peut participer sous réserve de la règle de vote unique.

## Cas limites et erreurs

- Une adresse mal formée est refusée avant l'envoi d'un email.
- Les domaines sont comparés sans tenir compte de la casse et doivent être saisis au format domaine, sans protocole ni chemin.
- Une adresse utilisant un sous-domaine n'est pas considérée comme appartenant automatiquement au domaine parent, sauf si ce comportement est explicitement configuré.
- Le système ne doit pas confirmer publiquement si une adresse a déjà voté lorsqu'une telle confirmation permettrait de sonder l'état d'une adresse ; les messages doivent rester neutres hors du parcours authentifié par email.
- Une demande répétée d'email est limitée afin d'éviter l'abus et les envois multiples.
- Si l'envoi d'email échoue, le vote n'est pas créé et le répondant reçoit un message permettant de réessayer sans exposer de données internes.
- Un sondage sans choix, avec un titre vide ou dépassant les limites de longueur est refusé.
- Les votes concurrents pour la même adresse et le même sondage ne peuvent produire qu'un seul vote.
- Un sondage fermé ou désactivé refuse toute nouvelle demande et tout nouveau vote.
- Les résultats d'un sondage sans vote affichent un état vide explicite, sans exposer de données techniques.

## Exigences

### Exigences fonctionnelles

- **REQ-001** : Le système DOIT permettre à tout visiteur de créer un sondage sans compte persistant.
- **REQ-002** : Le système DOIT permettre de définir un titre, au moins une question et les choix de réponse nécessaires à un sondage.
- **REQ-003** : Le système DOIT valider les champs obligatoires, les limites de longueur et la cohérence du sondage avant sa création.
- **REQ-004** : Le système DOIT générer un identifiant non prédictible pour chaque sondage.
- **REQ-005** : Le système DOIT fournir au créateur un lien de participation distinct d'un lien privé de consultation des résultats.
- **REQ-006** : Le système DOIT afficher le sondage et permettre à un répondant de saisir une adresse email valide.
- **REQ-007** : Le système DOIT vérifier que l'adresse email respecte les domaines autorisés avant d'envoyer un lien de vote.
- **REQ-008** : Le système DOIT envoyer à l'adresse fournie un lien de vote unique, non devinable et à durée de validité limitée.
- **REQ-009** : Le système DOIT exiger l'utilisation du lien reçu par email avant d'accepter un vote.
- **REQ-010** : Le système DOIT accepter au maximum un vote par sondage et par adresse email, y compris lors de demandes concurrentes.
- **REQ-011** : Le système DOIT invalider un lien de vote après son utilisation, son expiration ou sa révocation.
- **REQ-012** : Le système DOIT refuser les réponses qui ne correspondent pas aux choix proposés par le sondage.
- **REQ-013** : Le système DOIT permettre au créateur de configurer zéro, un ou plusieurs domaines email autorisés lors de la création.
- **REQ-014** : Le système DOIT comparer les domaines de manière insensible à la casse et refuser les valeurs contenant un protocole, un chemin ou des caractères invalides.
- **REQ-015** : Le système DOIT calculer et afficher les résultats agrégés par choix ainsi que le total des votes.
- **REQ-016** : Le système NE DOIT PAS afficher, exporter ou transmettre les adresses email dans les résultats destinés au créateur.
- **REQ-017** : Le système DOIT protéger le lien privé de résultats contre l'énumération et refuser les accès dépourvus d'autorisation.
- **REQ-018** : Le système DOIT fournir des messages d'erreur compréhensibles pour les liens invalides, expirés, consommés, les domaines refusés et les sondages fermés.
- **REQ-019** : Le système DOIT limiter les demandes répétées de liens de vote et enregistrer les événements de sécurité nécessaires à la détection d'abus, sans journaliser les adresses email en clair dans les journaux applicatifs.
- **REQ-020** : Le système DOIT permettre au créateur de fermer ou désactiver son sondage afin d'empêcher de nouveaux votes.
- **REQ-021** : Le système DOIT conserver séparément les données nécessaires à l'unicité d'un vote et les données de résultats, avec une représentation non réversible de l'adresse utilisée pour le contrôle d'unicité.
- **REQ-022** : Le système DOIT empêcher qu'une erreur d'envoi d'email soit interprétée comme un vote enregistré.

### Contraintes de confidentialité et de sécurité

- **REQ-023** : Le système DOIT minimiser les données personnelles conservées et ne conserver l'adresse email en clair que si cela est strictement nécessaire à l'envoi ou à une durée de rétention documentée.
- **REQ-024** : Le système DOIT empêcher l'accès aux résultats via le seul lien de participation.
- **REQ-025** : Le système DOIT protéger les jetons de vote et de résultats contre leur exposition dans les journaux, les messages d'erreur et les URLs de redirection après utilisation.
- **REQ-026** : Le système DOIT fournir une politique de rétention et de suppression des données avant la mise en production.

### Questions à clarifier

- **[NEEDS CLARIFICATION]** Le lien privé de résultats doit-il être un lien secret de type “bearer token” sans compte, ou le créateur doit-il s'authentifier pour consulter ses résultats ? Le MVP part sur un lien secret révocable, sans compte.
- **[NEEDS CLARIFICATION]** Quelle durée de validité et quelle politique de rétention sont attendues pour les liens de vote, les sondages et les données de contrôle d'unicité ? Le MVP part sur 24 heures pour un lien de vote et une suppression configurable après 12 mois.

## Entités clés

- **Sondage** : titre, question(s), choix, état ouvert/fermé, dates de création et de fermeture, configuration des domaines autorisés.
- **Lien de participation** : référence publique non prédictible permettant d'afficher un sondage sans donner accès aux résultats.
- **Lien de résultats** : secret privé permettant au créateur de voir les agrégats et pouvant être révoqué à la fermeture ou sur demande.
- **Demande de vote** : demande temporaire associée à un sondage, à une adresse normalisée et à l'état de livraison du message.
- **Jeton de vote** : secret à usage unique et à expiration, transmis uniquement dans l'email de vérification.
- **Vote** : réponse enregistrée pour un choix, liée au sondage et au contrôle d'unicité, sans adresse email exposée aux résultats.
- **Domaine autorisé** : domaine email normalisé configuré par le créateur.
- **Résultat agrégé** : total par choix et total global, calculé sans exposer l'identité des répondants.

## Critères de succès

### Résultats mesurables

- **SC-001** : Au moins 95 % des créateurs de test peuvent créer un sondage valide et obtenir ses deux liens en moins de 2 minutes.
- **SC-002** : Au moins 95 % des répondants de test reçoivent un lien utilisable dans les 60 secondes suivant une demande acceptée.
- **SC-003** : 100 % des scénarios de test tentant deux votes avec la même adresse pour un même sondage ne produisent qu'un seul vote.
- **SC-004** : 100 % des vues et exports de résultats testés ne contiennent aucune adresse email en clair, partielle ou dérivée.
- **SC-005** : 100 % des demandes provenant d'un domaine non autorisé sont bloquées avant l'envoi du lien de vote.
- **SC-006** : Au moins 95 % des utilisateurs de test comprennent pourquoi un lien est invalide, expiré, consommé ou refusé.
- **SC-007** : Les résultats agrégés d'un sondage de 10 000 votes s'affichent en moins de 2 secondes pour 95 % des consultations.
- **SC-008** : Les tests de concurrence sur 100 demandes simultanées pour la même adresse et le même sondage n'enregistrent jamais plus d'un vote.

## Hypothèses

- La création d'un sondage ne requiert pas de compte utilisateur pour le MVP.
- Un sondage contient au moins une question et chaque question possède au moins deux choix ; les questions à choix multiples sont hors périmètre initial sauf décision contraire.
- L'adresse email est normalisée pour le contrôle d'unicité, au minimum en supprimant les espaces superflus et en ignorant la casse.
- Les domaines autorisés s'appliquent à l'adresse complète ; les alias et règles spécifiques des fournisseurs de messagerie ne sont pas interprétés.
- Le créateur est responsable de la conservation et du partage de son lien privé de résultats.
- L'envoi effectif des emails dépend d'un service de messagerie configuré, mais le comportement fonctionnel doit rester testable avec un service de test.
