FROM mongo:7

COPY entrypoint.sh /usr/local/bin/rs-entrypoint.sh
RUN chmod +x /usr/local/bin/rs-entrypoint.sh

EXPOSE 27017
ENTRYPOINT ["rs-entrypoint.sh"]
