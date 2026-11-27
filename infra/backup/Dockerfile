# Respaldo diario: pg_dump (misma versión mayor que el servidor) → cifrado con age → Azure Blob.
FROM postgres:18-alpine
RUN apk add --no-cache age curl jq
COPY backup.sh /usr/local/bin/backup.sh
USER postgres
ENTRYPOINT ["/usr/local/bin/backup.sh"]
