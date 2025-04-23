# 🎬 Movie Explorer 

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-green)](https://www.djangoproject.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A feature-rich platform for discovering, tracking, and reviewing movies. Powered by TMDB API.

![App Banner](./screenshots/homepage.png)

## ✨ Features
### 🎥 Core Functionality
- Browse trending/upcoming/top-rated movies
- Advanced search with filters (genre, year, rating)
- Personalized watchlists (Favorites, Watch Later, Reviewed)
- Rate and review movies

### 🔧 Technical Highlights
- JWT authentication with refresh tokens
- Responsive design (Mobile + Desktop)
- Real-time movie recommendations
- Optimized API caching

## 🖥️ Screenshots
<div align="center">
  <img src="./screenshots/loginpage.png" width="32%" alt="Login Page">
  <img src="./screenshots/profilepage.png" width="32%" alt="User Profile">
  <img src="./screenshots/homepage.png" width="32%" alt="Homepage">
  <img src="./screenshots/watchedmoviespage.png" width="32%" alt="Watched Movies"> 
  <img src="./screenshots/favoritespage.png" width="32%" alt="Favorite Movies">
  <img src="./screenshots/ratedmoviespage.png" width="32%" alt="Rated Movies">
  <img src="./screenshots/watchlistpage.png" width="32%" alt="WatchList">
  <img src="./screenshots/searchpage.png" width="32%" alt="Search Page">
</div>

## 🚀 Installation
### Prerequisites
- Node.js ≥ 16
- Python ≥ 3.9
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate    # Windows
pip install -r requirements.txt
python manage.py migrate

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env

### Frontend Environment (.env):
REACT_APP_API_URL=http://localhost:8000
REACT_APP_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500

### Backend Environment (.env):
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
TMDB_API_KEY=your_tmdb_key
SECRET_KEY=your_django_secret

🛠️ Development

### Running Both Servers


### Start Django backend:
```bash
cd backend && python manage.py runserver

### Start React frontend (new terminal):
```bash
cd frontend && npm start

