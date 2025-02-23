#!/bin/bash
set -e

git config --global credential.helper '!f() { echo "username=oauth"; echo "password=$GITHUB_TOKEN"; }; f'

echo "Cloning repository..."
git clone "$GITHUB_REPO_URL" /app/repo
cd /app/repo

git checkout "$GITHUB_REPO_BRANCH"

run_stage() {
    local stage_name=$1
    local script_content=$2
    echo "Starting stage: ${stage_name}"
    mkdir -p "/app/scripts/${stage_name}"
    echo "$script_content" > "/app/scripts/${stage_name}/run.sh"
    chmod +x "/app/scripts/${stage_name}/run.sh"

    cd /app/repo
    if ! "/app/scripts/${stage_name}/run.sh"; then
        echo "Stage ${stage_name} failed with exit code $?"
        return 1
    fi
    echo "Completed stage: ${stage_name}"
    return 0
}

if [ -z "$STAGE_COUNT" ]; then
    echo "Error: STAGE_COUNT environment variable not set"
    exit 1
fi

# Run stages in sequence based on index
for ((i=0; i<$STAGE_COUNT; i++)); do
    stage_name_var="STAGE_${i}_NAME"
    script_content_var="STAGE_${i}_SCRIPT"
    stage_name="${!stage_name_var}"
    script_content="${!script_content_var}"

    if [ -z "$stage_name" ] || [ -z "$script_content" ]; then
        echo "Error: Missing stage name or script content for stage $i"
        exit 1
    fi

    if ! run_stage "$stage_name" "$script_content"; then
        echo "Pipeline failed at stage: ${stage_name}"
        exit 1
    fi
done

echo "All stages completed successfully"
