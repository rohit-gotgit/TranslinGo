#!/bin/bash

# Translingo Server - GCP Cloud Run Deployment Script
# This script deploys/updates the server to Google Cloud Run (cost-effective serverless option)
# It reads environment variables from .env file and sets them in Cloud Run

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables (modify these as needed or set via environment variables)
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-translingo-server}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
MIN_INSTANCES=0  # Set to 0 for cost-effective (scales to zero)
MAX_INSTANCES=10
CPU="1"
MEMORY="512Mi"
TIMEOUT="300"
CONCURRENCY="80"

# Function to check if service exists
service_exists() {
    gcloud run services describe ${SERVICE_NAME} --platform managed --region ${REGION} &>/dev/null
}

# Function to load environment variables from .env file
load_env_vars() {
    if [ ! -f .env ]; then
        echo -e "${RED}Error: .env file not found!${NC}"
        echo -e "${YELLOW}Please create a .env file based on .env.example${NC}"
        echo -e "${YELLOW}Run: ${GREEN}cp .env.example .env${NC} and edit it with your values"
        exit 1
    fi

    # Read .env file and export variables (handles comments and empty lines)
    # This method works with bash and most POSIX shells
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip comments and empty lines
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ -z "${line// }" ]] && continue
        
        # Export the variable
        export "$line" 2>/dev/null || true
    done < .env
    
    # Build env vars string for Cloud Run
    ENV_VARS="NODE_ENV=${NODE_ENV:-production}"
    
    # Check and add each required variable
    if [ -n "$MONGODB_URI" ] && [ "$MONGODB_URI" != "mongodb://localhost:27017" ]; then
        ENV_VARS="${ENV_VARS},MONGODB_URI=${MONGODB_URI}"
    else
        echo -e "${YELLOW}Warning: MONGODB_URI not set or using default value${NC}"
    fi
    
    if [ -n "$JWT_SECRET" ] && [ "$JWT_SECRET" != "your_jwt_secret_key_here_minimum_32_characters_long" ]; then
        ENV_VARS="${ENV_VARS},JWT_SECRET=${JWT_SECRET}"
    else
        echo -e "${RED}Error: JWT_SECRET must be set with a strong secret!${NC}"
        exit 1
    fi
    
    if [ -n "$JWT_EXPIRY" ]; then
        ENV_VARS="${ENV_VARS},JWT_EXPIRY=${JWT_EXPIRY}"
    fi
    
    if [ -n "$ORIGIN" ] && [ "$ORIGIN" != "http://localhost:5173" ]; then
        ENV_VARS="${ENV_VARS},ORIGIN=${ORIGIN}"
    else
        echo -e "${YELLOW}Warning: ORIGIN not set or using default (localhost)${NC}"
    fi
    
    if [ -n "$CLOUDINARY_CLOUD_NAME" ] && [ "$CLOUDINARY_CLOUD_NAME" != "your_cloudinary_cloud_name" ]; then
        ENV_VARS="${ENV_VARS},CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}"
    fi
    
    if [ -n "$CLOUDINARY_API_KEY" ] && [ "$CLOUDINARY_API_KEY" != "your_cloudinary_api_key" ]; then
        ENV_VARS="${ENV_VARS},CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}"
    fi
    
    if [ -n "$CLOUDINARY_API_SECRET" ] && [ "$CLOUDINARY_API_SECRET" != "your_cloudinary_api_secret" ]; then
        ENV_VARS="${ENV_VARS},CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}"
    fi
    
    if [ -n "$PORT" ] && [ "$PORT" != "3001" ]; then
        ENV_VARS="${ENV_VARS},PORT=${PORT}"
    fi
}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Translingo Server - GCP Cloud Run${NC}"
if service_exists; then
    echo -e "${BLUE}Update Deployment${NC}"
else
    echo -e "${BLUE}Initial Deployment${NC}"
fi
echo -e "${GREEN}========================================${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed.${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Validate PROJECT_ID
if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo -e "${RED}Error: PROJECT_ID is not set!${NC}"
    echo -e "${YELLOW}Please set it using one of these methods:${NC}"
    echo -e "  1. Export: ${GREEN}export GCP_PROJECT_ID=\"your-actual-project-id\"${NC}"
    echo -e "  2. Edit this script and change PROJECT_ID variable"
    exit 1
fi

# Check if user is authenticated
echo -e "${YELLOW}Checking authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}Not authenticated. Please login...${NC}"
    gcloud auth login
fi

