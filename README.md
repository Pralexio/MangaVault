# MangaVault

**MangaVault** est une application dédiée à l'archivage et au suivi de l'avancement des animes et des scans, développée avec [Electron](https://www.electronjs.org/). Cette application permet aux utilisateurs de créer, visualiser, modifier et supprimer des notes sur leurs animes et scans favoris, le tout en sauvegardant ces informations localement sur leur machine.

## Fonctionnalités

- **Création de Notes** : Ajoutez de nouvelles entrées pour chaque anime ou scan, incluant des détails comme le titre, le numéro de l'épisode ou du chapitre, et d'autres informations pertinentes.
- **Visualisation des Notes** : Consultez toutes vos notes facilement, grâce à une interface claire qui vous permet de suivre vos progrès.
- **Édition des Notes** : Modifiez les informations des entrées existantes pour mettre à jour le numéro de l'épisode ou du chapitre, ou pour ajouter des notes supplémentaires.
- **Suppression des Notes** : Supprimez les notes des animes ou scans que vous avez terminés ou que vous ne souhaitez plus suivre.

## Objectif

MangaVault a été conçu pour offrir aux amateurs d'animes et de mangas un outil simple et efficace pour suivre leur progression. Que vous soyez un fan occasionnel ou un consommateur assidu, cette application vous aide à garder une trace de ce que vous avez regardé ou lu et à planifier ce que vous voulez voir ou lire ensuite.

## Installation

1. Clonez ce dépôt sur votre machine :
    ```bash
    git clone https://github.com/Pralexio/MangaVault.git
    cd mangavault
    ```

2. Installez les dépendances :
    ```bash
    npm install electron@^25.0.0
    npm install @cliqz/adblocker @cliqz/adblocker-electron
    ```

3. Lancez l'application :
    ```bash
    electron .
    ```

## Utilisation

1. **Ajouter une nouvelle note** : Cliquez sur le bouton "+" en bas à droite pour ouvrir le formulaire de création de note.
2. **Voir le contenu d'une note** : Cliquez sur une note dans la liste pour afficher ses détails.
3. **Modifier une note** : Cliquez sur le bouton d'édition à côté de la note que vous souhaitez modifier.
4. **Supprimer une note** : Cliquez sur le bouton de suppression à côté de la note que vous souhaitez enlever.

## Contributions

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à l'amélioration de MangaVault, veuillez suivre les étapes suivantes :

1. Forker ce dépôt.
2. Créez une branche pour votre fonctionnalité ou correctif :
    ```bash
    git checkout -b ma-fonctionnalite
    ```
3. Faites vos modifications et commitez-les :
    ```bash
    git commit -am 'Ajout d'une nouvelle fonctionnalité'
    ```
4. Poussez vos changements :
    ```bash
    git push origin ma-fonctionnalite
    ```
5. Créez une pull request depuis GitHub.

## License

Ce projet est sous la licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

*Pour toute question ou support, veuillez ouvrir une issue sur [GitHub](https://github.com/votre-utilisateur/mangavault/issues).*
