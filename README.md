# ServerStatsCollector

This nodejs app executes shell commands at configured in travel to collect Server Performance Metrics like CPU, Memory etc. and writes them to Database.

This works on Unix/Linux platform. Update the command execution frequency param scanFrequencyMS (in milli sec) in env specific config file under config dir (dev-conf.json or prod-conf.json)

This writes to MS SQL DB using connection pooling. 

CPU utilization is written to SERV_MEM_METRICS table and memory usage details are written to SERV_CPU_METRICS table