# Set the project
echo -e "${YELLOW}Setting GCP project to: ${PROJECT_ID}${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs (only if service doesn't exist)
if ! service_exists; then
    echo -e "${YELLOW}Enabling required Google Cloud APIs...${NC}"
    gcloud services enable cloudbuild.googleapis.com 2>/dev/null || true
    gcloud services enable run.googleapis.com 2>/dev/null || true
    gcloud services enable containerregistry.googleapis.com 2>/dev/null || true
fi

# Load environment variables from .env file
echo -e "${YELLOW}Loading environment variables from .env file...${NC}"
load_env_vars

# Build the Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:latest .

# Configure Docker to use gcloud as a credential helper
echo -e "${YELLOW}Configuring Docker credentials...${NC}"
gcloud auth configure-docker --quiet

# Push the image to Google Container Registry
echo -e "${YELLOW}Pushing image to Google Container Registry...${NC}"
docker push ${IMAGE_NAME}:latest

# Check if this is an update or new deployment
IS_UPDATE=false
if service_exists; then
    IS_UPDATE=true
    echo -e "${YELLOW}Updating Cloud Run service...${NC}"
    gcloud run services update ${SERVICE_NAME} \
        --image ${IMAGE_NAME}:latest \
        --platform managed \
        --region ${REGION} \
        --min-instances ${MIN_INSTANCES} \
        --max-instances ${MAX_INSTANCES} \
        --cpu ${CPU} \
        --memory ${MEMORY} \
        --timeout ${TIMEOUT} \
        --concurrency ${CONCURRENCY} \
        --update-env-vars "${ENV_VARS}" \
        --port 3001
else
    echo -e "${YELLOW}Deploying new Cloud Run service...${NC}"
    gcloud run deploy ${SERVICE_NAME} \
        --image ${IMAGE_NAME}:latest \
        --platform managed \
        --region ${REGION} \
        --allow-unauthenticated \
        --min-instances ${MIN_INSTANCES} \
        --max-instances ${MAX_INSTANCES} \
        --cpu ${CPU} \
        --memory ${MEMORY} \
        --timeout ${TIMEOUT} \
        --concurrency ${CONCURRENCY} \
        --set-env-vars "${ENV_VARS}" \
        --port 3001
fi

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --platform managed --region ${REGION} --format 'value(status.url)')

echo -e "\n${GREEN}========================================${NC}"
if [ "$IS_UPDATE" = true ]; then
    echo -e "${GREEN}Update Successful!${NC}"
else
    echo -e "${GREEN}Deployment Successful!${NC}"
fi
echo -e "${GREEN}========================================${NC}\n"
echo -e "Service URL: ${GREEN}${SERVICE_URL}${NC}\n"
echo -e "${BLUE}Environment Variables Set:${NC}"
echo -e "  ✓ NODE_ENV=${NODE_ENV:-production}"
[ -n "$MONGODB_URI" ] && echo -e "  ✓ MONGODB_URI=${MONGODB_URI:0:30}..." || echo -e "  ✗ MONGODB_URI (not set)"
[ -n "$JWT_SECRET" ] && echo -e "  ✓ JWT_SECRET=***" || echo -e "  ✗ JWT_SECRET (not set)"
[ -n "$JWT_EXPIRY" ] && echo -e "  ✓ JWT_EXPIRY=${JWT_EXPIRY}" || echo -e "  ✗ JWT_EXPIRY (not set)"
[ -n "$ORIGIN" ] && echo -e "  ✓ ORIGIN=${ORIGIN}" || echo -e "  ✗ ORIGIN (not set)"
[ -n "$CLOUDINARY_CLOUD_NAME" ] && echo -e "  ✓ CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}" || echo -e "  ✗ CLOUDINARY_CLOUD_NAME (not set)"
[ -n "$CLOUDINARY_API_KEY" ] && echo -e "  ✓ CLOUDINARY_API_KEY=***" || echo -e "  ✗ CLOUDINARY_API_KEY (not set)"
[ -n "$CLOUDINARY_API_SECRET" ] && echo -e "  ✓ CLOUDINARY_API_SECRET=***" || echo -e "  ✗ CLOUDINARY_API_SECRET (not set)"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "1. Update your frontend .env file with:"
echo -e "   ${GREEN}VITE_API_BASE_URL=${SERVICE_URL}/api/v1${NC}"
echo -e "   ${GREEN}VITE_SOCKET_SERVER_URL=${SERVICE_URL}${NC}"
echo -e "\n2. Test your API: ${GREEN}curl ${SERVICE_URL}/api/v1${NC}\n"
