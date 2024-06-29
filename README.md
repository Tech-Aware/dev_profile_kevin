# personalPage

personalPage is a personal website developed with Django, designed to showcase the skills, projects, and contact information of a freelance developer.

## Project Structure

```
personnalPage/
│
├── .venv/                 # Virtual environment
│
├── personnalPage/         # Main project folder
│   ├── home/              # 'home' application
│   │   ├── migrations/
│   │   ├── static/
│   │   ├── templates/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── personnalPage/     # Project configuration
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
│
├── CHANGELOG.md
└── README.md
```

## Prerequisites

- Python 3.x
- Django (version specified in requirements.txt)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/dev_profile_kevin.git
   ```

2. Navigate to the project folder:
   ```
   cd personnalPage/personnalPage
   ```

3. Create and activate a virtual environment:
   ```
   python -m venv ../.venv
   source ../.venv/bin/activate  # On Windows, use `..\.venv\Scripts\activate`
   ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run migrations:
   ```
   python manage.py migrate
   ```

6. Start the development server:
   ```
   python manage.py runserver
   ```

The site will be accessible at `http://127.0.0.1:8000/`.

## Development

- The main application is `home`. Modify files in this folder to customize the site's content and logic.
- Templates are located in `home/templates/`.
- Static files (CSS, JS, images) should be placed in `home/static/`.
- The main project configuration is in `personnalPage/settings.py`.

## Potential Models and Future Features

### Planned Models

1. **Project**
   - Title
   - Description
   - Technologies used
   - Image
   - Project link
   - Completion date

2. **Skill**
   - Name
   - Category (e.g., Frontend, Backend, DevOps)
   - Proficiency level

3. **Blog Post**
   - Title
   - Content
   - Publication date
   - Category
   - Tags

4. **Testimonial**
   - Client name
   - Testimonial content
   - Rating (out of 5 stars)
   - Date

### Future Features

1. **Dynamic Portfolio**
   - Display projects with technology-based filtering
   - Detailed page for each project

2. **Technical Blog**
   - Article publishing system
   - Article categorization and search functionality

3. **Contact Form**
   - Send messages directly from the website
   - Integration with an email service

4. **Admin Dashboard**
   - Interface to easily manage projects, skills, and articles
   - Site visit statistics

5. **Social Media Integration**
   - Display recent posts from professional social networks
   - Share buttons for articles and projects

6. **Testimonials Section**
   - Display client testimonials
   - Allow clients to leave reviews

7. **Interactive Resume**
   - Interactive and downloadable version of the CV
   - Timeline of professional experiences

8. **Multilingual Support**
   - Support for multiple languages to reach an international audience

These models and features are subject to change and will be developed progressively based on project needs and priorities.

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for the project's version history.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/personnalPage](https://github.com/your-username/personnalPage)