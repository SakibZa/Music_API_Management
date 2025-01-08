# Music API

This is a Music API built with Node.js, Express, and MongoDB. It provides endpoints for managing users, artists, albums, tracks, and favorites.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [User Endpoints](#user-endpoints) 
  - [Artist Endpoints](#artist-endpoints)
  - [Album Endpoints](#album-endpoints)
  - [Track Endpoints](#track-endpoints)
  - [Favorite Endpoints](#favorite-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)

## Installation

## Environment Variables

Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following environment variables:


## API Endpoints

### User Endpoints

- **POST /api/v1/users/signup**: Sign up a new user.
- **POST /api/v1/users/login**: Log in a user.
- **GET /api/v1/users/user-details**: Get all users (Admin only).
- **POST /api/v1/users/add-user**: Add a new user (Admin only).
- **DELETE /api/v1/users/:id**: Delete a user (Admin only).
- **PUT /api/v1/users/update-password**: Update user password.

### Artist Endpoints

- **POST /api/v1/artist/add-artist**: Add a new artist (Admin only).
- **GET /api/v1/artist/all-artist**: Get all artists.
- **GET /api/v1/artist/:id**: Get artist by ID.
- **PUT /api/v1/artist/:id**: Update artist (Admin and Editor only).
- **DELETE /api/v1/artist/:id**: Delete artist (Admin and Editor only).

### Album Endpoints

- **POST /api/v1/albums/add-album**: Add a new album (Admin only).
- **GET /api/v1/albums/all-album**: Get all albums.
- **GET /api/v1/albums/:id**: Get album by ID.
- **PUT /api/v1/albums/:id**: Update album (Admin and Editor only).
- **DELETE /api/v1/albums/:id**: Delete album (Admin and Editor only).

### Track Endpoints

- **POST /api/v1/tracks/add-track**: Add a new track (Admin only).
- **GET /api/v1/tracks/allTrack**: Get all tracks.
- **GET /api/v1/tracks/:id**: Get track by ID.
- **PUT /api/v1/tracks/:id**: Update track (Admin and Editor only).
- **DELETE /api/v1/tracks/:id**: Delete track (Admin and Editor only).

### Favorite Endpoints

- **POST /api/v1/favorites/add-favorite**: Add a favorite item.
- **GET /api/v1/favorites/:category**: Get favorites by category.
- **DELETE /api/v1/favorites/remove-fovorite/:id**: Remove a favorite item.

## Authentication and Authorization

Authentication and Role-Based Access Control (RBAC) are implemented using JWT tokens and roles (Admin, Editor, Viewer).

- **Admin**: Can perform all CRUD operations for users, artists, albums, and tracks.
- **Editor**: Can edit and delete artists, albums, tracks, and update their password.
- **Viewer**: Can only read all entities.