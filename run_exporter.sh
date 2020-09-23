EXTERNAL_PORT=8081
INTERNAL_PORT=80
HOST=http://10.28.11.49

docker run -p ${EXTERNAL_PORT}:${INTERNAL_PORT} -e HOST=${HOST} -e CONFIGURATION_SWAGGER_PORT=${EXTERNAL_PORT} --name exporter_trigger exporter_trigger:latest &
