import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import kagglehub
import argparse

def train_aura(csv_path="data/behavior.csv"):
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        print("Please run 'php artisan ml:export-behavior' first.")
        return

    df = pd.read_csv(csv_path)
    if df.empty:
        print(f"Error: {csv_path} is empty.")
        return

    features = ['login_attempts', 'failed_logins', 'session_duration', 
                'pages_accessed', 'tickets_viewed', 'tickets_booked', 
                'events_viewed', 'events_created', 'total_actions', 'requests_per_minute']
    
    X = df[features].fillna(0)

    print(f"Training Isolation Forest on AURA++ data ({len(X)} records)...")
    clf = IsolationForest(n_estimators=100, contamination="auto", random_state=42)
    clf.fit(X)

    os.makedirs('models', exist_ok=True)
    joblib.dump(clf, 'models/isolation_forest.joblib')
    print("Model saved to models/isolation_forest.joblib")

def train_external():
    print("Downloading external dataset (shubhamekhandeee/user-behaviour-dataset)...")
    path = kagglehub.dataset_download("shubhamekhandeee/user-behaviour-dataset")
    csv_path = os.path.join(path, "user_behavior_data.csv")
    
    if not os.path.exists(csv_path):
        print(f"Failed to locate user_behavior_data.csv in the downloaded dataset: {csv_path}")
        return
        
    df = pd.read_csv(csv_path)
    print(f"External dataset loaded: {len(df)} records.")
    
    X_mapped = pd.DataFrame()
    
    # Map exact matches available in the new Kaggle CSV
    X_mapped['login_attempts'] = df['login_attempts']
    X_mapped['failed_logins'] = df['failed_logins']
    X_mapped['session_duration'] = df['session_duration']
    X_mapped['pages_accessed'] = df['pages_accessed']
    
    # Map mock data for the rest to match AURA++ model schema
    X_mapped['tickets_viewed'] = np.random.randint(0, 10, size=len(df))
    X_mapped['tickets_booked'] = np.random.randint(0, 3, size=len(df))
    X_mapped['events_viewed'] = np.random.randint(0, 5, size=len(df))
    X_mapped['events_created'] = 0
    X_mapped['total_actions'] = X_mapped['pages_accessed'] + X_mapped['tickets_viewed'] + X_mapped['tickets_booked']
    X_mapped['requests_per_minute'] = X_mapped['total_actions'] / X_mapped['session_duration'].replace(0, 1)

    print("Training Isolation Forest on mapped external data...")
    clf = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    clf.fit(X_mapped)
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(clf, 'models/isolation_forest.joblib')
    print("Model trained on external dataset and saved to models/isolation_forest.joblib")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Isolation Forest Model")
    parser.add_argument('csv_path', nargs='?', default=None, help="Path to AURA++ behavior.csv")
    parser.add_argument('--external', action='store_true', help="Train using Kaggle external dataset")
    args = parser.parse_args()

    if args.external:
        train_external()
    else:
        path = args.csv_path if args.csv_path else "../server/data/behavior.csv"
        train_aura(path)
