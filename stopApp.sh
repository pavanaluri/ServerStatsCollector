#!/usr/bin/bash

#---------------------------------------------------------#
#   SCRIPT to shut down Server Stats Collector Daemon app
#---------------------------------------------------------#

APP_NAME="Server Stats Collector Daemon"

APP_HOME_DIR="/home/_paluri_npd@na.sdxcorp.net/ServerStatsCollector"

LOG_FILE_DIR="$APP_HOME_DIR/logs"

CONSOLE_LOG_FILE="$LOG_FILE_DIR/consoleLogs.log"

echo "Shutting down $APP_NAME application"

echo `date` " Shutting down $APP_NAME application through stopApp.sh " >> $CONSOLE_LOG_FILE

pid=$(ps -ef | grep node | grep server/b2b-app.js | awk '{print $2}')


if [ $? -eq 0 ]; then
   
   echo "$APP_NAME pid: $pid"
   if [ ! -z "$pid" ]; then

       kill -9  $pid 2>&1 | tee -a $CONSOLE_LOG_FILE

       echo "$APP_NAME application is down"

       echo `date` " $APP_NAME application is shut down" >> $CONSOLE_LOG_FILE
  
   else
       echo "$APP_NAME application process is NOT RUNNING. Exiting stop script"

       echo `date` " $APP_NAME application process is NOT RUNNING. Exiting stop script" >> $CONSOLE_LOG_FILE

    fi

else

    echo "ERROR in finding $APP_NAME application process"

    echo `date` " ERROR in finding $APP_NAME application process. Exiting stop script" >> $CONSOLE_LOG_FILE

fi

exit 0

# END of script