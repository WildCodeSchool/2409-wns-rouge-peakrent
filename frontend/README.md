# MARQUE-PAGES : Une application de revente de livre d'occasion / Une application de gestion de biblioteque de livre

## Ce que je peux faire

- Afficher tous mes livres.
- Afficher tous les livres par catégories.
- Afficher le détail d'un livre.
- Ajouter / Modifier / Supprimer un livre.
- Ajouter / Modifier / Supprimer une catégories.
- Ajouter / Modifier / Supprimer un tag.
- Ajouter un tag a un livre.
- Rechercher une offre par nom / tag. A chaque frappe, rechercher si un livre ou un tag contient ce qu'il y a écrit. Afficher dans une dropbox les résultats (nom de livres et tags). Si tag : mainColor, si livre : normal. Si "entrée" diriger vers une page ou sont afficher les resultats. Si présent, en haut, les tags. Puis les livres. Si clique sur un tag dans dropbox, rediriger vers une page ou on affiche tous les livres qui contiennent ce tag. Si clique sur le livre, redirection vers le detail du livre. (lazy loading + debouncing + limitation des champs retournés + champs normalisedName).
- Avoir un systeme de pagination et n'afficher que 15/30/60 livres par page.

## Ce que je veux faire

- Pouvoir trier les livres affichés (de A-Z, Z-A, les plus récents, les plus anciens, prix crossant, prix décroissant).
- Avoir des boutons en fin de page << < [1] [2] [3] [...] [x] > >>. onClick retour en haut.
- Puis choix "all" et afficher les livres 15 par 15 a chaque fois que l'utilisateur arrive à la fin de la page. donc plus de boutons.
- Rechercher par nom d'auteur.
- Optimiser les requettes serveur pour retourner le moins de chose possible.
- Optimiser les onglets RecentAds, CategoryDetail, TagDetail. Un seul et meme composant.
- Ajouter une nouvelle donnée etat : usé, neuf, ect...
- Centraliser la gestion d'erreur. Et utiliser `throw new Error()`
- Affichage dynamique des cartes produits (renvoyer le texte en priorité puis les images)
- ajouter la gestion de role (admin, moderator, user)

## Dans le futur

- Vente de livre sous forme de liste d'attente. Je selectionne le livre et l'état, puis la premiere annonce la plus proche est vendu.
