# Changelog

All notable changes to the personnalPage project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial Django project setup for "personnalPage"
- Creation of "home" application
- Addition of "home" application to INSTALLED_APPS
- Creation of base template for homepage (index.html)
- Configuration of static files in settings.py
- Creation of 'static' folder with 'css' subfolder
- Creation of style.css file in static/css folder
- Addition of {% load static %} tag in index.html template
- Linking of CSS file to HTML template

### Changed
- Updated views.py to render index.html template
- Modified urls.py to include the homepage view

### Fixed
- Resolved "Invalid block tag: 'static'" error by properly loading the static tag
- Resolved name of repository in `README.md`

## [0.1.0] - 2024-06-29
### Added
- Initialized Django project "personnalPage"
- Created "home" application
- Basic project configuration

[Unreleased]: https://github.com/your-username/personnalPage/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-username/personnalPage/releases/tag/v0.1.0