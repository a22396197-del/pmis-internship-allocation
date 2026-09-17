#!/usr/bin/env bash
set -o errexit

echo "Building React Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt

echo "Initializing Database..."
python -c "import sys; sys.path.insert(0, '.'); from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
python -c "import sys, os; sys.path.insert(0, '.'); sys.path.insert(0, '..'); from database.init_pmis_opportunities import init_pmis_opportunities; init_pmis_opportunities()"

echo "Build Completed Successfully!"
