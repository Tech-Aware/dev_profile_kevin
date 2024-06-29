# Changelog

Tous les changements notables apportés au projet personnalPage seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Configuration initiale du projet Django "personnalPage"
- Création de l'application "home"
- Ajout de l'application "home" dans INSTALLED_APPS
- Création du template de base pour la page d'accueil (index.html)
- Configuration des fichiers statiques dans settings.py
- Création du dossier 'static' avec un sous-dossier 'css'
- Création du fichier style.css dans le dossier static/css
- Ajout de la balise {% load static %} dans le template index.html
- Liaison du fichier CSS au template HTML

### Changed
- Mise à jour du fichier views.py pour rendre le template index.html
- Modification du fichier urls.py pour inclure la vue de la page d'accueil

### Fixed
- Correction de l'erreur "Invalid block tag: 'static'" en chargeant correctement la balise static

## [0.1.0] - 2024-06-29
### Added
- Initialisation du projet Django "personnalPage"
- Création de l'application "home"
- Configuration de base du projet

[Unreleased]: https://github.com/votre-nom-utilisateur/personnalPage/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/votre-nom-utilisateur/personnalPage/releases/tag/v0.1.0