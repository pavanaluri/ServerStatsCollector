#!/usr/bin/bash

#------------------------------------------------------#
#   SCRIPT to start Server Stats Collector Daemon app
#------------------------------------------------------#

APP_NAME="Server Stats Collector Daemon"

APP_HOME_DIR="/home/_paluri_npd@na.sdxcorp.net/ServerStatsCollector"

LOG_FILE_DIR="$APP_HOME_DIR/logs"

CONSOLE_LOG_FILE="$LOG_FILE_DIR/consoleLogs.log"

cd $APP_HOME_DIR

echo "Starting $APP_NAME application"

npm run start > $CONSOLE_LOG_FILE &

echo "Issued start command. Logs are written to $CONSOLE_LOG_FILE"

# END of script
